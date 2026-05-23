import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';

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

    // Construct the full file path (remove leading slash if present)
    const cleanPath = datasheetPath.startsWith('/') ? datasheetPath.slice(1) : datasheetPath;
    const htmlFilePath = path.join(process.cwd(), 'public', cleanPath);

    // Check if file exists
    if (!fs.existsSync(htmlFilePath)) {
      return NextResponse.json(
        { error: 'Datasheet file not found' },
        { status: 404 }
      );
    }

    // Read the HTML content
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    // Convert image paths to absolute file:// URLs for Puppeteer
    const publicDir = path.join(process.cwd(), 'public');

    // Replace relative image paths with base64 data URLs
    const logoPath = path.join(process.cwd(), 'public', 'inmarco-tagline-logo1.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      const logoBase64 = logoBuffer.toString('base64');
      const logoDataUrl = `data:image/png;base64,${logoBase64}`;

      // Replace logo references
      htmlContent = htmlContent.replace(
        /src=["']\.\.\/\.\.\/\.\.\/src\/assets\/inmarco-tagline-logo1\.png["']/g,
        `src="${logoDataUrl}"`
      );
    }

    // Replace all background image references (chemical.jpg, oil and gas.jpg, etc.)
    const backgroundImageRegex = /url\(['"]?(\.\.\/\.\.\/[^'")]+\.(?:jpg|jpeg|png))['"]?\)/gi;
    htmlContent = htmlContent.replace(backgroundImageRegex, (match, relativePath) => {
      try {
        const decodedPath = decodeURIComponent(relativePath);
        const absolutePath = path.join(publicDir, decodedPath.replace(/\.\.\//g, ''));

        if (fs.existsSync(absolutePath)) {
          const imageBuffer = fs.readFileSync(absolutePath);
          const imageBase64 = imageBuffer.toString('base64');
          const ext = path.extname(absolutePath).toLowerCase();
          const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
          return `url('data:${mimeType};base64,${imageBase64}')`;
        }
        return match; // Keep original if file doesn't exist
      } catch (error) {
        console.warn('Failed to process background image:', relativePath, error);
        return match; // Keep original on error
      }
    });

    // Replace product images with base64 data URLs
    // Match patterns like: src="../../FZC%20Inmarco%20Product%20Shoot/PE%20505/PE%20505_1.png"
    const productImageRegex = /src=["'](\.\.\/\.\.\/[^"']+\.(?:png|jpg|jpeg))["']/gi;
    htmlContent = htmlContent.replace(productImageRegex, (match, relativePath) => {
      try {
        // Decode URL encoding and resolve the path
        const decodedPath = decodeURIComponent(relativePath);
        const absolutePath = path.join(publicDir, decodedPath.replace(/\.\.\//g, ''));

        if (fs.existsSync(absolutePath)) {
          const imageBuffer = fs.readFileSync(absolutePath);
          const imageBase64 = imageBuffer.toString('base64');
          const ext = path.extname(absolutePath).toLowerCase();
          const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
          return `src="data:${mimeType};base64,${imageBase64}"`;
        }
        return match; // Keep original if file doesn't exist
      } catch (error) {
        console.warn('Failed to process image:', relativePath, error);
        return match; // Keep original on error
      }
    });

    // Launch Puppeteer with @sparticuz/chromium (optimized for containers)
    console.log('Launching browser for PDF generation...');
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set content directly instead of navigating to a file URL
    await page.setContent(htmlContent, {
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

    // Detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Log additional context
    console.error('Failed for datasheet path:', datasheetPath);
    console.error('Environment:', {
      nodeEnv: process.env.NODE_ENV,
      puppeteerPath: process.env.PUPPETEER_EXECUTABLE_PATH,
      cwd: process.cwd(),
    });

    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
