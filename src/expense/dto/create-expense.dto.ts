import { IsNumber, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  item: string;

  @IsNumber()
  price: number;

  @IsString()
  date: string;

  @IsString()
  category: string;
}
