import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
import { MusicTypeCategory } from "@prisma/client";

export class UpsertMusicTypeDto {
  @IsString()
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(MusicTypeCategory)
  typeCategory?: MusicTypeCategory;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isActive?: boolean;
}
