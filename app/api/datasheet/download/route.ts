import { NextRequest, NextResponse } from 'next/server';
import { trackDatasheetDownload } from '../../../lib/analyticsTracking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productName, productSlug, datasheetUrl } = body;

    // Validation
    if (!email || !productName || !productSlug || !datasheetUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: email, productName, productSlug, and datasheetUrl are required',
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    // Track download in database (don't wait for it)
    trackDatasheetDownload({
      email,
      productName,
      productSlug,
      datasheetUrl,
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    }).catch(err => console.error('Failed to track datasheet download:', err));

    return NextResponse.json(
      {
        success: true,
        message: 'Download tracked successfully',
        downloadUrl: datasheetUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Datasheet download tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process download request',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Optional: Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
