import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  type AuthenticatedRequestUser,
} from '@dcredit/backend-shared';
import {
  GetCreditDetailUseCase,
  GetCreditTimelineUseCase,
  ListCreditsUseCase,
} from '../../../../application/use-cases/credits/credits.use-cases';

@ApiTags('credits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('credits')
export class CreditsController {
  constructor(
    private readonly listCreditsUseCase: ListCreditsUseCase,
    private readonly getCreditDetailUseCase: GetCreditDetailUseCase,
    private readonly getCreditTimelineUseCase: GetCreditTimelineUseCase,
  ) {}

  @Get()
  listCredits(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.listCreditsUseCase.execute(currentUser.id);
  }

  @Get('timeline')
  getTimeline(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.getCreditTimelineUseCase.execute(currentUser.id);
  }

  @Get(':id')
  getCreditById(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Param('id') creditId: string,
  ) {
    return this.getCreditDetailUseCase.execute(currentUser.id, creditId);
  }
}
