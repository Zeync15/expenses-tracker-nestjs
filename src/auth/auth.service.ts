import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findByUsername(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const result = await this.validateUser(user.username, user.password);
    console.log(result, "res");
    const payload = { sub: result.userId, username: user.username };
    console.log(payload);
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
