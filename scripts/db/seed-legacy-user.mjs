#!/usr/bin/env node
/**
 * One person as the NextAuth-era server registered them (the deleted
 * /api/auth/register: a cuid id, bcryptjs cost 12 in `users.password`), so CI
 * can prove an account from before AccountKit still signs in after the
 * import in drizzle/0001_accountkit_accounts.sql.
 *
 *   DATABASE_URL=… LEGACY_EMAIL=… LEGACY_PASSWORD=… node scripts/db/seed-legacy-user.mjs
 *
 * Synthetic people only. Prints nothing about them.
 */
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { DATABASE_URL, LEGACY_EMAIL, LEGACY_PASSWORD } = process.env;
if (!DATABASE_URL || !LEGACY_EMAIL || !LEGACY_PASSWORD) {
  console.error('DATABASE_URL, LEGACY_EMAIL and LEGACY_PASSWORD are required');
  process.exit(2);
}
const db = new pg.Client({ connectionString: DATABASE_URL });
await db.connect();
await db.query(
  `INSERT INTO "users" ("id", "email", "name", "password", "role", "updatedAt")
   VALUES ($1, $2, $3, $4, 'CUSTOMER', now())`,
  [
    `legacy${Date.now().toString(36)}`,
    LEGACY_EMAIL,
    'Legacy Person',
    await bcrypt.hash(LEGACY_PASSWORD, 12),
  ],
);
await db.end();
console.log('seeded 1 legacy account');
