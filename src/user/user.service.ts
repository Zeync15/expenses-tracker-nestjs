import {
  BadRequestException,
  Body,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = new User();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(["Passwords are not identical"]);
    }

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new BadRequestException(["Username or Email is already taken"]);
    }

    user.username = createUserDto.username;
    user.password = await this.hashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    return await this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({
      username,
    });
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    currentUser?: User,
  ): Promise<User> {
    console.log(userId, currentUser, 'update user init')
    const user = await this.userRepository.findOneBy({
      userId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (userId !== currentUser.userId) {
      throw new ForbiddenException(
        null,
        "You are not authorized to change this user",
      );
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
