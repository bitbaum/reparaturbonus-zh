import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { bonusCodes } from '@/lib/db/schema';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const verify = searchParams.get('verify') === 'true';

    // For shop verification, allow access without authentication
    if (verify) {
      const bonusCode = await db.query.bonusCodes.findFirst({
        where: eq(bonusCodes.code, resolvedParams.code.toUpperCase()),
        with: {
          user: { columns: { name: true, email: true } },
          shop: { columns: { name: true } },
        },
      });

      if (!bonusCode) {
        return NextResponse.json({ error: 'Bonus code not found' }, { status: 404 });
      }

      return NextResponse.json(bonusCode);
    }

    // Original authenticated access for users
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bonusCode = await db.query.bonusCodes.findFirst({
      where: eq(bonusCodes.code, resolvedParams.code),
      with: {
        user: { columns: { id: true, name: true, email: true } },
        shop: { columns: { name: true, category: true } },
        order: { columns: { id: true, total: true, status: true, description: true } },
      },
    });

    if (!bonusCode) {
      return NextResponse.json({ error: 'Bonus code not found' }, { status: 404 });
    }

    // Check if user is authorized to view this bonus code
    const userRole = (session.user as { role?: string; id?: string }).role;
    const isOwner = bonusCode.userId === (session.user as { id?: string }).id;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(bonusCode);
  } catch (error) {
    console.error('Error fetching bonus code:', error);
    return NextResponse.json({ error: 'Failed to fetch bonus code' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const bonusCode = await db.query.bonusCodes.findFirst({
      where: eq(bonusCodes.code, resolvedParams.code),
    });

    if (!bonusCode) {
      return NextResponse.json({ error: 'Bonus code not found' }, { status: 404 });
    }

    // Check authorization
    const userRole = (session.user as { role?: string; id?: string }).role;
    const isOwner = bonusCode.userId === (session.user as { id?: string }).id;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (action === 'use') {
      if (bonusCode.isUsed) {
        return NextResponse.json({ error: 'Bonus code already used' }, { status: 400 });
      }

      if (new Date() > bonusCode.expiresAt) {
        return NextResponse.json({ error: 'Bonus code expired' }, { status: 400 });
      }

      await db
        .update(bonusCodes)
        .set({ isUsed: true, usedAt: new Date() })
        .where(eq(bonusCodes.code, resolvedParams.code));

      const updatedBonusCode = await db.query.bonusCodes.findFirst({
        where: eq(bonusCodes.code, resolvedParams.code),
        with: { shop: { columns: { name: true } } },
      });

      return NextResponse.json(updatedBonusCode);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating bonus code:', error);
    return NextResponse.json({ error: 'Failed to update bonus code' }, { status: 500 });
  }
}
