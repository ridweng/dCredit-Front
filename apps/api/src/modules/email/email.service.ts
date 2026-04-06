import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly defaultFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.defaultFrom = this.configService.get<string>('mail.from', 'noreply@dcredit.local');
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      auth: this.configService.get<string>('mail.user')
        ? {
            user: this.configService.get<string>('mail.user'),
            pass: this.configService.get<string>('mail.pass'),
          }
        : undefined,
    });
  }

  async sendVerificationEmail(to: string, verificationToken: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.defaultFrom,
      to,
      subject: 'Verify your dCredit account',
      text: `Verification token: ${verificationToken}`,
    });
  }
}
