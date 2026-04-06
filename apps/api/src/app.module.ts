import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { mailConfig } from './config/mail.config';
import { validateEnv } from './config/env.validation';
import { buildTypeOrmModuleOptions } from './database/typeorm.config';
import { SharedModule } from './modules/shared/shared.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/email.module';
import { FinancialSourcesModule } from './modules/financial-sources/financial-sources.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CreditsModule } from './modules/credits/credits.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      validate: validateEnv,
      load: [appConfig, authConfig, databaseConfig, mailConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: buildTypeOrmModuleOptions,
    }),
    SharedModule,
    HealthModule,
    AuthModule,
    UsersModule,
    EmailModule,
    FinancialSourcesModule,
    AccountsModule,
    TransactionsModule,
    CreditsModule,
    CategoriesModule,
    DashboardModule,
  ],
})
export class AppModule {}
