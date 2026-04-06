# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
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

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

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
