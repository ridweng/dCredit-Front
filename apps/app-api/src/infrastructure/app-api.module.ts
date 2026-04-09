import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  Credit,
  CreditsService,
  DashboardService,
  EmailModule,
  FinancialInsightsService,
  FinancialSource,
  FinancialSourcesService,
  Installment,
  JwtStrategy,
  Transaction,
  User,
  VerificationToken,
  buildBackendRootImports,
} from '@dcredit/backend-shared';
import { APP_API_TOKENS } from '../application/ports/app-api.tokens';
import {
  GetVerificationStatusUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ResendVerificationUseCase,
  VerifyEmailUseCase,
} from '../application/use-cases/auth/auth.use-cases';
import {
  GetCreditDetailUseCase,
  GetCreditTimelineUseCase,
  ListCreditsUseCase,
} from '../application/use-cases/credits/credits.use-cases';
import {
  GetDashboardSummaryUseCase,
  GetLiquidBalanceUseCase,
  GetWeeklySpendingUseCase,
} from '../application/use-cases/dashboard/dashboard.use-cases';
import {
  CreateFinancialSourceUseCase,
  ListFinancialSourcesUseCase,
  UpdateFinancialSourceUseCase,
} from '../application/use-cases/financial-sources/financial-sources.use-cases';
import {
  GetCurrentUserUseCase,
  UpdateCurrentUserUseCase,
} from '../application/use-cases/users/users.use-cases';
import { AuthPolicyService } from '../domain/services/auth-policy.service';
import { AuthController } from '../adapters/inbound/http/controllers/auth.controller';
import { CreditsController } from '../adapters/inbound/http/controllers/credits.controller';
import { DashboardController } from '../adapters/inbound/http/controllers/dashboard.controller';
import { FinancialSourcesController } from '../adapters/inbound/http/controllers/financial-sources.controller';
import { PublicVerificationController } from '../adapters/inbound/http/controllers/public-verification.controller';
import { UsersController } from '../adapters/inbound/http/controllers/users.controller';
import { VerificationMailerAdapter } from '../adapters/outbound/email/verification-mailer.adapter';
import { TypeOrmAuthUsersAdapter } from '../adapters/outbound/persistence/typeorm-auth-users.adapter';
import {
  SharedCreditsReadAdapter,
  SharedDashboardReadAdapter,
  SharedFinancialSourcesAdapter,
} from '../adapters/outbound/persistence/shared-query.adapters';
import {
  BcryptPasswordHasherAdapter,
  JwtAccessTokenAdapter,
  SystemClockAdapter,
} from '../adapters/outbound/security/security.adapters';

@Module({
  imports: [
    ...buildBackendRootImports(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwtExpiresIn', '1h'),
        },
      }),
    }),
    EmailModule,
    TypeOrmModule.forFeature([
      User,
      VerificationToken,
      Account,
      Credit,
      Installment,
      Transaction,
      FinancialSource,
    ]),
  ],
  controllers: [
    AuthController,
    PublicVerificationController,
    UsersController,
    DashboardController,
    CreditsController,
    FinancialSourcesController,
  ],
  providers: [
    AuthPolicyService,
    RegisterUserUseCase,
    LoginUserUseCase,
    VerifyEmailUseCase,
    ResendVerificationUseCase,
    GetVerificationStatusUseCase,
    GetCurrentUserUseCase,
    UpdateCurrentUserUseCase,
    GetDashboardSummaryUseCase,
    GetLiquidBalanceUseCase,
    GetWeeklySpendingUseCase,
    ListCreditsUseCase,
    GetCreditDetailUseCase,
    GetCreditTimelineUseCase,
    ListFinancialSourcesUseCase,
    CreateFinancialSourceUseCase,
    UpdateFinancialSourceUseCase,
    TypeOrmAuthUsersAdapter,
    VerificationMailerAdapter,
    BcryptPasswordHasherAdapter,
    JwtAccessTokenAdapter,
    SystemClockAdapter,
    SharedDashboardReadAdapter,
    SharedCreditsReadAdapter,
    SharedFinancialSourcesAdapter,
    DashboardService,
    CreditsService,
    FinancialSourcesService,
    FinancialInsightsService,
    JwtStrategy,
    {
      provide: APP_API_TOKENS.authUsersPort,
      useExisting: TypeOrmAuthUsersAdapter,
    },
    {
      provide: APP_API_TOKENS.passwordHasherPort,
      useExisting: BcryptPasswordHasherAdapter,
    },
    {
      provide: APP_API_TOKENS.accessTokenPort,
      useExisting: JwtAccessTokenAdapter,
    },
    {
      provide: APP_API_TOKENS.verificationMailerPort,
      useExisting: VerificationMailerAdapter,
    },
    {
      provide: APP_API_TOKENS.clockPort,
      useExisting: SystemClockAdapter,
    },
    {
      provide: APP_API_TOKENS.dashboardReadPort,
      useExisting: SharedDashboardReadAdapter,
    },
    {
      provide: APP_API_TOKENS.creditsReadPort,
      useExisting: SharedCreditsReadAdapter,
    },
    {
      provide: APP_API_TOKENS.financialSourcesPort,
      useExisting: SharedFinancialSourcesAdapter,
    },
  ],
})
export class AppApiModule {}
