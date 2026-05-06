import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BannerStatus, Role, SongStatus, VerificationStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { slugify } from "../catalog/slug";
import { AdminSongDto } from "./dto/admin-song.dto";
import { UpsertArtistDto } from "./dto/upsert-artist.dto";
import { UpsertGenreDto } from "./dto/upsert-genre.dto";
import { UpsertAlbumDto } from "./dto/upsert-album.dto";
import { UpsertMusicTypeDto } from "./dto/upsert-music-type.dto";
import { UpsertEditorPickDto } from "./dto/upsert-editor-pick.dto";
import { UpsertHeroBannerDto } from "./dto/upsert-hero-banner.dto";
import { UpdateTrendingSettingsDto } from "./dto/update-trending-settings.dto";

const SONG_INCLUDE = {
  artist: { select: { id: true, name: true, slug: true } },
  genre: { select: { id: true, name: true, slug: true } },
  album: { select: { id: true, title: true } },
  musicType: { select: { id: true, name: true } },
  language: { select: { id: true, name: true } },
} as const;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Overview ────────────────────────────────────────────────────────────

  async getOverview() {
    const [
      totalUsers,
      totalArtistAccounts,
      totalAdmins,
      totalArtistProfiles,
      totalGenres,
      totalSongs,
      publishedSongs,
      draftSongs,
      disabledSongs,
      totalAlbums,
      totalMusicTypes,
      totalPlays,
      totalDownloads,
      topSongs,
      latestSongs,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.ARTIST } }),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
      this.prisma.artist.count(),
      this.prisma.genre.count(),
      this.prisma.song.count(),
      this.prisma.song.count({ where: { status: SongStatus.PUBLISHED } }),
      this.prisma.song.count({ where: { status: SongStatus.DRAFT } }),
      this.prisma.song.count({ where: { status: SongStatus.DISABLED } }),
      this.prisma.album.count(),
      this.prisma.musicType.count(),
      this.prisma.song.aggregate({ _sum: { playCount: true } }),
      this.prisma.song.aggregate({ _sum: { downloadCount: true } }),
      this.prisma.song.findMany({
        where: { status: SongStatus.PUBLISHED },
        orderBy: { playCount: "desc" },
        take: 5,
        include: SONG_INCLUDE,
      }),
      this.prisma.song.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: SONG_INCLUDE,
      }),
    ]);

    return {
      totalUsers,
      totalArtistAccounts,
      totalAdmins,
      totalArtistProfiles,
      totalGenres,
      totalSongs,
      publishedSongs,
      draftSongs,
      disabledSongs,
      totalAlbums,
      totalMusicTypes,
      totalPlays: totalPlays._sum.playCount ?? 0,
      totalDownloads: totalDownloads._sum.downloadCount ?? 0,
      topSongs,
      latestSongs,
    };
  }

  // ─── Songs ────────────────────────────────────────────────────────────────

  listSongs(status?: SongStatus) {
    return this.prisma.song.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: SONG_INCLUDE,
    });
  }

  async getSong(id: string) {
    const song = await this.prisma.song.findUnique({ where: { id }, include: SONG_INCLUDE });
    if (!song) throw new NotFoundException("Song not found.");
    return song;
  }


  async updateAdminSong(id: string, dto: AdminSongDto) {
    const existing = await this.prisma.song.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Song not found.");

    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data["title"] = dto.title.trim();
    if (dto.artistId !== undefined) data["artistId"] = dto.artistId;
    if (dto.genreId !== undefined) data["genreId"] = dto.genreId;
    if (dto.albumId !== undefined) data["albumId"] = dto.albumId || null;
    if (dto.musicTypeId !== undefined) data["musicTypeId"] = dto.musicTypeId || null;
    if (dto.languageId !== undefined) data["languageId"] = dto.languageId || null;
    if (dto.description !== undefined) data["description"] = dto.description || null;
    if (dto.status !== undefined) {
      data["status"] = dto.status;
      data["isPublished"] = dto.status === SongStatus.PUBLISHED;
    }
    if (dto.scheduledAt !== undefined) data["scheduledAt"] = dto.scheduledAt ? new Date(dto.scheduledAt) : null;
    if (dto.isPublished !== undefined) {
      data["isPublished"] = dto.isPublished;
      if (dto.status === undefined) data["status"] = dto.isPublished ? SongStatus.PUBLISHED : SongStatus.DRAFT;
    }
    if (dto.allowDownload !== undefined) data["allowDownload"] = dto.allowDownload;
    if (dto.allowRemix !== undefined) data["allowRemix"] = dto.allowRemix;
    if (dto.duration !== undefined) data["duration"] = dto.duration;
    if (dto.releaseDate !== undefined) data["releaseDate"] = dto.releaseDate ? new Date(dto.releaseDate) : null;
    if (dto.manualTrendingBoost !== undefined) data["manualTrendingBoost"] = dto.manualTrendingBoost;
    if (dto.seoTitle !== undefined) data["seoTitle"] = dto.seoTitle || null;
    if (dto.seoDescription !== undefined) data["seoDescription"] = dto.seoDescription || null;

    return this.prisma.song.update({ where: { id }, data, include: SONG_INCLUDE });
  }

  async deleteAdminSong(id: string) {
    const existing = await this.prisma.song.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Song not found.");
    await this.prisma.song.delete({ where: { id } });
    return { success: true };
  }

  // ─── Artists ──────────────────────────────────────────────────────────────

  listArtists(verificationStatus?: VerificationStatus) {
    return this.prisma.artist.findMany({
      where: verificationStatus ? { verificationStatus } : undefined,
      orderBy: { name: "asc" },
      include: { _count: { select: { songs: true, followers: true } } },
    });
  }

  async getArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException("Artist not found.");
    return artist;
  }

  async createArtist(dto: UpsertArtistDto) {
    const slug = await this.uniqueArtistSlug(dto.slug || dto.name);
    return this.prisma.artist.create({
      data: {
        name: dto.name.trim(),
        slug,
        bio: dto.bio?.trim() || null,
        avatar: dto.avatar?.trim() || null,
        coverImage: dto.coverImage?.trim() || null,
        verified: dto.verified ?? false,
        verificationStatus: dto.verificationStatus ?? VerificationStatus.UNVERIFIED,
        seoTitle: dto.seoTitle || null,
        seoDescription: dto.seoDescription || null,
      },
      include: { _count: { select: { songs: true, followers: true } } },
    });
  }

  async updateArtist(id: string, dto: UpsertArtistDto) {
    const existing = await this.prisma.artist.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Artist was not found.");

    const slug =
      dto.slug || (dto.name && dto.name.trim() !== existing.name)
        ? await this.uniqueArtistSlug(dto.slug || dto.name, existing.id)
        : existing.slug;

    return this.prisma.artist.update({
      where: { id },
      data: {
        name: dto.name.trim(),
        slug,
        bio: dto.bio?.trim() || null,
        avatar: dto.avatar?.trim() || null,
        coverImage: dto.coverImage?.trim() || null,
        verified: dto.verified ?? existing.verified,
        verificationStatus: dto.verificationStatus ?? existing.verificationStatus,
        seoTitle: dto.seoTitle ?? existing.seoTitle,
        seoDescription: dto.seoDescription ?? existing.seoDescription,
      },
      include: { _count: { select: { songs: true, followers: true } } },
    });
  }

  async deleteArtist(id: string) {
    const existing = await this.prisma.artist.findUnique({
      where: { id },
      include: { _count: { select: { songs: true } } },
    });
    if (!existing) throw new NotFoundException("Artist was not found.");
    if (existing._count.songs > 0)
      throw new BadRequestException("Remove or move the artist's songs before deleting.");
    await this.prisma.artist.delete({ where: { id } });
    return { success: true };
  }

  async verifyArtist(id: string, status: VerificationStatus) {
    const existing = await this.prisma.artist.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Artist was not found.");
    return this.prisma.artist.update({
      where: { id },
      data: {
        verificationStatus: status,
        verified: status === VerificationStatus.VERIFIED,
      },
      include: { _count: { select: { songs: true, followers: true } } },
    });
  }

  // ─── Genres ───────────────────────────────────────────────────────────────

  listGenres() {
    return this.prisma.genre.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { songs: true } } },
    });
  }

  async getGenre(id: string) {
    const genre = await this.prisma.genre.findUnique({ where: { id } });
    if (!genre) throw new NotFoundException("Genre not found.");
    return genre;
  }

  async createGenre(dto: UpsertGenreDto) {
    const slug = await this.uniqueGenreSlug(dto.slug || dto.name);
    return this.prisma.genre.create({
      data: {
        name: dto.name.trim(),
        slug,
        color: dto.color?.trim() || null,
        icon: dto.icon?.trim() || null,
        description: dto.description?.trim() || null,
        seoTitle: dto.seoTitle || null,
        seoDescription: dto.seoDescription || null,
      },
      include: { _count: { select: { songs: true } } },
    });
  }

  async updateGenre(id: string, dto: UpsertGenreDto) {
    const existing = await this.prisma.genre.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Genre was not found.");

    const slug =
      dto.slug || (dto.name && dto.name.trim() !== existing.name)
        ? await this.uniqueGenreSlug(dto.slug || dto.name, existing.id)
        : existing.slug;

    return this.prisma.genre.update({
      where: { id },
      data: {
        name: dto.name.trim(),
        slug,
        color: dto.color?.trim() || null,
        icon: dto.icon?.trim() || null,
        description: dto.description?.trim() || null,
        seoTitle: dto.seoTitle ?? existing.seoTitle,
        seoDescription: dto.seoDescription ?? existing.seoDescription,
      },
      include: { _count: { select: { songs: true } } },
    });
  }

  async deleteGenre(id: string) {
    const existing = await this.prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { songs: true } } },
    });
    if (!existing) throw new NotFoundException("Genre was not found.");
    if (existing._count.songs > 0)
      throw new BadRequestException("Remove or move songs from this genre before deleting it.");
    await this.prisma.genre.delete({ where: { id } });
    return { success: true };
  }

  // ─── Albums ───────────────────────────────────────────────────────────────

  listAlbums() {
    return this.prisma.album.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        artist: { select: { id: true, name: true, slug: true } },
        _count: { select: { songs: true } },
      },
    });
  }

  async getAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException("Album not found.");
    return album;
  }

  async createAlbum(dto: UpsertAlbumDto) {
    const slug = await this.uniqueAlbumSlug(dto.slug || dto.title);
    return this.prisma.album.create({
      data: {
        title: dto.title.trim(),
        slug,
        artistId: dto.artistId,
        coverImage: dto.coverImage || null,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
        description: dto.description || null,
        isPublished: dto.isPublished ?? false,
        seoTitle: dto.seoTitle || null,
        seoDescription: dto.seoDescription || null,
      },
      include: {
        artist: { select: { id: true, name: true, slug: true } },
        _count: { select: { songs: true } },
      },
    });
  }

  async updateAlbum(id: string, dto: UpsertAlbumDto) {
    const existing = await this.prisma.album.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Album not found.");

    const slug =
      dto.slug || (dto.title && dto.title.trim() !== existing.title)
        ? await this.uniqueAlbumSlug(dto.slug || dto.title, existing.id)
        : existing.slug;

    return this.prisma.album.update({
      where: { id },
      data: {
        title: dto.title.trim(),
        slug,
        artistId: dto.artistId,
        coverImage: dto.coverImage ?? existing.coverImage,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : existing.releaseDate,
        description: dto.description ?? existing.description,
        isPublished: dto.isPublished ?? existing.isPublished,
        seoTitle: dto.seoTitle ?? existing.seoTitle,
        seoDescription: dto.seoDescription ?? existing.seoDescription,
      },
      include: {
        artist: { select: { id: true, name: true, slug: true } },
        _count: { select: { songs: true } },
      },
    });
  }

  async deleteAlbum(id: string) {
    const existing = await this.prisma.album.findUnique({
      where: { id },
      include: { _count: { select: { songs: true } } },
    });
    if (!existing) throw new NotFoundException("Album not found.");
    if (existing._count.songs > 0)
      throw new BadRequestException("Remove songs from this album before deleting.");
    await this.prisma.album.delete({ where: { id } });
    return { success: true };
  }

  // ─── Music Types ──────────────────────────────────────────────────────────

  listMusicTypes(typeCategory?: string) {
    return this.prisma.musicType.findMany({
      where: typeCategory ? { typeCategory: typeCategory as any } : undefined,
      orderBy: { name: "asc" },
      include: { _count: { select: { songs: true } } },
    });
  }

  async getMusicType(id: string) {
    const musicType = await this.prisma.musicType.findUnique({ where: { id } });
    if (!musicType) throw new NotFoundException("Music type not found.");
    return musicType;
  }

  async createMusicType(dto: UpsertMusicTypeDto) {
    const slug = await this.uniqueMusicTypeSlug(dto.slug || dto.name);
    return this.prisma.musicType.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description || null,
        icon: dto.icon || null,
        color: dto.color || null,
        typeCategory: dto.typeCategory ?? "MOOD",
        isActive: dto.isActive ?? true,
      },
      include: { _count: { select: { songs: true } } },
    });
  }

  async updateMusicType(id: string, dto: UpsertMusicTypeDto) {
    const existing = await this.prisma.musicType.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Music type not found.");

    const slug =
      dto.slug || (dto.name && dto.name.trim() !== existing.name)
        ? await this.uniqueMusicTypeSlug(dto.slug || dto.name, existing.id)
        : existing.slug;

    return this.prisma.musicType.update({
      where: { id },
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description ?? existing.description,
        icon: dto.icon ?? existing.icon,
        color: dto.color ?? existing.color,
        typeCategory: dto.typeCategory ?? existing.typeCategory,
        isActive: dto.isActive ?? existing.isActive,
      },
      include: { _count: { select: { songs: true } } },
    });
  }

  async deleteMusicType(id: string) {
    const existing = await this.prisma.musicType.findUnique({
      where: { id },
      include: { _count: { select: { songs: true } } },
    });
    if (!existing) throw new NotFoundException("Music type not found.");
    if (existing._count.songs > 0)
      throw new BadRequestException("Remove songs from this music type before deleting.");
    await this.prisma.musicType.delete({ where: { id } });
    return { success: true };
  }

  // ─── Trending ─────────────────────────────────────────────────────────────

  getTrending() {
    return this.prisma.song.findMany({
      where: { status: SongStatus.PUBLISHED },
      orderBy: [{ playCount: "desc" }, { downloadCount: "desc" }],
      take: 100,
      include: SONG_INCLUDE,
    });
  }

  getTop50() {
    return this.prisma.song.findMany({
      where: { status: SongStatus.PUBLISHED },
      orderBy: { playCount: "desc" },
      take: 50,
      include: SONG_INCLUDE,
    });
  }

  getAllTime() {
    return this.prisma.song.findMany({
      where: { status: SongStatus.PUBLISHED },
      orderBy: [{ playCount: "desc" }, { downloadCount: "desc" }],
      take: 200,
      include: SONG_INCLUDE,
    });
  }

  async getTrendingSettings() {
    let settings = await this.prisma.trendingSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.trendingSettings.create({
        data: { playsWeight: 0.5, downloadsWeight: 0.3, recencyWeight: 0.1, editorBoost: 0.1 },
      });
    }
    return settings;
  }

  async updateTrendingSettings(dto: UpdateTrendingSettingsDto) {
    let settings = await this.prisma.trendingSettings.findFirst();
    if (!settings) {
      return this.prisma.trendingSettings.create({
        data: {
          playsWeight: dto.playsWeight ?? 0.5,
          downloadsWeight: dto.downloadsWeight ?? 0.3,
          recencyWeight: dto.recencyWeight ?? 0.1,
          editorBoost: dto.editorBoost ?? 0.1,
        },
      });
    }
    return this.prisma.trendingSettings.update({
      where: { id: settings.id },
      data: {
        playsWeight: dto.playsWeight ?? settings.playsWeight,
        downloadsWeight: dto.downloadsWeight ?? settings.downloadsWeight,
        recencyWeight: dto.recencyWeight ?? settings.recencyWeight,
        editorBoost: dto.editorBoost ?? settings.editorBoost,
      },
    });
  }

  async boostSong(id: string, boost: number) {
    const existing = await this.prisma.song.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Song not found.");
    return this.prisma.song.update({
      where: { id },
      data: { manualTrendingBoost: boost },
      include: SONG_INCLUDE,
    });
  }

  // ─── Editor Picks ─────────────────────────────────────────────────────────

  listEditorPicks() {
    return this.prisma.editorPick.findMany({
      orderBy: { priority: "asc" },
      include: {
        song: { include: { artist: { select: { id: true, name: true } } } },
      },
    });
  }

  async createEditorPick(dto: UpsertEditorPickDto) {
    const song = await this.prisma.song.findUnique({ where: { id: dto.songId } });
    if (!song) throw new NotFoundException("Song not found.");
    return this.prisma.editorPick.create({
      data: {
        songId: dto.songId,
        priority: dto.priority ?? 0,
        sectionLabel: dto.sectionLabel || null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isActive: dto.isActive ?? true,
      },
      include: {
        song: { include: { artist: { select: { id: true, name: true } } } },
      },
    });
  }

  async updateEditorPick(id: string, dto: UpsertEditorPickDto) {
    const existing = await this.prisma.editorPick.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Editor pick not found.");
    return this.prisma.editorPick.update({
      where: { id },
      data: {
        songId: dto.songId ?? existing.songId,
        priority: dto.priority ?? existing.priority,
        sectionLabel: dto.sectionLabel ?? existing.sectionLabel,
        startDate: dto.startDate ? new Date(dto.startDate) : existing.startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
        isActive: dto.isActive ?? existing.isActive,
      },
      include: {
        song: { include: { artist: { select: { id: true, name: true } } } },
      },
    });
  }

  async deleteEditorPick(id: string) {
    const existing = await this.prisma.editorPick.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Editor pick not found.");
    await this.prisma.editorPick.delete({ where: { id } });
    return { success: true };
  }

  // ─── Hero Banners ─────────────────────────────────────────────────────────

  listHeroBanners(status?: BannerStatus) {
    return this.prisma.heroBanner.findMany({
      where: status ? { status } : undefined,
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });
  }

  createHeroBanner(dto: UpsertHeroBannerDto) {
    return this.prisma.heroBanner.create({
      data: {
        title: dto.title.trim(),
        subtitle: dto.subtitle || null,
        image: dto.image || null,
        linkedSongId: dto.linkedSongId || null,
        linkedArtistId: dto.linkedArtistId || null,
        ctaLabel: dto.ctaLabel || null,
        ctaUrl: dto.ctaUrl || null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: dto.status ?? BannerStatus.DRAFT,
        priority: dto.priority ?? 0,
      },
    });
  }

  async updateHeroBanner(id: string, dto: UpsertHeroBannerDto) {
    const existing = await this.prisma.heroBanner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Banner not found.");
    return this.prisma.heroBanner.update({
      where: { id },
      data: {
        title: dto.title?.trim() ?? existing.title,
        subtitle: dto.subtitle ?? existing.subtitle,
        image: dto.image ?? existing.image,
        linkedSongId: dto.linkedSongId ?? existing.linkedSongId,
        linkedArtistId: dto.linkedArtistId ?? existing.linkedArtistId,
        ctaLabel: dto.ctaLabel ?? existing.ctaLabel,
        ctaUrl: dto.ctaUrl ?? existing.ctaUrl,
        startDate: dto.startDate ? new Date(dto.startDate) : existing.startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
        status: dto.status ?? existing.status,
        priority: dto.priority ?? existing.priority,
      },
    });
  }

  async deleteHeroBanner(id: string) {
    const existing = await this.prisma.heroBanner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Banner not found.");
    await this.prisma.heroBanner.delete({ where: { id } });
    return { success: true };
  }

  // ─── Languages ────────────────────────────────────────────────────────────
  
  listLanguages() {
    return this.prisma.language.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { songs: true } } },
    });
  }

  async getLanguage(id: string) {
    const language = await this.prisma.language.findUnique({ where: { id } });
    if (!language) throw new NotFoundException("Language not found.");
    return language;
  }

  async createLanguage(name: string) {
    return this.prisma.language.create({ data: { name } });
  }

  async updateLanguage(id: string, name: string) {
    return this.prisma.language.update({ where: { id }, data: { name } });
  }

  async deleteLanguage(id: string) {
    await this.prisma.language.delete({ where: { id } });
    return { success: true };
  }

  // ─── Slug helpers ─────────────────────────────────────────────────────────

  // ─── Users ────────────────────────────────────────────────────────────────
  
  listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        displayName: true,
        username: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: { select: { songs: true, playlists: true } }
      }
    });
  }

  async updateUserRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true, email: true, displayName: true, username: true, role: true, avatarUrl: true, createdAt: true, _count: { select: { songs: true, playlists: true } }
      }
    });
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }


  private async uniqueArtistSlug(value: string, existingId?: string) {
    return this.uniqueSlug(value, async (slug) => {
      const r = await this.prisma.artist.findUnique({ where: { slug } });
      return Boolean(r && r.id !== existingId);
    });
  }

  private async uniqueGenreSlug(value: string, existingId?: string) {
    return this.uniqueSlug(value, async (slug) => {
      const r = await this.prisma.genre.findUnique({ where: { slug } });
      return Boolean(r && r.id !== existingId);
    });
  }

  private async uniqueAlbumSlug(value: string, existingId?: string) {
    return this.uniqueSlug(value, async (slug) => {
      const r = await this.prisma.album.findUnique({ where: { slug } });
      return Boolean(r && r.id !== existingId);
    });
  }

  private async uniqueMusicTypeSlug(value: string, existingId?: string) {
    return this.uniqueSlug(value, async (slug) => {
      const r = await this.prisma.musicType.findUnique({ where: { slug } });
      return Boolean(r && r.id !== existingId);
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
}
