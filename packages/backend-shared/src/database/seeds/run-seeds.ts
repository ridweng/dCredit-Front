import 'reflect-metadata';
import AppDataSource from '../data-source';
import { runSeeds } from './seed-database';

async function main(): Promise<void> {
  const dataSource = await AppDataSource.initialize();

  try {
    await runSeeds(dataSource);
    console.log('Seed data applied successfully.');
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed database', error);
  process.exit(1);
});
