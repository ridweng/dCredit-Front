import { registerAs } from '@nestjs/config';
import { loadValidatedEnv } from './env.validation';

export const authConfig = registerAs('auth', () => {
  const env = loadValidatedEnv();

  return {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
  };
});
