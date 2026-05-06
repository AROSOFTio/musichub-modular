import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpsertGenreDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string;
}
