import { NextResponse } from 'next/server';
import { isAuthenticated } from '../../../lib/auth';
import { getAnalyticsData } from '../../../lib/analytics';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
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
