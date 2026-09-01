import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { shops } from '@/lib/db/schema';

export async function GET() {
  try {
    console.log('Test API: Starting...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    const count = await db.$count(shops);
    console.log('Test API: Shop count:', count);

    const shopRows = await db.query.shops.findMany({
      limit: 3,
      columns: { id: true, name: true, category: true, isActive: true },
    });
    console.log('Test API: First 3 shops:', shopRows);

    return NextResponse.json({
      success: true,
      count,
      shops: shopRows,
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({ error: 'Test API failed', details: error }, { status: 500 });
  }
}
