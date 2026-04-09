import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { bootstrapBackendApp } from './bootstrap';

bootstrapBackendApp({
  rootModule: AppModule,
  docsTitle: 'dCredit App API',
  docsDescription:
    'Customer-facing dCredit API for authentication, profile, dashboard, credits, spending, and financial sources.',
  docsPath: 'api/docs',
  globalPrefix: 'api',
  globalPrefixExclude: [{ path: 'verify-email', method: RequestMethod.GET }],
  defaultPort: 3001,
  publicBasePath: '/api',
}).catch((error: unknown) => {
  console.error('Failed to bootstrap dCredit shared backend entrypoint', error);
  process.exit(1);
});
