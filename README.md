# dCredit

> Startup-style fintech MVP monorepo: two NestJS backends, React web, React Native mobile, PostgreSQL, Mailpit, and Docker Compose.

## Architecture

The repo now runs with two separate NestJS services backed by the same PostgreSQL database:

```text
apps/
  app-api/     Customer-facing NestJS service
  admin-api/   Internal admin / ops NestJS service
  api/         Shared backend foundation + migration/seed owner
  web/         Canonical React + Vite frontend
  mobile/      React Native + Expo frontend
packages/
  core/        Shared financial logic
  i18n/        Shared EN/ES translation layer
  types/       Shared TypeScript domain + app API contracts
  ui/          Shared UI package surface
```

## Frontend architecture decision

The project should remain a dual-frontend setup for now:

- `apps/web` stays the browser product
- `apps/mobile` stays the Expo / React Native product

The current recommendation is incremental consolidation, not a React Native Web rewrite.

Why:

- the web app is still strongly DOM- and browser-oriented
- the mobile app is still strongly Expo- and device-oriented
- the safest shared surface today is contracts, business logic, navigation metadata, and translations
- a full UI unification now would add migration risk without enough payoff yet

This phase consolidated:

- shared app API contracts in [packages/types](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/types)
- shared API route helpers in [packages/core](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/core)
- shared app section metadata in [packages/core](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/core)
- shared bilingual resources in [packages/i18n](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/i18n)

Platform-specific code remains separate for:

- rendering primitives and styling
- routing / navigation containers
- browser storage vs secure device storage
- web-specific responsive layout and native-specific runtime behavior

Decision note:

- [docs/frontend-architecture.md](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/docs/frontend-architecture.md)

## Why the backend was split

- `app-api` stays focused on product use cases used by customers and the web/mobile apps.
- `admin-api` stays focused on internal operations: activation funnel, user search, schema visibility, and backend docs.
- `apps/api` remains the single shared backend foundation so entities, migrations, seed scripts, auth primitives, and business modules are not duplicated.

This keeps the service boundary clear without creating two competing schema or auth implementations.

## Responsibility split

`app-api` owns:

- auth endpoints
- email verification pages and flows
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

`apps/api` owns:

- shared Nest modules and entities
- shared config and TypeORM setup
- migrations
- seed scripts
- DB reset workflow

## Frontend grouping

The product UI remains grouped the same way across web and mobile:

- `Home`: general balance, weekly movement, monthly obligations, next payment
- `Credits`: rates, monthly payments, payment dates, timeline
- `Spending`: grouped and categorized outflows
- `Sources`: connected financial sources and setup
- `Profile`: identity, language, verification state, logout

## Stack

- Customer web app: React + TypeScript + Vite
- Mobile app: React Native + TypeScript + Expo
- Backends: NestJS
- Database: PostgreSQL
- Email testing: Mailpit
- Migrations: TypeORM
- Orchestration: Docker Compose
- Workspace management: pnpm

## Shared logic

- [packages/core](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/core)
  - financial calculations
  - debt prioritization
  - recommendation helpers
  - shared app section metadata
  - shared app API route helpers
- [packages/i18n](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/i18n)
  - shared bilingual strings used by web and mobile
- [packages/types](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/types)
  - shared domain types
  - shared app-facing API request/response contracts
- [apps/api](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/api)
  - shared backend modules, entities, config, migrations, seeds

## Install

```bash
pnpm install
```

Or:

```bash
pnpm install:deps
```

## Environment setup

Copy the env examples you need:

```bash
cp .env.example .env
cp apps/app-api/.env.example apps/app-api/.env
cp apps/admin-api/.env.example apps/admin-api/.env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Local defaults:

- Postgres: `localhost:5433`
- App API: `http://localhost:3001`
- Admin API: `http://localhost:3002`
- Web: `http://localhost:5173`
- Mailpit UI: `http://localhost:8025`
- Mailpit SMTP: `localhost:1025`

