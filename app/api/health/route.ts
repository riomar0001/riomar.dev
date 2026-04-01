import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if we have projects
    const projectCount = await prisma.project.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      projectCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[HEALTH] Database connection failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        env: {
          DATABASE_URL_SET: !!process.env.DATABASE_URL,
          DIRECT_URL_SET: !!process.env.DIRECT_URL,
          NODE_ENV: process.env.NODE_ENV
        }
      },
      { status: 503 }
    );
  }
}
