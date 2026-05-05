import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";

import { CurrentUser } from "./decorators/current-user.decorator";
import { AuthenticatedUser } from "./decorators/current-user.decorator";
import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { REFRESH_COOKIE_NAME } from "./auth.constants";
import { AccessTokenGuard } from "./guards/access-token.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.register(dto);
    this.setRefreshCookie(response, session.refreshToken);
    return session;
  }

  @Post("login")
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.login(dto);
    this.setRefreshCookie(response, session.refreshToken);
    return session;
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = dto.refreshToken || request.cookies?.[REFRESH_COOKIE_NAME];
    const session = await this.authService.refresh({ refreshToken });
    this.setRefreshCookie(response, session.refreshToken);
    return session;
  }

  @Post("logout")
  @UseGuards(AccessTokenGuard)
  @HttpCode(200)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: LogoutDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.userId);
    this.clearRefreshCookie(response);
    return {
      success: true,
      revokedRefreshToken: Boolean(dto.refreshToken),
    };
  }

  @Get("me")
  @UseGuards(AccessTokenGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.userId);
  }

  private setRefreshCookie(response: Response, refreshToken: string) {
    const isProduction = this.configService.get<string>("NODE_ENV") === "production";

    response.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshCookie(response: Response) {
    const isProduction = this.configService.get<string>("NODE_ENV") === "production";

    response.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/api/auth",
    });
  }
}
