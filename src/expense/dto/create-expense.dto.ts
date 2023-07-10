import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  item: string;

  @IsString()
  price: string;

  @IsDateString()
  createdDate: Date;

  @IsString()
  category: string;
}
