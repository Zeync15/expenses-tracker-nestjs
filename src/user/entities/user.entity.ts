import { Column, PrimaryGeneratedColumn } from "typeorm";

export class User {
  @Column()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
