import { Smartphone, Shirt, Footprints, Wrench, type LucideIcon } from 'lucide-react';
import { SHOP_CATEGORIES, type ShopCategory } from './categories';

/**
 * SSOT for the line-icon representing each repair category.
 *
 * Replaces the emoji icons (📱 👕 👟) that made the site read as a templated
 * consumer app rather than an official civic service. A consistent lucide
 * line-icon set signals a trustworthy, deliberate government tool.
 */
export const CATEGORY_ICONS: Record<ShopCategory, LucideIcon> = {
  [SHOP_CATEGORIES.ALL]: Wrench,
  [SHOP_CATEGORIES.ELECTRONICS]: Smartphone,
  [SHOP_CATEGORIES.CLOTHING]: Shirt,
  [SHOP_CATEGORIES.SHOES]: Footprints,
};
