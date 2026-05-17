#!/usr/bin/env node

/**
 * PDF Generator for standalone HTML datasheets
 *
 * Usage:
 *   node generate-pdf-from-html.js generated_html/PE_104.html generated_pdf/PE_104.pdf
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF(htmlFile, outputFile) {
    console.log(`\n🚀 Generating PDF from: ${htmlFile}`);

    try {
        // Create output directory if it doesn't exist
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Launch browser
        console.log('📖 Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Use localhost server to serve the HTML file
        const htmlPath = path.join(__dirname, htmlFile);
        const htmlUrl = `http://localhost:8765/public/datasheets/${htmlFile}`;

        console.log(`📄 Loading HTML: ${htmlUrl}`);

        // Navigate to HTML file
        await page.goto(htmlUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for any images to load
        await page.evaluate(() => {
            return Promise.all(
                Array.from(document.images).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve);
                    });
                })
            );
        });

        // Wait a bit more for any dynamic content
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('🖨️  Generating PDF...');

        // Generate PDF
        await page.pdf({
            path: outputFile,
            format: 'A4',
            printBackground: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        });

        console.log(`✅ PDF created: ${outputFile}`);

        await browser.close();
        return true;

    } catch (error) {
        console.error(`❌ Error generating PDF: ${error.message}`);
        console.error(error.stack);
        return false;
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    // Generate PDFs for all HTML files in generated_html directory
    const htmlDir = path.join(__dirname, 'generated_html');
    const outputDir = path.join(__dirname, 'generated_pdf');

    if (!fs.existsSync(htmlDir)) {
        console.error('❌ generated_html directory not found');
        process.exit(1);
    }

    const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

    console.log(`📦 Found ${htmlFiles.length} HTML files to convert`);

    (async () => {
        for (const htmlFile of htmlFiles) {
            const baseName = path.basename(htmlFile, '.html');
            const htmlPath = `generated_html/${htmlFile}`;
            const outputPath = path.join(outputDir, `${baseName}.pdf`);

            await generatePDF(htmlPath, outputPath);
        }

        console.log('\n✅ All PDFs generated successfully!');
    })();

} else if (args.length === 2) {
    // Generate single PDF
    const [htmlFile, outputFile] = args;

    (async () => {
        const success = await generatePDF(htmlFile, outputFile);
        process.exit(success ? 0 : 1);
    })();

} else {
    console.error('Usage: node generate-pdf-from-html.js [htmlFile outputFile]');
    console.error('Or run without arguments to convert all HTML files in generated_html/');
    process.exit(1);
}
