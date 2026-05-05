import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";
import { LocalStorageService } from "./local-storage.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [CatalogController],
  providers: [CatalogService, LocalStorageService],
})
export class CatalogModule {}
