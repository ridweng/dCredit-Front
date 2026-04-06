# dCredit Web

`apps/web` is the canonical React frontend for dCredit.

## Run

```bash
pnpm install
pnpm dev:api
pnpm dev:web
```

The web app runs on `http://localhost:5173`.

## API URL

Set `VITE_API_URL` in `apps/web/.env` when the API is not available on the default local origin:

```bash
VITE_API_URL=http://localhost:3001
```

If omitted, the app uses the Vite `/api` dev proxy.

## Auth Flow

1. Register a new account from `/register`.
2. Open Mailpit at `http://localhost:8025`.
3. Follow the verification link, which lands on `/verify-email`.
4. Log in from `/login`.
5. Protected routes live under the authenticated shell: `/`, `/credits`, `/spending`, `/sources`, `/profile`.

## Language Switching

- English and Spanish are supported.
- All UI strings come from `@dcredit/i18n`.
- Switching language updates the UI immediately.
- When authenticated, saving the language in Profile persists it to the Nest API.
