import { bootstrapBackendApp } from '@dcredit/backend-shared';
import { AppModule } from './app.module';

bootstrapBackendApp({
  rootModule: AppModule,
  docsTitle: 'dCredit Admin API',
  docsDescription:
    'Internal dCredit admin / ops API for activation KPIs, user journeys, database schema visibility, and backend documentation.',
  docsPath: 'api/docs',
  defaultPort: 3002,
  publicBasePath: '/admin',
}).catch((error: unknown) => {
  console.error('Failed to bootstrap dCredit Admin API', error);
  process.exit(1);
});
