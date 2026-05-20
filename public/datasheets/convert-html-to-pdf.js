#!/usr/bin/env node

/**
 * HTML to PDF Converter for Inmarco Datasheets
 * Converts all HTML files in generated_html/ to PDFs in pdf_output/
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, 'generated_html');
const OUTPUT_DIR = path.join(__dirname, 'pdf_output');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertHTMLtoPDF(htmlPath, pdfPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  try {
    const page = await browser.newPage();

    // Convert file path to file:// URL
    const fileUrl = `file://${htmlPath}`;

    // Navigate to HTML file using file:// protocol (preserves relative paths)
    await page.goto(fileUrl, {
      waitUntil: ['networkidle0', 'load'],
      timeout: 60000
    });

    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
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
  console.log('Inmarco Datasheet HTML to PDF Converter');
  console.log('================================================\n');

  // Get all HTML files
  const htmlFiles = fs.readdirSync(INPUT_DIR)
    .filter(file => file.endsWith('.html'))
    .sort();

  if (htmlFiles.length === 0) {
    console.log('❌ No HTML files found in generated_html/ directory');
    process.exit(1);
  }

  console.log(`📁 Found ${htmlFiles.length} HTML file(s) to convert\n`);

  let successCount = 0;
  let failCount = 0;

  // Process each HTML file
  for (const htmlFile of htmlFiles) {
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
