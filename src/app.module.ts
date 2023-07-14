import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ExpenseModule } from "./expense/expense.module";
import { IncomeModule } from "./income/income.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import ormConfig from "./config/orm.config";
import ormConfigProd from "./config/orm.config.prod";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== "production" ? ormConfig : ormConfigProd,
    }),
    AuthModule,
    ExpenseModule,
    IncomeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
