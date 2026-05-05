import { Controller, Get, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("admin")
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("overview")
  async getOverview() {
    const [totalUsers, totalArtists, totalAdmins] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: Role.ARTIST } }),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
    ]);

    return {
      totalUsers,
      totalArtists,
      totalAdmins,
      freeDownloadsEnabled: true,
      remixPaymentsEnabled: false,
    };
  }
}
