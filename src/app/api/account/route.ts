import { NextResponse } from 'next/server';
import { getAccount } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/** Who is signed in, with their role — what the header and dashboards read. */
export async function GET() {
  const account = await getAccount().catch(() => null);
  return NextResponse.json(account, { headers: { 'Cache-Control': 'private, no-store' } });
}
