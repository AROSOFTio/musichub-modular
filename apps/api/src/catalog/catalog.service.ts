import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role, Song } from "@prisma/client";
import path from "path";

import { AuthenticatedUser } from "../auth/decorators/current-user.decorator";
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
  ) {}

  async listPublished(query?: string) {
    const search = query?.trim();
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

    return songs.map((song) => this.toSongResponse(song));
  }

  async listManageable(user: AuthenticatedUser) {
    const songs = await this.prisma.song.findMany({
      where: user.role === Role.ADMIN ? {} : { uploaderId: user.userId },
      include: songInclude,
      orderBy: { createdAt: "desc" },
    });

    return songs.map((song) => this.toSongResponse(song));
  }

  async getPublishedBySlug(slug: string) {
    const song = await this.prisma.song.findFirst({
      where: { slug, isPublished: true },
      include: songInclude,
    });

    if (!song) {
      throw new NotFoundException("Song was not found.");
    }

    return this.toSongResponse(song);
  }

  async uploadSong(user: AuthenticatedUser, dto: SongUploadDto, files: SongFiles) {
    const audioFile = await this.storage.saveAudio(files.audio?.[0]);
    const coverFile = await this.storage.saveCover(files.cover?.[0]);
    const artist = await this.resolveArtist(dto, user);
    const genre = await this.resolveGenre(dto);
    const slug = await this.uniqueSongSlug(dto.slug || dto.title);

    const song = await this.prisma.song.create({
      data: {
        title: dto.title.trim(),
        slug,
        artistId: artist.id,
        genreId: genre.id,
        uploaderId: user.userId,
        coverImage: coverFile?.publicUrl ?? null,
        audioFile: audioFile.relativePath,
        duration: this.optionalNumber(dto.duration),
        description: dto.description?.trim() || null,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : new Date(),
        isPublished: this.booleanFromString(dto.isPublished, true),
        allowDownload: this.booleanFromString(dto.allowDownload, true),
        allowRemix: this.booleanFromString(dto.allowRemix, false),
      },
      include: songInclude,
    });

    if (song.isPublished) {
      await this.notifyFollowers(song.artist.id, song.id, song.title, song.artist.name, song.slug);
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
    const coverFile = await this.storage.saveCover(files.cover?.[0]);
    const audioFile = files.audio?.[0] ? await this.storage.saveAudio(files.audio[0]) : null;
    const artist = dto.artistId || dto.artistName ? await this.resolveArtist(dto, user) : null;
    const genre = dto.genreId || dto.genreName ? await this.resolveGenre(dto) : null;
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
        coverImage: coverFile?.publicUrl ?? existing.coverImage,
        audioFile: audioFile?.relativePath ?? existing.audioFile,
        duration:
          dto.duration === undefined ? existing.duration : this.optionalNumber(dto.duration),
        description:
          dto.description === undefined ? existing.description : dto.description?.trim() || null,
        releaseDate:
          dto.releaseDate === undefined
            ? existing.releaseDate
            : dto.releaseDate
              ? new Date(dto.releaseDate)
              : null,
        isPublished: this.booleanFromString(dto.isPublished, existing.isPublished),
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

  async listGenres() {
    return this.prisma.genre.findMany({ orderBy: { name: "asc" } });
  }

  async listArtists() {
    return this.prisma.artist.findMany({ orderBy: { name: "asc" } });
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

  private toSongResponse(song: Song & { artist: { name: string; slug: string }; genre: { name: string; slug: string } }) {
    return {
      id: song.id,
      title: song.title,
      slug: song.slug,
      artist: song.artist,
      genre: song.genre,
      coverImage: song.coverImage,
      streamUrl: `/api/songs/${song.id}/stream`,
      downloadUrl: song.allowDownload ? `/api/songs/${song.id}/download` : null,
      duration: song.duration,
      description: song.description,
      releaseDate: song.releaseDate,
      isPublished: song.isPublished,
      allowDownload: song.allowDownload,
      allowRemix: song.allowRemix,
      downloadCount: song.downloadCount,
      playCount: song.playCount,
      createdAt: song.createdAt,
      updatedAt: song.updatedAt,
    };
  }
}
