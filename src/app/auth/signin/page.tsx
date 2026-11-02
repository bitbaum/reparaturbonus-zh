import { redirect } from 'next/navigation';
import { authLabelsFor, signInMethods } from '@bitbaum/accountkit/auth';
import { returnPath } from '@bitbaum/accountkit/orangecat';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignInMarketing } from '@/components/auth/AuthMarketing';
import { ReparaturSignIn } from '@/components/auth/AccountScreens';
import { accountsReady, authMailer, getAccount } from '@/lib/auth';
import { ROUTES } from '@/lib/constants/routes';

export const dynamic = 'force-dynamic';

/** Every way in, on one screen: password, link, passkey, OrangeCat, the shared sign-in. */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; token?: string }>;
}) {
  const query = await searchParams;
  const next = returnPath(query.next, ROUTES.AUTH.CONTINUE);
  // A reset link lands here with its token: show the form even when signed in.
  if (!query.token && (await getAccount().catch(() => null))) redirect(next);
  const labels = authLabelsFor('de');
  const signUpHref = query.next
    ? `${ROUTES.AUTH.SIGNUP}?next=${encodeURIComponent(next)}`
    : ROUTES.AUTH.SIGNUP;
  return (
    <AuthShell
      marketing={<SignInMarketing />}
      title="Anmelden"
      subtitle="Melden Sie sich bei Ihrem Konto an"
    >
      {accountsReady() ? (
        <ReparaturSignIn
          labels={labels}
          methods={signInMethods(process.env, authMailer.configured)}
          next={next}
          signUpHref={signUpHref}
          initialError={Boolean(query.error)}
        />
      ) : (
        <p className="text-center text-gray-600">{labels.errors.unavailable}</p>
      )}
    </AuthShell>
  );
}
