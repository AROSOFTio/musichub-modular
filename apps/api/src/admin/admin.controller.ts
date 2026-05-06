import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Role } from "@prisma/client";

import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminService } from "./admin.service";
import { UpsertArtistDto } from "./dto/upsert-artist.dto";
import { UpsertGenreDto } from "./dto/upsert-genre.dto";

@Controller("admin")
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("overview")
  getOverview() {
    return this.adminService.getOverview();
  }

  @Get("artists")
  listArtists() {
    return this.adminService.listArtists();
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
}
