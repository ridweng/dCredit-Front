# dCredit

> Bilingual fintech MVP foundation built as a monorepo: NestJS API, React web, React Native mobile, PostgreSQL, and Mailpit.

## Architecture

The repo is organized around three product apps and shared packages:

```text
apps/
  api/      NestJS + TypeORM backend
  web/      Canonical React + Vite web app
  mobile/   React Native + Expo mobile app
packages/
  core/     Shared financial logic
  i18n/     Shared EN/ES translation layer
  types/    Shared TypeScript types
artifacts/  Historical prototypes and migration references
```

Why the app is grouped into `Home`, `Credits`, `Spending`, `Sources`, and `Profile`:

- `Home` concentrates top-level financial awareness: general balance, weekly movement, obligations, and next payment.
- `Credits` isolates debt-product detail: rates, monthly payments, next dates, and installment timeline.
- `Spending` focuses on grouped and classified outflows.
- `Sources` is the setup and connection surface for banking/manual sources.
- `Profile` holds identity, language preference, verification state, and logout.

This grouping is shared conceptually across web and mobile so the product remains consistent across platforms.

## Stack

- Backend: NestJS
- Web: React + TypeScript + Vite
- Mobile: React Native + TypeScript + Expo
- Database: PostgreSQL
- ORM / schema workflow: TypeORM + committed migrations
- Email verification inbox: Mailpit
- Local infrastructure runtime: Docker Compose
- Workspace management: pnpm

## Shared Logic

Shared code is intentionally centralized:

- [`packages/core`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/core)
  - financial calculations
  - debt prioritization
  - risk / recommendation helpers
- [`packages/i18n`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/i18n)
  - shared bilingual translation dictionaries
  - reused by web and mobile
- [`packages/types`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/packages/types)
  - shared domain-oriented TypeScript types

## Install

```bash
pnpm install
```

There is also a pass-through script if you want it documented in the repo command surface:

```bash
pnpm install:deps
```

## Environment Setup

Copy the example env files:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Key local defaults:

- Postgres: `localhost:5433`
- API: `http://localhost:3001`
- Web: `http://localhost:5173`
- Mailpit UI: `http://localhost:8025`
- Mailpit SMTP: `localhost:1025`

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

App development:

```bash
pnpm dev:api
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

## Docker Compose Flow

Docker Compose is the local runtime for:

- PostgreSQL
- NestJS API
- Mailpit

The Compose stack is defined in [`docker-compose.yml`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/docker-compose.yml).

Expected startup flow:

1. `docker compose up -d`
2. Postgres becomes healthy on `5433`
3. Mailpit becomes healthy on `1025/8025`
4. API starts on `3001` and connects to Postgres + Mailpit

Useful checks:

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f postgres
docker compose logs -f mailpit
```

## Mailpit

Mailpit is the local verification email solution.

- SMTP target used by the API: `localhost:1025`
- Web inbox: `http://localhost:8025`

To inspect verification emails:

1. Register a user from the web or mobile flow
2. Open `http://localhost:8025`
3. Open the latest message
4. Follow the verification link or copy the token

## Database and Migrations

Schema changes are migration-first.

Typical workflow:

1. Update TypeORM entities in [`apps/api/src`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/api/src)
2. Generate a migration:

```bash
pnpm migration:generate --name=AddSomething
```

3. Review the generated file in [`apps/api/src/database/migrations`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/api/src/database/migrations)
4. Apply it:

```bash
pnpm migration:run
```

5. If needed, revert the latest migration:

```bash
pnpm migration:revert
```

## Demo Data / Seeding

Seed scripts create deterministic demo data for the MVP:

- verified and unverified auth users
- financial sources
- accounts
- transactions
- credits
- installments

Run:

```bash
pnpm seed
```

Reset local DB state completely:

```bash
pnpm db:reset
```

## Backend

The backend remains NestJS throughout the project.

API location:

- [`apps/api`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/api)

Main responsibilities already covered:

- authentication
- JWT-based session flow
- email verification via Mailpit
- dashboard aggregation
- credit views and timelines
- spending summaries
- financial source management
- lightweight internal admin / ops dashboard
- Swagger / OpenAPI backend documentation

Health endpoint:

- `GET /api/health`

Admin and docs routes:

- internal admin dashboard: `http://localhost:3001/admin`
- Swagger / OpenAPI: `http://localhost:3001/api/docs`

## Internal Admin Dashboard

The NestJS server now includes a lightweight internal ops dashboard served directly by the backend.

Why it is lightweight:

