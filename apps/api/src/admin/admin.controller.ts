import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BannerStatus, Role, SongStatus, VerificationStatus } from "@prisma/client";

import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminService } from "./admin.service";
import { AdminSongDto } from "./dto/admin-song.dto";
import { UpsertArtistDto } from "./dto/upsert-artist.dto";
import { UpsertGenreDto } from "./dto/upsert-genre.dto";
import { UpsertAlbumDto } from "./dto/upsert-album.dto";
import { UpsertMusicTypeDto } from "./dto/upsert-music-type.dto";
import { UpsertEditorPickDto } from "./dto/upsert-editor-pick.dto";
import { UpsertHeroBannerDto } from "./dto/upsert-hero-banner.dto";
import { UpdateTrendingSettingsDto } from "./dto/update-trending-settings.dto";

@Controller("admin")
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Overview ────────────────────────────────────────────────────────────
  @Get("overview")
  getOverview() {
    return this.adminService.getOverview();
  }

  // ─── Songs ───────────────────────────────────────────────────────────────
  @Get("songs")
  listSongs(@Query("status") status?: string) {
    const s = status && Object.values(SongStatus).includes(status as SongStatus)
      ? (status as SongStatus)
      : undefined;
    return this.adminService.listSongs(s);
  }

  @Patch("songs/:id")
  updateSong(@Param("id") id: string, @Body() dto: AdminSongDto) {
    return this.adminService.updateAdminSong(id, dto);
  }

  @Delete("songs/:id")
  deleteSong(@Param("id") id: string) {
    return this.adminService.deleteAdminSong(id);
  }

  @Patch("songs/:id/boost")
  boostSong(@Param("id") id: string, @Body("boost") boost: number) {
    return this.adminService.boostSong(id, boost ?? 0);
  }

  // ─── Artists ─────────────────────────────────────────────────────────────
  @Get("artists")
  listArtists(@Query("verificationStatus") vs?: string) {
    const status = vs && Object.values(VerificationStatus).includes(vs as VerificationStatus)
      ? (vs as VerificationStatus)
      : undefined;
    return this.adminService.listArtists(status);
  }

  @Post("artists")
  createArtist(@Body() dto: UpsertArtistDto) {
    return this.adminService.createArtist(dto);
  }

  @Patch("artists/:id")
  updateArtist(@Param("id") id: string, @Body() dto: UpsertArtistDto) {
    return this.adminService.updateArtist(id, dto);
  }

  @Delete("artists/:id")
  deleteArtist(@Param("id") id: string) {
    return this.adminService.deleteArtist(id);
  }

  @Patch("artists/:id/verify")
  verifyArtist(
    @Param("id") id: string,
    @Body("verificationStatus") verificationStatus: VerificationStatus,
  ) {
    return this.adminService.verifyArtist(id, verificationStatus);
  }

  // ─── Genres ──────────────────────────────────────────────────────────────
  @Get("genres")
  listGenres() {
    return this.adminService.listGenres();
  }

  @Post("genres")
  createGenre(@Body() dto: UpsertGenreDto) {
    return this.adminService.createGenre(dto);
  }

  @Patch("genres/:id")
  updateGenre(@Param("id") id: string, @Body() dto: UpsertGenreDto) {
    return this.adminService.updateGenre(id, dto);
  }

  @Delete("genres/:id")
  deleteGenre(@Param("id") id: string) {
    return this.adminService.deleteGenre(id);
  }

  // ─── Albums ───────────────────────────────────────────────────────────────
  @Get("albums")
  listAlbums() {
    return this.adminService.listAlbums();
  }

  @Post("albums")
  createAlbum(@Body() dto: UpsertAlbumDto) {
    return this.adminService.createAlbum(dto);
  }

  @Patch("albums/:id")
  updateAlbum(@Param("id") id: string, @Body() dto: UpsertAlbumDto) {
    return this.adminService.updateAlbum(id, dto);
  }

  @Delete("albums/:id")
  deleteAlbum(@Param("id") id: string) {
    return this.adminService.deleteAlbum(id);
  }

  // ─── Music Types ──────────────────────────────────────────────────────────
  @Get("music-types")
  listMusicTypes(@Query("category") category?: string) {
    return this.adminService.listMusicTypes(category);
  }

  @Post("music-types")
  createMusicType(@Body() dto: UpsertMusicTypeDto) {
    return this.adminService.createMusicType(dto);
  }

  @Patch("music-types/:id")
  updateMusicType(@Param("id") id: string, @Body() dto: UpsertMusicTypeDto) {
    return this.adminService.updateMusicType(id, dto);
  }

  @Delete("music-types/:id")
  deleteMusicType(@Param("id") id: string) {
    return this.adminService.deleteMusicType(id);
  }

  // ─── Trending ─────────────────────────────────────────────────────────────
  @Get("trending")
  getTrending() {
    return this.adminService.getTrending();
  }

  @Get("trending/top-50")
  getTop50() {
    return this.adminService.getTop50();
  }

  @Get("trending/all-time")
  getAllTime() {
    return this.adminService.getAllTime();
  }

  @Get("trending/settings")
  getTrendingSettings() {
    return this.adminService.getTrendingSettings();
  }

  @Patch("trending/settings")
  updateTrendingSettings(@Body() dto: UpdateTrendingSettingsDto) {
    return this.adminService.updateTrendingSettings(dto);
  }

  // ─── Editor Picks ─────────────────────────────────────────────────────────
  @Get("editor-picks")
  listEditorPicks() {
    return this.adminService.listEditorPicks();
  }

  @Post("editor-picks")
  createEditorPick(@Body() dto: UpsertEditorPickDto) {
    return this.adminService.createEditorPick(dto);
  }

  @Patch("editor-picks/:id")
  updateEditorPick(@Param("id") id: string, @Body() dto: UpsertEditorPickDto) {
    return this.adminService.updateEditorPick(id, dto);
  }

  @Delete("editor-picks/:id")
  deleteEditorPick(@Param("id") id: string) {
    return this.adminService.deleteEditorPick(id);
  }

  // ─── Hero Banners ─────────────────────────────────────────────────────────
  @Get("hero-banners")
  listHeroBanners(@Query("status") status?: string) {
    const s = status && Object.values(BannerStatus).includes(status as BannerStatus)
      ? (status as BannerStatus)
      : undefined;
    return this.adminService.listHeroBanners(s);
  }

  @Post("hero-banners")
  createHeroBanner(@Body() dto: UpsertHeroBannerDto) {
    return this.adminService.createHeroBanner(dto);
  }

  @Patch("hero-banners/:id")
  updateHeroBanner(@Param("id") id: string, @Body() dto: UpsertHeroBannerDto) {
    return this.adminService.updateHeroBanner(id, dto);
  }

  @Delete("hero-banners/:id")
  deleteHeroBanner(@Param("id") id: string) {
    return this.adminService.deleteHeroBanner(id);
  }
}
