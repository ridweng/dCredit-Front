import { registerAs } from '@nestjs/config';
import { loadValidatedEnv } from './env.validation';

export const appConfig = registerAs('app', () => {
  const env = loadValidatedEnv();
  const webUrl = env.APP_WEB_URL ?? env.WEB_URL ?? 'http://localhost:5173';

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    webUrl,
    corsOrigins: env.CORS_ORIGINS
      ? env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
      : [webUrl, 'http://localhost:19000', 'http://localhost:19006'],
  };
});
