import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request as NestRequest,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { User } from "src/user/entities/user.entity";
import { CurrentUser } from "./current-user.decorator";
import JwtRefreshGuard from "./jwt-refresh.guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() req: User) {
    return this.authService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@NestRequest() req: any) {
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  async refreshTokens(@Req() req: Request) {
    const userId = req.user["sub"];
    const refreshToken = req.user["refresh_token"];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@CurrentUser() user: User) {
    return user;
  }
}
