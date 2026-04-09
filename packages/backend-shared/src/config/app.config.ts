import { registerAs } from '@nestjs/config';
import { loadValidatedEnv } from './env.validation';

export const appConfig = registerAs('app', () => {
  const env = loadValidatedEnv();
  const apiUrl = env.APP_API_URL ?? `http://localhost:${env.PORT}`;
  const adminUiOrigin = env.ADMIN_UI_ORIGIN;
  const defaultOrigins = [
    apiUrl,
    'http://localhost:19000',
    'http://localhost:19006',
    'http://127.0.0.1:19000',
    'http://127.0.0.1:19006',
  ];

  if (adminUiOrigin) {
    defaultOrigins.push(adminUiOrigin);
  }

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    apiUrl,
    adminUiOrigin,
    corsOrigins: env.CORS_ORIGINS
      ? env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
      : defaultOrigins,
  };
});
