import { SHOP_CATEGORIES, CATEGORY_LABELS, type ShopCategory } from './categories';
import { CATEGORY_ICONS } from './category-icons';
import type { LucideIcon } from 'lucide-react';

export interface RepairCategory {
  id: ShopCategory;
  label: string;
  icon: LucideIcon;
  /** Plain-language examples shown to residents on the landing wizard. */
  examples: string[];
}

/**
 * The three bonus-eligible repair categories, with their line icon and a few
 * concrete examples. Single source for both the landing wizard cards and the
 * detail-step placeholder.
 */
export const REPAIR_CATEGORIES: RepairCategory[] = [
  {
    id: SHOP_CATEGORIES.ELECTRONICS,
    label: CATEGORY_LABELS[SHOP_CATEGORIES.ELECTRONICS],
    icon: CATEGORY_ICONS[SHOP_CATEGORIES.ELECTRONICS],
    examples: ['Smartphone', 'Laptop', 'Tablet', 'Kopfhörer', 'Kaffeemaschine', 'Toaster'],
  },
  {
    id: SHOP_CATEGORIES.CLOTHING,
    label: CATEGORY_LABELS[SHOP_CATEGORIES.CLOTHING],
    icon: CATEGORY_ICONS[SHOP_CATEGORIES.CLOTHING],
    examples: ['Jacke', 'Hose', 'T-Shirt', 'Tasche'],
  },
  {
    id: SHOP_CATEGORIES.SHOES,
    label: CATEGORY_LABELS[SHOP_CATEGORIES.SHOES],
    icon: CATEGORY_ICONS[SHOP_CATEGORIES.SHOES],
    examples: ['Sneaker', 'Stiefel', 'Sandalen', 'Absätze'],
  },
];

export const findRepairCategory = (id: string): RepairCategory | undefined =>
  REPAIR_CATEGORIES.find((category) => category.id === id);
