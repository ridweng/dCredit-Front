import { registerAs } from '@nestjs/config';
import { loadValidatedEnv } from './env.validation';

export const appConfig = registerAs('app', () => {
  const env = loadValidatedEnv();

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    webUrl: env.WEB_URL,
    corsOrigins: env.CORS_ORIGINS
      ? env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
      : [env.WEB_URL, 'http://localhost:19000', 'http://localhost:19006'],
  };
});
