import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  item: string;

  @IsNumber()
  price: number;

  @IsDateString()
  date: Date;

  @IsString()
  category: string;
}
