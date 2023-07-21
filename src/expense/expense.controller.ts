import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
  ForbiddenException,
  HttpCode,
} from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/user/entities/user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Expense } from "./entities/expense.entity";

@Controller("expense")
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: User,
  ) {
    return await this.expenseService.create(createExpenseDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    return await this.expenseService.findAll(user);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.expenseService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: User,
  ) {
    const expense = await this.expenseService.findOne(id);

    if (!expense) {
      throw new NotFoundException();
    }

    if (expense.userId !== user.userId) {
      throw new ForbiddenException(
        null,
        "You are not authorized to change this expense",
      );
    }

    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async remove(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const expense = await this.expenseService.findOne(id);

    if (!expense) {
      throw new NotFoundException();
    }

    if (expense.userId !== user.userId) {
      throw new ForbiddenException(
        null,
        `You are not authorized to remove this expense`,
      );
    }

    return this.expenseService.remove(id);
  }

  // no need this d
  @Get("user/:userId")
  async findAllExpensesByUserId(
    @Param("userId") userId: string,
  ): Promise<Expense[]> {
    return this.expenseService.findAllExpensesByUserId(userId);
  }
  // trying out query builder
  @Get("ytd")
  findYtd() {
    return this.expenseService.findExpensesBeforeToday();
  }
}
