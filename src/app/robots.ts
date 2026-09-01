import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/site';
import { NOINDEX_PATH_PREFIXES } from '@/lib/constants/routes';

/**
 * The site served no robots.txt at all, so nothing pointed a crawler at the
 * sitemap and nothing kept the admin console, the resident dashboard or the
 * JSON API out of a search index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...NOINDEX_PATH_PREFIXES],
    },
    sitemap: new URL('/sitemap.xml', SITE_URL).toString(),
    host: SITE_URL,
  };
}
