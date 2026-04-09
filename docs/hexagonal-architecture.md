# Hexagonal Architecture In dCredit

Date: 2026-04-09

## Intent

This repo uses a practical ports-and-adapters structure instead of framework-centric modules as the primary organizing principle.

The goal is:

- keep business rules away from NestJS, React, and React Native specifics
- make persistence, auth, email, and HTTP clients swappable behind ports
- keep controllers and screens thin
- keep dependency direction pointing inward

## How It Is Applied

### `app-api`

`apps/app-api` is the customer-facing NestJS service. It follows the stricter backend version of hexagonal architecture:

```text
src/
  domain/
    services/
  application/
    ports/
    use-cases/
  adapters/
    inbound/http/
    outbound/
  infrastructure/
```

In practice:

- `domain` holds framework-free policy such as auth registration and verification rules
- `application/use-cases` orchestrates flows like register, login, verify email, dashboard reads, credits reads, and financial-source commands
- `application/ports` defines repository, token, mailer, query, and clock abstractions
- `adapters/inbound/http` contains Nest controllers and DTOs
- `adapters/outbound` contains TypeORM, JWT, bcrypt, SMTP, and shared-query adapters
- `infrastructure` wires Nest providers/modules

### `admin-api`

`apps/admin-api` follows the same backend pattern:

```text
src/
  domain/
    models/
    services/
  application/
    ports/
    use-cases/
  adapters/
    inbound/http/
    outbound/
  infrastructure/
```

In practice:

- `domain` owns activation stages and overview calculations
- `application/use-cases` owns overview, list users, search users, journey lookup, schema docs, and backend docs flows
- `application/ports` defines the read-side abstractions used by those use-cases
- `adapters/inbound/http` contains admin JSON controllers and the admin HTML controller
- `adapters/outbound` reads from Postgres-backed services and schema/docs adapters
- `infrastructure` wires admin auth/session and Nest composition

### `client-core`

`packages/client-core` uses a frontend-adapted version of hexagonal architecture:

```text
src/
  domain/
    entities/
  application/
    ports/
    use-cases/
  infrastructure/
    api/
```

In practice:

- `domain` holds client-side session concepts
- `application/ports` defines API and storage ports
- `application/use-cases` owns flows like login, register, restore session, dashboard loading, credits loading, spending loading, and sources loading
- `infrastructure/api` builds concrete API adapters from a request adapter
- `apps/web` and `apps/mobile` are the presentation adapters on top of `client-core`

## Dependency Direction

The dependency rule is:

1. `domain` depends on nothing framework-specific
2. `application` depends only on `domain` plus port abstractions
3. `adapters` depend on `application` contracts
4. `infrastructure` wires concrete implementations
5. React pages and React Native screens depend on shared client use-cases, not on core business rules directly

## Shared Schema Ownership

The Postgres schema is shared by `app-api` and `admin-api`, but the migration workflow has a single owner:

- `apps/api`

`apps/api` remains the shared backend foundation package and owns:

- TypeORM entities
- config factories
- migrations
- seed scripts
- DB reset workflow

This avoids conflicting migration systems across the two Nest services.

## Adding A New Backend Use-Case

For `app-api` or `admin-api`:

1. Add or extend a domain service only if the rule is framework-free
2. Define any required port in `application/ports`
3. Implement the use-case in `application/use-cases`
4. Add or extend outbound adapters to satisfy the new port
5. Add a thin inbound controller method if the use-case is HTTP-facing
6. Register the providers/tokens in `infrastructure/*module.ts`

## Adding A New Outbound Adapter

1. Implement the port contract under `adapters/outbound`
2. Keep framework specifics there: TypeORM, SMTP, JWT, bcrypt, HTTP, filesystem
3. Register it in the relevant infrastructure module
4. Bind it to the application token with `useClass` or `useExisting`

## Adding A New HTTP Endpoint

1. Create or extend the use-case first
2. Add request DTOs under `adapters/inbound/http/dtos` if needed
3. Add a controller handler under `adapters/inbound/http/controllers`
4. Keep mapping/validation at the edge
5. Delegate immediately to the use-case

## Adding A New Frontend API Adapter Or Flow

1. Add or extend the port in `packages/client-core/src/application/ports`
2. Add the use-case in `packages/client-core/src/application/use-cases`
3. Extend `createAppApiPorts` if the flow is app-api backed
4. Reuse the shared use-case from `apps/web` and `apps/mobile`
5. Keep React/React Native components focused on presentation, loading, and error states

## Practical Tradeoff

This refactor intentionally preserves some shared service adapters instead of rewriting every repository and query path from scratch.

That is deliberate:

- the application boundaries are now explicit
- the composition roots are now service-specific
- the repo is more testable and maintainable
- product behavior stays stable

The next step, if needed, is to keep moving more read-side query logic from shared Nest services into dedicated outbound adapters without changing the public behavior.
