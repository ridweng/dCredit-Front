import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivationMetricsService } from './activation-metrics.service';
import { AdminSessionGuard } from './admin-session.guard';
import { BackendDocsService } from './backend-docs.service';
import { SearchUsersQueryDto } from './dto/search-users-query.dto';
import { SchemaDocumentationService } from './schema-documentation.service';
import { UserJourneyService } from './user-journey.service';
import { UserSearchService } from './user-search.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminSessionGuard)
@Controller('admin')
export class AdminApiController {
  constructor(
    private readonly activationMetricsService: ActivationMetricsService,
    private readonly userJourneyService: UserJourneyService,
    private readonly userSearchService: UserSearchService,
    private readonly schemaDocumentationService: SchemaDocumentationService,
    private readonly backendDocsService: BackendDocsService,
  ) {}

  @Get('overview')
  getOverview() {
    return this.activationMetricsService.getOverview();
  }

  @Get('users')
  async listUsers() {
    return {
      users: await this.userJourneyService.listUsers(),
    };
  }

  @Get('users/:id')
  getUserDetail(@Param('id') userId: string) {
    return this.userJourneyService.getUserDetail(userId);
  }

  @Get('search')
  search(@Query() query: SearchUsersQueryDto) {
    return this.userSearchService.searchUsers(query);
  }

  @Get('database')
  getDatabaseReference() {
    return this.schemaDocumentationService.getSchemaReference();
  }

  @Get('backend-docs')
  getBackendDocs() {
    return this.backendDocsService.getDocs();
  }
}
