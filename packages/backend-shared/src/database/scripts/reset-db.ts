import 'reflect-metadata';
import AppDataSource from '../data-source';
import { runSeeds } from '../seeds/seed-database';

async function resetDatabase(): Promise<void> {
  const dataSource = await AppDataSource.initialize();

  try {
    await dataSource.dropDatabase();
    await dataSource.runMigrations();
    await runSeeds(dataSource);
    console.log('Database reset, migrated, and seeded successfully.');
  } finally {
    await dataSource.destroy();
  }
}

resetDatabase().catch((error: unknown) => {
  console.error('Failed to reset database', error);
  process.exit(1);
});
