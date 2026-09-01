import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { absoluteUrl } from '@/lib/constants/site';
import { PUBLIC_PAGES } from '@/lib/constants/page-metadata';
import { shopPath } from '@/lib/constants/routes';

/**
 * The workshop directory is the product, and every workshop page was
 * unreachable to a search engine: the listing at /shops renders client-side
 * from fetch(), so a crawler that lands there sees an empty shell and finds no
 * links to any /shops/[id]. The sitemap is what makes those pages exist for
 * search at all.
 */

/** Re-read the workshop list hourly; new shops should not wait for a redeploy. */
export const revalidate = 3600;

type ShopEntry = { id: string; updatedAt: Date };

/**
 * Deliberately returns nothing when the database is unavailable rather than
 * falling back to the demo workshops the API layer serves. A sitemap is a claim
 * made to a search engine — advertising placeholder shops as real Zürich
 * businesses is worse than an incomplete sitemap, and the next hourly
 * revalidation repairs it on its own.
 */
async function listShops(): Promise<ShopEntry[]> {
  try {
    return await prisma.shop.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.warn('sitemap: database unavailable, emitting static pages only:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const generatedAt = new Date();

  const staticPages = PUBLIC_PAGES.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: generatedAt,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const shopPages = (await listShops()).map((shop) => ({
    url: absoluteUrl(shopPath(shop.id)),
    lastModified: shop.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...shopPages];
}
