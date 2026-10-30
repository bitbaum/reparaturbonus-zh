# AGENTS.md

<!-- fleet:rules:begin — generated from bitbaum/fleet templates/agent-rules.md; edit it there, not here -->

## Org rules

Read `bitbaum/fleet` `AGENTS.md`, `SHARED.md` and the registers it names before
inventing a host, a name, a page or a shared behaviour. Do not copy their facts
into this file.

- **Packages first.** If a `@bitbaum/*` package (or `bip-kit`, `limitkit`,
  `threadkit`, `ai-forms`) already does it, use it and fix a defect in the
  package, not in this app. Every chat is `@bitbaum/chatkit`, every search box
  `@bitbaum/searchkit`, every chart `@bitbaum/chartkit`, accounts
  `@bitbaum/accountkit`, model calls `@bitbaum/ai-kit`. Review this product's
  `package-plan.json` before building anything. When a second product needs
  what one product built (a map, a globe, a calculator), extract it into a
  package before writing the second copy.
- **A gap is a task, not an answer.** Never end the work, or a reply, at "not
  supported" or "not available". When a source cannot be read or a case does
  not fit the model, find another way (another format or publisher, the
  official tool measured, the model extended) and do it. What truly cannot be
  done yet is tracked with its plan, never presented as a limit of the product.
- **Every page leads to an action.** What a reader learns, they can act on
  from the same screen: file, pay, apply, compare, ask, contact.
- **One shape per kind.** Things of the same kind look the same and sit in the
  same place (fleet `AGENTS.md`, "One shape per kind").
- **Finished work ships by itself.** Open a non-draft pull request; the fleet
  auto-merge sweep is the only merge path. Never merge by hand, through the
  merge API, with `--auto` or with an admin bypass, and never force-push a
  shared branch.
- **Nothing made up.** A fact on a page or in a doc needs a source that was
  opened; where there is none, the line is removed or softened. A gap is
  filled with sourced data, never with a guess.
- **Bitcoin orange is for Bitcoin and top-of-funnel actions only.**
- **No model identifier** in anything pushed to a repository.
- Before you finish, run `node <fleet>/scripts/ci/docs-truth-audit.mjs --dir .`:
  the same check the sweep runs on every pull request.

<!-- fleet:rules:end -->

Guide for agents (and humans) working in this repo. Keep changes additive and
respect the SSOT/DRY/SoC principles in `.claude/CLAUDE.md`.

## What this is

Reparaturbonus Zürich — a Next.js app connecting Zürich residents with certified
repair shops and issuing government-subsidized bonus codes (repair instead of
replace). See `README.md` for the product overview.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack, `output: "standalone"`) |
| Language | TypeScript 6 (strict) |
| Database | PostgreSQL + Drizzle ORM (`drizzle-orm/node-postgres`, `pg` Pool) |
| Auth | NextAuth.js (credentials, JWT, bcryptjs) |
| Styling | Tailwind CSS 4 |
| Deploy | Self-hosted (Hetzner, Caddy) — `reparaturbonus.orangecat.ch` |

## Commands

```bash
pnpm run dev        # dev server (Turbopack)
pnpm run verify     # SSOT gate: format + lint + typecheck + tests — run before every commit
pnpm run build      # next build (hermetic, no live DB needed)
pnpm run setup      # db:migrate + db:seed (needs a live DATABASE_URL)
```

`pnpm run verify` is the single source of truth for "is this change OK". CI
(`.github/workflows/ci.yml`) runs `pnpm run verify`, and gates `pnpm run build`
on top. Green verify + build locally ⇒ green CI.

## Drizzle

- Schema (SSOT for models/types): `src/lib/db/schema.ts` — 4 tables, 3 enums,
  relations, `$inferSelect` type exports. It mirrors the live database exactly
  (table/column/constraint names from the original Prisma migration) — never
  "normalize" names.
- Client: `src/lib/db/index.ts` — lazy `pg` Pool + `drizzle()` singleton, the
  single DB door. No codegen: types flow from the schema at typecheck time.
- Migrations: `drizzle/` (`pnpm run db:generate` after schema edits; never edit
  applied migrations). Fresh DBs: `pnpm run db:migrate`. The live box is
  reconciled on deploy by loki's `apply-schema.sh` (forward-only,
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