## Core commands

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

App development:

```bash
pnpm dev:app-api
pnpm dev:admin-api
pnpm dev:web
pnpm dev:mobile
```

Database workflow:

```bash
pnpm migration:generate --name=DescribeChange
pnpm migration:run
pnpm migration:revert
pnpm seed
pnpm db:reset
```

Verification:

```bash
pnpm typecheck
pnpm verify
```

## Docker Compose services

`docker-compose.yml` now runs:

- `postgres`
- `mailpit`
- `app-api`
- `admin-api`

Ports:

- Postgres: `5433`
- Mailpit SMTP: `1025`
- Mailpit UI: `8025`
- App API: `3001`
- Admin API: `3002`

Useful checks:

```bash
docker compose ps
docker compose logs -f app-api
docker compose logs -f admin-api
docker compose logs -f postgres
docker compose logs -f mailpit
```

## Migrations and schema ownership

There is one migration workflow for the shared PostgreSQL schema.

Migration owner:

- [apps/api](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/api)

Workflow:

1. Update shared entities or TypeORM metadata under [apps/api/src](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/api/src)
2. Generate a migration
3. Review the file under [apps/api/src/database/migrations](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/api/src/database/migrations)
4. Run the migration

Commands:

```bash
pnpm migration:generate --name=AddSomething
pnpm migration:run
pnpm migration:revert
```

## Seed data

Seeds create deterministic local demo data for:

- verified users
- unverified users
- admin user
- activation journey examples
- financial sources
- accounts
- transactions
- credits
- installments

Run:

```bash
pnpm seed
```

Reset everything:

```bash
pnpm db:reset
```

## Mailpit

Mailpit is the local verification email solution.

- SMTP target: `localhost:1025`
- Web inbox: `http://localhost:8025`

Typical auth verification flow:

1. Register from web or mobile
2. Open Mailpit
3. Open the latest verification email
4. Follow the verification link
5. Sign in to the app

## App API

Location:

- [apps/app-api](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/app-api)

Key routes:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/liquid-balance`
- `GET /api/dashboard/weekly-spending`
- `GET /api/transactions`
- `GET /api/transactions/categories-summary`
- `GET /api/credits`
- `GET /api/credits/:id`
- `GET /api/credits/timeline`
- `GET /api/financial-sources`
- `POST /api/financial-sources`
- `PATCH /api/financial-sources/:id`

Swagger:

- `http://localhost:3001/api/docs`

## Admin API

Location:

- [apps/admin-api](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/admin-api)

Key routes:

- `GET /health`
- `GET /admin`
- `GET /admin/overview`
- `GET /admin/users`
- `GET /admin/users/:id`
- `GET /admin/search`
- `GET /admin/database`
- `GET /admin/backend-docs`

Swagger:

- `http://localhost:3002/api/docs`

Admin auth:

- admin access still uses the shared JWT/auth stack
- only users with `isAdmin = true` can enter the admin dashboard
- the admin dashboard stores an httpOnly admin session cookie scoped to `/admin`

Local seeded admin:

- email: `admin@dcredit.local`
- password: `AdminAccess123!`

Admin dashboard:

- `http://localhost:3002/admin`

## Web

Location:

- [apps/web](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/web)

Run:

```bash
pnpm dev:app-api
pnpm dev:web
```

Default API URL:

- `http://localhost:3001`

## Mobile

Location:

- [apps/mobile](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/mobile)

Run:

```bash
pnpm dev:app-api
pnpm dev:mobile
```

Default API URL:

- `EXPO_PUBLIC_API_URL=http://localhost:3001`

For real devices, replace `localhost` with your machine LAN IP or tunnel URL.

## What remains mocked or placeholder

- real banking / open-banking integrations
- production vault-backed credential storage
- production email infrastructure
- full analytics instrumentation for activation
- production deployment wiring for the two Nest services

The current repo is an MVP foundation with real backend structure, real auth, real shared schema, and demo financial data.
