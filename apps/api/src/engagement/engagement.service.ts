import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaylistDto, CreateCommentDto } from './dto/engagement.dto';

@Injectable()
export class EngagementService {
  constructor(private prisma: PrismaService) {}

  // LIKES
  async likeSong(userId: string, songId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_songId: { userId, songId } },
    });
    if (existing) {
      throw new ConflictException('Song already liked');
    }
    
    // Check if song exists
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    const like = await this.prisma.like.create({
      data: { userId, songId },
    });
    return like;
  }

  async unlikeSong(userId: string, songId: string) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_songId: { userId, songId } },
    });
    if (!existing) {
      throw new NotFoundException('Like not found');
    }
    await this.prisma.like.delete({
      where: { id: existing.id },
    });
    return { success: true };
  }

  // FAVORITES
  async addFavorite(userId: string, songId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_songId: { userId, songId } },
    });
    if (existing) {
      throw new ConflictException('Song already in favorites');
    }

    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    const favorite = await this.prisma.favorite.create({
      data: { userId, songId },
    });
    return favorite;
  }

  async removeFavorite(userId: string, songId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_songId: { userId, songId } },
    });
    if (!existing) {
      throw new NotFoundException('Favorite not found');
    }
    await this.prisma.favorite.delete({
      where: { id: existing.id },
    });
    return { success: true };
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        song: {
          include: { artist: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // PLAYLISTS
  async createPlaylist(userId: string, dto: CreatePlaylistDto) {
    return this.prisma.playlist.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        isPublic: dto.isPublic ?? true,
      },
    });
  }

  async getUserPlaylists(userId: string) {
    return this.prisma.playlist.findMany({
      where: { userId },
      include: {
        _count: { select: { songs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlaylist(id: string, userId?: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        user: { select: { displayName: true, username: true } },
        songs: {
          include: {
            song: { include: { artist: true } },
          },
          orderBy: { addedAt: 'asc' },
        },
      },
    });

    if (!playlist) throw new NotFoundException('Playlist not found');
    if (!playlist.isPublic && playlist.userId !== userId) {
      throw new NotFoundException('Playlist not found');
    }

    return playlist;
  }

  async addSongToPlaylist(userId: string, playlistId: string, songId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== userId) {
      throw new NotFoundException('Playlist not found');
    }

    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    const existing = await this.prisma.playlistSong.findUnique({
      where: { playlistId_songId: { playlistId, songId } },
    });
    if (existing) {
      throw new ConflictException('Song already in playlist');
    }

    return this.prisma.playlistSong.create({
      data: { playlistId, songId },
    });
  }

  async removeSongFromPlaylist(userId: string, playlistId: string, songId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== userId) {
      throw new NotFoundException('Playlist not found');
    }

    const existing = await this.prisma.playlistSong.findUnique({
      where: { playlistId_songId: { playlistId, songId } },
    });
    if (!existing) {
      throw new NotFoundException('Song not in playlist');
    }

    await this.prisma.playlistSong.delete({
      where: { id: existing.id },
    });
    return { success: true };
  }

  async deletePlaylist(userId: string, playlistId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist || playlist.userId !== userId) {
      throw new NotFoundException('Playlist not found');
    }

    await this.prisma.playlist.delete({ where: { id: playlistId } });
    return { success: true };
  }

  // FOLLOWS
  async followArtist(userId: string, artistId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: { userId_artistId: { userId, artistId } },
    });
    if (existing) {
      throw new ConflictException('Already following this artist');
    }

    const artist = await this.prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) throw new NotFoundException('Artist not found');

    return this.prisma.follow.create({
      data: { userId, artistId },
    });
  }

  async unfollowArtist(userId: string, artistId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: { userId_artistId: { userId, artistId } },
    });
    if (!existing) {
      throw new NotFoundException('Follow not found');
    }

    await this.prisma.follow.delete({ where: { id: existing.id } });
    return { success: true };
  }

  // HISTORY
  async recordPlayHistory(userId: string, songId: string) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    // Also increment song playCount if this is a new play (could add debounce logic here)
    await this.prisma.song.update({
      where: { id: songId },
      data: { playCount: { increment: 1 } },
    });

    return this.prisma.playHistory.create({
      data: { userId, songId },
    });
  }

  async getPlayHistory(userId: string) {
    // Return recent 50
    return this.prisma.playHistory.findMany({
      where: { userId },
      include: {
        song: { include: { artist: true } },
      },
      orderBy: { playedAt: 'desc' },
      take: 50,
    });
  }

  // COMMENTS
  async addComment(userId: string, songId: string, dto: CreateCommentDto) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Song not found');

    return this.prisma.comment.create({
      data: {
        userId,
        songId,
        content: dto.content,
      },
      include: {
        user: { select: { displayName: true, avatarUrl: true, username: true } },
      },
    });
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    // Need to check if user is admin, but for now we allow if they are the owner
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (comment.userId !== userId && user?.role !== 'ADMIN') {
      throw new ConflictException('Not authorized to delete this comment');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  }

  async getSongComments(songId: string) {
    return this.prisma.comment.findMany({
      where: { songId },
      include: {
        user: { select: { displayName: true, avatarUrl: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // NOTIFICATIONS
  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
}
