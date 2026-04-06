import {
  Body,
  Controller,
  Get,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequestUser } from '../auth/types/authenticated-request-user.type';
import { UpdateCurrentUserDto } from './dto/update-current-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() currentUser: AuthenticatedRequestUser) {
    const user = await this.usersService.findById(currentUser.id);

    if (!user) {
      throw new UnauthorizedException('Invalid access token.');
    }

    return this.usersService.toSafeUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(
    @CurrentUser() currentUser: AuthenticatedRequestUser,
    @Body() body: UpdateCurrentUserDto,
  ) {
    const user = await this.usersService.updateCurrentUser(currentUser.id, body);
    return this.usersService.toSafeUser(user);
  }
}