- no separate admin SPA
- no heavy admin framework
- simple server-rendered HTML with small JSON endpoints behind it
- protected with an admin-only JWT cookie derived from the existing auth stack

Access:

- route: `http://localhost:3001/admin`
- local demo admin user:
  - `admin@dcredit.local`
  - `AdminAccess123!`

Sections:

- `Overview`
  - total users
  - verified vs unverified
  - users with sources, accounts, transactions, credits
  - activation funnel counts and percentages
  - latest signups
  - latest verifications
- `Users`
  - per-user activation state
  - counts for sources, accounts, transactions, credits
  - detail view with journey steps, sources, accounts, credits, and recent transactions
- `Searcher`
  - text search by name/email
  - filters by verification, activation stage, credits, and sources
- `Database`
  - readable explanation of the main tables
  - relation summary
  - table-by-table documentation
- `Backend Docs`
  - link to Swagger docs
  - module and endpoint guide

Activation stage logic used by the admin dashboard:

- `registered`
- `email_verified`
- `source_connected`
- `account_ready`
- `transaction_ready`
- `credit_ready`
- `activated`

Activation is defined as:

- verified user
- at least one financial source
- at least one account
- and either transaction data or at least one detected credit

## Web App

The web app remains React + TypeScript and is the canonical frontend.

Location:

- [`apps/web`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/web)

Run:

```bash
pnpm dev:web
```

Set API origin in [`apps/web/.env.example`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/web/.env.example):

```bash
VITE_API_URL=http://localhost:3001
```

If `VITE_API_URL` is omitted, the local Vite `/api` proxy is used.

The web app includes:

- login
- register
- verification confirmation
- protected app shell
- bilingual tabs for Home, Credits, Spending, Sources, and Profile

## Mobile App

The mobile app remains React Native + Expo.

Location:

- [`apps/mobile`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/mobile)

Structure:

- `src/navigation`
- `src/screens`
- `src/context`
- `src/services/api`
- `src/components`
- `src/theme`

Run:

```bash
pnpm dev:mobile
```

Mobile uses the same major feature grouping as web:

- Home
- Credits
- Spending
- Sources
- Profile

Mobile API host is configured in [`apps/mobile/.env.example`](/Users/ignaciokaiser/Desktop/mines/dCredit-Front/apps/mobile/.env.example):

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

For real device/emulator testing outside a local desktop loop:

- `localhost` usually is not enough
- use your machine LAN IP, Expo tunnel, or Android reverse proxying
- native deep linking for verification is still future work

## Authentication

Auth works conceptually across the product foundation:

- register creates an unverified account
- verification email is sent through Mailpit
- verified users can log in and receive JWT access tokens
- protected routes/screens rely on JWT-backed current-user rehydration

Implemented API endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /admin`
- `GET /admin/overview`
- `GET /admin/users`
- `GET /admin/users/:id`
- `GET /admin/search`
- `GET /admin/database`
- `GET /admin/backend-docs`
- `GET /admin/docs`

## Financial Views Covered

The current foundation covers the requested product surfaces:

- consolidated general balance
- weekly grouped spending
- categorized spending totals and percentages
- monthly credit obligations
- next payment highlight
- interest rate visibility per credit
- installment timeline / gantt-ready credit data
- financial source list and setup placeholder

## Bilingual Support

Bilingual support exists across the product through the shared i18n package.

Supported languages:

- English
- Spanish

Web and mobile both use the shared translation layer instead of hardcoding separate copy systems.

## What Remains Placeholder / Future Integration

The foundation is production-minded, but some features are intentionally still placeholders:

- banking provider integrations are not yet connected to real institutions
- `financial-sources` currently uses secure vault reference placeholders instead of real credential vaulting
- mobile verification currently routes users toward the web verification flow
- no real Plaid/open-banking connector is implemented yet
- recommendation quality is demo-oriented and based on seeded data

## Demo Users

After `pnpm seed` or `pnpm db:reset`:

- admin:
  - `admin@dcredit.local`
  - `AdminAccess123!`
- verified:
  - `demo@dcredit.local`
  - `ChangeMe123!`
- unverified:
  - `pending@dcredit.local`
  - `VerifyMe123!`

## Quality Status

The project remains aligned with the intended MVP foundation:

- NestJS backend
- React web frontend
- React Native mobile frontend
- PostgreSQL database
- Mailpit verification email flow
- Docker Compose runtime for postgres + api + mailpit
- bilingual support across product surfaces
- migration-based schema workflow
- seeded demo data and financial views
