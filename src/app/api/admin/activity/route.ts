import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { and, desc, eq, isNotNull } from 'drizzle-orm';
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

    // Get recent activity from different sources
    const [recentUsers, recentShops, recentBonusCodes, recentUsedCodes] = await Promise.all([
      db.query.users.findMany({
        columns: { id: true, name: true, email: true, createdAt: true },
        orderBy: desc(users.createdAt),
        limit: 5,
      }),
      db.query.shops.findMany({
        columns: { id: true, name: true, createdAt: true },
        orderBy: desc(shops.createdAt),
        limit: 5,
      }),
      db.query.bonusCodes.findMany({
        columns: { id: true, code: true, amount: true, createdAt: true },
        with: { user: { columns: { name: true } } },
        orderBy: desc(bonusCodes.createdAt),
        limit: 5,
      }),
      db.query.bonusCodes.findMany({
        columns: { id: true, code: true, amount: true, usedAt: true },
        with: { user: { columns: { name: true } } },
        where: and(eq(bonusCodes.isUsed, true), isNotNull(bonusCodes.usedAt)),
        orderBy: desc(bonusCodes.usedAt),
        limit: 5,
      }),
    ]);

    // Combine and format activities
    const activities = [
      ...recentUsers.map((user) => ({
        id: `user-${user.id}`,
        type: 'USER_REGISTERED' as const,
        description: `New user registered: ${user.name || user.email}`,
        timestamp: user.createdAt.toISOString(),
      })),
      ...recentShops.map((shop) => ({
        id: `shop-${shop.id}`,
        type: 'SHOP_ADDED' as const,
        description: `New shop added: ${shop.name}`,
        timestamp: shop.createdAt.toISOString(),
      })),
      ...recentBonusCodes.map((code) => ({
        id: `bonus-${code.id}`,
        type: 'BONUS_CODE_GENERATED' as const,
        description: `Bonus code ${code.code} generated for ${code.user.name} (CHF ${code.amount})`,
        timestamp: code.createdAt.toISOString(),
      })),
      ...recentUsedCodes.map((code) => ({
        id: `used-${code.id}`,
        type: 'BONUS_CODE_USED' as const,
        description: `Bonus code ${code.code} used by ${code.user.name} (CHF ${code.amount})`,
        timestamp: code.usedAt!.toISOString(),
      })),
    ];

    // Sort by timestamp and take most recent 20
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return NextResponse.json({ error: 'Failed to fetch admin activity' }, { status: 500 });
  }
}
