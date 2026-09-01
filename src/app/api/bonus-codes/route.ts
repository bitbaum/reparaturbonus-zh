import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { bonusCodes, orders, shops } from '@/lib/db/schema';
import { authOptions } from '@/lib/auth';
import { generateBonusCode, calculateBonusAmount, getBonusExpiryDate } from '@/lib/bonus-codes';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const codes = await db.query.bonusCodes.findMany({
      where: eq(bonusCodes.userId, (session.user as { id?: string }).id!),
      with: {
        shop: { columns: { name: true } },
        order: { columns: { id: true, total: true, status: true } },
      },
      orderBy: desc(bonusCodes.createdAt),
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error('Error fetching bonus codes:', error);
    return NextResponse.json({ error: 'Failed to fetch bonus codes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repairCost, shopId, orderId, description } = body;

    if (!repairCost || !shopId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify shop exists
    const shop = await db.query.shops.findFirst({
      where: eq(shops.id, shopId),
    });

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Generate unique bonus code
    let bonusCode = generateBonusCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existingCode = await db.query.bonusCodes.findFirst({
        where: eq(bonusCodes.code, bonusCode),
      });

      if (!existingCode) {
        break;
      }

      bonusCode = generateBonusCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: 'Failed to generate unique bonus code' }, { status: 500 });
    }

    const bonusAmount = calculateBonusAmount();
    const expiryDate = getBonusExpiryDate();

    // Create order if not provided
    let orderRecord = null;
    if (orderId) {
      orderRecord =
        (await db.query.orders.findFirst({
          where: eq(orders.id, orderId),
        })) ?? null;
    } else {
      [orderRecord] = await db
        .insert(orders)
        .values({
          total: repairCost,
          description: description || 'Repair service',
          userId: (session.user as { id?: string }).id!,
          shopId: shopId,
          status: 'COMPLETED',
        })
        .returning();
    }

    // Create bonus code
    const [inserted] = await db
      .insert(bonusCodes)
      .values({
        code: bonusCode,
        amount: bonusAmount,
        expiresAt: expiryDate,
        userId: (session.user as { id?: string }).id!,
        shopId: shopId,
        orderId: orderRecord?.id,
      })
      .returning({ id: bonusCodes.id });

    const newBonusCode = await db.query.bonusCodes.findFirst({
      where: eq(bonusCodes.id, inserted.id),
      with: {
        shop: { columns: { name: true } },
        order: { columns: { id: true, total: true, status: true } },
      },
    });

    return NextResponse.json(newBonusCode, { status: 201 });
  } catch (error) {
    console.error('Error creating bonus code:', error);
    return NextResponse.json({ error: 'Failed to create bonus code' }, { status: 500 });
  }
}
