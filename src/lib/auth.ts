import { createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { isDeliverable } from '@bitbaum/accountkit/auth';
import { createAuthMailer } from '@bitbaum/accountkit/auth/mail';
import { createAuthRuntime } from '@bitbaum/accountkit/auth/next';
import { SITE_NAME, SITE_URL } from './constants/site';
import { db } from './db';
import { authTables, users, type UserRole } from './db/schema';

/**
 * Accounts on Reparaturbonus Zürich — the fleet's one account system
 * (@bitbaum/accountkit/auth): email and password, the emailed sign-in link,
 * passkeys, two-step codes, password recovery, "Continue with OrangeCat" and
 * the shared sign-in, each shown once it is configured.
 *
 * Everyone who had an account under NextAuth was imported by
 * drizzle/0001_accountkit_accounts.sql under the same id with the same bcrypt
 * hash; `legacyBcrypt` verifies it, so nobody has to reset a password.
 * `users.role` stays the one source for who is an admin.
 */
const site = { url: SITE_URL, title: SITE_NAME, slug: 'reparaturbonus' };

/** Account mail through the fleet transport (RESEND_*). Off without a key. */
export const authMailer = createAuthMailer({ site });

/**
 * The box has held NEXTAUTH_SECRET since before AccountKit. When no
 * BETTER_AUTH_SECRET / AUTH_SECRET is set, the session key is derived from it,
 * so the cutover needs no new secret. Hashed, because AccountKit needs 32+
 * characters and an older secret may be shorter; the key is as secret as the
 * one it comes from and the same on every start. A dedicated secret takes over
 * the moment it is written (everyone then signs in once more).
 */
function authEnv(): NodeJS.ProcessEnv {
  const env = process.env;
  const legacy = env.NEXTAUTH_SECRET?.trim();
  if (env.BETTER_AUTH_SECRET?.trim() || env.AUTH_SECRET?.trim() || !legacy) return env;
  const derived = createHash('sha256').update(`reparaturbonus accounts:${legacy}`).digest('hex');
  return { ...env, BETTER_AUTH_SECRET: derived };
}

export const { GET, POST, getSession, authStatus, getAuth } = createAuthRuntime({
  site,
  mail: authMailer,
  env: authEnv(),
  isDatabaseConfigured: (env) => Boolean(env.DATABASE_URL),
  getDatabase: () => db,
  schema: authTables,
  legacyBcrypt: bcrypt,
  // A person AccountKit creates itself (a sign-up, a first OrangeCat or shared
  // sign-in) gets the product row orders and bonus codes hang from, under the
  // same id.
  onAccountCreated: async ({ userId }) => {
    await ensureProductUser(userId);
  },
});

/** Whether accounts can answer at all (a database and a session secret). */
export function accountsReady(): boolean {
  return authStatus().ready;
}

export interface Account {
  user: { id: string; email: string | null; name: string | null; role: UserRole };
}

/** The product row for a shared account, created on first sight. */
async function ensureProductUser(userId: string) {
  const existing = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (existing) return existing;
  const shared = await db.query.authUsers.findFirst({ where: eq(authTables.user.id, userId) });
  if (!shared) return null;
  await db
    .insert(users)
    .values({ id: shared.id, email: shared.email, name: shared.name || null })
    .onConflictDoNothing();
  return (await db.query.users.findFirst({ where: eq(users.id, userId) })) ?? null;
}

/**
 * The signed-in person with their role, read from `users` on every request so
 * a role change or a deletion takes effect at once. Null when signed out.
 */
export async function getAccount(): Promise<Account | null> {
  if (!accountsReady()) return null;
  const session = await getSession();
  if (!session) return null;
  const row = await ensureProductUser(session.user.id);
  if (!row) return null;
  return {
    user: {
      id: row.id,
      email: isDeliverable(session.user.email) ? session.user.email : null,
      name: row.name || session.user.name || null,
      role: row.role,
    },
  };
}

export function isAdmin(account: Account | null): boolean {
  return account?.user.role === 'ADMIN' || account?.user.role === 'SUPER_ADMIN';
}

/** The provider ids attached to the signed-in person ("credential", "orangecat", …). */
export async function linkedMethods(): Promise<string[]> {
  const linked = (await getAuth()
    .api.listUserAccounts({ headers: await headers() })
    .catch(() => [])) as { providerId: string }[];
  return linked.map((a) => a.providerId);
}
