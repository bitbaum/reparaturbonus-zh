import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Lazy singleton (fleet pattern, see vitareba): the Pool is not created at
// module load time, so Next.js build analysis doesn't throw when DATABASE_URL
// is absent in the build environment.
type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as { db: DbInstance | undefined };

function getInstance(): DbInstance {
  if (!globalForDb.db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL environment variable is not set');
    globalForDb.db = drizzle(new Pool({ connectionString: url }), { schema });
  }
  return globalForDb.db;
}

export const db = new Proxy({} as DbInstance, {
  get(_, prop: string | symbol) {
    return Reflect.get(getInstance(), prop);
  },
});
