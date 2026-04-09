import { DynamicModule, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { mailConfig } from './config/mail.config';
import { validateEnv } from './config/env.validation';
import { buildTypeOrmModuleOptions } from './database/typeorm.config';
import { HealthModule } from './modules/health/health.module';
import { SharedModule } from './modules/shared/shared.module';

export function buildBackendRootImports(): Array<
  DynamicModule | Promise<DynamicModule> | Type<unknown>
> {
  return [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '../../packages/backend-shared/.env'),
        path.resolve(process.cwd(), '../../.env'),
      ],
      validate: validateEnv,
      load: [appConfig, authConfig, databaseConfig, mailConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: buildTypeOrmModuleOptions,
    }),
    SharedModule,
    HealthModule,
  ];
}
