import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { getShop } from '@/lib/demo/shopData';
import { categoryLabel } from '@/lib/constants/categories';
import { OG_IMAGE, SITE_NAME } from '@/lib/constants/site';
import { shopPath } from '@/lib/constants/routes';

type ShopSummary = { name: string; description: string | null; city: string; category: string };

/**
 * Resolves the workshop server-side purely so the page can be named. The page
 * component fetches it again on the client to render; that duplicate read is
 * the price of the page being a client component, and it is one indexed query
 * against a table of a few hundred rows.
 *
 * Mirrors the page's own fallback chain (database, then the demo workshops) so
 * a shared link never renders a card for a shop the page will not show.
 */
async function findShop(id: string): Promise<ShopSummary | null> {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id },
      select: { name: true, description: true, city: true, category: true },
    });

    if (shop) return shop;
  } catch (error) {
    console.warn(`shops/${id}: database unavailable for metadata:`, error);
  }

  return getShop(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const shop = await findShop(id);

  // Not a real workshop: the page renders its "nicht gefunden" state, so keep
  // the URL out of the index rather than naming it after an id. The canonical
  // is self-referencing on purpose — inheriting the parent segment's would
  // claim this page is /shops, which it is not.
  if (!shop) {
    return {
      title: { absolute: `Werkstatt nicht gefunden | ${SITE_NAME}` },
      alternates: { canonical: shopPath(id) },
      robots: { index: false, follow: true },
    };
  }

  const title = `${shop.name} — ${categoryLabel(shop.category)} in ${shop.city}`;
  const description =
    shop.description ??
    `${shop.name} in ${shop.city}: zertifizierte Werkstatt für ${categoryLabel(shop.category)}. Adresse, Öffnungszeiten und Kontakt — und CHF 100 Reparaturbonus der Stadt Zürich einlösen.`;

  return {
    // `absolute` because the root layout's title template stops propagating at
    // /shops, which sets a plain title of its own — without it this page is the
    // one title on the site with no site name in it.
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: shopPath(id) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: shopPath(id),
      siteName: SITE_NAME,
      type: 'website',
      locale: 'de_CH',
      images: [OG_IMAGE],
    },
  };
}

export default function ShopDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
