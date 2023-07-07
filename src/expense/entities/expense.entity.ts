import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("expense")
export class Expense {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item: string;

  @Column()
  price: number;

  @Column()
  createdDate: Date;

  @Column()
  category: string;
}
