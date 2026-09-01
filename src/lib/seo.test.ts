/**
 * Guards the two claims this site makes to a search engine.
 *
 * The failure this exists to prevent is silent: someone adds a public page,
 * forgets the PUBLIC_PAGES entry, and the page is simply absent from
 * sitemap.xml — nothing breaks, nothing is logged, the page just never gets
 * indexed. The filesystem is the source of truth for what routes exist, so the
 * first test reads it rather than a second hand-maintained list.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import robots from '@/app/robots';
import { PUBLIC_PAGES, getPublicPage } from '@/lib/constants/page-metadata';
import { NOINDEX_PATH_PREFIXES, ROUTES } from '@/lib/constants/routes';
import { pageMetadata } from '@/lib/metadata';
import { OG_IMAGE } from '@/lib/constants/site';

const APP_DIR = join(__dirname, '..', 'app');

/** Every route segment under app/ that renders a page, as a URL path. */
const routeSegments = readdirSync(APP_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('[') && entry.name !== 'api')
  .filter((entry) => existsSync(join(APP_DIR, entry.name, 'page.tsx')))
  .map((entry) => `/${entry.name}`);

const isPrivate = (path: string) =>
  NOINDEX_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

describe('PUBLIC_PAGES registry', () => {
  it('covers every public page that exists on disk', () => {
    const registered = new Set(PUBLIC_PAGES.map((page) => page.path));
    const missing = routeSegments.filter((path) => !isPrivate(path) && !registered.has(path));

    expect(missing).toEqual([]);
  });

  it('registers the home page, which has no segment of its own', () => {
    expect(PUBLIC_PAGES.map((page) => page.path)).toContain(ROUTES.HOME);
  });

  it('never lists a page that robots.txt disallows', () => {
    expect(PUBLIC_PAGES.filter((page) => isPrivate(page.path))).toEqual([]);
  });

  it('gives every page a distinct path and a non-empty title and description', () => {
    const paths = PUBLIC_PAGES.map((page) => page.path);

    expect(new Set(paths).size).toBe(paths.length);
    for (const page of PUBLIC_PAGES) {
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.description.length).toBeGreaterThan(0);
      expect(page.priority).toBeGreaterThan(0);
      expect(page.priority).toBeLessThanOrEqual(1);
    }
  });
});

describe('pageMetadata', () => {
  it('builds a canonical URL and an OpenGraph card for a registered page', () => {
    const metadata = pageMetadata(ROUTES.SHOPS);

    expect(metadata.title).toBe(getPublicPage(ROUTES.SHOPS).title);
    expect(metadata.alternates?.canonical).toBe(ROUTES.SHOPS);
    expect(metadata.openGraph?.description).toBe(getPublicPage(ROUTES.SHOPS).description);
  });

  it('attaches the generated social card to every page', () => {
    // Regression guard: declaring `openGraph` on a segment detaches the
    // file-convention og:image inherited from the root layout, so every page
    // that gets its own og:title silently loses its picture unless it names
    // the image too.
    for (const page of PUBLIC_PAGES) {
      const images = pageMetadata(page.path).openGraph?.images;

      expect(images, `no og:image for ${page.path}`).toEqual([OG_IMAGE]);
    }
  });

  it('throws on an unregistered path instead of shipping a generic title', () => {
    expect(() => pageMetadata('/not-a-page')).toThrow(/No metadata registered/);
  });
});

describe('robots.txt', () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

  it('points crawlers at the sitemap on the deployed origin, not localhost', () => {
    expect(result.sitemap).toMatch(/^https:\/\/[^/]+\/sitemap\.xml$/);
  });

  it('keeps the admin console, dashboard, API and sign-in out of the index', () => {
    expect(rules?.disallow).toEqual(expect.arrayContaining([...NOINDEX_PATH_PREFIXES]));
  });

  it('still allows the public site', () => {
    expect(rules?.allow).toBe('/');
  });
});
