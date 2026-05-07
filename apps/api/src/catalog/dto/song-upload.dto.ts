import {
  ArrayMaxSize,
  IsBooleanString,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { Transform, Type } from "class-transformer";

function toStringArray(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [value];
  return raw.map((item) => String(item).trim()).filter(Boolean);
}

export class SongUploadDto {
  @IsString()
  @MaxLength(140)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  featuredArtistIds?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(140)
  artistName?: string;

  @IsOptional()
  @IsString()
  genreId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  genreName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsBooleanString()
  isPublished?: string;

  @IsOptional()
  @IsBooleanString()
  allowDownload?: string;

  @IsOptional()
  @IsBooleanString()
  allowRemix?: string;

  @IsOptional()
  @IsString()
  albumId?: string;

  @IsOptional()
  @IsString()
  musicTypeId?: string;

  @IsOptional()
  @IsString()
  languageId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  languageName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoDescription?: string;
}
