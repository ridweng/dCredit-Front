import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/types/authenticated-request-user.type';
import { CreditsService } from './credits.service';

@ApiTags('credits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get()
  listCredits(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.creditsService.listCreditsView(currentUser.id);
  }

  @Get('timeline')
  getTimeline(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.creditsService.getTimeline(currentUser.id);
  }

  @Get(':id')
  getCreditById(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Param('id') creditId: string,
  ) {
    return this.creditsService.getCreditDetails(currentUser.id, creditId);
  }
}
