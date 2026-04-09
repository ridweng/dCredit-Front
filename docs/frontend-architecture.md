# Frontend Architecture Decision

Date: 2026-04-09

## Decision

Keep `apps/web` and `apps/mobile` as separate frontend apps for now, and continue consolidating shared logic incrementally.

Do not move the product to a unified React Native Web or Expo-for-web architecture in the current phase.

## Why

- The current web UI is meaningfully web-specific:
  - `react-router-dom`
  - Vite
  - DOM-first components
  - utility-class styling and responsive layout tuned for the browser
- The current mobile UI is meaningfully native-specific:
  - Expo
  - React Navigation
  - native storage and runtime constraints
  - device-first screen composition
- The API and product structure are already aligned across both apps, so the safest win is to share contracts and view-model logic, not rewrite the rendering layer.
- A React Native Web migration now would increase risk around auth flow, responsive polish, Expo stability, and release velocity without reducing enough complexity yet.

## What Was Shared In This Phase

- Shared app-facing API contracts now live in `packages/types`
- Shared API route metadata and request helpers now live in `packages/core`
- Shared app section metadata now lives in `packages/core`
- Shared EN/ES resources remain in `packages/i18n`
- Web and mobile wrappers now consume the same route and contract layer instead of maintaining separate copies

## What Remains Platform-Specific

- UI primitives and screen rendering
- navigation containers and routing
- auth/session storage adapters
- browser-specific layout and native device behavior
- platform-specific startup/runtime concerns

## Recommended Next Steps

1. Keep `apps/web` and `apps/mobile`
2. Continue moving duplicated screen state and transformation logic into shared packages
3. Extract shared feature-level hooks only when they no longer depend on DOM or native-only APIs
4. Reevaluate React Native Web only after:
   - the API/view-model layer is mostly shared
   - web-only UI dependencies are reduced
   - the product surface is more stable
