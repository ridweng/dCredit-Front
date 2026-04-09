import 'reflect-metadata';
import { config as loadEnvFile } from 'dotenv';
import { DataSource } from 'typeorm';
import { createTypeOrmOptions } from './typeorm.config';

loadEnvFile();

const appDataSource = new DataSource(createTypeOrmOptions());

export default appDataSource;
