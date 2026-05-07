import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";
import bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { ArtistRegisterDto, RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { slugify } from "../catalog/slug";

type PublicUser = {
  id: string;
  email: string;
  role: Role;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type AuthPayload = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};

type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    if (!([Role.DEV_ADMIN, Role.ADMIN, Role.EDITOR, Role.ARTIST, Role.USER] as Role[]).includes(user.role)) {
      throw new UnauthorizedException("Insufficient permissions.");
    }

    return this.issueSession(user);
  }

  async registerUser(dto: RegisterDto): Promise<AuthPayload> {
    return this.createAccount(dto, Role.USER);
  }

  async registerArtist(dto: ArtistRegisterDto): Promise<AuthPayload> {
    const session = await this.createAccount(dto, Role.ARTIST);
    const artistName = dto.artistName.trim() || dto.displayName.trim();
    const slug = await this.uniqueArtistSlug(artistName);
    await this.prisma.artist.create({
      data: {
        name: artistName,
        slug,
        bio: dto.bio?.trim() || null,
        verificationStatus: "PENDING",
        verified: false,
      },
    });
    return session;
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthPayload> {
    if (!dto.refreshToken) {
      throw new UnauthorizedException("Refresh token is required.");
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Refresh token is invalid or expired.");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException("Refresh session is not active.");
    }

    const isValidRefresh = await bcrypt.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!isValidRefresh) {
      throw new UnauthorizedException("Refresh token does not match.");
    }

    if (!([Role.DEV_ADMIN, Role.ADMIN, Role.EDITOR, Role.ARTIST, Role.USER] as Role[]).includes(user.role)) {
      throw new UnauthorizedException("Insufficient permissions.");
    }

    return this.issueSession(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException("User account was not found.");
    }

    return this.toPublicUser(user);
  }

  private async issueSession(user: User): Promise<AuthPayload> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("ACCESS_TOKEN_TTL"),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("REFRESH_TOKEN_TTL"),
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    const freshUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });

    return {
      user: this.toPublicUser(freshUser),
      accessToken,
      refreshToken,
    };
  }

  private async createAccount(dto: RegisterDto, role: Role) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException("An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName: dto.displayName.trim(),
        username: dto.username?.trim().toLowerCase() || null,
        role,
      },
    });
    return this.issueSession(user);
  }

  private async uniqueArtistSlug(value: string) {
    const base = slugify(value) || "artist";
    let candidate = base;
    let index = 2;
    while (await this.prisma.artist.findUnique({ where: { slug: candidate } })) {
      candidate = `${base}-${index++}`;
    }
    return candidate;
  }

  private toPublicUser(user: User): PublicUser {
    const publicUser: PublicUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return publicUser;
  }
}
