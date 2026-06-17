import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '../../../lib/auth';
import { getAnalyticsData } from '../../../lib/analytics';
import prisma from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication using Request API (avoids Next.js 16 cookies() bug)
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Delete expired session if it exists
      if (session) {
        await prisma.session.delete({
          where: { id: session.id },
        });
      }
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analyticsData = await getAnalyticsData();

    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
