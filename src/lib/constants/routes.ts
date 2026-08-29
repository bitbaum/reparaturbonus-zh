export const ROUTES = {
  HOME: '/',
  SHOPS: '/shops',
  HOW_IT_WORKS: '/how-it-works',
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

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.SHOPS,
  ROUTES.HOW_IT_WORKS,
  ROUTES.SHOP_ONBOARDING,
  ROUTES.VERIFY,
  ROUTES.AUTH.SIGNIN,
  ROUTES.AUTH.SIGNUP,
] as const;

export const PROTECTED_ROUTES = [ROUTES.DASHBOARD] as const;

export const ADMIN_ROUTES = [ROUTES.ADMIN] as const;
