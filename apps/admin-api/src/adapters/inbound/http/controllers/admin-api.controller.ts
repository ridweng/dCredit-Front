import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GetActivationOverviewUseCase,
  GetBackendDocsUseCase,
  GetDatabaseSchemaDocsUseCase,
  GetUserJourneyUseCase,
  ListUsersUseCase,
  SearchUsersUseCase,
} from '../../../../application/use-cases/admin.use-cases';
import { AdminSessionGuard } from '../../../../infrastructure/auth/admin-session.guard';
import { SearchUsersQueryDto } from '../dtos/search-users-query.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminSessionGuard)
@Controller('admin')
export class AdminApiController {
  constructor(
    private readonly getActivationOverviewUseCase: GetActivationOverviewUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserJourneyUseCase: GetUserJourneyUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
    private readonly getDatabaseSchemaDocsUseCase: GetDatabaseSchemaDocsUseCase,
    private readonly getBackendDocsUseCase: GetBackendDocsUseCase,
  ) {}

  @Get('overview')
  getOverview() {
    return this.getActivationOverviewUseCase.execute();
  }

  @Get('users')
  listUsers() {
    return this.listUsersUseCase.execute();
  }

  @Get('users/:id')
  getUserDetail(@Param('id') userId: string) {
    return this.getUserJourneyUseCase.execute(userId);
  }

  @Get('search')
  search(@Query() query: SearchUsersQueryDto) {
    return this.searchUsersUseCase.execute(query);
  }

  @Get('database')
  getDatabaseReference() {
    return this.getDatabaseSchemaDocsUseCase.execute();
  }

  @Get('backend-docs')
  getBackendDocs() {
    return this.getBackendDocsUseCase.execute();
  }
}
