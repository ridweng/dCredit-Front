import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { buildVerificationEmailTemplate } from './templates/verification-email.template';

export interface SendVerificationEmailInput {
  to: string;
  fullName: string;
  verificationUrl: string;
}

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

  async sendVerificationEmail(input: SendVerificationEmailInput): Promise<void> {
    const template = buildVerificationEmailTemplate({
      fullName: input.fullName,
      verificationUrl: input.verificationUrl,
    });

    await this.transporter.sendMail({
      from: this.defaultFrom,
      to: input.to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }
}
