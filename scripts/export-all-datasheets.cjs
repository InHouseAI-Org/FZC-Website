const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DATASHEETS_DIR = path.join(__dirname, '../public/datasheets/new_generated_html');
const OUTPUT_DIR = path.join(__dirname, '../public/datasheets/pdf_exports');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✓ Created output directory:', OUTPUT_DIR);
}

async function convertHtmlToPdf(htmlFilePath, outputPdfPath) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Read HTML content
        let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
        
        // Convert relative paths to absolute for images
        const publicDir = path.join(__dirname, '../public');
        
        // Replace logo path
        const logoPath = path.join(publicDir, 'inmarco-tagline-logo1.png');
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            const logoBase64 = logoBuffer.toString('base64');
            htmlContent = htmlContent.replace(
                /src=["']\.\.\/\.\.\/\.\.\/src\/assets\/inmarco-tagline-logo1\.png["']/g,
                `src="data:image/png;base64,${logoBase64}"`
            );
        }
        
        // Replace background images
        htmlContent = htmlContent.replace(/url\(['"]?(\.\.\/\.\.\/[^'")]+\.(?:jpg|jpeg|png))['"]?\)/gi, (match, relativePath) => {
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
                return match;
            } catch (error) {
                return match;
            }
        });
        
        // Replace product images
        htmlContent = htmlContent.replace(/src=["'](\.\.\/\.\.\/[^"']+\.(?:png|jpg|jpeg|JPG))["']/gi, (match, relativePath) => {
            try {
                const decodedPath = decodeURIComponent(relativePath);
                const absolutePath = path.join(publicDir, decodedPath.replace(/\.\.\//g, ''));
                
                if (fs.existsSync(absolutePath)) {
                    const imageBuffer = fs.readFileSync(absolutePath);
                    const imageBase64 = imageBuffer.toString('base64');
                    const ext = path.extname(absolutePath).toLowerCase();
                    const mimeType = (ext === '.png') ? 'image/png' : 'image/jpeg';
                    return `src="data:${mimeType};base64,${imageBase64}"`;
                }
                return match;
            } catch (error) {
                return match;
            }
        });
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF
        await page.pdf({
            path: outputPdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0.5cm',
                right: '0.5cm',
                bottom: '0.5cm',
                left: '0.5cm'
            }
        });
        
    } finally {
        await browser.close();
    }
}

async function exportAllDatasheets() {
    console.log('\n🚀 Starting datasheet export...\n');
    console.log('Input directory:', DATASHEETS_DIR);
    console.log('Output directory:', OUTPUT_DIR);
    console.log('');
    
    // Get all HTML files
    const htmlFiles = fs.readdirSync(DATASHEETS_DIR).filter(file => file.endsWith('.html'));
    
    console.log(`Found ${htmlFiles.length} datasheet files\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < htmlFiles.length; i++) {
        const htmlFile = htmlFiles[i];
        const htmlPath = path.join(DATASHEETS_DIR, htmlFile);
        const pdfFile = htmlFile.replace('.html', '.pdf');
        const pdfPath = path.join(OUTPUT_DIR, pdfFile);
        
        try {
            process.stdout.write(`[${i + 1}/${htmlFiles.length}] Converting ${htmlFile}... `);
            await convertHtmlToPdf(htmlPath, pdfPath);
            console.log('✓');
            successCount++;
        } catch (error) {
            console.log('✗');
            console.error(`   Error: ${error.message}`);
            errorCount++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Export complete!');
    console.log(`   Success: ${successCount}/${htmlFiles.length}`);
    console.log(`   Failed: ${errorCount}/${htmlFiles.length}`);
    console.log(`   Output: ${OUTPUT_DIR}`);
    console.log('='.repeat(50) + '\n');
}

// Run the export
exportAllDatasheets().catch(console.error);
