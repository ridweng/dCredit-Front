# dCredit

> Startup-style fintech MVP monorepo: two NestJS backends, one React Native product client, PostgreSQL, Mailpit, and Docker Compose.

## Architecture

```text
apps/
  app-api/     Customer-facing NestJS service
  admin-api/   Internal admin / ops NestJS service
  api/         Shared backend foundation + migration/seed owner
  mobile/      Canonical React Native + Expo frontend
packages/
  core/        Shared financial logic
  client-core/ Shared frontend application/use-case layer
  i18n/        Shared EN/ES translation layer
  types/       Shared TypeScript domain + app API contracts
```

The product is intentionally mobile-only in this phase:

- `apps/mobile` is the only customer-facing frontend
- the former browser frontend has been retired
- email verification lands on a backend-hosted confirmation page, not a browser app

## Architecture Notes

- Hexagonal architecture note:
  - [docs/hexagonal-architecture.md](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/docs/hexagonal-architecture.md)
- Frontend decision note:
  - [docs/frontend-architecture.md](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/docs/frontend-architecture.md)

## Service Responsibilities

`app-api` owns:

- auth endpoints
- backend-hosted email verification confirmation
- `users/me`
- dashboard endpoints
- transactions and category summaries
- credits and timeline endpoints
- financial source endpoints
- customer-facing Swagger docs

`admin-api` owns:

- `/admin` HTML dashboard
- overview KPIs and activation funnel
- users list and user journey detail
- searcher
- live database/schema explorer
- backend docs surface
- admin-only session and admin role enforcement
- admin Swagger docs

`packages/backend-shared` owns:

- shared Nest modules and entities
- shared config and TypeORM setup
- migrations
- seed scripts
- DB reset workflow

`apps/mobile` owns:

- auth flow
- verification waiting flow
- Home
- Credits
- Spending
- Sources
- Profile

## Product Surface

The mobile app is grouped into five tabs:

- `Home`
  - liquid balance
  - weekly spending summary
  - monthly credit obligations
  - next payment
  - recommendation cards
- `Credits`
  - credit list
  - interest rate per credit
  - upcoming payment dates
  - selected-credit detail
  - installment timeline
- `Spending`
  - grouped weekly spending
  - categorized spending totals
  - category percentages
  - recent transaction insights
- `Sources`
  - connected financial sources
  - status quick actions
  - add source form
  - secure setup explanation
- `Profile`
  - user details
  - language preference
  - verification state
  - logout

## Stack

- Frontend: React Native + TypeScript + Expo
- Backends: NestJS
- Database: PostgreSQL
- Email testing: Mailpit
- Migrations: TypeORM
- Orchestration: Docker Compose
- Workspace management: pnpm

## Shared Logic

- [packages/core](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/core)
  - financial calculations
  - debt prioritization
  - recommendation helpers
  - shared app metadata
  - shared app API route helpers
- [packages/client-core](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/client-core)
  - shared frontend ports
  - shared auth/session use-cases
  - shared dashboard / credits / spending / sources loading use-cases
  - shared request adapter composition
- [packages/i18n](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/i18n)
  - shared bilingual strings used by the mobile app
- [packages/types](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/types)
  - shared domain types
  - shared app-facing API request/response contracts

## Install

```bash
pnpm install
```

Or:

```bash
pnpm install:deps
```

## Environment Setup

Copy the env examples you need:

```bash
cp .env.example .env
cp apps/app-api/.env.example apps/app-api/.env
cp apps/admin-api/.env.example apps/admin-api/.env
cp packages/backend-shared/.env.example packages/backend-shared/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Local defaults:

- Postgres: `localhost:5433`
- App API: `http://localhost:3001`
- Admin API: `http://localhost:3002`
- Mailpit UI: `http://localhost:8025`
- Mailpit SMTP: `localhost:1025`

For the iOS simulator, keep this in `apps/mobile/.env`:

```bash
EXPO_PUBLIC_API_URL=http://127.0.0.1:3001
```

## Core Commands

Infrastructure:

```bash
docker compose up -d
docker compose down
```

Repo shortcuts:

```bash
pnpm docker:up
pnpm docker:down
pnpm docker:logs
```

Development:

```bash
pnpm dev:app-api
pnpm dev:admin-api
pnpm dev:mobile
pnpm dev:mobile:ios
pnpm ios
```

Database workflow:

```bash
pnpm migration:generate
pnpm migration:run
pnpm migration:revert
pnpm seed
pnpm db:reset
```

Verification and static checks:

```bash
pnpm typecheck
pnpm verify
```

## Recommended Local Run Flow

Terminal 1:

```bash
docker compose up -d postgres mailpit
```

Terminal 2:

```bash
pnpm dev:app-api
```

Terminal 3:

```bash
pnpm dev:mobile:ios
```

Optional admin terminal:

```bash
pnpm dev:admin-api
```

## URLs And Tools

- App API docs: `http://localhost:3001/api/docs`
- Admin dashboard: `http://localhost:3002/admin`
- Admin API docs: `http://localhost:3002/api/docs`
- Mailpit: `http://localhost:8025`

## Auth And Verification Flow

1. Register in the mobile app
2. The app moves to the verification waiting screen
3. Open Mailpit and open the verification email
4. Follow the backend-hosted `/verify-email` link
5. Return to the app
6. The waiting screen auto-retries verification and can also be checked manually
7. Once verified, the user can sign in and enter the app

If an email already belongs to an unverified account, a new registration reclaims that email and replaces the older unverified account. Verified accounts remain protected and cannot be overwritten by registration.

## Admin Dashboard

Admin dashboard:

- `http://localhost:3002/admin`

## Seeded Local Accounts

Verified demo user with seeded financial data:

- email: `demo@dcredit.local`
- password: `ChangeMe123!`

Unverified demo user:

- email: `pending@dcredit.local`
- password: `VerifyMe123!`

Seeded local admin credentials:

- email: `admin@dcredit.local`
- password: `AdminAccess123!`

Admin features include:

- overview KPIs and activation funnel
- user list and user detail
- searcher
- live schema explorer with table relationships
- backend docs links

## Migrations And Seeds

The shared PostgreSQL schema has one migration owner:

- `packages/backend-shared`

That package owns:

- TypeORM entities
- migrations
- seed scripts
- DB reset workflow

This keeps `app-api` and `admin-api` on the same schema without conflicting migration systems.

## Mailpit

Mailpit is used for local verification email testing.

- SMTP endpoint: `localhost:1025`
- UI: `http://localhost:8025`

Use it to:

- inspect registration verification emails
- open the backend-hosted verification link
- validate resend-verification behavior

## Future Integration Placeholders

The current MVP still uses placeholders for future banking integrations:

- financial-source credentials are represented by secure vault references, not real provider credentials
- source connectivity remains a product-level demo flow
- transaction and credit data remain seeded/demo-friendly instead of coming from live aggregators

That is intentional for this phase. The core API and product surfaces are in place without introducing real external banking dependencies yet.
