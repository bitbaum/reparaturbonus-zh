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
