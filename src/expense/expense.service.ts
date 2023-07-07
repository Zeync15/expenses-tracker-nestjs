import { Injectable } from "@nestjs/common";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Expense } from "./entities/expense.entity";
import { Repository } from "typeorm";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const newExpense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(newExpense);
  }

  findAll() {
    return this.expenseRepository.find();
  }

  findOne(id: number) {
    return this.expenseRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    await this.expenseRepository.update(id, updateExpenseDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.expenseRepository.delete(id);
  }
}
