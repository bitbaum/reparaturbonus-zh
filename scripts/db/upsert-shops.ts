import { and, eq } from 'drizzle-orm';
import { shops } from '../../src/lib/db/schema';
import { createScriptDb } from './client';
import { REVAMPIT_SHOP, type SeedShop } from './data/shops';

/**
 * Production-safe shop upsert. Unlike `seed.ts`, this NEVER deletes — it only
 * inserts or updates the real listings below, leaving bonus codes and orders
 * untouched. Run against the live DB to publish/refresh a shop:
 *
 *   DATABASE_URL=... npx tsx scripts/db/upsert-shops.ts
 *
 * Shop has no natural unique key, so we match on (name, postalCode).
 */

const { db, pool } = createScriptDb();

// Only verified, real shops belong here — never demo placeholders.
const SHOPS: SeedShop[] = [REVAMPIT_SHOP];

async function upsertShop(shop: SeedShop) {
  const existing = await db.query.shops.findFirst({
    where: and(eq(shops.name, shop.name), eq(shops.postalCode, shop.postalCode)),
    columns: { id: true },
  });

  if (existing) {
    await db.update(shops).set(shop).where(eq(shops.id, existing.id));
    console.log(`↻ Updated shop: ${shop.name} (${shop.postalCode})`);
  } else {
    await db.insert(shops).values(shop);
    console.log(`✓ Created shop: ${shop.name} (${shop.postalCode})`);
  }
}

async function main() {
  console.log('🛠  Upserting real shops (non-destructive)...');
  for (const shop of SHOPS) {
    await upsertShop(shop);
  }
  console.log(`🎉 Done — ${SHOPS.length} shop(s) upserted.`);
}

main()
  .catch((e) => {
    console.error('❌ Error upserting shops:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
