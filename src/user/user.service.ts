import { BadRequestException, Body, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(@Body() createUserDto: CreateUserDto) {
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
    // user.password = await this.authService.hashPassword(createUserDto.password);
    user.password = createUserDto.password;
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    // return {
    //   ...(await this.userRepository.save(user)),
    //   token: this.authService.getTokenForUser(user),
    // };
    return await this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(userId: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({
      userId,
    });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({
      username,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
