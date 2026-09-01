export const ROUTES = {
  HOME: '/',
  SHOPS: '/shops',
  HOW_IT_WORKS: '/how-it-works',
  WHY_REPAIR: '/warum-reparieren',
  SHOP_ONBOARDING: '/shop-onboarding',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  VERIFY: '/verify',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
  },
  API: {
    SHOPS: '/api/shops',
    BONUS_CODES: '/api/bonus-codes',
    AUTH: '/api/auth',
  },
} as const;

/** The detail page for a single workshop. */
export const shopPath = (id: string): string => `${ROUTES.SHOPS}/${id}`;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.SHOPS,
  ROUTES.HOW_IT_WORKS,
  ROUTES.WHY_REPAIR,
  ROUTES.SHOP_ONBOARDING,
  ROUTES.VERIFY,
  ROUTES.AUTH.SIGNIN,
  ROUTES.AUTH.SIGNUP,
] as const;

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD] as const;

export const ADMIN_ROUTES = [ROUTES.ADMIN] as const;

/**
 * Path prefixes that must never reach a search index: the admin console, a
 * resident's own dashboard, the JSON API and the sign-in forms. Consumed by
 * `app/robots.ts` (Disallow is a prefix match, so no trailing slash — `/admin`
 * covers `/admin` and everything under it) and by the per-segment
 * `robots: { index: false }` metadata that backs it up.
 */
export const NOINDEX_PATH_PREFIXES = [ROUTES.ADMIN, ROUTES.DASHBOARD, '/api', '/auth'] as const;
