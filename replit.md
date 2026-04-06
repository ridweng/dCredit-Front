# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: NestJS
- **Mobile shell**: Expo + React Native WebView
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/dcredit dev` — run the Vite app for browser + WebView development
- `PORT=3001 pnpm --filter @workspace/api-server dev` — run the Nest API server locally
- `EXPO_PUBLIC_WEB_APP_URL=http://127.0.0.1:5173 pnpm --filter @workspace/dcredit-mobile ios` — launch the Expo shell in the iPhone simulator

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Full-Stack Monorepo Structure

```
dCredit/
├── apps/
│   ├── api/          # NestJS backend (TypeScript, PostgreSQL, TypeORM, Mailpit)
│   ├── web/          # React + Vite frontend (production full-stack version)
│   └── mobile/       # React Native + Expo mobile app
├── packages/
│   ├── types/        # @dcredit/types — shared domain interfaces (User, DebtProduct, etc.)
│   ├── core/         # @dcredit/core — shared financial logic (no UI deps)
│   ├── i18n/         # @dcredit/i18n — shared EN/ES translations
│   └── ui/           # @dcredit/ui — shared design tokens
├── artifacts/
│   └── dcredit/      # Replit preview — standalone React MVP (no backend required)
├── docker-compose.yml  # postgres + nestjs api + mailpit
├── .env.example
└── README.md
```

### Root Scripts
- `pnpm dev:api` — starts `apps/api` (NestJS)
- `pnpm dev:web` — starts `apps/web` (React + Vite)
- `pnpm dev:mobile` — starts `apps/mobile` (Expo)
- `pnpm docker:up` — starts Docker stack (postgres, api, mailpit)
- `pnpm docker:down` — stops Docker stack

### Service Ports
- NestJS API: `localhost:3001/api`
- React web: `localhost:5173`
- Mailpit UI: `localhost:8025`
- Mailpit SMTP: `localhost:1025`
- PostgreSQL: `localhost:5432`

## Artifacts

### dCredit (`artifacts/dcredit/`) — preview path `/`
A bilingual (EN/ES) fintech MVP that helps salaried professionals understand their real debt capacity.

**Key folder structure:**
- `src/i18n/` — translation dictionaries (`translations.ts`) and `useTranslation` hook
- `src/contexts/` — `LanguageContext` (EN/ES toggle + localStorage) and `FinancialContext` (mock data + editable assumptions)
- `src/engine/` — pure business logic (no React/DOM dependencies; reusable in React Native):
  - `financialCalculations.ts` — FCF, debt burden ratio, amortization, safe capacity
  - `recommendationEngine.ts` — risk assessment, debt prioritization, recommendation generation, loan simulation
  - `debtHealthScore.ts` — 0–100 score based on burden/FCF/trend
- `src/data/mockData.ts` — realistic mock user (Alex Rivera, $5200/mo), 3 debts, 3 institutions, 6-month history
- `src/types/financial.ts` — shared TypeScript interfaces
- `src/pages/` — 6 pages: Onboarding, Dashboard, Debts, Simulator, Insights, DataConfidence
- `src/components/` — reusable components: AppShell, TopNav, BottomNav, DebtCard, StatusBadge, etc.

**Architecture notes:**
- No backend required — all logic is in-browser
- To add real bank APIs: replace `mockData.ts` imports in `FinancialContext.tsx`
- Language switching is instant via React context + localStorage
- Business logic in `src/engine/` has zero browser/React dependencies

### dCredit Mobile (`artifacts/dcredit-mobile/`)
An Expo shell that loads the Vite app in a native `WebView`.

**Local workflow**
- Start web: `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/dcredit dev`
- Start API: `PORT=3001 pnpm --filter @workspace/api-server dev`
- Start iOS shell: `EXPO_PUBLIC_WEB_APP_URL=http://127.0.0.1:5173 pnpm --filter @workspace/dcredit-mobile ios`

### API Server (`artifacts/api-server/`)
A Nest-based API server that preserves the existing `/api/healthz` contract.
