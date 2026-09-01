import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../src/lib/db/schema';

/**
 * Standalone Drizzle client for one-shot scripts (seed, upsert). Unlike the
 * app's lazy singleton in src/lib/db, this exposes the Pool so a script can
 * close it and exit cleanly.
 */
export function createScriptDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  const pool = new Pool({ connectionString: url });
  return { db: drizzle(pool, { schema }), pool };
}
