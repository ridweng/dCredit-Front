import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  AdminHtmlService,
  BackendDocsService,
  Credit,
  FinancialSource,
  SchemaDocumentationService,
  Transaction,
  User,
  UserJourneyService,
  VerificationToken,
  buildBackendRootImports,
} from '@dcredit/backend-shared';
import { ADMIN_API_TOKENS } from '../application/ports/admin-api.tokens';
import {
  GetActivationOverviewUseCase,
  GetBackendDocsUseCase,
  GetDatabaseSchemaDocsUseCase,
  GetUserJourneyUseCase,
  ListUsersUseCase,
  SearchUsersUseCase,
} from '../application/use-cases/admin.use-cases';
import { ActivationOverviewService } from '../domain/services/activation-overview.service';
import { AdminController } from '../adapters/inbound/http/controllers/admin.controller';
import { AdminApiController } from '../adapters/inbound/http/controllers/admin-api.controller';
import { SharedAdminUsersReadAdapter } from '../adapters/outbound/persistence/shared-admin-users.adapter';
import { SchemaReferenceAdapter } from '../adapters/outbound/schema/schema-reference.adapter';
import { BackendDocsAdapter } from '../adapters/outbound/docs/backend-docs.adapter';
import { AdminSessionGuard } from './auth/admin-session.guard';
import { AdminSessionService } from './auth/admin-session.service';

@Module({
  imports: [
    ...buildBackendRootImports(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwtExpiresIn', '1h'),
        },
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      VerificationToken,
      FinancialSource,
      Account,
      Transaction,
      Credit,
    ]),
  ],
  controllers: [AdminController, AdminApiController],
  providers: [
    ActivationOverviewService,
    GetActivationOverviewUseCase,
    ListUsersUseCase,
    GetUserJourneyUseCase,
    SearchUsersUseCase,
    GetDatabaseSchemaDocsUseCase,
    GetBackendDocsUseCase,
    SharedAdminUsersReadAdapter,
    SchemaReferenceAdapter,
    BackendDocsAdapter,
    AdminSessionService,
    AdminSessionGuard,
    AdminHtmlService,
    UserJourneyService,
    SchemaDocumentationService,
    BackendDocsService,
    {
      provide: ADMIN_API_TOKENS.adminUsersReadPort,
      useExisting: SharedAdminUsersReadAdapter,
    },
    {
      provide: ADMIN_API_TOKENS.schemaReferencePort,
      useExisting: SchemaReferenceAdapter,
    },
    {
      provide: ADMIN_API_TOKENS.backendDocsPort,
      useExisting: BackendDocsAdapter,
    },
  ],
})
export class AdminApiModule {}
