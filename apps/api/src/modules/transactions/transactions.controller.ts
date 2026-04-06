import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/types/authenticated-request-user.type';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { TransactionsService } from './transactions.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  listTransactions(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Query() query: ListTransactionsQueryDto,
  ) {
    return this.transactionsService.listRecentForUser(currentUser.id, query);
  }

  @Get('categories-summary')
  getCategoriesSummary(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.transactionsService.getCategoriesSummary(currentUser.id);
  }
}
