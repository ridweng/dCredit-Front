import { z } from 'zod';

const booleanValue = z
  .union([z.boolean(), z.string()])
  .transform((value) => {
    if (typeof value === 'boolean') {
      return value;
    }

    return value === 'true';
  });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z.coerce.number().int().positive().default(5433),
  DATABASE_NAME: z.string().default('dcredit'),
  DATABASE_USER: z.string().default('dcredit'),
  DATABASE_PASSWORD: z.string().default('dcredit_dev_password'),
  DATABASE_URL: z.string().min(1).optional(),
  DATABASE_LOGGING: booleanValue.default(false),
  DATABASE_SSL: booleanValue.default(false),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().min(1).default('noreply@dcredit.local'),
  SMTP_FROM: z.string().min(1).optional(),
  APP_API_URL: z.string().url().optional(),
  APP_WEB_URL: z.string().url().default('http://localhost:5173'),
  ADMIN_UI_ORIGIN: z.string().url().optional(),
  WEB_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(16).default('dev-only-change-me-secret'),
  JWT_EXPIRES_IN: z.string().min(1).default('1h'),
  CORS_ORIGINS: z.string().optional(),
});

export type ValidatedEnv = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): ValidatedEnv {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  const data = parsed.data;

  return {
    ...data,
    DATABASE_URL:
      data.DATABASE_URL ??
      buildDatabaseUrl({
        host: data.DATABASE_HOST,
        port: data.DATABASE_PORT,
        name: data.DATABASE_NAME,
        user: data.DATABASE_USER,
        password: data.DATABASE_PASSWORD,
      }),
  };
}

export function loadValidatedEnv(): ValidatedEnv {
  return validateEnv(process.env);
}

function buildDatabaseUrl(input: {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}): string {
  return `postgresql://${encodeURIComponent(input.user)}:${encodeURIComponent(
    input.password,
  )}@${input.host}:${input.port}/${input.name}`;
}
