FROM node:20-alpine AS base

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
COPY apps/admin ./apps/admin

RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter=@barbershop/admin...

FROM base AS prisma
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/admin ./apps/admin
RUN corepack enable pnpm && pnpm --filter=@barbershop/database db:generate

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .
RUN corepack enable pnpm && pnpm build --filter=@barbershop/admin

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/admin/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/admin/server.js"]