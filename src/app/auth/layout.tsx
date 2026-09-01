import type { Metadata } from 'next';
import { noindexMetadata } from '@/lib/metadata';

/** Sign-in and sign-up are not search results. */
export const metadata: Metadata = noindexMetadata;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
