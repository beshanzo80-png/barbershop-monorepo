FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/config ./packages/config
COPY packages/types ./packages/types
COPY packages/database ./packages/database
COPY socket-server ./socket-server

RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter=@barbershop/socket-server...

FROM base AS prisma
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
RUN corepack enable pnpm && pnpm --filter=@barbershop/db db:generate

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN corepack enable pnpm && pnpm build --filter=@barbershop/socket-server

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/socket-server/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs

EXPOSE 3002

ENV PORT=3002

CMD ["node", "dist/index.js"]