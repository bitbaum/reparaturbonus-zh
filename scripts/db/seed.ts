import { bonusCodes, orders, shops } from '../../src/lib/db/schema';
import { createScriptDb } from './client';
import { SEED_SHOPS } from './data/shops';

const { db, pool } = createScriptDb();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (handle foreign key constraints)
  await db.delete(orders);
  await db.delete(bonusCodes);
  await db.delete(shops);

  console.log('Creating repair shops...');

  for (const shop of SEED_SHOPS) {
    await db.insert(shops).values(shop);
    console.log(`✓ Created shop: ${shop.name}`);
  }

  console.log(`🎉 Successfully created ${SEED_SHOPS.length} repair shops!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
