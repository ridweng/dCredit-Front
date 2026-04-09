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
- `src/services/api`:
  - NestJS API client and endpoint modules
- `src/components`:
  - reusable native cards, buttons, and layout wrappers

## Shared packages used by mobile

- `@dcredit/i18n` for bilingual EN/ES strings
- `@dcredit/core` for shared financial logic where useful
- `@dcredit/types` for shared domain types where practical

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

```bash
pnpm install
pnpm dev:app-api
pnpm --filter @dcredit/mobile start
```

For a real device or emulator you may additionally need:

- Expo Go or a development build
- iOS simulator or Android emulator
- a reachable API host instead of `localhost`
- Mailpit running if you want to test register/verification flows
