import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  type AuthenticatedRequestUser,
} from '@dcredit/backend-shared';
import {
  CreateFinancialSourceUseCase,
  ListFinancialSourcesUseCase,
  UpdateFinancialSourceUseCase,
} from '../../../../application/use-cases/financial-sources/financial-sources.use-cases';
import {
  CreateFinancialSourceDto,
  UpdateFinancialSourceDto,
} from '../dtos/financial-sources.dto';

@ApiTags('financial-sources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financial-sources')
export class FinancialSourcesController {
  constructor(
    private readonly listFinancialSourcesUseCase: ListFinancialSourcesUseCase,
    private readonly createFinancialSourceUseCase: CreateFinancialSourceUseCase,
    private readonly updateFinancialSourceUseCase: UpdateFinancialSourceUseCase,
  ) {}

  @Get()
  listSources(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.listFinancialSourcesUseCase.execute(currentUser.id);
  }

  @Post()
  createSource(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Body() body: CreateFinancialSourceDto,
  ) {
    return this.createFinancialSourceUseCase.execute(currentUser.id, body);
  }

  @Patch(':id')
  updateSource(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Param('id') financialSourceId: string,
    @Body() body: UpdateFinancialSourceDto,
  ) {
    return this.updateFinancialSourceUseCase.execute(currentUser.id, financialSourceId, body);
  }
}
