#!/usr/bin/env node

/**
 * PDF Generator for Inmarco Datasheets
 *
 * Usage:
 *   node generate-pdf.js data/style_150C_data.json output/150C.pdf
 *   node generate-pdf.js data/HY_105_flexible.json output/HY_105.pdf
 *
 * Requirements:
 *   npm install puppeteer
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF(dataFile, outputFile) {
    console.log(`\n🚀 Generating PDF from: ${dataFile}`);

    try {
        // Launch browser
        console.log('📖 Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Use localhost server to avoid CORS issues (server runs from project root)
        const templateUrl = `http://localhost:8765/public/datasheets/flexible-template.html?data=${dataFile}`;

        console.log(`📄 Loading datasheet: ${templateUrl}`);

        // Navigate to template with data
        await page.goto(templateUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait a bit for any dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('🖨️  Generating PDF...');

        // Generate PDF
        await page.pdf({
            path: outputFile,
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        });

        await browser.close();

        // Check file size
        const stats = fs.statSync(outputFile);
        const fileSizeInKB = (stats.size / 1024).toFixed(2);

        console.log(`✅ PDF generated successfully!`);
        console.log(`📊 File size: ${fileSizeInKB} KB`);
        console.log(`💾 Saved to: ${outputFile}\n`);

    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        process.exit(1);
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log(`
Usage: node generate-pdf.js <data-file> <output-file>

Examples:
  node generate-pdf.js data/style_150C_data.json output/150C.pdf
  node generate-pdf.js data/HY_105_flexible.json output/HY_105.pdf

Batch generate all:
  node generate-pdf.js --all
    `);
    process.exit(1);
}

const dataFile = args[0];
const outputFile = args[1];

// Create output directory if it doesn't exist
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

generatePDF(dataFile, outputFile);

export { generatePDF };
