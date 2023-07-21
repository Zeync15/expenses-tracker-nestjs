import { Injectable } from "@nestjs/common";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Expense } from "./entities/expense.entity";
import { Repository } from "typeorm";
import * as dayjs from "dayjs";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  public async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const newExpense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(newExpense);
  }

  async findAll(): Promise<Expense[]> {
    const expenses = await this.expenseRepository.find();

    // Format date strings to Date objects using Day.js
    expenses.forEach((expense) => {
      expense.date = dayjs(expense.date).format("YYYY-MM-DD");
    });

    return expenses;
  }

  findOne(id: string) {
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

  async findExpensesBeforeToday(): Promise<Expense[]> {
    const today = dayjs().format("YYYY-MM-DD");
    const qB = this.expenseRepository.createQueryBuilder("expense");

    const expensesBeforeToday = await qB
      .where("expense.date < :today", { today })
      .getMany();

    return expensesBeforeToday;
  }
}
