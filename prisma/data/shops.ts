import { ShopCategory } from '@prisma/client'

/**
 * Shop seed data — SSOT for both `seed.ts` (full dev reseed) and
 * `upsert-shops.ts` (production-safe insert without wiping bonus codes/orders).
 *
 * REVAMPIT_SHOP is a real, verified listing (data mirrors revampit `org.ts`).
 * DEMO_SHOPS are illustrative placeholders — dev/demo only, never upserted to prod.
 */

export type SeedShop = {
  name: string
  description: string
  address: string
  city: string
  postalCode: string
  phone: string | null
  email: string | null
  website: string | null
  category: ShopCategory
  latitude: number
  longitude: number
  isActive: boolean
}

/** Real, production-grade listing. Verkaufsstelle / customer-facing repair point. */
export const REVAMPIT_SHOP: SeedShop = {
  name: 'RevampIT',
  description:
    'Gemeinnütziger Verein für IT-Wiederverwendung: Reparatur von Computern, Laptops und Elektronik, Verkauf geprüfter Gebraucht-Hardware und Linux-Support. Nachhaltig, fachkundig und umweltfreundlich.',
  address: 'Birmensdorferstrasse 379',
  city: 'Zürich',
  postalCode: '8055',
  phone: '+41 43 960 32 64',
  email: 'empfang@revamp-it.ch',
  website: 'https://revamp-it.ch',
  category: ShopCategory.ELECTRONICS,
  latitude: 47.3815,
  longitude: 8.5237,
  isActive: true,
}

/** Illustrative placeholder shops — dev/demo seeding only. */
export const DEMO_SHOPS: SeedShop[] = [
  {
    name: 'Schuh-Reparatur Meister',
    description:
      'Traditionelle Schuhmacherei mit moderner Ausstattung. Wir reparieren alle Arten von Schuhen.',
    address: 'Langstrasse 156',
    city: 'Zürich',
    postalCode: '8004',
    phone: '+41 44 987 65 43',
    email: 'meister@schuh-reparatur.ch',
    website: null,
    category: ShopCategory.SHOES,
    latitude: 47.3782,
    longitude: 8.5297,
    isActive: true,
  },
  {
    name: 'Näh-Atelier Zürich',
    description:
      'Professionelle Kleider-Reparaturen und Änderungen. Von Reissverschlüssen bis zu kompletten Umarbeitungen.',
    address: 'Niederdorfstrasse 23',
    city: 'Zürich',
    postalCode: '8001',
    phone: '+41 44 456 78 90',
    email: 'kontakt@naeh-atelier.ch',
    website: 'https://naeh-atelier-zuerich.ch',
    category: ShopCategory.CLOTHING,
    latitude: 47.3708,
    longitude: 8.5426,
    isActive: true,
  },
  {
    name: 'Elektro-Service Zürich',
    description:
      'Spezialisiert auf Haushaltsgeräte-Reparaturen: Kaffeemaschinen, Waschmaschinen, Kühlschränke und alle elektronischen Geräte.',
    address: 'Hardstrasse 201',
    city: 'Zürich',
    postalCode: '8005',
    phone: '+41 44 567 89 01',
    email: 'service@elektro-service-zh.ch',
    website: 'https://elektro-service-zuerich.ch',
    category: ShopCategory.ELECTRONICS,
    latitude: 47.3889,
    longitude: 8.5169,
    isActive: true,
  },
]

/** Full set for dev reseed: the real shop plus demo placeholders. */
export const SEED_SHOPS: SeedShop[] = [REVAMPIT_SHOP, ...DEMO_SHOPS]
