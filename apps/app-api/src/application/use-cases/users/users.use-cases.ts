import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { SafeUser, SupportedLocale } from '@dcredit/types';
import { APP_API_TOKENS } from '../../ports/app-api.tokens';
import { type AuthUsersPort, toSafeUser } from '../../ports/auth.ports';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(APP_API_TOKENS.authUsersPort)
    private readonly authUsersPort: AuthUsersPort,
  ) {}

  async execute(userId: string): Promise<SafeUser> {
    const user = await this.authUsersPort.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid access token.');
    }

    return toSafeUser(user);
  }
}

@Injectable()
export class UpdateCurrentUserUseCase {
  constructor(
    @Inject(APP_API_TOKENS.authUsersPort)
    private readonly authUsersPort: AuthUsersPort,
  ) {}

  async execute(userId: string, preferredLanguage: SupportedLocale): Promise<SafeUser> {
    const user = await this.authUsersPort.updatePreferredLanguage(userId, preferredLanguage);
    return toSafeUser(user);
  }
}
