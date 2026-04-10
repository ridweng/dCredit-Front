# dCredit Mobile

`apps/mobile` is the only customer-facing frontend in the repo.

It is an Expo + React Native app that talks to:

- `app-api` for product functionality
- `admin-api` only indirectly through internal tooling links and docs, not as the main app backend

## Structure

- `src/navigation`
  - auth stack
  - authenticated bottom tabs
- `src/screens`
  - `auth`
  - `home`
  - `credits`
  - `spending`
  - `sources`
  - `profile`
- `src/context`
  - auth session
  - language
- `src/client`
  - request adapter and API composition
  - Expo request adapter
- `src/client-core`
  - mobile-local frontend ports and use-cases
- `src/i18n`
  - mobile-local EN/ES translations
- `src/services/storage`
  - secure token and locale persistence
- `src/components`
  - reusable native cards, buttons, loaders, and layout wrappers

## Shared Packages Used By Mobile

- `@dcredit/core`
  - financial calculations and recommendation helpers
- `@dcredit/types`
  - shared domain and API contracts

## API Configuration

Set the product API origin in `apps/mobile/.env`:

```bash
EXPO_PUBLIC_API_URL=http://127.0.0.1:3001
```

Notes:

- `127.0.0.1` is the safest default for the iOS simulator on the same machine
- on a real device you usually need your machine LAN IP, Expo tunnel, or another reachable host

## Local Run Flow

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

## Auth And Verification

1. Register from the mobile app
2. The app moves to the verification waiting screen
3. Open Mailpit at `http://localhost:8025`
4. Open the verification email
5. Follow the backend-hosted `/verify-email` link
6. Return to the app; it auto-retries verification and can also be checked manually

The email confirmation page is intentionally backend-hosted, so the mobile-only product does not need a browser frontend for verification.
