# Premium Barber - Monorepo

Modern, mobile-first, PWA-enabled barber appointment booking system built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## 🏗️ Monorepo Structure

```
barbershop-monorepo/
├── apps/
│   ├── web/                 # Customer-facing PWA (Next.js 14)
│   └── admin/               # Admin panel (Next.js 14)
├── packages/
│   ├── ui/                  # Shared UI component library (shadcn/ui + Radix)
│   ├── database/            # Prisma ORM + PostgreSQL schema
│   ├── config/              # Shared configs (TypeScript, ESLint, Tailwind, Prettier)
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utilities (formatters, validators, helpers)
│   └── web-hooks/           # Custom React hooks (Zustand + TanStack Query)
├── turbo.json               # Turborepo pipeline config
├── pnpm-workspace.yaml      # pnpm workspace config
└── package.json             # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed database
pnpm db:seed

# Start development servers
pnpm dev
```

### Environment Variables

Create `.env` file in root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/barbershop?schema=public"

# Auth
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_TEAM_ID=""
APPLE_KEY_ID=""
APPLE_PRIVATE_KEY=""

# Payment (İyzico)
IYZICO_API_KEY=""
IYZICO_SECRET_KEY=""
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"

# SMS (Netgsm)
NETGSM_USERCODE=""
NETGSM_PASSWORD=""
NETGSM_HEADER=""

# Push Notifications
VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT="mailto:admin@barbershop.com"

# External APIs
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm --filter=@barbershop/web dev # Start only web app

# Building
pnpm build            # Build all apps
pnpm --filter=@barbershop/web build

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations (dev)
pnpm db:migrate:prod  # Deploy migrations (prod)
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database

# Code Quality
pnpm lint             # Lint all packages
pnpm typecheck        # TypeScript check all packages
pnpm format           # Format with Prettier

# Testing
pnpm test             # Run tests
pnpm test:watch       # Watch mode
```

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5
- **Package Manager**: pnpm 9 + Turborepo
- **Database**: PostgreSQL + Prisma ORM

### Styling
- **CSS**: Tailwind CSS 3.4
- **Components**: shadcn/ui + Radix UI Primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React

### State Management
- **Client State**: Zustand
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod

### Authentication
- **Auth**: NextAuth.js v5 (Auth.js)
- **Providers**: Credentials, Google, Apple
- **Security**: bcryptjs, jose (JWT)

### PWA & Mobile
- **PWA**: next-pwa (Workbox)
- **Push**: Web Push API (VAPID)
- **Offline**: Service Worker + IndexedDB

### Payments & SMS
- **Payments**: İyzico / PayTR
- **SMS**: Netgsm / Twilio
- **Email**: Resend / SendGrid

### Dev Tools
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier + prettier-plugin-tailwindcss
- **Testing**: Vitest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions → Vercel + Railway

## 🎨 Design System

### Color Palette (Dark Theme + Gold)
```css
--bg-primary: #0D0D0D;      /* Main background */
--bg-secondary: #1A1A1A;    /* Cards */
--bg-tertiary: #252525;     /* Inputs, hover */
--gold-primary: #D4A843;    /* Brand color */
--gold-light: #E8C56D;      /* Hover */
--gold-dark: #B89038;       /* Active */
```

### Typography
- **Sans**: Inter (UI text)
- **Display**: Playfair Display (Headings)
- **Mono**: JetBrains Mono (Code)

### Spacing
8px base grid system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)

## 📱 Key Features

### Customer App (PWA)
- ✅ 4-step booking wizard (Service → Barber → Time → Confirm)
- ✅ Real-time barber availability
- ✅ Favorites (barbers & services)
- ✅ Loyalty points & tiers
- ✅ Push notifications (24h & 2h reminders)
- ✅ SMS reminders (Netgsm)
- ✅ Wallet integration (Apple/Google Wallet)
- ✅ Biometric login (WebAuthn)
- ✅ Offline-first with background sync
- ✅ WhatsApp/Call/Map integration

### Admin Panel
- 📊 Dashboard with real-time stats
- 📅 Appointment management
- 👨‍🦱 Barber management
- ✂️ Service management
- 👥 Customer CRM
- 📈 Analytics & reports
- ⚙️ Settings management

### Technical
- 🔄 Real-time updates (Socket.io)
- 🛡️ Type-safe API (tRPC-ready)
- 📝 Comprehensive TypeScript types
- ♿ WCAG AA accessibility
- 🌍 i18n ready (Turkish default)

## 📁 Key Files

### Database Schema
`packages/database/prisma/schema.prisma` - Complete PostgreSQL schema with:
- Users (Customer, Barber, Admin)
- Services & Categories
- Barbers & Schedules
- Chairs
- Appointments & Services
- Reviews
- Notifications
- Loyalty System
- Favorites
- Settings

### UI Components
`packages/ui/src/components/atoms/` - Button, Input, Card, Avatar, Badge, etc.
`packages/ui/src/components/molecules/` - ServiceCard, BarberCard, TimeSlot, etc.
`packages/ui/src/components/organisms/` - BookingFlow, ServiceSelector, etc.

### Hooks
`packages/web-hooks/src/stores.ts` - Zustand stores (auth, booking, appointments, notifications, favorites)
`packages/web-hooks/src/api.ts` - TanStack Query hooks for all API calls

## 🧪 Testing

```bash
# Unit tests
pnpm test --filter=ui
pnpm test --filter=web-hooks

# E2E tests
cd apps/web && pnpm playwright test
```

## 🚀 Deployment

### Vercel (Frontend)
1. Connect GitHub repo to Vercel
2. Add environment variables
3. Set the project root directory to `apps/web`
4. Set Install Command to `cd ../.. && pnpm install --frozen-lockfile`
5. Set Build Command to `pnpm run build`
6. Deploy automatically on push

### Railway/Render (Backend)
1. Add PostgreSQL database
2. Set environment variables
3. Run migrations on deploy

### Docker (Optional)
```dockerfile
# Multi-stage build available in each app
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- Email: support@premiumbarber.com
- Issues: GitHub Issues
- Docs: `/docs` (coming soon)