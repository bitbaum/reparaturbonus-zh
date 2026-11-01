import { NextResponse, type NextRequest } from 'next/server';
import { getAccount, isAdmin } from '@/lib/auth';
import { ROUTES } from '@/lib/constants/routes';

export const dynamic = 'force-dynamic';

/** Where every sign-in lands: admins to the console, residents to their dashboard. */
export async function GET(request: NextRequest) {
  const account = await getAccount().catch(() => null);
  const to = !account ? ROUTES.AUTH.SIGNIN : isAdmin(account) ? ROUTES.ADMIN : ROUTES.DASHBOARD;
  return NextResponse.redirect(new URL(to, request.nextUrl.origin));
}
