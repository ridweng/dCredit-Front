import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../accounts/account.entity';
import { AuthModule } from '../auth/auth.module';
import { Credit } from '../credits/credit.entity';
import { Installment } from '../credits/installment.entity';
import { FinancialSource } from '../financial-sources/financial-source.entity';
import { Transaction } from '../transactions/transaction.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { VerificationToken } from '../users/verification-token.entity';
import { AdminApiController } from './admin-api.controller';
import { AdminController } from './admin.controller';
import { ActivationMetricsService } from './activation-metrics.service';
import { AdminHtmlService } from './admin-html.service';
import { AdminSessionGuard } from './admin-session.guard';
import { AdminSessionService } from './admin-session.service';
import { BackendDocsService } from './backend-docs.service';
import { SchemaDocumentationService } from './schema-documentation.service';
import { UserJourneyService } from './user-journey.service';
import { UserSearchService } from './user-search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      VerificationToken,
      FinancialSource,
      Account,
      Transaction,
      Credit,
      Installment,
    ]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AdminController, AdminApiController],
  providers: [
    AdminHtmlService,
    AdminSessionService,
    AdminSessionGuard,
    ActivationMetricsService,
    UserJourneyService,
    UserSearchService,
    SchemaDocumentationService,
    BackendDocsService,
  ],
})
export class AdminModule {}
