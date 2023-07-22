import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { UpdateUserDto } from "src/user/dto/update-user.dto";

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
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const result = await this.validateUser(user.username, user.password);
    const payload = { sub: result.userId, username: user.username };

    const tokens = await this.getTokens(payload.sub, payload.username);

    const currentUser = await this.userService.findOneByUsername(user.username);

    await this.updateRefreshToken(
      payload.sub,
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
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.userService.updateUser(
      userId,
      {
        refresh_token: hashedRefreshToken,
      },
      currentUser,
    );
  }
}
