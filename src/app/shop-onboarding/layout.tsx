import type { Metadata } from 'next';
import { ROUTES } from '@/lib/constants/routes';
import { pageMetadata } from '@/lib/metadata';

/**
 * The page itself is a client component and so cannot export `metadata`; this
 * server layout carries it. Copy comes from the PUBLIC_PAGES registry.
 */
export const metadata: Metadata = pageMetadata(ROUTES.SHOP_ONBOARDING);

export default function ShopOnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
