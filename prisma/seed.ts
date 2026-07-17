import { PrismaClient } from '@prisma/client'
import { SEED_SHOPS } from './data/shops'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data (handle foreign key constraints)
  await prisma.order.deleteMany()
  await prisma.bonusCode.deleteMany()
  await prisma.shop.deleteMany()

  console.log('Creating repair shops...')

  for (const shop of SEED_SHOPS) {
    await prisma.shop.create({ data: shop })
    console.log(`✓ Created shop: ${shop.name}`)
  }

  console.log(`🎉 Successfully created ${SEED_SHOPS.length} repair shops!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
