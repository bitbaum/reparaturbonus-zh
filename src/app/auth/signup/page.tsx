import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { authLabelsFor, signInMethods } from '@bitbaum/accountkit/auth';
import { returnPath } from '@bitbaum/accountkit/orangecat';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignUpMarketing } from '@/components/auth/AuthMarketing';
import { ReparaturSignUp } from '@/components/auth/AccountScreens';
import { accountsReady, authMailer, getAccount } from '@/lib/auth';
import { ROUTES } from '@/lib/constants/routes';

export const dynamic = 'force-dynamic';

/** A resident's account. A workshop applies through the onboarding instead. */
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const query = await searchParams;
  const next = returnPath(query.next, ROUTES.AUTH.CONTINUE);
  if (await getAccount().catch(() => null)) redirect(next);
  const labels = authLabelsFor('de');
  const signInHref = query.next
    ? `${ROUTES.AUTH.SIGNIN}?next=${encodeURIComponent(next)}`
    : ROUTES.AUTH.SIGNIN;
  return (
    <AuthShell
      marketing={<SignUpMarketing />}
      title="Konto erstellen"
      subtitle="Eröffnen Sie jetzt ein Konto"
      switchPrompt="Bereits ein Konto?"
      switchHref={signInHref}
      switchLabel="Jetzt anmelden"
    >
      <Link
        href={ROUTES.SHOP_ONBOARDING}
        className="mb-6 flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-gray-200 p-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300"
      >
        <BuildingStorefrontIcon className="h-5 w-5" />
        Sie sind ein Reparaturbetrieb? Zur Anmeldung für Betriebe
      </Link>
      {accountsReady() ? (
        <ReparaturSignUp
          labels={labels}
          methods={signInMethods(process.env, authMailer.configured)}
          next={next}
          signInHref={signInHref}
        />
      ) : (
        <p className="text-center text-gray-600">{labels.errors.unavailable}</p>
      )}
    </AuthShell>
  );
}
