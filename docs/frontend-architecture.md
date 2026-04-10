# Frontend Architecture Decision

Date: 2026-04-09

## Decision

The product is now mobile-only.

- `apps/mobile` is the only customer-facing frontend
- the former browser frontend has been retired and removed
- there is no React Native Web target in this phase

## Why

- The Expo / React Native app already covers the product surface and is the safer runtime to keep.
- The React/Vite browser app duplicated product behavior without providing enough additional value for the current MVP scope.
- Maintaining one frontend reduces product drift across auth, financial views, translations, and API integration.
- The backend-hosted verification page already removes the main browser dependency from the sign-up flow.

## What Is Shared

- `packages/core`
  - financial calculations
  - recommendation helpers
  - shared app metadata
- `packages/types`
  - shared app-facing contracts
  - domain types

## What Lives In Mobile

- `apps/mobile/src/client-core`
  - frontend ports
  - shared use-cases for the mobile app
  - API composition used by the React Native presentation layer
- `apps/mobile/src/i18n`
  - EN/ES strings owned by the mobile app

## What Remains Platform-Specific

- React Native presentation components
- React Navigation structure
- Expo runtime and Metro configuration
- secure device storage
- simulator / device networking concerns

## Recommended Path Forward

1. Keep `apps/mobile` as the single product client
2. Keep only truly cross-service code in `packages/`
3. Keep mobile-only client logic under `apps/mobile/src`
4. Keep the backend-hosted verification confirmation page as the email landing page
5. Revisit a browser client only if a concrete product requirement returns
