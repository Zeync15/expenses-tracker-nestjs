import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs(
  "orm.config",
  (): TypeOrmModuleOptions => ({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,
    // dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA))
  }),
);
