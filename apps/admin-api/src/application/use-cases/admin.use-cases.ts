import { Inject, Injectable } from '@nestjs/common';
import { ADMIN_API_TOKENS } from '../ports/admin-api.tokens';
import type {
  BackendDocsPort,
  AdminUsersReadPort,
  SchemaReferencePort,
} from '../ports/admin.ports';
import { ActivationOverviewService } from '../../domain/services/activation-overview.service';
import { type AdminUserSummary, activationStages } from '../../domain/models/admin.models';
import { SearchUsersQueryDto } from '../../adapters/inbound/http/dtos/search-users-query.dto';

@Injectable()
export class GetActivationOverviewUseCase {
  constructor(
    @Inject(ADMIN_API_TOKENS.adminUsersReadPort)
    private readonly adminUsersReadPort: AdminUsersReadPort,
    private readonly activationOverviewService: ActivationOverviewService,
  ) {}

  async execute() {
    const users = await this.adminUsersReadPort.listUsers();
    const totalUsers = users.length;
    const verifiedUsers = users.filter((user) => user.emailVerified).length;
    const usersWithSources = users.filter((user) => user.financialSourceCount > 0).length;
    const usersWithAccounts = users.filter((user) => user.accountCount > 0).length;
    const usersWithTransactions = users.filter((user) => user.transactionCount > 0).length;
    const usersWithCredits = users.filter((user) => user.creditCount > 0).length;
    const activatedUsers = users.filter((user) => user.activationStage === 'activated').length;

    return {
      kpis: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        usersWithSources,
        usersWithAccounts,
        usersWithTransactions,
        usersWithCredits,
        activatedUsers,
      },
      funnel: this.activationOverviewService.buildFunnel(users),
      activationDefinition: this.activationOverviewService.activationDefinition(),
      latestSignups: users.slice(0, 8).map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        activationStage: user.activationStage,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        isAdmin: user.isAdmin,
      })),
      latestVerifications: await this.adminUsersReadPort.getLatestVerifications(8),
      trends: this.activationOverviewService.calculateSignupTrend(users),
    };
  }
}

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(ADMIN_API_TOKENS.adminUsersReadPort)
    private readonly adminUsersReadPort: AdminUsersReadPort,
  ) {}

  async execute() {
    return {
      users: await this.adminUsersReadPort.listUsers(),
    };
  }
}

@Injectable()
export class GetUserJourneyUseCase {
  constructor(
    @Inject(ADMIN_API_TOKENS.adminUsersReadPort)
    private readonly adminUsersReadPort: AdminUsersReadPort,
  ) {}

  execute(userId: string) {
    return this.adminUsersReadPort.getUserDetail(userId);
  }
}

@Injectable()
export class SearchUsersUseCase {
  constructor(
    @Inject(ADMIN_API_TOKENS.adminUsersReadPort)
    private readonly adminUsersReadPort: AdminUsersReadPort,
  ) {}

  async execute(query: SearchUsersQueryDto) {
    const users = await this.adminUsersReadPort.listUsers();
    const filtered = users.filter((user) => this.matches(user, query));
    const start = (query.page - 1) * query.pageSize;
    const results = filtered.slice(start, start + query.pageSize);

    return {
      query,
      activationStages,
      total: filtered.length,
      page: query.page,
      pageSize: query.pageSize,
      results,
    };
  }

  private matches(user: AdminUserSummary, query: SearchUsersQueryDto): boolean {
    const searchText = query.q?.trim().toLowerCase();

    if (
      searchText &&
      !user.fullName.toLowerCase().includes(searchText) &&
      !user.email.toLowerCase().includes(searchText)
    ) {
      return false;
    }

    if (query.verified !== undefined && user.emailVerified !== query.verified) {
      return false;
    }

    if (query.activationStage && user.activationStage !== query.activationStage) {
      return false;
    }

    if (query.hasCredits !== undefined && (user.creditCount > 0) !== query.hasCredits) {
      return false;
    }

    if (
      query.hasFinancialSources !== undefined &&
      (user.financialSourceCount > 0) !== query.hasFinancialSources
    ) {
      return false;
    }

    return true;
  }
}

@Injectable()
export class GetDatabaseSchemaDocsUseCase {
  constructor(
    @Inject(ADMIN_API_TOKENS.schemaReferencePort)
    private readonly schemaReferencePort: SchemaReferencePort,
  ) {}

  execute() {
    return this.schemaReferencePort.getSchemaReference();
  }
}

@Injectable()
export class GetBackendDocsUseCase {
  constructor(
    @Inject(ADMIN_API_TOKENS.backendDocsPort)
    private readonly backendDocsPort: BackendDocsPort,
  ) {}

  execute() {
    return this.backendDocsPort.getDocs();
  }
}
