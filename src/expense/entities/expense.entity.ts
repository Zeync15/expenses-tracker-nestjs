import { User } from "src/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("expense")
export class Expense {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  item: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  date: string;

  @Column()
  category: string;

  @Column({ name: "userId" })
  userId: string;

  @ManyToOne(() => User, (user) => user.expense, {
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  user: User;
}
