import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  displayName!: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class ArtistRegisterDto extends RegisterDto {
  @IsString()
  artistName!: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
