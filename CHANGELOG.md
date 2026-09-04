# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-04

### Added
- **Monorepo Structure**: Turborepo + pnpm workspaces with 7 packages
- **Customer Web App (PWA)**: Next.js 14 App Router, mobile-first responsive design
- **Admin Panel**: Next.js 14 with sidebar navigation, dashboard, CRUD operations
- **Design System**: shadcn/ui + Radix UI components with Dark/Gold theme
- **Authentication**: NextAuth.js v5 with Credentials, Google, Apple providers
- **Database**: Prisma ORM + PostgreSQL with comprehensive schema
- **Booking System**: 4-step wizard (Service → Barber → Time → Confirm)
- **Real-time Updates**: Socket.io server for availability and notifications
- **Payment Integration**: İyzico sandbox with 3D Secure
- **Notification System**: Push (Web Push), SMS (Netgsm), Email (Resend)
- **Loyalty Program**: Points, tiers (Bronze/Silver/Gold/Platinum), rewards
- **PWA Features**: Offline support, install prompts, app shortcuts
- **CI/CD**: GitHub Actions → Vercel (web/admin) + Railway (socket/db)
- **Docker**: Multi-stage builds for web, admin, socket services
- **Documentation**: Comprehensive README, CONTRIBUTING, API docs

### Technical Details
- **Frontend**: Next.js 14, React 18, TypeScript 5, Tailwind CSS 3
- **State**: Zustand (client), TanStack Query (server)
- **Forms**: React Hook Form + Zod validation
- **UI**: Radix UI primitives, Framer Motion animations
- **Database**: PostgreSQL 15, Prisma 5 with migrations
- **Real-time**: Socket.io with Redis adapter
- **Payments**: İyzico API integration
- **SMS**: Netgsm XML API
- **Email**: Resend API
- **Push**: Web Push Protocol (VAPID)

### Security
- JWT-based authentication with httpOnly cookies
- bcrypt password hashing
- CSP, HSTS, X-Frame-Options headers
- Rate limiting on auth endpoints
- SQL injection prevention via Prisma
- XSS protection via React auto-escaping

### Performance
- Next.js Image Optimization (AVIF/WebP)
- Code splitting & lazy loading
- Service Worker caching (Workbox)
- Static Generation (SSG) where possible
- ISR for dynamic content
- Bundle analysis with @next/bundle-analyzer

### Accessibility (a11y)
- WCAG 2.1 AA compliant
- Semantic HTML5
- ARIA labels & roles
- Keyboard navigation support
- Focus visible states
- Reduced motion support
- Screen reader tested

### Developer Experience
- Turborepo for fast builds
- Shared TypeScript configs
- ESLint + Prettier + Tailwind CSS plugin
- Husky pre-commit hooks
- VS Code recommended extensions
- Comprehensive TypeScript types
- Prisma Studio for database management

## [Unreleased]

### Planned
- [ ] Multi-language support (i18n)
- [ ] Apple/Google Wallet integration
- [ ] Biometric authentication (WebAuthn)
- [ ] Advanced analytics (Mixpanel/GA4)
- [ ] Barber mobile app (React Native)
- [ ] AI-powered scheduling optimization
- [ ] Video call consultation feature
- [ ] Gift card system
- [ ] Corporate/bulk booking
- [ ] Inventory management for products