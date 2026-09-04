# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/config ./packages/config
COPY packages/types ./packages/types
COPY packages/utils ./packages/utils
COPY packages/database ./packages/database
COPY packages/ui ./packages/ui
COPY packages/web-hooks ./packages/web-hooks
COPY packages/payments ./packages/payments
COPY packages/notifications ./packages/notifications
COPY apps/web ./apps/web

RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter=@barbershop/web...

# Generate Prisma Client
FROM base AS prisma
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web ./apps/web
RUN corepack enable pnpm && pnpm --filter=@barbershop/db db:generate

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN corepack enable pnpm && pnpm build --filter=@barbershop/web

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]