FROM node:20-alpine AS base
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY apps/admin-api/package.json apps/admin-api/package.json
COPY packages/backend-shared/package.json packages/backend-shared/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/core/package.json packages/core/package.json

RUN pnpm install --frozen-lockfile

COPY apps/admin-api apps/admin-api
COPY packages/backend-shared packages/backend-shared
COPY packages/types packages/types
COPY packages/core packages/core

RUN pnpm --filter @dcredit/backend-shared build
RUN pnpm --filter @dcredit/admin-api build

EXPOSE 3002

CMD ["pnpm", "--filter", "@dcredit/admin-api", "start:dev"]
