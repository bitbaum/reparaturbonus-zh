# Reparaturbonus Zürich

Connecting Zurich residents with certified repair shops through government-subsidized bonus codes. Repair instead of replace.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000.svg)](https://nextjs.org/)
[![Live](https://img.shields.io/badge/Live-reparaturbonus.orangecat.ch-green.svg)](https://reparaturbonus.orangecat.ch)

## What It Does

- **Bonus codes**: Stadt Zürich issues CHF 100 repair bonuses -- 8-character codes, 30-day expiry, one per repair
- **Shop directory**: Searchable by category, text, postal code, or radius (haversine distance calculation)
- **Three categories**: Elektro/Elektronik, Kleidung, Schuhe -- only these qualify for the city's bonus program
- **Admin dashboard**: User management, shop approval, bonus tracking, platform statistics
- **Graceful degradation**: API endpoints fall back to mock data if the database is unavailable -- the shop directory keeps working

---

## Architecture

### Bonus Code System

`src/lib/bonus-codes.ts` -- centralized logic for the core business operation:

- `generateBonusCode()`: 8-character alphanumeric, unique validation with retry loop (up to 10 attempts)
- `calculateBonusAmount()`: Fixed CHF 100 per code
- `getBonusExpiryDate()`: 30 days from creation
- `isValidBonusCode()`: Regex validation before database lookup

The bonus amount was a design decision -- percentage-based (20% of repair cost) was considered and rejected. A flat CHF 100 is simpler to communicate, simpler to implement, and eliminates disputes over repair cost valuation.

### Constants as SSOT

Two files prevent hardcoded strings from scattering across the codebase:

- `src/lib/constants/categories.ts` -- shop category enum + Swiss German labels
- `src/lib/constants/routes.ts` -- all application routes in one place

### API Resilience

Every shop-related API endpoint has a fallback path. If the database is down, the endpoint returns mock data from `src/lib/demo/` instead of a 500 error. The shop directory continues working. Users see real data when available, demo data when not -- no error pages.

### Role-Based Access

```
Customer  -->  Admin  -->  Super Admin
```

- Credentials provider with bcrypt password hashing
- JWT session strategy with role embedded in token
- Protected routes check `session?.user?.role` server-side
- Admin dashboard at `/admin` is role-gated

### Database Schema

Prisma as SSOT -- 8 models, types derived from schema:

```
User ──── has many ──> BonusCode
  │                       │
  └── has many ──> Order ─┘ (1:1 with BonusCode)
                     │
Shop ── has many ────┘
```

Three enums enforce domain constraints at the database level:
- `UserRole`: CUSTOMER, ADMIN, SUPER_ADMIN
- `ShopCategory`: ELECTRONICS, CLOTHING, SHOES
- `OrderStatus`: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL + Prisma 6 |
| Auth | NextAuth.js, JWT, bcryptjs |
| Styling | Tailwind CSS 4 |
| Deployment | Self-hosted (Hetzner, Caddy, Next.js standalone) |

---

<details>
<summary><strong>Quick Start</strong></summary>

### Prerequisites

- Node.js 18+
- PostgreSQL

### Setup

```bash
git clone https://github.com/maonakamoto/reparaturbonus-zh.git
cd reparaturbonus-zh
cp .env.example .env.local    # configure DATABASE_URL, NEXTAUTH_SECRET
npm install
npm run setup                  # generate Prisma client + push schema + seed
npm run dev
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Session signing key |
| `NEXTAUTH_URL` | Application URL |

</details>

---

## Project Structure

```
src/
  app/
    api/              # API routes (shops, bonus-codes, admin, auth)
    admin/            # Admin dashboard (role-gated)
    dashboard/        # Customer dashboard
    shops/            # Shop directory + detail pages
    how-it-works/     # Platform explanation
  components/
    admin/            # Auth guard
    forms/            # Reusable form inputs
    layout/           # Header, Footer
    shop/             # Shop-specific components
  lib/
    auth.ts           # NextAuth config + JWT strategy
    bonus-codes.ts    # Code generation, validation, expiry
    db.ts             # Prisma singleton
    constants/        # Routes + categories (SSOT)
    demo/             # Mock data for graceful fallback
prisma/
  schema.prisma       # 8 models, 3 enums (SSOT for types)
  seed.ts             # Sample repair shops
```

---

## License

MIT

---

Reparaturbonus Zürich -- repair culture for a circular economy.
