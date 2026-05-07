import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role, Song, SongStatus } from "@prisma/client";
import path from "path";

import { AuthenticatedUser } from "../auth/decorators/current-user.decorator";
import { FeatureModulesService } from "../feature-modules/feature-modules.service";
import { PrismaService } from "../prisma/prisma.service";
import { SongUploadDto } from "./dto/song-upload.dto";
import { LocalStorageService } from "./local-storage.service";
import { slugify } from "./slug";

type SongFiles = {
  audio?: { buffer: Buffer; mimetype: string; originalname: string }[];
  cover?: { buffer: Buffer; mimetype: string; originalname: string }[];
};

const songInclude = {
  artist: true,
  genre: true,
  uploader: {
    select: {
      id: true,
      displayName: true,
      email: true,
      role: true,
    },
  },
};

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: LocalStorageService,
    private readonly featureModules: FeatureModulesService,
  ) {}

  async listPublished(query?: string) {
    const search = query?.trim();
    const modules = await this.featureModules.getFlags("public");
    const songs = await this.prisma.song.findMany({
      where: {
        isPublished: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { artist: { name: { contains: search, mode: "insensitive" } } },
                { genre: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: songInclude,
      orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    return songs.map((song) => this.toSongResponse(song, modules));
  }

  async listManageable(user: AuthenticatedUser) {
    const songs = await this.prisma.song.findMany({
      where: user.role === Role.ADMIN ? {} : { uploaderId: user.userId },
      include: songInclude,
      orderBy: { createdAt: "desc" },
    });

    const modules = await this.featureModules.getFlags("public");
    return songs.map((song) => this.toSongResponse(song, modules));
  }

  async getPublishedBySlug(slug: string) {
    const song = await this.prisma.song.findFirst({
      where: { slug, isPublished: true },
      include: songInclude,
    });

    if (!song) {
      throw new NotFoundException("Song was not found.");
    }

    return this.toSongResponse(song, await this.featureModules.getFlags("public"));
  }

  // ── Discovery ──────────────────────────────────────────────────────────

  /** Trending: score = plays*0.5 + downloads*0.4 + recency_boost*0.1 */
  async getTrending(limit = 50, enforceModule = true) {
    if (enforceModule) await this.featureModules.assertEnabled("trending", "api");
    const modules = await this.featureModules.getFlags("public");
    const songs = await this.prisma.song.findMany({
      where: { isPublished: true },
      include: songInclude,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const now = Date.now();
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    const scored = songs.map((song) => {
      const ageMs = now - new Date(song.createdAt).getTime();
      const recentBoost = Math.max(0, 1 - ageMs / ONE_WEEK_MS);
      const score =
        song.playCount * 0.5 + song.downloadCount * 0.4 + recentBoost * 1000 * 0.1;
      return { song, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(({ song }) => this.toSongResponse(song, modules));
  }

  async getLatest(limit = 50, enforceModule = true) {
    if (enforceModule) await this.featureModules.assertEnabled("latest", "api");
    const modules = await this.featureModules.getFlags("public");
    const songs = await this.prisma.song.findMany({
      where: { isPublished: true, status: "PUBLISHED" },
      include: songInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return songs.map((song) => this.toSongResponse(song, modules));
  }

  async getTop50() {
    await this.featureModules.assertEnabled("top50", "api");
    const modules = await this.featureModules.getFlags("public");
    const songs = await this.prisma.song.findMany({
      where: { isPublished: true },
      include: songInclude,
      orderBy: [{ downloadCount: "desc" }, { playCount: "desc" }],
      take: 50,
    });
    return songs.map((song) => this.toSongResponse(song, modules));
  }

  async getAllTime() {
    await this.featureModules.assertEnabled("all_time", "api");
    const modules = await this.featureModules.getFlags("public");
    const songs = await this.prisma.song.findMany({
      where: { isPublished: true },
      include: songInclude,
      orderBy: [{ playCount: "desc" }, { downloadCount: "desc" }],
      take: 100,
    });
    return songs.map((song) => this.toSongResponse(song, modules));
  }

  async getEditorPicks(limit = 20, enforceModule = true) {
    if (enforceModule) await this.featureModules.assertEnabled("editor_picks", "api");
    const modules = await this.featureModules.getFlags("public");
    const songs = await this.prisma.song.findMany({
      where: { isPublished: true, isEditorPick: true },
      include: songInclude,
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return songs.map((song) => this.toSongResponse(song, modules));
  }

  async search(query: string) {
    await this.featureModules.assertEnabled("search", "api");
    const modules = await this.featureModules.getFlags("public");
    const q = query?.trim();
    if (!q) return { songs: [], artists: [], genres: [] };

    const [songs, artists, genres] = await Promise.all([
      this.prisma.song.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { artist: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        include: songInclude,
        orderBy: { playCount: "desc" },
        take: 20,
      }),
      this.prisma.artist.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { bio: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { _count: { select: { songs: true } } },
        take: 10,
      }),
      this.prisma.genre.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        include: { _count: { select: { songs: true } } },
        take: 10,
      }),
    ]);

    return {
      songs: songs.map((s) => this.toSongResponse(s, modules)),
      artists,
      genres,
    };
  }

  // ── Genres ─────────────────────────────────────────────────────────────

  async listGenres() {
    await this.featureModules.assertEnabled("genres", "api");
    return this.prisma.genre.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { songs: true } } },
    });
  }

  async getGenreBySlug(slug: string) {
    await this.featureModules.assertEnabled("genres", "api");
    const genre = await this.prisma.genre.findUnique({
      where: { slug },
      include: {
        _count: { select: { songs: true } },
        songs: {
          where: { isPublished: true },
          include: songInclude,
          orderBy: { playCount: "desc" },
          take: 50,
        },
      },
    });

    if (!genre) throw new NotFoundException("Genre not found.");
    const modules = await this.featureModules.getFlags("public");

    return {
      ...genre,
      songs: genre.songs.map((s) => this.toSongResponse(s, modules)),
    };
  }

  // ── Artists ────────────────────────────────────────────────────────────

  async listArtists() {
    await this.featureModules.assertEnabled("artists", "api");
    return this.prisma.artist.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { songs: true, followers: true } },
      },
    });
  }

  async getArtistBySlug(slug: string) {
    await this.featureModules.assertEnabled("artists", "api");
    const artist = await this.prisma.artist.findUnique({
      where: { slug },
      include: {
        _count: { select: { songs: true, followers: true } },
        songs: {
          where: { isPublished: true },
          include: songInclude,
          orderBy: { playCount: "desc" },
          take: 50,
        },
      },
    });

    if (!artist) throw new NotFoundException("Artist not found.");
    const modules = await this.featureModules.getFlags("public");

    return {
      ...artist,
      songs: artist.songs.map((s) => this.toSongResponse(s, modules)),
    };
  }

  // ── Editor pick toggle (admin) ─────────────────────────────────────────

  async setEditorPick(user: AuthenticatedUser, songId: string, pick: boolean) {
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException("Only admins can manage editor picks.");
    }

    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException("Song not found.");

    const updated = await this.prisma.song.update({
      where: { id: songId },
      data: { isEditorPick: pick },
      include: songInclude,
    });

    return this.toSongResponse(updated);
  }

  // ── Home feed ─────────────────────────────────────────────────────────

  async getHomeFeed() {
    await this.featureModules.assertEnabled("home", "api");
    const modules = await this.featureModules.getFlags("public");
    const feed: Record<string, any> = { modules };

    if (modules.hero_banners) {
      const banner = await this.prisma.heroBanner.findFirst({
        where: { status: "ACTIVE" },
        orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
      });
      const fallbackSong = await this.prisma.song.findFirst({
        where: { isPublished: true, isEditorPick: true },
        include: songInclude,
        orderBy: { updatedAt: "desc" },
      }).then((s) => s ?? this.prisma.song.findFirst({
        where: { isPublished: true },
        include: songInclude,
        orderBy: { playCount: "desc" },
      }));
      feed.heroBanners = banner ? [banner] : fallbackSong ? [this.toSongResponse(fallbackSong as any, modules)] : [];
      feed.featured = fallbackSong ? this.toSongResponse(fallbackSong as any, modules) : null;
    }

    if (modules.trending) feed.trendingNow = await this.getTrending(8, false);
    if (modules.latest) feed.latestUploads = await this.getLatest(8, false);
    if (modules.editor_picks) feed.editorPicks = await this.getEditorPicks(6, false);
    if (modules.top_downloads && modules.downloads) {
      const topDownloads = await this.prisma.song.findMany({
        where: { isPublished: true },
        include: songInclude,
        orderBy: { downloadCount: "desc" },
        take: 8,
      });
      feed.topDownloads = topDownloads.map((s) => this.toSongResponse(s, modules));
    }
    if (modules.popular_artists && modules.artists) {
      feed.popularArtists = await this.prisma.artist.findMany({
        orderBy: { songs: { _count: "desc" } },
        include: { _count: { select: { songs: true, followers: true } } },
        take: 8,
      });
    }
    if (modules.browse_by_genre && modules.genres) {
      feed.browseGenres = await this.prisma.genre.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { songs: true } } },
        take: 12,
      });
      feed.genres = feed.browseGenres;
    }
    if (modules.continue_listening) feed.continueListening = [];

    return feed;
  }

  // ── Existing CRUD ─────────────────────────────────────────────────────

  async uploadSong(user: AuthenticatedUser, dto: SongUploadDto, files: SongFiles) {
    await this.featureModules.assertEnabled("upload", "api");
    const audioFile = await this.storage.saveAudio(files.audio?.[0]);
    const coverFile = await this.storage.saveCover(files.cover?.[0]);
    const artist = await this.resolveArtist(dto, user);
    const genre = await this.resolveGenre(dto);
    const language = await this.resolveLanguage(dto);
    const slug = await this.uniqueSongSlug(dto.slug || dto.title);

    const song = await this.prisma.song.create({
      data: {
        title: dto.title.trim(),
        slug,
        artistId: artist.id,
        genreId: genre.id,
        albumId: dto.albumId || null,
        musicTypeId: dto.musicTypeId || null,
        languageId: language?.id || null,
        uploaderId: user.userId,
        coverImage: coverFile?.publicUrl ?? null,
        audioFile: audioFile.relativePath,
        duration: this.optionalNumber(dto.duration),
        description: dto.description?.trim() || null,
        seoTitle: dto.seoTitle?.trim() || null,
        seoDescription: dto.seoDescription?.trim() || null,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : new Date(),
        isPublished: this.booleanFromString(dto.isPublished, true),
        status: this.booleanFromString(dto.isPublished, true) ? SongStatus.PUBLISHED : SongStatus.DRAFT,
        allowDownload: this.booleanFromString(dto.allowDownload, true),
        allowRemix: this.booleanFromString(dto.allowRemix, false),
      },
      include: songInclude,
    });

    if (song.isPublished) {
      await this.notifyFollowers(song.artist.id, song.id, song.title, song.artist.name, song.slug).catch(() => undefined);
    }

    return this.toSongResponse(song);
  }

  private async notifyFollowers(artistId: string, songId: string, songTitle: string, artistName: string, songSlug: string) {
    const followers = await this.prisma.follow.findMany({
      where: { artistId },
      select: { userId: true },
    });

    if (followers.length === 0) return;

    const notifications = followers.map((f) => ({
      userId: f.userId,
      title: 'New Release',
      message: `${artistName} just released a new song: ${songTitle}`,
      link: `/songs/${songSlug}`,
    }));

    await this.prisma.notification.createMany({
      data: notifications,
    });
  }

  async updateSong(
    user: AuthenticatedUser,
    id: string,
    dto: Partial<SongUploadDto>,
    files: SongFiles,
  ) {
    const existing = await this.findManageableSong(user, id);
    const nextIsPublished = this.booleanFromString(dto.isPublished, existing.isPublished);
    const coverFile = await this.storage.saveCover(files.cover?.[0]);
    const audioFile = files.audio?.[0] ? await this.storage.saveAudio(files.audio[0]) : null;
    const artist = dto.artistId || dto.artistName ? await this.resolveArtist(dto, user) : null;
    const genre = dto.genreId || dto.genreName ? await this.resolveGenre(dto) : null;
    const language = dto.languageId || dto.languageName ? await this.resolveLanguage(dto) : null;
    const nextSlug =
      dto.slug || (dto.title && dto.title.trim() !== existing.title)
        ? await this.uniqueSongSlug(dto.slug || dto.title || existing.title, existing.id)
        : existing.slug;

    const song = await this.prisma.song.update({
      where: { id: existing.id },
      data: {
        title: dto.title?.trim() || existing.title,
        slug: nextSlug,
        artistId: artist?.id ?? existing.artistId,
        genreId: genre?.id ?? existing.genreId,
        albumId: dto.albumId === undefined ? existing.albumId : dto.albumId || null,
        musicTypeId: dto.musicTypeId === undefined ? existing.musicTypeId : dto.musicTypeId || null,
        languageId: language?.id ?? existing.languageId,
        coverImage: coverFile?.publicUrl ?? existing.coverImage,
        audioFile: audioFile?.relativePath ?? existing.audioFile,
        duration:
          dto.duration === undefined ? existing.duration : this.optionalNumber(dto.duration),
        description:
          dto.description === undefined ? existing.description : dto.description?.trim() || null,
        seoTitle: dto.seoTitle === undefined ? existing.seoTitle : dto.seoTitle?.trim() || null,
        seoDescription: dto.seoDescription === undefined ? existing.seoDescription : dto.seoDescription?.trim() || null,
        releaseDate:
          dto.releaseDate === undefined
            ? existing.releaseDate
            : dto.releaseDate
              ? new Date(dto.releaseDate)
              : null,
        isPublished: nextIsPublished,
        status: nextIsPublished && existing.status === SongStatus.DRAFT ? SongStatus.PUBLISHED : existing.status,
        allowDownload: this.booleanFromString(dto.allowDownload, existing.allowDownload),
        allowRemix: this.booleanFromString(dto.allowRemix, existing.allowRemix),
      },
      include: songInclude,
    });

    return this.toSongResponse(song);
  }

  async deleteSong(user: AuthenticatedUser, id: string) {
    const existing = await this.findManageableSong(user, id);
    await this.prisma.song.delete({ where: { id: existing.id } });
    return { success: true };
  }

  async resolveAudioForStream(id: string) {
    await this.featureModules.assertEnabled("streaming", "api");
    const song = await this.prisma.song.findFirst({
      where: { id, isPublished: true },
    });

    if (!song) {
      throw new NotFoundException("Song was not found.");
    }

    await this.prisma.song.update({
      where: { id: song.id },
      data: { playCount: { increment: 1 } },
    });

    return this.storage.resolve(song.audioFile);
  }

  async resolveAudioForDownload(id: string) {
    await this.featureModules.assertEnabled("downloads", "api");
    const song = await this.prisma.song.findFirst({
      where: { id, isPublished: true },
      include: { artist: true },
    });

    if (!song) {
      throw new NotFoundException("Song was not found.");
    }

    if (!song.allowDownload) {
      throw new ForbiddenException("Downloads are disabled for this song.");
    }

    await this.prisma.song.update({
      where: { id: song.id },
      data: { downloadCount: { increment: 1 } },
    });

    const filePath = await this.storage.resolve(song.audioFile);
    const cleanName =
      `${song.artist.name} - ${song.title}`.replace(/[^\w .-]+/g, "").trim() || "song";

    return {
      path: filePath,
      filename: `${cleanName}${path.extname(filePath) || ".mp3"}`,
    };
  }

  async resolveUpload(relativePath: string) {
    return this.storage.resolve(relativePath);
  }

  private async findManageableSong(user: AuthenticatedUser, id: string) {
    const song = await this.prisma.song.findUnique({ where: { id } });
    if (!song) {
      throw new NotFoundException("Song was not found.");
    }

    if (user.role !== Role.ADMIN && song.uploaderId !== user.userId) {
      throw new ForbiddenException("You cannot manage this song.");
    }

    return song;
  }

  private async resolveArtist(dto: Partial<SongUploadDto>, user: AuthenticatedUser) {
    if (dto.artistId) {
      const artist = await this.prisma.artist.findUnique({ where: { id: dto.artistId } });
      if (!artist) {
        throw new BadRequestException("Artist was not found.");
      }
      return artist;
    }

    const fallbackUser = await this.prisma.user.findUnique({ where: { id: user.userId } });
    const name = dto.artistName?.trim() || fallbackUser?.displayName || "Unknown Artist";
    const slug = slugify(name) || "artist";

    return this.prisma.artist.upsert({
      where: { slug },
      update: { name },
      create: { name, slug, verified: user.role === Role.ADMIN },
    });
  }

  private async resolveGenre(dto: Partial<SongUploadDto>) {
    if (dto.genreId) {
      const genre = await this.prisma.genre.findUnique({ where: { id: dto.genreId } });
      if (!genre) {
        throw new BadRequestException("Genre was not found.");
      }
      return genre;
    }

    const name = dto.genreName?.trim() || "Uncategorized";
    const slug = slugify(name) || "uncategorized";
    return this.prisma.genre.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  private async resolveLanguage(dto: Partial<SongUploadDto & { languageId?: string, languageName?: string }>) {
    if (dto.languageId) {
      const language = await this.prisma.language.findUnique({ where: { id: dto.languageId } });
      if (!language) {
        throw new BadRequestException("Language was not found.");
      }
      return language;
    }

    if (!dto.languageName) return null;

    const name = dto.languageName.trim();
    if (!name) return null;

    const existing = await this.prisma.language.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) return existing;

    try {
      return await this.prisma.language.create({ data: { name } });
    } catch (error: any) {
      if (error?.code === "P2002") {
        return this.prisma.language.findFirstOrThrow({
          where: { name: { equals: name, mode: "insensitive" } },
        });
      }
      throw error;
    }
  }

  private async uniqueSongSlug(value: string, existingId?: string) {
    return this.uniqueSlug(value, async (slug) => {
      const song = await this.prisma.song.findUnique({ where: { slug } });
      return Boolean(song && song.id !== existingId);
    });
  }

  private async uniqueSlug(value: string, exists: (slug: string) => Promise<boolean>) {
    const base = slugify(value) || "item";
    let candidate = base;
    let index = 2;

    while (await exists(candidate)) {
      candidate = `${base}-${index}`;
      index += 1;
    }

    return candidate;
  }

  private optionalNumber(value?: number | string) {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 0) {
      throw new BadRequestException("Duration must be a positive number.");
    }

    return Math.round(numberValue);
  }

  private booleanFromString(value: string | boolean | undefined, fallback: boolean) {
    if (value === undefined) {
      return fallback;
    }

    if (typeof value === "boolean") {
      return value;
    }

    return value === "true" || value === "1" || value === "on";
  }

  private toSongResponse(song: Song & { artist: any; genre: any }, modules?: Record<string, boolean>) {
    const canStream = modules?.streaming ?? true;
    const canDownload = modules?.downloads ?? true;
    const canRemix = modules?.remix ?? true;
    return {
      id: song.id,
      title: song.title,
      slug: song.slug,
      artist: song.artist,
      genre: song.genre,
      coverImage: song.coverImage,
      streamUrl: canStream ? `/api/songs/${song.id}/stream` : null,
      downloadUrl: canDownload && song.allowDownload ? `/api/songs/${song.id}/download` : null,
      duration: song.duration,
      description: song.description,
      releaseDate: song.releaseDate,
      isPublished: song.isPublished,
      allowDownload: canDownload && song.allowDownload,
      allowRemix: canRemix && song.allowRemix,
      isEditorPick: (song as any).isEditorPick ?? false,
      downloadCount: song.downloadCount,
      playCount: song.playCount,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
    };
  }
}
