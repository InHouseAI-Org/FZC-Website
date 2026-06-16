import { NextRequest, NextResponse } from 'next/server';

// Lightweight version for Vercel (no Puppeteer/Chromium)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const datasheetPath = searchParams.get('path');

  // Return error message for Vercel deployment
  return NextResponse.json(
    {
      error: 'PDF generation is not available on this deployment',
      message: 'Please view the datasheet in your browser or download from the main server',
      datasheetPath: datasheetPath
    },
    { status: 503 }
  );
}
