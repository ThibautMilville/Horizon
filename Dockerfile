FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:20-bullseye AS dev

RUN npm un -g pnpm \
    && corepack enable

ARG USERNAME="node"
ARG USER_UID="1000"
ARG USER_GID=${USER_UID}

RUN getent group ${USER_GID} || groupmod --gid ${USER_GID} ${USERNAME} \
    && usermod --uid ${USER_UID} --gid ${USER_GID} ${USERNAME} \
    && chown -R ${USER_UID}:${USER_GID} /home/${USERNAME}

USER ${USERNAME}

EXPOSE 8080

FROM node:20-bookworm-slim AS build

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/dashboard/package.json apps/dashboard/
COPY apps/server/package.json apps/server/

RUN pnpm install --frozen-lockfile

COPY apps/dashboard apps/dashboard
COPY apps/server apps/server
COPY vitest.workspace.json ./

ARG VITE_GRAPHQL_URI=/graphql
ENV VITE_GRAPHQL_URI=${VITE_GRAPHQL_URI}

RUN pnpm --filter @horizon/server build \
    && pnpm --filter @horizon/dashboard build

FROM node:20-bookworm-slim AS prod

RUN corepack enable && corepack prepare pnpm@9.6.0 --activate

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV STATIC_ROOT=/app/apps/dashboard/dist

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/
COPY apps/dashboard/package.json apps/dashboard/

RUN pnpm install --frozen-lockfile --prod --filter @horizon/server...

COPY --from=build /workspace/apps/server/dist apps/server/dist
COPY --from=build /workspace/apps/dashboard/dist apps/dashboard/dist

EXPOSE 3000

USER node

CMD ["node", "apps/server/dist/index.js"]
