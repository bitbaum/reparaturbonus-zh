import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
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
      totalBonusValue,
      usedBonusValue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.shop.count(),
      prisma.bonusCode.count(),
      prisma.bonusCode.count({
        where: {
          isUsed: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
      prisma.bonusCode.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.bonusCode.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          isUsed: true,
        },
      }),
    ]);

    const stats = {
      totalUsers,
      totalShops,
      totalBonusCodes,
      activeBonusCodes,
      totalBonusValue: totalBonusValue._sum.amount || 0,
      usedBonusValue: usedBonusValue._sum.amount || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
