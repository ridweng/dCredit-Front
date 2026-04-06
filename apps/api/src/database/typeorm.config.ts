import * as path from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { loadValidatedEnv } from '../config/env.validation';
import { appEntities } from './entities';

export function createTypeOrmOptions(): DataSourceOptions {
  const env = loadValidatedEnv();

  return {
    type: 'postgres',
    url: env.DATABASE_URL,
    entities: appEntities,
    migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    logging: env.DATABASE_LOGGING,
    ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
  };
}

export function buildTypeOrmModuleOptions(): TypeOrmModuleOptions {
  return createTypeOrmOptions();
}
