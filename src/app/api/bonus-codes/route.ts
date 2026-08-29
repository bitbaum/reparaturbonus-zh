import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { generateBonusCode, calculateBonusAmount, getBonusExpiryDate } from '@/lib/bonus-codes';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bonusCodes = await prisma.bonusCode.findMany({
      where: {
        userId: (session.user as { id?: string }).id!,
      },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bonusCodes);
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
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Generate unique bonus code
    let bonusCode = generateBonusCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existingCode = await prisma.bonusCode.findUnique({
        where: { code: bonusCode },
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
      orderRecord = await prisma.order.findUnique({
        where: { id: orderId },
      });
    } else {
      orderRecord = await prisma.order.create({
        data: {
          total: repairCost,
          description: description || 'Repair service',
          userId: (session.user as { id?: string }).id!,
          shopId: shopId,
          status: 'COMPLETED',
        },
      });
    }

    // Create bonus code
    const newBonusCode = await prisma.bonusCode.create({
      data: {
        code: bonusCode,
        amount: bonusAmount,
        expiresAt: expiryDate,
        userId: (session.user as { id?: string }).id!,
        shopId: shopId,
        orderId: orderRecord?.id,
      },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(newBonusCode, { status: 201 });
  } catch (error) {
    console.error('Error creating bonus code:', error);
    return NextResponse.json({ error: 'Failed to create bonus code' }, { status: 500 });
  }
}
