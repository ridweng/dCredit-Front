import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/types/authenticated-request-user.type';
import { CreateFinancialSourceDto } from './dto/create-financial-source.dto';
import { UpdateFinancialSourceDto } from './dto/update-financial-source.dto';
import { FinancialSourcesService } from './financial-sources.service';

@UseGuards(JwtAuthGuard)
@Controller('financial-sources')
export class FinancialSourcesController {
  constructor(private readonly financialSourcesService: FinancialSourcesService) {}

  @Get()
  listForCurrentUser(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.financialSourcesService.listViewForUser(currentUser.id);
  }

  @Post()
  createForCurrentUser(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Body() body: CreateFinancialSourceDto,
  ) {
    return this.financialSourcesService.createForUser(currentUser.id, body);
  }

  @Patch(':id')
  updateForCurrentUser(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Param('id') financialSourceId: string,
    @Body() body: UpdateFinancialSourceDto,
  ) {
    return this.financialSourcesService.updateForUser(currentUser.id, financialSourceId, body);
  }
}
