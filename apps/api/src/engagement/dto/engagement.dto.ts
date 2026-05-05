import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class AddSongToPlaylistDto {
  @IsString()
  @IsNotEmpty()
  songId!: string;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
