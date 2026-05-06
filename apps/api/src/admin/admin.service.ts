import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { slugify } from "../catalog/slug";
import { UpsertArtistDto } from "./dto/upsert-artist.dto";
import { UpsertGenreDto } from "./dto/upsert-genre.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalUsers,
      totalArtistAccounts,
      totalAdmins,
      totalArtistProfiles,
      totalGenres,
      totalSongs,
      publishedSongs,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.ARTIST } }),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
      this.prisma.artist.count(),
      this.prisma.genre.count(),
      this.prisma.song.count(),
      this.prisma.song.count({ where: { isPublished: true } }),
    ]);

    return {
      totalUsers,
      totalArtistAccounts,
      totalAdmins,
      totalArtistProfiles,
      totalGenres,
      totalSongs,
      publishedSongs,
      draftSongs: totalSongs - publishedSongs,
      freeDownloadsEnabled: true,
      remixPaymentsEnabled: false,
    };
  }

  listArtists() {
    return this.prisma.artist.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            songs: true,
            followers: true,
          },
        },
      },
    });
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
        verified: dto.verified ?? true,
      },
      include: {
        _count: {
          select: {
            songs: true,
            followers: true,
          },
        },
      },
    });
  }

  async updateArtist(id: string, dto: UpsertArtistDto) {
    const existing = await this.prisma.artist.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Artist was not found.");
    }

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
      },
      include: {
        _count: {
          select: {
            songs: true,
            followers: true,
          },
        },
      },
    });
  }

  async deleteArtist(id: string) {
    const existing = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            songs: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException("Artist was not found.");
    }

    if (existing._count.songs > 0) {
      throw new BadRequestException("Remove or move the artist's songs before deleting this artist.");
    }

    await this.prisma.artist.delete({ where: { id } });
    return { success: true };
  }

  listGenres() {
    return this.prisma.genre.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            songs: true,
          },
        },
      },
    });
  }

  async createGenre(dto: UpsertGenreDto) {
    const slug = await this.uniqueGenreSlug(dto.slug || dto.name);

    return this.prisma.genre.create({
      data: {
        name: dto.name.trim(),
        slug,
        color: dto.color?.trim() || null,
        icon: dto.icon?.trim() || null,
      },
      include: {
        _count: {
          select: {
            songs: true,
          },
        },
      },
    });
  }

  async updateGenre(id: string, dto: UpsertGenreDto) {
    const existing = await this.prisma.genre.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Genre was not found.");
    }

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
      },
      include: {
        _count: {
          select: {
            songs: true,
          },
        },
      },
    });
  }

  async deleteGenre(id: string) {
    const existing = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            songs: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException("Genre was not found.");
    }

    if (existing._count.songs > 0) {
      throw new BadRequestException("Remove or move songs from this genre before deleting it.");
    }

    await this.prisma.genre.delete({ where: { id } });
    return { success: true };
  }

  private async uniqueArtistSlug(value: string, existingId?: string) {
    return this.uniqueSlug(value, async (slug) => {
      const artist = await this.prisma.artist.findUnique({ where: { slug } });
      return Boolean(artist && artist.id !== existingId);
    });
  }

  private async uniqueGenreSlug(value: string, existingId?: string) {
    return this.uniqueSlug(value, async (slug) => {
      const genre = await this.prisma.genre.findUnique({ where: { slug } });
      return Boolean(genre && genre.id !== existingId);
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
