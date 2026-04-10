# Hexagonal Architecture In dCredit

Date: 2026-04-09

## Intent

This repo uses a practical ports-and-adapters structure instead of treating framework modules as the primary architecture.

The goal is to:

- keep business rules away from NestJS and React Native specifics
- keep persistence, auth, email, schema inspection, and HTTP access behind ports
- keep controllers and screens thin
- keep dependency direction pointing inward

## Service Areas

Hexagonal architecture is applied across:

- `apps/app-api`
- `apps/admin-api`
- `apps/mobile/src/client-core`

## `app-api`

`apps/app-api` is the customer-facing NestJS service.

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
- `application/use-cases` orchestrates register, login, verify email, dashboard reads, credits reads, and financial-source commands
- `application/ports` defines repository, token, mailer, query, and clock abstractions
- `adapters/inbound/http` contains Nest controllers and DTOs
- `adapters/outbound` contains TypeORM, JWT, bcrypt, SMTP, and shared-query adapters
- `infrastructure` wires the concrete Nest providers

## `admin-api`

`apps/admin-api` is the internal admin / ops NestJS service.

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

## Mobile Client Core

`apps/mobile/src/client-core` uses a frontend-adapted hexagonal structure for the single mobile client.

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
- `apps/mobile` is the presentation adapter on top of this client core

## Dependency Direction

The rule is:

1. `domain` depends on nothing framework-specific
2. `application` depends only on `domain` plus port abstractions
3. `adapters` depend on `application` contracts
4. `infrastructure` wires concrete implementations
5. React Native screens depend on shared client use-cases, not on core business rules directly

## Shared Schema Ownership

The Postgres schema is shared by `app-api` and `admin-api`, but the migration workflow has one owner:

- `packages/backend-shared`

`packages/backend-shared` remains the shared backend foundation package and owns:

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
6. Register the providers in `infrastructure/*module.ts`

## Adding A New Outbound Adapter

1. Implement the port contract under `adapters/outbound`
2. Keep framework specifics there: TypeORM, SMTP, JWT, bcrypt, HTTP, filesystem
3. Register it in the relevant infrastructure module
4. Bind it to the application token with `useClass` or `useExisting`

## Adding A New HTTP Endpoint

1. Create or extend the use-case first
2. Add request DTOs under `adapters/inbound/http/dtos` if needed
3. Add a controller handler under `adapters/inbound/http/controllers`
4. Keep mapping and validation at the edge
5. Delegate immediately to the use-case

## Adding A New Mobile API Flow

1. Add or extend the port in `apps/mobile/src/client-core/application/ports`
2. Add the use-case in `apps/mobile/src/client-core/application/use-cases`
3. Extend `createAppApiPorts` if the flow is `app-api` backed
4. Reuse the shared use-case from `apps/mobile`
5. Keep React Native screens focused on presentation, loading, and error states

## Practical Tradeoff

This refactor deliberately preserves some shared service adapters instead of rewriting every repository and query path from scratch.

That is intentional:

- the application boundaries are explicit
- the composition roots are service-specific
- the repo is more testable and maintainable
- product behavior stays stable
