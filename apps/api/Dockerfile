FROM node:20-alpine AS base
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/core/package.json packages/core/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages/types packages/types
COPY packages/core packages/core

RUN pnpm --filter @dcredit/api build

EXPOSE 3001

CMD ["pnpm", "--filter", "@dcredit/api", "start:dev"]
