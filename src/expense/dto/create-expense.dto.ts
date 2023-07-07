import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  item: string;

  @IsNumber()
  price: number;

  @IsDateString()
  createdDate: Date;

  @IsString()
  category: string;
}
