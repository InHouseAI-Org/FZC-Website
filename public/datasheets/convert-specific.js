#!/usr/bin/env node

/**
 * Convert specific HTML files to PDF
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, 'new_generated_html');
const OUTPUT_DIR = path.join(__dirname, 'pdf_exports');

const FILES_TO_CONVERT = [
  'Aramid_Wiping_Pad.html',
  'HY_606.html',
  'High_Temperature_Wiping_Pad.html'
];

async function convertHTMLtoPDF(htmlPath, pdfPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  try {
    const page = await browser.newPage();

    // Convert file path to file:// URL
    const fileUrl = `file://${htmlPath}`;

    // Navigate to HTML file
    await page.goto(fileUrl, {
      waitUntil: ['networkidle0', 'load'],
      timeout: 60000
    });

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate PDF with optimized settings
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });

    console.log(`✓ Generated: ${path.basename(pdfPath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed: ${path.basename(htmlPath)} - ${error.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('================================================');
  console.log('Converting Specific Datasheets to PDF');
  console.log('================================================\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✓ Created output directory: ${OUTPUT_DIR}\n`);
  }

  let successCount = 0;
  let failCount = 0;

  for (const htmlFile of FILES_TO_CONVERT) {
    const htmlPath = path.join(INPUT_DIR, htmlFile);
    const pdfFile = htmlFile.replace('.html', '.pdf');
    const pdfPath = path.join(OUTPUT_DIR, pdfFile);

    const success = await convertHTMLtoPDF(htmlPath, pdfPath);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n================================================');
  console.log(`✅ Successfully generated: ${successCount} PDF(s)`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} PDF(s)`);
  }
  console.log(`📂 PDFs saved in: ${OUTPUT_DIR}/`);
  console.log('================================================');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
