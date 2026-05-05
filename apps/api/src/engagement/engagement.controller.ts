import { Controller, Post, Delete, Get, Param, Body, UseGuards, Put } from '@nestjs/common';
import { EngagementService } from './engagement.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreatePlaylistDto, AddSongToPlaylistDto, CreateCommentDto } from './dto/engagement.dto';

@Controller('engagement')
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  // LIKES
  @UseGuards(JwtAuthGuard)
  @Post('likes/:songId')
  likeSong(@CurrentUser() user: AuthenticatedUser, @Param('songId') songId: string) {
    return this.engagementService.likeSong(user.userId, songId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('likes/:songId')
  unlikeSong(@CurrentUser() user: AuthenticatedUser, @Param('songId') songId: string) {
    return this.engagementService.unlikeSong(user.userId, songId);
  }

  // FAVORITES
  @UseGuards(JwtAuthGuard)
  @Post('favorites/:songId')
  addFavorite(@CurrentUser() user: AuthenticatedUser, @Param('songId') songId: string) {
    return this.engagementService.addFavorite(user.userId, songId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:songId')
  removeFavorite(@CurrentUser() user: AuthenticatedUser, @Param('songId') songId: string) {
    return this.engagementService.removeFavorite(user.userId, songId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavorites(@CurrentUser() user: AuthenticatedUser) {
    return this.engagementService.getFavorites(user.userId);
  }

  // PLAYLISTS
  @UseGuards(JwtAuthGuard)
  @Post('playlists')
  createPlaylist(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePlaylistDto) {
    return this.engagementService.createPlaylist(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('playlists')
  getUserPlaylists(@CurrentUser() user: AuthenticatedUser) {
    return this.engagementService.getUserPlaylists(user.userId);
  }

  // Allow anonymous access if playlist is public (checked in service)
  @Get('playlists/:id')
  getPlaylist(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return this.engagementService.getPlaylist(id, user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('playlists/:id/songs')
  addSongToPlaylist(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') playlistId: string,
    @Body() dto: AddSongToPlaylistDto,
  ) {
    return this.engagementService.addSongToPlaylist(user.userId, playlistId, dto.songId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('playlists/:id/songs/:songId')
  removeSongFromPlaylist(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') playlistId: string,
    @Param('songId') songId: string,
  ) {
    return this.engagementService.removeSongFromPlaylist(user.userId, playlistId, songId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('playlists/:id')
  deletePlaylist(@CurrentUser() user: AuthenticatedUser, @Param('id') playlistId: string) {
    return this.engagementService.deletePlaylist(user.userId, playlistId);
  }

  // FOLLOWS
  @UseGuards(JwtAuthGuard)
  @Post('follows/:artistId')
  followArtist(@CurrentUser() user: AuthenticatedUser, @Param('artistId') artistId: string) {
    return this.engagementService.followArtist(user.userId, artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('follows/:artistId')
  unfollowArtist(@CurrentUser() user: AuthenticatedUser, @Param('artistId') artistId: string) {
    return this.engagementService.unfollowArtist(user.userId, artistId);
  }

  // HISTORY
  @UseGuards(JwtAuthGuard)
  @Post('history/:songId')
  recordPlayHistory(@CurrentUser() user: AuthenticatedUser, @Param('songId') songId: string) {
    return this.engagementService.recordPlayHistory(user.userId, songId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getPlayHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.engagementService.getPlayHistory(user.userId);
  }

  // COMMENTS
  @UseGuards(JwtAuthGuard)
  @Post('comments/:songId')
  addComment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('songId') songId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.engagementService.addComment(user.userId, songId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  deleteComment(@CurrentUser() user: AuthenticatedUser, @Param('id') commentId: string) {
    return this.engagementService.deleteComment(user.userId, commentId);
  }

  @Get('comments/:songId')
  getSongComments(@Param('songId') songId: string) {
    return this.engagementService.getSongComments(songId);
  }

  // NOTIFICATIONS
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  getNotifications(@CurrentUser() user: AuthenticatedUser) {
    return this.engagementService.getNotifications(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('notifications/:id/read')
  markNotificationRead(@CurrentUser() user: AuthenticatedUser, @Param('id') notificationId: string) {
    return this.engagementService.markNotificationRead(user.userId, notificationId);
  }
}
