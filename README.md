# dCredit

> **Your debt, made clear.** — A bilingual (EN/ES) fintech app that helps salaried professionals understand their real monthly debt capacity.

---

## Monorepo Structure

```
dCredit/
├── apps/
│   ├── api/          # NestJS backend API
│   ├── web/          # React + Vite frontend (production full-stack version)
│   └── mobile/       # React Native + Expo mobile app
├── packages/
│   ├── types/        # Shared TypeScript domain types
│   ├── core/         # Shared financial calculation logic (no UI deps)
│   ├── i18n/         # Shared EN/ES translation dictionaries
│   └── ui/           # Shared design tokens and style constants
├── artifacts/
│   └── dcredit/      # Replit preview — standalone React MVP (mock data, no backend)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| API        | NestJS (TypeScript)         |
| Database   | PostgreSQL 16               |
| ORM        | TypeORM + migrations        |
| Web        | React 19 + Vite             |
| Mobile     | React Native + Expo         |
| Email      | Mailpit (dev) / SMTP (prod) |
| Containers | Docker Compose              |
| Monorepo   | pnpm workspaces             |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+ — `npm install -g pnpm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the local backend stack)
- For mobile: [Expo Go](https://expo.dev/go) on your phone or an iOS/Android simulator

---

## Initial Setup

```bash
# 1. Clone and install dependencies
git clone <repo>
cd dcredit
pnpm install

# 2. Set up environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

---

## Development

### Start the Docker backend stack

```bash
# Starts: PostgreSQL, NestJS API, Mailpit
pnpm docker:up

# Stop all containers
pnpm docker:down
```

To inspect running services:

```bash
pnpm docker:logs
```

### Start individual apps

```bash
# NestJS API (http://localhost:3001/api)
pnpm dev:api

# React web app (http://localhost:5173)
pnpm dev:web

# React Native mobile app (Expo)
pnpm dev:mobile
```

### Database workflow

```bash
# Run committed migrations against the configured DATABASE_URL
pnpm migration:run

# Revert the latest migration
pnpm migration:revert

# Generate a new migration from entity changes
pnpm migration:generate --name=DescribeChange

# Seed deterministic demo data
pnpm seed

# Drop the local schema, rerun migrations, and reseed
pnpm db:reset
```

---

## Service URLs

| Service      | URL                          | Description                      |
|--------------|------------------------------|----------------------------------|
| NestJS API   | http://localhost:3001/api    | REST API (health: /api/health)   |
| Web app      | http://localhost:5173        | React frontend                   |
| Mailpit UI   | http://localhost:8025        | View outgoing emails in dev      |
| Mailpit SMTP | localhost:1025               | SMTP catch-all (dev only)        |
| PostgreSQL   | localhost:5433               | DB: `dcredit`, user: `dcredit`   |

---

## Package Architecture

### `packages/types`
Canonical TypeScript interfaces for the dCredit domain — `User`, `DebtProduct`, `FinancialProfile`, `SimulatorResult`, etc. No runtime dependencies; used by all apps.

### `packages/core`
Pure financial logic with zero UI or framework dependencies:
- `financialCalculations.ts` — FCF, debt burden, amortization, safe capacity
- `recommendationEngine.ts` — risk assessment, debt prioritization, loan simulation
- `debtHealthScore.ts` — 0–100 health score based on burden, FCF, and trend

### `packages/i18n`
EN/ES translation dictionaries with a framework-agnostic `t(locale, key)` helper.

### `packages/ui`
Design tokens (colors, spacing, typography, border radii) shared between web and mobile.

---

## Database

PostgreSQL runs via Docker. The `dcredit` database is created automatically on first start, and schema changes are applied through committed TypeORM migrations.

Inspect the Postgres connection details:

```bash
# Open a psql shell in the running container
docker compose exec postgres psql -U dcredit -d dcredit

# Print connection settings from the API env example
cat apps/api/.env.example
```

Connection defaults:
- Host: `localhost`
- Port: `5433`
- Database: `dcredit`
- User: `dcredit`
- Password: `dcredit_dev_password`
- URL: `postgresql://dcredit:dcredit_dev_password@localhost:5433/dcredit`

---

## Email (Mailpit)

In development, all outgoing emails are caught by Mailpit — nothing is sent externally.

- **SMTP**: `localhost:1025` (configured automatically via `docker-compose.yml`)
- **Web UI**: [http://localhost:8025](http://localhost:8025)

In production, set real SMTP credentials in `apps/api/.env`.

---

## Replit Preview

The `artifacts/dcredit/` app is the standalone Replit preview — a fully functional React frontend with mock data and no backend required. It demonstrates the complete dCredit user experience and is ready to deploy.

The `apps/` structure above is the full-stack foundation for the production version.

---

## Backend Foundation

The backend now includes:
- TypeORM entities and an initial migration for users, verification tokens, financial sources, accounts, categories, credits, installments, and transactions
- NestJS module scaffolding for `auth`, `users`, `email`, `financial-sources`, `accounts`, `transactions`, `credits`, `categories`, `dashboard`, `health`, and `shared`
- Seed scripts with deterministic demo data
- Environment validation and typed config factories for app, database, and mail settings
