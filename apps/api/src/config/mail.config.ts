import { registerAs } from '@nestjs/config';
import { loadValidatedEnv } from './env.validation';

export const mailConfig = registerAs('mail', () => {
  const env = loadValidatedEnv();

  return {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.MAIL_FROM ?? env.SMTP_FROM ?? 'noreply@dcredit.local',
  };
});
