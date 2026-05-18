import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const datasheetPath = searchParams.get('path');

    if (!datasheetPath) {
      return NextResponse.json(
        { error: 'Datasheet path is required' },
        { status: 400 }
      );
    }

    // Construct the full file path
    const htmlFilePath = path.join(process.cwd(), 'public', datasheetPath);

    // Check if file exists
    if (!fs.existsSync(htmlFilePath)) {
      return NextResponse.json(
        { error: 'Datasheet file not found' },
        { status: 404 }
      );
    }

    // Convert file path to file:// URL for proper relative path resolution
    const fileUrl = pathToFileURL(htmlFilePath).href;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'],
    });

    const page = await browser.newPage();

    // Navigate to the file URL so relative paths work correctly
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF with A4 format
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5cm',
        right: '0.5cm',
        bottom: '0.5cm',
        left: '0.5cm',
      },
    });

    await browser.close();

    // Extract filename for download
    const filename = path.basename(datasheetPath, '.html') + '.pdf';

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
