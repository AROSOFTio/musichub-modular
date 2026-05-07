import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";

import { Roles } from "../auth/decorators/roles.decorator";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UpdateFeatureModuleDto } from "./dto/update-feature-module.dto";
import { FeatureModulesService } from "./feature-modules.service";

@Controller()
export class FeatureModulesController {
  constructor(private readonly featureModulesService: FeatureModulesService) {}

  @Get("modules/public")
  getPublicModules() {
    return this.featureModulesService.getPublicModules();
  }

  @Get("admin/modules")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.DEV_ADMIN)
  getAllModules() {
    return this.featureModulesService.getAll();
  }

  @Get("admin/modules/flags")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.DEV_ADMIN)
  async getAdminFlags() {
    return {
      public: await this.featureModulesService.getFlags("public"),
      admin: await this.featureModulesService.getFlags("admin"),
      api: await this.featureModulesService.getFlags("api"),
    };
  }

  @Patch("admin/modules/:key")
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.DEV_ADMIN)
  updateModule(@Param("key") key: string, @Body() dto: UpdateFeatureModuleDto) {
    return this.featureModulesService.update(key, dto);
  }
}
