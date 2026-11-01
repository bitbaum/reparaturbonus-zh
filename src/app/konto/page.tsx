import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { authLabelsFor, isDeliverable, signInMethods } from '@bitbaum/accountkit/auth';
import { ReparaturAccount } from '@/components/auth/AccountScreens';
import { authMailer, getSession, linkedMethods } from '@/lib/auth';
import { ROUTES } from '@/lib/constants/routes';
import { noindexMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { ...noindexMetadata, title: 'Konto' };

/** One's own account: passkeys, two-step codes, password, sign-in methods, deletion. */
export default async function AccountPage() {
  const session = await getSession().catch(() => null);
  if (!session) redirect(`${ROUTES.AUTH.SIGNIN}?next=${encodeURIComponent(ROUTES.ACCOUNT)}`);
  const { user } = session;
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link href={ROUTES.DASHBOARD} className="text-sm text-gray-500 hover:text-gray-700">
        ← Zum Dashboard
      </Link>
      <h1 className="mt-4 mb-8 text-3xl font-bold text-gray-900">Konto</h1>
      <ReparaturAccount
        labels={authLabelsFor('de')}
        methods={signInMethods(process.env, authMailer.configured)}
        user={{
          name: user.name ?? '',
          email: isDeliverable(user.email) ? user.email : null,
          emailVerified: Boolean(user.emailVerified),
          role: user.role ?? 'customer',
          twoFactorEnabled: Boolean(user.twoFactorEnabled),
        }}
        linked={await linkedMethods()}
      />
    </div>
  );
}
