import { PrismaClient } from '@prisma/client'
import { REVAMPIT_SHOP, type SeedShop } from './data/shops'

/**
 * Production-safe shop upsert. Unlike `seed.ts`, this NEVER deletes — it only
 * inserts or updates the real listings below, leaving bonus codes and orders
 * untouched. Run against the live DB to publish/refresh a shop:
 *
 *   DATABASE_URL=... npx tsx prisma/upsert-shops.ts
 *
 * Shop has no natural unique key, so we match on (name, postalCode).
 */

const prisma = new PrismaClient()

// Only verified, real shops belong here — never demo placeholders.
const SHOPS: SeedShop[] = [REVAMPIT_SHOP]

async function upsertShop(shop: SeedShop) {
  const existing = await prisma.shop.findFirst({
    where: { name: shop.name, postalCode: shop.postalCode },
    select: { id: true },
  })

  if (existing) {
    await prisma.shop.update({ where: { id: existing.id }, data: shop })
    console.log(`↻ Updated shop: ${shop.name} (${shop.postalCode})`)
  } else {
    await prisma.shop.create({ data: shop })
    console.log(`✓ Created shop: ${shop.name} (${shop.postalCode})`)
  }
}

async function main() {
  console.log('🛠  Upserting real shops (non-destructive)...')
  for (const shop of SHOPS) {
    await upsertShop(shop)
  }
  console.log(`🎉 Done — ${SHOPS.length} shop(s) upserted.`)
}

main()
  .catch((e) => {
    console.error('❌ Error upserting shops:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
