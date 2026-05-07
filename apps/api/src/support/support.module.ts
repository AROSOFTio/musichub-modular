import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { FeatureModulesModule } from "../feature-modules/feature-modules.module";
import { PrismaModule } from "../prisma/prisma.module";
import { SupportController } from "./support.controller";
import { SupportService } from "./support.service";

@Module({
  imports: [AuthModule, ConfigModule, FeatureModulesModule, PrismaModule],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
