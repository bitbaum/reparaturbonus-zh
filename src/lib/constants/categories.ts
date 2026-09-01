export const SHOP_CATEGORIES = {
  ALL: 'ALL',
  ELECTRONICS: 'ELECTRONICS', // Elektro und Elektronik (includes computers, household appliances, etc.)
  CLOTHING: 'CLOTHING',
  SHOES: 'SHOES',
} as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[keyof typeof SHOP_CATEGORIES];

export const CATEGORY_LABELS: Record<ShopCategory, string> = {
  [SHOP_CATEGORIES.ALL]: 'Alle Kategorien',
  [SHOP_CATEGORIES.ELECTRONICS]: 'Elektro und Elektronik',
  [SHOP_CATEGORIES.CLOTHING]: 'Kleidung',
  [SHOP_CATEGORIES.SHOES]: 'Schuhe',
};

/**
 * Label for a category value that arrives as a plain string (a Prisma enum
 * value, a URL segment), falling back for anything unrecognised so a display
 * path can never render `undefined`.
 */
export const categoryLabel = (category: string): string =>
  (CATEGORY_LABELS as Record<string, string | undefined>)[category] ?? 'Reparaturen';
