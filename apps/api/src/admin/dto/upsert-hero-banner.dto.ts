import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { BannerStatus } from "@prisma/client";

export class UpsertHeroBannerDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  linkedSongId?: string;

  @IsOptional()
  @IsString()
  linkedArtistId?: string;

  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(BannerStatus)
  status?: BannerStatus;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  priority?: number;
}
