import { Module } from '@nestjs/common';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CreditsModule } from './modules/credits/credits.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EmailModule } from './modules/email/email.module';
import { FinancialSourcesModule } from './modules/financial-sources/financial-sources.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { buildBackendRootImports } from './root-imports';

@Module({
  imports: [
    ...buildBackendRootImports(),
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
export class AppApiModule {}
