# Reparaturbonus Zürich

@~/.claude/CLAUDE.md

---

## Overview

Reparaturbonus Zürich is a **Next.js** application connecting customers with certified repair shops and providing bonus codes for sustainable repair choices. Built with Drizzle ORM and PostgreSQL.

## Architecture

```
reparaturbonus-zh/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin dashboard
│   │   ├── auth/         # Authentication pages
│   │   └── dashboard/    # Customer dashboard
│   ├── components/       # React components
│   └── lib/              # Utilities
│       └── db/           # Drizzle client + schema (SSOT for types)
├── drizzle/              # Generated SQL migrations
├── scripts/db/           # Seed + prod-safe shop upsert
└── package.json
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Database | PostgreSQL with Drizzle ORM |
| Auth | NextAuth.js (credentials provider) |
| Styling | Tailwind CSS |
| Language | TypeScript |

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run setup  # Applies Drizzle migrations + seeds data

# Start development
npm run dev    # Uses Turbopack
```

## Default Users (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@reparaturbonus.ch | admin123 |
| Customer | customer@example.com | customer123 |

## Critical Rules

### 1. Database Operations

Always use Drizzle via the single client in `@/lib/db`:
```typescript
import { db } from '@/lib/db';
import { shops, bonusCodes } from '@/lib/db/schema';

// Query
const allShops = await db.query.shops.findMany();

// Create
const [code] = await db
  .insert(bonusCodes)
  .values({ code: generateCode(), amount: 50, expiresAt, userId })
  .returning();
```

### 2. Authentication

Use NextAuth.js with role-based access:
```typescript
// Check role in API route
import { getServerSession } from 'next-auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
}
```

### 3. Bonus Code System

- Codes are 8-character alphanumeric
- Amount = 20% of repair cost (max CHF 50)
- Codes expire after 1 year
- Validate uniqueness before creating

### 4. Shop Categories

```typescript
type ShopCategory = 
  | 'ELECTRONICS' | 'CLOTHING' | 'JEWELRY' 
  | 'WATCHES' | 'APPLIANCES' | 'FURNITURE'
  | 'SHOES' | 'BAGS' | 'BIKES' | 'OTHER';
```

## Environment Variables

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/reparaturbonus_zh"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-string"
```

## Don't

- Expose user passwords or sensitive data
- Skip Drizzle migrations for schema changes (`npm run db:generate` after editing `src/lib/db/schema.ts`)
- Hardcode bonus amounts (use constants)
- Commit .env files

## Database Commands

```bash
npm run db:generate   # Generate SQL migration from schema changes
npm run db:push       # Push schema to database (dev shortcut)
npm run db:migrate    # Run migrations
npm run db:seed       # Seed with sample data
npm run db:studio     # Open Drizzle Studio
```

---

**Last Updated**: 2026-01-23
