import { registerAs } from '@nestjs/config';
import { loadValidatedEnv } from './env.validation';

export const databaseConfig = registerAs('database', () => {
  const env = loadValidatedEnv();

  return {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    name: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    url: env.DATABASE_URL,
    logging: env.DATABASE_LOGGING,
    ssl: env.DATABASE_SSL,
  };
});
