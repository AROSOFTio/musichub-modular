import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpsertEditorPickDto {
  @IsString()
  songId!: string;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsString()
  sectionLabel?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  isActive?: boolean;
}
