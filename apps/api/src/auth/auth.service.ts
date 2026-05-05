import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Role, User } from "@prisma/client";
import bcrypt from "bcrypt";

import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";

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

  async register(dto: RegisterDto): Promise<AuthPayload> {
    const email = dto.email.trim().toLowerCase();
    const username = dto.username?.trim().toLowerCase() || null;

    if (dto.role === Role.ADMIN) {
      throw new UnauthorizedException("Admin accounts cannot self-register.");
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ username }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        "An account with those credentials already exists.",
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role: dto.role ?? Role.USER,
        displayName: dto.displayName.trim(),
        username,
      },
    });

    return this.issueSession(user);
  }

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

    return this.issueSession(user);
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
