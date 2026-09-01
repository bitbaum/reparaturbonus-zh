# AGENTS.md

Guide for agents (and humans) working in this repo. Keep changes additive and
respect the SSOT/DRY/SoC principles in `.claude/CLAUDE.md`.

## What this is

Reparaturbonus Zürich — a Next.js app connecting Zürich residents with certified
repair shops and issuing government-subsidized bonus codes (repair instead of
replace). See `README.md` for the product overview.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, Turbopack, `output: "standalone"`) |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL + Drizzle ORM (`drizzle-orm/node-postgres`, `pg` Pool) |
| Auth | NextAuth.js (credentials, JWT, bcryptjs) |
| Styling | Tailwind CSS 4 |
| Deploy | Self-hosted (Hetzner, Caddy) — `reparaturbonus.orangecat.ch` |

## Commands

```bash
npm run dev        # dev server (Turbopack)
npm run verify     # SSOT gate: format + lint + typecheck + tests — run before every commit
npm run build      # next build (hermetic, no live DB needed)
npm run setup      # db:migrate + db:seed (needs a live DATABASE_URL)
```

`npm run verify` is the single source of truth for "is this change OK". CI
(`.github/workflows/ci.yml`) runs `npm run verify`, and gates `npm run build`
on top. Green verify + build locally ⇒ green CI.

## Drizzle

- Schema (SSOT for models/types): `src/lib/db/schema.ts` — 4 tables, 3 enums,
  relations, `$inferSelect` type exports. It mirrors the live database exactly
  (table/column/constraint names from the original Prisma migration) — never
  "normalize" names.
- Client: `src/lib/db/index.ts` — lazy `pg` Pool + `drizzle()` singleton, the
  single DB door. No codegen: types flow from the schema at typecheck time.
- Migrations: `drizzle/` (`npm run db:generate` after schema edits; never edit
  applied migrations). Fresh DBs: `npm run db:migrate`. The live box is
  reconciled on deploy by fleetcrown's `apply-schema.sh` (forward-only,
  ledgered in `public._deploy_schema_history`, refuses destructive SQL).
- Seed / data helpers: `scripts/db/seed.ts` (dev reseed, destructive),
  `scripts/db/upsert-shops.ts` (prod-safe), `scripts/db/data/`.

## Build hermeticity

`next build` does not touch a live database: DB-backed pages (`/admin`,
`/dashboard`) are `export const dynamic = 'force-dynamic'`, and public pages
fetch from API routes client-side. A dummy `DATABASE_URL` is enough to build.
Note: `next.config.ts` sets `eslint.ignoreDuringBuilds` and
`typescript.ignoreBuildErrors`, so the build does NOT re-check lint/types — that
is why `verify` runs as its own gate.

## Environment

Copy `.env.example` → `.env.local` and set `DATABASE_URL`, `NEXTAUTH_SECRET`,
`NEXTAUTH_URL`. Never commit `.env*` files or print secrets.

## Conventions

- Constants are SSOT: `src/lib/constants/` (routes, categories). No hardcoded
  strings/amounts in components.
- Bonus logic lives in `src/lib/bonus-codes.ts`.
- API routes fall back to `src/lib/demo/` mock data when the DB is unavailable.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
