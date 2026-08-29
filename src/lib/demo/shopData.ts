import { Shop, Review } from '@/types/shop';

// Andreas's ElektronikRep + clean demo shops
export const DEMO_SHOPS: Record<string, Shop> = {
  // Andreas's ElektronikRep shop
  elektronikrep: {
    id: 'elektronikrep',
    name: 'ElektronikRep',
    description:
      'Spezialist für Elektronik-Reparaturen in Zürich. Wir reparieren Smartphones, Laptops, Tablets und mehr mit höchster Qualität und fairen Preisen.',
    address: 'Bahnhofstrasse 45',
    city: 'Zürich',
    postalCode: '8001',
    phone: '+41 44 123 45 67',
    email: 'info@elektronikrep.shop',
    website: 'https://elektronikrep.shop',
    category: 'ELECTRONICS',
    isActive: true,
    specializations: [
      'Smartphone-Reparatur',
      'Laptop-Wartung',
      'Tablet-Reparatur',
      'Datenrettung',
      'Displaytausch',
      'Akku-Wechsel',
    ],
    openingHours: {
      Montag: '08:00 - 19:00',
      Dienstag: '08:00 - 19:00',
      Mittwoch: '08:00 - 19:00',
      Donnerstag: '08:00 - 19:00',
      Freitag: '08:00 - 19:00',
      Samstag: '09:00 - 17:00',
      Sonntag: 'Geschlossen',
    },
    services: [
      {
        name: 'Display-Reparatur',
        description: 'Professioneller Displaytausch für alle gängigen Smartphone-Modelle',
        price: 'CHF 120-180',
        duration: '1-2 Stunden',
      },
      {
        name: 'Akku-Wechsel',
        description: 'Hochwertige Ersatzakkus mit 12 Monaten Garantie',
        price: 'CHF 80-120',
        duration: '30 Minuten',
      },
      {
        name: 'Wasserschaden-Reparatur',
        description: 'Spezielle Reinigung und Wiederherstellung nach Wasserschäden',
        price: 'CHF 150-250',
        duration: '2-3 Tage',
      },
      {
        name: 'Datenrettung',
        description: 'Wiederherstellung verlorener Daten von defekten Geräten',
        price: 'CHF 200-400',
        duration: '1-5 Tage',
      },
    ],
    reviews: [
      {
        name: 'Maria S.',
        rating: 5,
        comment:
          'Excellent service! Mein iPhone wurde schnell und professionell repariert. Sehr empfehlenswert!',
        date: '2024-01-15',
      },
      {
        name: 'Thomas K.',
        rating: 5,
        comment: 'Top Beratung und faire Preise. Das Team ist sehr kompetent und freundlich.',
        date: '2024-01-10',
      },
      {
        name: 'Sandra L.',
        rating: 4,
        comment: 'Schnelle Reparatur meines Laptops. Gutes Preis-Leistungs-Verhältnis.',
        date: '2024-01-05',
      },
    ],
    certifications: ['Apple Certified Repair Center', 'Samsung Partner', 'ISO 9001 Zertifiziert'],
    aboutText:
      'ElektronikRep ist Ihr vertrauensvoller Partner für alle Elektronik-Reparaturen in Zürich. Seit über 8 Jahren reparieren wir Smartphones, Tablets, Laptops und andere elektronische Geräte mit höchster Qualität und fairen Preisen. Unser erfahrenes Team verwendet nur getestete und überprüfte Ersatzteile und bietet umfassende Garantien auf alle Reparaturen.',
    experienceYears: 8,
  },

  // Andreas's corrected Schneiderei
  'schneiderei-mueller': {
    id: 'schneiderei-mueller',
    name: 'Schneiderei Müller',
    description:
      'Traditionelle Schneiderei mit über 30 Jahren Erfahrung. Änderungen, Reparaturen und Massanfertigungen aller Art.',
    address: 'Langstrasse 89',
    city: 'Zürich',
    postalCode: '8004',
    phone: '+41 44 987 65 43',
    email: 'info@schneiderei-mueller.ch',
    website: 'https://schneiderei-mueller.ch',
    category: 'CLOTHING',
    isActive: true,
    specializations: [
      'Kleider-Änderungen',
      'Hosen-Kürzen',
      'Reissverschluss-Reparatur',
      'Massanfertigungen',
      'Lederjacken-Reparatur',
    ],
    openingHours: {
      Montag: '09:00 - 18:00',
      Dienstag: '09:00 - 18:00',
      Mittwoch: '09:00 - 18:00',
      Donnerstag: '09:00 - 18:00',
      Freitag: '09:00 - 18:00',
      Samstag: '09:00 - 16:00',
      Sonntag: 'Geschlossen',
    },
    services: [
      {
        name: 'Hosen kürzen',
        description: 'Professionelles Kürzen aller Hosenarten',
        price: 'CHF 25-35',
        duration: '2-3 Tage',
      },
      {
        name: 'Reissverschluss-Reparatur',
        description: 'Austausch und Reparatur von Reissverschlüssen',
        price: 'CHF 20-45',
        duration: '1-2 Tage',
      },
      {
        name: 'Kleider-Änderungen',
        description: 'Anpassungen und Änderungen an Kleidern und Blusen',
        price: 'CHF 30-60',
        duration: '3-5 Tage',
      },
    ],
    reviews: [
      {
        name: 'Lisa M.',
        rating: 5,
        comment:
          'Sehr professionelle Arbeit und freundlicher Service. Meine Kleider passen perfekt!',
        date: '2024-01-12',
      },
      {
        name: 'Hans B.',
        rating: 5,
        comment: 'Traditionelle Handwerkskunst zu fairen Preisen. Immer wieder gerne!',
        date: '2024-01-08',
      },
    ],
    certifications: ['Schneider-Zunft Zürich', '30+ Jahre Erfahrung'],
    aboutText:
      'Die Schneiderei Müller ist ein traditioneller Familienbetrieb mit über 30 Jahren Erfahrung in der Textilbranche. Wir bieten professionelle Änderungen, Reparaturen und Massanfertigungen für alle Arten von Kleidungsstücken.',
    experienceYears: 30,
  },

  // Shoe repair shop for demo
  'schuh-meister': {
    id: 'schuh-meister',
    name: 'Schuh-Reparatur Meister',
    description:
      'Traditionelle Schuhmacherei mit moderner Ausstattung. Wir reparieren alle Arten von Schuhen.',
    address: 'Limmatstrasse 152',
    city: 'Zürich',
    postalCode: '8005',
    phone: '+41 44 456 78 90',
    email: 'info@schuh-reparatur.ch',
    website: null,
    category: 'SHOES',
    isActive: true,
    specializations: ['Sohlen-Reparatur', 'Absatz-Reparatur', 'Leder-Pflege', 'Schuh-Reinigung'],
    openingHours: {
      Montag: '09:00 - 19:00',
      Dienstag: '09:00 - 19:00',
      Mittwoch: '09:00 - 19:00',
      Donnerstag: '09:00 - 19:00',
      Freitag: '09:00 - 19:00',
      Samstag: '09:00 - 17:00',
      Sonntag: 'Geschlossen',
    },
    services: [
      {
        name: 'Sohlen-Reparatur',
        description: 'Professionelle Reparatur aller Sohlenarten',
        price: 'CHF 40-80',
        duration: '2-3 Tage',
      },
      {
        name: 'Absatz-Reparatur',
        description: 'Reparatur und Austausch von Absätzen',
        price: 'CHF 25-50',
        duration: '1-2 Tage',
      },
    ],
    reviews: [
      {
        name: 'Hans M.',
        rating: 5,
        comment: 'Excellente Qualität! Meine Schuhe sehen aus wie neu.',
        date: '2024-01-10',
      },
    ],
    certifications: ['Schuhmacher-Zunft Zürich', '25+ Jahre Erfahrung'],
    aboutText:
      'Schuh-Reparatur Meister ist Ihre Anlaufstelle für alle Arten von Schuhreparaturen in Zürich.',
    experienceYears: 25,
  },
};

// ID mapping to fix navigation between listing and detail pages
export const SHOP_ID_MAPPING: Record<string, string> = {
  'mock-1': 'elektronikrep',
  'mock-2': 'schneiderei-mueller',
  'mock-3': 'schuh-meister',
};

// Simple service for demo (future: replace with real API calls)
export function getShop(id: string): Shop | null {
  // Check for mapped ID first
  const mappedId = SHOP_ID_MAPPING[id] || id;
  return DEMO_SHOPS[mappedId] || null;
}

export function calculateAverageRating(reviews?: Review[]): number {
  if (!reviews?.length) return 4.8;
  return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
}
