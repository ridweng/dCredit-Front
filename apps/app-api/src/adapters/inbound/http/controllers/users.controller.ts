import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  JwtAuthGuard,
  type AuthenticatedRequestUser,
} from '@dcredit/backend-shared';
import {
  GetCurrentUserUseCase,
  UpdateCurrentUserUseCase,
} from '../../../../application/use-cases/users/users.use-cases';
import { UpdateCurrentUserDto } from '../dtos/users.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly updateCurrentUserUseCase: UpdateCurrentUserUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    return this.getCurrentUserUseCase.execute(currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Body() body: UpdateCurrentUserDto,
  ) {
    return this.updateCurrentUserUseCase.execute(currentUser.id, body.preferredLanguage);
  }
}
