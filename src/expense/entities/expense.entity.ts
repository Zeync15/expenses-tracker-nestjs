import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("expense")
export class Expense {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  item: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  date: Date;

  @Column()
  category: string;
}
