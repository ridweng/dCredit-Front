import { Injectable } from '@nestjs/common';

@Injectable()
export class BackendDocsService {
  getDocs() {
    return {
      swaggerUrl: '/api/docs',
      appApiDocsUrl: 'http://localhost:3001/api/docs',
      adminApiDocsUrl: 'http://localhost:3002/api/docs',
      modules: [
        {
          name: 'Auth',
          description:
            'Registration, login, email verification, resend verification, and JWT issuance on the customer-facing app-api.',
          endpoints: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'POST /api/auth/verify-email',
            'POST /api/auth/resend-verification',
          ],
        },
        {
          name: 'Users',
          description: 'Authenticated profile access and preferred-language updates.',
          endpoints: ['GET /api/users/me', 'PATCH /api/users/me'],
        },
        {
          name: 'Dashboard',
          description: 'Liquid balance, weekly spending, monthly credit obligations, and next-payment visibility.',
          endpoints: [
            'GET /api/dashboard/summary',
            'GET /api/dashboard/liquid-balance',
            'GET /api/dashboard/weekly-spending',
          ],
        },
        {
          name: 'Credits',
          description: 'Credit inventory, detail views, interest-rate visibility, and timeline-ready data.',
          endpoints: ['GET /api/credits', 'GET /api/credits/:id', 'GET /api/credits/timeline'],
        },
        {
          name: 'Financial Sources',
          description: 'Connected sources and secure credential-reference placeholders.',
          endpoints: [
            'GET /api/financial-sources',
            'POST /api/financial-sources',
            'PATCH /api/financial-sources/:id',
          ],
        },
        {
          name: 'Transactions',
          description: 'Recent transactions plus category summary and spending breakdowns.',
          endpoints: ['GET /api/transactions', 'GET /api/transactions/categories-summary'],
        },
        {
          name: 'Admin',
          description:
            'Internal admin-api surface for ops metrics, user lookup, schema visibility, and backend tooling.',
          endpoints: [
            'GET /admin',
            'GET /admin/overview',
            'GET /admin/users',
            'GET /admin/users/:id',
            'GET /admin/search',
            'GET /admin/database',
            'GET /admin/backend-docs',
          ],
        },
      ],
      notes: [
        'The backend is split into app-api (customer product endpoints) and admin-api (internal operations and admin tooling).',
        'All app-api business endpoints use JWT bearer auth unless they are part of the public auth flow.',
        'The /admin surface is protected separately by an admin-only JWT cookie derived from the same auth stack and shared admin flag.',
        'Swagger is exposed separately on both services: app-api at localhost:3001/api/docs and admin-api at localhost:3002/api/docs in local development.',
      ],
    };
  }
}
