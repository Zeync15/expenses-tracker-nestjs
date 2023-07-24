import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

// refresh token tutorial from:
// https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException("User does not exist");
    }

    if (user && bcrypt.compare(user.password, pass)) {
      const { userId, username } = user;
      const result = { userId, username };
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = await this.validateUser(user.username, user.password);

    const tokens = await this.getTokens(payload.userId, payload.username);

    const currentUser = await this.userService.findOneByUsername(user.username);

    await this.updateRefreshToken(
      payload.userId,
      tokens.refresh_token,
      currentUser,
    );
    return tokens;
  }

  async getTokens(userId: string, username: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>("JWT_TOKEN_SECRET"),
          expiresIn: "15m",
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
          expiresIn: "7d",
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(
    userId: string,
    refresh_token: string,
    currentUser: User,
  ) {
    await this.userService.updateUser(
      userId,
      {
        refresh_token,
      },
      currentUser,
    );
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException("Access Denied User");

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const refreshTokenMatches = await bcrypt.compare(
      user.refresh_token,
      hashedRefreshToken,
    );

    if (!refreshTokenMatches)
      throw new ForbiddenException("Access Denied Not Match");
    const tokens = await this.getTokens(user.userId, user.username);
    await this.updateRefreshToken(user.userId, tokens.refresh_token, user);
    return tokens;
  }
}
