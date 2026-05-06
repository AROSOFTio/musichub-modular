import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Role } from "@prisma/client";
import type { Response } from "express";

import {
  AuthenticatedUser,
  CurrentUser,
} from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CatalogService } from "./catalog.service";
import { SongUploadDto } from "./dto/song-upload.dto";

const songFileInterceptor = FileFieldsInterceptor(
  [
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ],
  {
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  },
);

type UploadedSongFiles = {
  audio?: Array<{ buffer: Buffer; mimetype: string; originalname: string }>;
  cover?: Array<{ buffer: Buffer; mimetype: string; originalname: string }>;
};

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // ── Home Feed ───────────────────────────────────────────────────────────
  @Get("home")
  getHomeFeed() {
    return this.catalogService.getHomeFeed();
  }

  // ── Discovery ───────────────────────────────────────────────────────────
  @Get("discover/trending")
  getTrending(@Query("limit") limit?: string) {
    return this.catalogService.getTrending(limit ? parseInt(limit) : 50);
  }

  @Get("discover/latest")
  getLatest(@Query("limit") limit?: string) {
    return this.catalogService.getLatest(limit ? parseInt(limit) : 50);
  }

  @Get("discover/top-50")
  getTop50() {
    return this.catalogService.getTop50();
  }

  @Get("discover/all-time")
  getAllTime() {
    return this.catalogService.getAllTime();
  }

  @Get("discover/editor-picks")
  getEditorPicks() {
    return this.catalogService.getEditorPicks();
  }

  @Get("discover/search")
  search(@Query("q") query: string) {
    return this.catalogService.search(query);
  }

  // ── Genres ──────────────────────────────────────────────────────────────
  @Get("genres")
  listGenres() {
    return this.catalogService.listGenres();
  }

  @Get("genres/:slug")
  getGenre(@Param("slug") slug: string) {
    return this.catalogService.getGenreBySlug(slug);
  }

  // ── Artists ─────────────────────────────────────────────────────────────
  @Get("artists")
  listArtists() {
    return this.catalogService.listArtists();
  }

  @Get("artists/:slug")
  getArtist(@Param("slug") slug: string) {
    return this.catalogService.getArtistBySlug(slug);
  }

  // ── Songs CRUD ──────────────────────────────────────────────────────────
  @Get("songs")
  listSongs(@Query("q") query?: string) {
    return this.catalogService.listPublished(query);
  }

  @Get("songs/manage")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ARTIST)
  listManageableSongs(@CurrentUser() user: AuthenticatedUser) {
    return this.catalogService.listManageable(user);
  }

  @Get("songs/:slug")
  getSong(@Param("slug") slug: string) {
    return this.catalogService.getPublishedBySlug(slug);
  }

  @Post("songs")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ARTIST)
  @UseInterceptors(songFileInterceptor)
  uploadSong(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SongUploadDto,
    @UploadedFiles() files: UploadedSongFiles,
  ) {
    return this.catalogService.uploadSong(user, dto, files ?? {});
  }

  @Patch("songs/:id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ARTIST)
  @UseInterceptors(songFileInterceptor)
  updateSong(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: Partial<SongUploadDto>,
    @UploadedFiles() files: UploadedSongFiles,
  ) {
    return this.catalogService.updateSong(user, id, dto, files ?? {});
  }

  @Delete("songs/:id")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.ARTIST)
  deleteSong(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.catalogService.deleteSong(user, id);
  }

  // Admin: toggle editor pick
  @Put("songs/:id/editor-pick")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN)
  setEditorPick(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body("pick") pick: boolean,
  ) {
    return this.catalogService.setEditorPick(user, id, pick);
  }

  // ── Streaming / Download / Uploads ─────────────────────────────────────
  @Get("songs/:id/stream")
  @Header("Accept-Ranges", "bytes")
  async streamSong(@Param("id") id: string, @Res() response: Response) {
    const filePath = await this.catalogService.resolveAudioForStream(id);
    return response.sendFile(filePath);
  }

  @Get("songs/:id/download")
  async downloadSong(@Param("id") id: string, @Res() response: Response) {
    const file = await this.catalogService.resolveAudioForDownload(id);
    return response.download(file.path, file.filename);
  }

  @Get("uploads/:kind/:filename")
  async getUpload(
    @Param("kind") kind: string,
    @Param("filename") filename: string,
    @Res() response: Response,
  ) {
    const filePath = await this.catalogService.resolveUpload(`${kind}/${filename}`);
    return response.sendFile(filePath);
  }
}
