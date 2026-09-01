/**
 * Identity of the deployed site. SSOT for everything that has to name or link
 * to the site from the outside: `metadataBase`, canonical URLs, sitemap.xml,
 * robots.txt and the OpenGraph card.
 *
 * `SITE_URL` is load-bearing for the social preview and for search: Next
 * resolves relative metadata URLs (including the generated og:image) against
 * `metadataBase`, and without it they are emitted as http://localhost:3000/... —
 * present, plausible, and unfetchable by every scraper. Falls back to the real
 * host, never to localhost.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://reparaturbonus.orangecat.ch';

export const SITE_NAME = 'Reparaturbonus Zürich';

export const SITE_DESCRIPTION =
  'Finden Sie die beste Werkstatt in Zürich und nutzen Sie CHF 100 Reparaturbonus der Stadt. Nachhaltig, günstig und umweltfreundlich.';

/**
 * The social card served by app/opengraph-image.tsx, as OpenGraph metadata.
 *
 * Every page has to name it explicitly: Next attaches the generated image via
 * the file convention only while a segment does not declare its own
 * `openGraph`, and each public page declares one to get its own og:title. A
 * page that forgets this silently shares as a blank rectangle, which is the
 * exact defect the generated card was added to fix — hence the guard in
 * seo.test.ts.
 */
export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Reparaturbonus Zürich — Reparieren statt wegwerfen',
} as const;

/** The page's own path resolved against the deployed origin. */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString();
