import type { Metadata } from 'next';
import { noindexMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

/** Backs up the robots.txt Disallow — a crawler that reaches this anyway sees noindex. */
export const metadata: Metadata = noindexMetadata;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
