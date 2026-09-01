import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, eq, gt, sum } from 'drizzle-orm';
import { db } from '@/lib/db';
import { bonusCodes, shops, users } from '@/lib/db/schema';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string })?.role;
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [
      totalUsers,
      totalShops,
      totalBonusCodes,
      activeBonusCodes,
      [totalBonusValue],
      [usedBonusValue],
    ] = await Promise.all([
      db.$count(users),
      db.$count(shops),
      db.$count(bonusCodes),
      db.$count(
        bonusCodes,
        and(eq(bonusCodes.isUsed, false), gt(bonusCodes.expiresAt, new Date())),
      ),
      db.select({ sum: sum(bonusCodes.amount) }).from(bonusCodes),
      db
        .select({ sum: sum(bonusCodes.amount) })
        .from(bonusCodes)
        .where(eq(bonusCodes.isUsed, true)),
    ]);

    const stats = {
      totalUsers,
      totalShops,
      totalBonusCodes,
      activeBonusCodes,
      totalBonusValue: Number(totalBonusValue.sum) || 0,
      usedBonusValue: Number(usedBonusValue.sum) || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
