import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('Test API: Starting...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    const count = await prisma.shop.count();
    console.log('Test API: Shop count:', count);

    const shops = await prisma.shop.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        category: true,
        isActive: true,
      },
    });
    console.log('Test API: First 3 shops:', shops);

    return NextResponse.json({
      success: true,
      count,
      shops,
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({ error: 'Test API failed', details: error }, { status: 500 });
  }
}
