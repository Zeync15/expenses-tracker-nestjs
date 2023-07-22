import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("curr")
  async findAll(@CurrentUser() user: User) {
    return user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":username")
  async findUser(@Param("username") username: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.userService.updateUser(id, updateUserDto, user);
  }
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
