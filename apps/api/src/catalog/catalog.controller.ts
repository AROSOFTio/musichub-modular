import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
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

  @Get("genres")
  listGenres() {
    return this.catalogService.listGenres();
  }

  @Get("artists")
  listArtists() {
    return this.catalogService.listArtists();
  }
}
