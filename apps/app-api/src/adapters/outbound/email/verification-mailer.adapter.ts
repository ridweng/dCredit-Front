import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@dcredit/backend-shared';
import type { VerificationMailerPort } from '../../../application/ports/auth.ports';

@Injectable()
export class VerificationMailerAdapter implements VerificationMailerPort {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  sendVerificationEmail(input: {
    to: string;
    fullName: string;
    token: string;
  }): Promise<void> {
    const verificationUrl = this.buildVerificationUrl(input.token);

    return this.emailService.sendVerificationEmail({
      to: input.to,
      fullName: input.fullName,
      verificationUrl,
    });
  }

  private buildVerificationUrl(token: string): string {
    const baseUrl = this.configService
      .get<string>('app.apiUrl', 'http://localhost:3001')
      .replace(/\/+$/, '');

    return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  }
}
