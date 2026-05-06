import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpsertArtistDto {
  @IsString()
  @MinLength(2)
  @MaxLength(140)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1200)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  verified?: boolean;
}
