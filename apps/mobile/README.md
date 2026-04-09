# dCredit Mobile

`apps/mobile` is the Expo + React Native client that mirrors the web product structure.

## Structure

- `src/navigation`:
  - auth stack
  - authenticated bottom tabs
- `src/screens`:
  - `auth`
  - `home`
  - `credits`
  - `spending`
  - `sources`
  - `profile`
- `src/context`:
  - auth session
  - language
- `src/client`:
  - shared client-core composition
  - Expo request adapter
- `src/services/storage`:
  - secure token and locale persistence
- `src/components`:
  - reusable native cards, buttons, and layout wrappers

## Shared packages used by mobile

- `@dcredit/i18n` for bilingual EN/ES strings
- `@dcredit/core` for shared financial logic where useful
- `@dcredit/types` for shared domain types where practical
- `@dcredit/client-core` for shared frontend ports and use-cases

## API configuration

Set the API origin in `apps/mobile/.env`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Important:

- `localhost` works only in limited local scenarios
- on a simulator/device you usually need your machine LAN IP, Expo tunnel, or Android `adb reverse`

## Running outside Replit

Typical local flow:

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

For a real device or emulator you may additionally need:

- Expo Go or a development build
- iOS simulator or Android emulator
- a reachable API host instead of `localhost`
- Mailpit running if you want to test register/verification flows
