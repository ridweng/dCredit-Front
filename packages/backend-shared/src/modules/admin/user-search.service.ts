import { Injectable } from '@nestjs/common';
import { SearchUsersQueryDto } from './dto/search-users-query.dto';
import { AdminUserSummary } from './admin.types';
import { UserJourneyService } from './user-journey.service';

@Injectable()
export class UserSearchService {
  constructor(private readonly userJourneyService: UserJourneyService) {}

  async searchUsers(query: SearchUsersQueryDto) {
    const users = await this.userJourneyService.listUsers();
    const filtered = users.filter((user) => this.matches(user, query));
    const start = (query.page - 1) * query.pageSize;
    const results = filtered.slice(start, start + query.pageSize);

    return {
      query,
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
