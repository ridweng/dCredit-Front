import { registerAs } from '@nestjs/config';
import { loadValidatedEnv } from './env.validation';

export const appConfig = registerAs('app', () => {
  const env = loadValidatedEnv();
  const apiUrl = env.APP_API_URL ?? `http://localhost:${env.PORT}`;
  const webUrl = env.APP_WEB_URL ?? env.WEB_URL ?? 'http://localhost:5173';
  const adminUiOrigin = env.ADMIN_UI_ORIGIN;
  const defaultOrigins = [webUrl, apiUrl, 'http://localhost:19000', 'http://localhost:19006'];

  if (adminUiOrigin) {
    defaultOrigins.push(adminUiOrigin);
  }

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    apiUrl,
    webUrl,
    adminUiOrigin,
    corsOrigins: env.CORS_ORIGINS
      ? env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
      : defaultOrigins,
  };
});
