import { Injectable, UseGuards } from "@nestjs/common";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Expense } from "./entities/expense.entity";
import { Repository } from "typeorm";
import * as dayjs from "dayjs";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    user: User,
  ): Promise<Expense> {
    const formattedDate = dayjs(createExpenseDto.date).format("YYYY-MM-DD");
    const validatedExpense = { ...createExpenseDto, date: formattedDate };
    return await this.expenseRepository.save({ ...validatedExpense, user });
  }

  async findAll(user: User): Promise<Expense[]> {
    return await this.expenseRepository.find({
      where: { user },
    });

    // Format date strings to Date objects using Day.js
    // expenses.forEach((expense: Expense) => {
    //   expense.date = dayjs(expense.date).format("YYYY-MM-DD");
    // });

    // return expenses;
  }

  findOne(id: string): Promise<Expense> {
    return this.expenseRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    await this.expenseRepository.update(id, updateExpenseDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.expenseRepository.delete(id);
  }

  // learning purposes
  async findExpensesBeforeToday(): Promise<Expense[]> {
    const today = dayjs().format("YYYY-MM-DD");
    const qB = this.expenseRepository.createQueryBuilder("expense");

    const expensesBeforeToday = await qB
      .where("expense.date < :today", { today })
      .getMany();

    return expensesBeforeToday;
  }

  // learning purposes
  async findAllExpensesByUserId(userId: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { user: { userId } },
    });
  }
}
