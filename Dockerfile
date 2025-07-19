# Base image and setup
FROM node:24-alpine AS base

RUN npm install -g pnpm@latest

WORKDIR /usr/source/app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S seedcord -u 1001

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

# Development stage
FROM base AS development

RUN pnpm install --frozen-lockfile

COPY . .

USER seedcord

EXPOSE 3000

CMD ["pnpm", "start:watch"]

# Build stage
FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile && \
    pnpm run build

# Production stage
FROM base AS production

COPY --from=build /usr/source/app/dist ./dist
COPY --from=build /usr/source/app/package.json ./

USER seedcord

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check')" || exit 1

EXPOSE 3000

CMD ["pnpm", "start:bot"]
