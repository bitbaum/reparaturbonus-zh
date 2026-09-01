import { ROUTES } from './routes';

/**
 * SSOT for what each indexable page is called and what it is about.
 *
 * Every public page in this app is a `'use client'` component, and a client
 * component cannot export `metadata` — which is why the whole site shipped a
 * single title and description inherited from the root layout. Registering the
 * copy here lets the thin server-side segment layouts (and `sitemap.ts`) read
 * the same entry, so a page's name exists in exactly one place instead of once
 * in the layout and again in the sitemap.
 *
 * A page listed here IS in sitemap.xml. Pages that must stay out of a search
 * index (dashboard, admin, sign-in) are not entries here at all — see
 * `NOINDEX_PATH_PREFIXES` in ./routes.
 */
export interface PublicPage {
  path: string;
  /** Page-specific half of the title; the root layout appends the site name. */
  title: string;
  description: string;
  /** How often this page's content actually changes. */
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  /** Relative importance within this site, 0.0–1.0. */
  priority: number;
}

export const PUBLIC_PAGES: readonly PublicPage[] = [
  {
    path: ROUTES.HOME,
    title: 'Reparieren statt wegwerfen',
    description:
      'Finden Sie die beste Werkstatt in Zürich und nutzen Sie CHF 100 Reparaturbonus der Stadt. Nachhaltig, günstig und umweltfreundlich.',
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    path: ROUTES.SHOPS,
    title: 'Werkstätten in Zürich',
    description:
      'Alle zertifizierten Reparaturwerkstätten in Zürich auf einen Blick — für Elektronik, Kleidung und Schuhe. Nach Kategorie und Postleitzahl filtern.',
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    path: ROUTES.HOW_IT_WORKS,
    title: 'Wie funktioniert der Reparaturbonus?',
    description:
      'In wenigen Schritten zum Reparaturbonus: Werkstatt wählen, Bonus-Code erhalten, CHF 100 an die Reparatur anrechnen lassen. Für Privatpersonen und Werkstätten erklärt.',
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    path: ROUTES.WHY_REPAIR,
    title: 'Warum reparieren?',
    description:
      'Reparieren spart Geld, schont Ressourcen und stärkt das lokale Gewerbe in Zürich. Die Gründe, warum sich eine Reparatur fast immer lohnt.',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: ROUTES.SHOP_ONBOARDING,
    title: 'Werkstatt anmelden',
    description:
      'Sie betreiben eine Reparaturwerkstatt in Zürich? Melden Sie Ihren Betrieb an und werden Sie Teil des Reparaturbonus-Programms der Stadt.',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: ROUTES.VERIFY,
    title: 'Bonus-Code prüfen',
    description:
      'Für teilnehmende Werkstätten: Gültigkeit eines Reparaturbonus-Codes prüfen und den Bonus einlösen.',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

/**
 * Throws on an unregistered path rather than returning `undefined`. Both
 * callers run at build time, so a page added without a registry entry fails the
 * build instead of shipping with the root layout's generic title and no
 * sitemap entry.
 */
export function getPublicPage(path: string): PublicPage {
  const page = PUBLIC_PAGES.find((entry) => entry.path === path);

  if (!page) {
    throw new Error(
      `No metadata registered for "${path}". Add it to PUBLIC_PAGES in src/lib/constants/page-metadata.ts.`,
    );
  }

  return page;
}
