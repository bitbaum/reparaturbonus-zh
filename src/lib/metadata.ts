import type { Metadata } from 'next';
import { OG_IMAGE, SITE_NAME } from './constants/site';
import { getPublicPage } from './constants/page-metadata';

/**
 * Build the `metadata` export for one indexable page from the single registry
 * entry in constants/page-metadata.
 */
export function pageMetadata(path: string): Metadata {
  const page = getPublicPage(path);

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: `${page.title} — ${SITE_NAME}`,
      description: page.description,
      url: page.path,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'de_CH',
      images: [OG_IMAGE],
    },
  };
}

/** Metadata for a page that exists for signed-in users only, never for search. */
export const noindexMetadata: Metadata = {
  robots: { index: false, follow: false },
};
