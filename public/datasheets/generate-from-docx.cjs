const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATASHEET_LOT_DIR = path.join(__dirname, '../Datasheet lot');
const OUTPUT_DIR = path.join(__dirname, 'new_generated_html');
const TEMP_DIR = '/tmp/docx_extracts';

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Function to extract text from docx XML
function extractTextFromXML(xmlContent) {
    const texts = [];
    const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;

    while ((match = regex.exec(xmlContent)) !== null) {
        if (match[1]) {
            texts.push(match[1]);
        }
    }

    return texts.join('');
}

// Function to parse docx file
function parseDocxFile(filePath) {
    const fileName = path.basename(filePath, '.docx');
    const tempExtractDir = path.join(TEMP_DIR, fileName.replace(/[^a-zA-Z0-9]/g, '_'));

    try {
        // Extract docx (which is a zip file)
        execSync(`unzip -q -o "${filePath}" -d "${tempExtractDir}"`, { encoding: 'utf8' });

        // Read the document.xml file
        const documentXmlPath = path.join(tempExtractDir, 'word', 'document.xml');
        const xmlContent = fs.readFileSync(documentXmlPath, 'utf8');

        // Extract all text
        const fullText = extractTextFromXML(xmlContent);

        return fullText;
    } catch (error) {
        console.error(`Error processing ${fileName}:`, error.message);
        return null;
    }
}

// Function to parse content into sections
function parseContent(text) {
    const sections = {
        productName: '',
        description: '',
        keyFeatures: [],
        performanceAdvantages: [],
        properties: [],
        applications: [],
        benefits: [],
        certifications: []
    };

    // Split into paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

    let currentSection = '';

    for (let para of paragraphs) {
        para = para.trim();

        // Identify sections
        if (para.match(/PRODUCT OVERVIEW/i)) {
            currentSection = 'overview';
            continue;
        } else if (para.match(/KEY FEATURES/i)) {
            currentSection = 'features';
            continue;
        } else if (para.match(/PERFORMANCE ADVANTAGES/i) || para.match(/BENEFITS/i)) {
            currentSection = 'advantages';
            continue;
        } else if (para.match(/TECHNICAL PROPERTIES/i) || para.match(/SPECIFICATIONS/i)) {
            currentSection = 'properties';
            continue;
        } else if (para.match(/APPLICATIONS/i)) {
            currentSection = 'applications';
            continue;
        } else if (para.match(/CERTIFICATION/i) || para.match(/TESTING/i)) {
            currentSection = 'certifications';
            continue;
        }

        // Add content to appropriate section
        if (currentSection === 'overview' && !sections.description) {
            sections.description = para;
        } else if (currentSection === 'features') {
            // Extract bullet points
            const bullets = para.split(/[\n•●-]/).filter(b => b.trim() && b.length > 10);
            sections.keyFeatures.push(...bullets.map(b => b.trim()));
        } else if (currentSection === 'advantages') {
            const bullets = para.split(/[\n•●-]/).filter(b => b.trim() && b.length > 10);
            sections.performanceAdvantages.push(...bullets.map(b => b.trim()));
        } else if (currentSection === 'applications') {
            const bullets = para.split(/[\n•●-]/).filter(b => b.trim() && b.length > 5);
            sections.applications.push(...bullets.map(b => b.trim()));
        } else if (currentSection === 'certifications') {
            const bullets = para.split(/[\n•●-]/).filter(b => b.trim() && b.length > 5);
            sections.certifications.push(...bullets.map(b => b.trim()));
        } else if (currentSection === 'properties') {
            // Try to parse properties as key-value pairs
            const lines = para.split('\n').filter(l => l.trim());
            for (let line of lines) {
                if (line.includes(':')) {
                    const [key, value] = line.split(':').map(s => s.trim());
                    if (key && value) {
                        sections.properties.push({ key, value });
                    }
                }
            }
        }
    }

    return sections;
}

// Function to generate HTML from template
function generateHTML(productName, sections) {
    // Split long description into paragraphs
    const descriptionParagraphs = sections.description
        .split(/\.\s+/)
        .filter(p => p.trim())
        .map(p => p.trim() + (p.endsWith('.') ? '' : '.'))
        .join('<br><br>');

    // Generate features HTML
    const featuresHTML = sections.keyFeatures.slice(0, 10).map(feature => `
                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">${feature}</span>
                    </div>`).join('');

    // Generate performance advantages HTML
    const advantagesHTML = sections.performanceAdvantages.slice(0, 10).map(adv => `
                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">${adv}</span>
                    </div>`).join('');

    // Generate properties table HTML
    const propertiesHTML = sections.properties.map(prop => `
                        <tr>
                            <td>${prop.key}</td>
                            <td>${prop.value}</td>
                        </tr>`).join('');

    // Generate applications HTML
    const applicationsHTML = sections.applications.slice(0, 10).map(app => `
                <div class="feature-item">
                    <span class="bullet">●</span>
                    <span class="feature-text">${app}</span>
                </div>`).join('');

    // Generate benefits HTML
    const benefitsHTML = sections.performanceAdvantages.slice(0, 8).map(benefit => `
                <div class="benefit-item">
                    <span class="check-icon">✓</span>
                    <span>${benefit}</span>
                </div>`).join('');

    // Generate certifications HTML
    const certificationsHTML = sections.certifications.map(cert => `
                <div class="feature-item">
                    <span class="bullet">●</span>
                    <span class="feature-text">${cert}</span>
                </div>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - Technical Datasheet</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4 portrait;
            margin: 0;
        }

        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .product-image-container {
                box-shadow: none !important;
            }
        }

        html {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #2b2a29;
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
        }

        /* Page 1 - Hero */
        .page-1 {
            width: 210mm;
            height: 297mm;
            background: linear-gradient(135deg, #2b2a29 0%, #1a1918 100%);
            position: relative;
            overflow: hidden;
            page-break-after: always;
        }

        .header {
            padding: 20mm 15mm;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .logo-section {
            color: white;
        }

        .logo-section img {
            height: 200px;
            width: auto;
        }

        /* Hero section */
        .hero-section {
            position: relative;
            margin-top: 10px;
            height: 100%;
            background-image: url('../../oil and gas.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(43, 42, 41, 0.95) 0%, rgba(43, 42, 41, 0.7) 50%, transparent 100%);
        }

        .hero-content {
            position: relative;
            z-index: 10;
            padding: 35mm 15mm 0 15mm;
            max-width: 150mm;
        }

        .red-accent {
            width: 50mm;
            height: 4px;
            background: #e31e24;
            margin-bottom: 10mm;
        }

        .product-name {
            font-size: 52pt;
            font-weight: 700;
            color: white;
            margin-bottom: 6mm;
            letter-spacing: -1.5px;
            line-height: 1.1;
        }

        .product-tagline {
            font-size: 16pt;
            color: #ffffff;
            max-width: 140mm;
            line-height: 1.5;
            font-weight: 300;
        }

        /* Page 2 - Technical Details */
        .page-2 {
            width: 210mm;
            height: 297mm;
            background: white;
            position: relative;
            page-break-after: always;
        }

        /* Page 3 - Properties */
        .page-3 {
            width: 210mm;
            height: 297mm;
            background: white;
            position: relative;
            page-break-after: always;
        }

        /* Page 4 - Performance Benefits */
        .page-4 {
            width: 210mm;
            height: 297mm;
            background: white;
            position: relative;
        }

        .page-2-header {
            background: linear-gradient(135deg, #2b2a29 0%, #1a1918 100%);
            padding: 12mm 15mm;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .page-2-title {
            font-size: 28pt;
            font-weight: bold;
        }

        .content-section {
            padding: 10mm 15mm;
        }

        .description-with-image {
            margin-bottom: 6mm;
        }

        .description-text {
            display: block;
        }

        .description {
            font-size: 10pt;
            line-height: 1.5;
            color: #333;
            margin-bottom: 0;
            text-align: justify;
        }

        .side-product-image {
            float: right;
            margin-left: 5mm;
            margin-bottom: 5mm;
        }

        .product-image-container {
            background: white;
            border-radius: 5mm;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 3px solid #e31e24;
        }

        .product-image-small {
            height: 50mm;
            border-radius: 4mm;
            object-fit: contain;
            display: block;
        }

        .section-divider {
            height: 2px;
            background: #e31e24;
            margin: 5mm 0;
        }

        .features-grid {
            display: flex;
            gap: 10mm;
            margin-bottom: 0;
        }

        .features-column {
            flex: 1;
        }

        .features-column h3 {
            font-size: 12pt;
            color: #2b2a29;
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #e31e24;
            font-weight: 600;
        }

        .feature-item {
            display: flex;
            margin-bottom: 1mm;
            font-size: 8.5pt;
            line-height: 1.4;
        }

        .bullet {
            color: #e31e24;
            font-weight: bold;
            margin-right: 3mm;
            font-size: 8pt;
            margin-top: 0.8mm;
        }

        .feature-text {
            flex: 1;
            color: #444;
        }

        /* Properties Table */
        .properties-section {
            background: #f5f5f5;
            padding: 8mm;
            border-radius: 3mm;
            border-left: 4px solid #e31e24;
            margin-bottom: 8mm;
        }

        .properties-section h3 {
            font-size: 14pt;
            color: #2b2a29;
            margin-bottom: 5mm;
        }

        .properties-table {
            width: 100%;
            border-collapse: collapse;
        }

        .properties-table th {
            background: #2b2a29;
            color: white;
            padding: 3mm;
            text-align: left;
            font-size: 9pt;
            font-weight: 600;
        }

        .properties-table td {
            padding: 2.5mm 3mm;
            border-bottom: 1px solid #ddd;
            font-size: 9pt;
            color: #333;
        }

        .properties-table tr:last-child td {
            border-bottom: none;
        }

        .properties-table td:first-child {
            font-weight: 600;
            color: #2b2a29;
        }

        /* Benefits Box */
        .benefits-box {
            background: linear-gradient(135deg, #e31e24 0%, #c41a20 100%);
            color: white;
            padding: 8mm;
            border-radius: 3mm;
            margin-bottom: 8mm;
        }

        .benefits-box h3 {
            font-size: 14pt;
            margin-bottom: 4mm;
        }

        .benefit-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 3mm;
            font-size: 9pt;
            line-height: 1.4;
        }

        .benefit-item:last-child {
            margin-bottom: 0;
        }

        .check-icon {
            color: white;
            font-weight: bold;
            margin-right: 3mm;
            font-size: 11pt;
        }

        /* Footer */
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #2b2a29;
            color: white;
            padding: 8mm 15mm;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .company-info {
            font-size: 7pt;
            line-height: 1.6;
        }

        .company-name {
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 2mm;
            color: #e31e24;
        }

        .contact-info {
            color: #ccc;
        }

        .disclaimer {
            font-size: 6pt;
            color: #888;
            margin-top: 3mm;
            max-width: 160mm;
        }
    </style>
</head>
<body>
    <!-- Page 1 - Hero -->
    <div class="page-1">
        <div class="header">
            <div class="logo-section">
                <img src="../../../src/assets/inmarco-tagline-logo1.png" alt="INMARCO - Innovations in Fluid Sealing">
            </div>
        </div>

        <div class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="red-accent"></div>
                <h1 class="product-name">${productName}</h1>
                <p class="product-tagline">Premium sealing solution for demanding industrial applications</p>
            </div>
        </div>
    </div>

    <!-- Page 2 - Technical Details -->
    <div class="page-2">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">${productName}</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="description-with-image">
                <div class="description-text">
                    <p class="description" style="margin-bottom: 0;">
                        ${descriptionParagraphs}
                    </p>
                </div>
            </div>

            <div class="section-divider"></div>

            <div class="features-grid">
                <div class="features-column">
                    <h3>Key Features</h3>${featuresHTML}
                </div>

                <div class="features-column">
                    <h3>Performance Advantages</h3>${advantagesHTML}
                </div>
            </div>
            </div>
        </div>
    </div>

    <!-- Page 3 - Technical Properties and Applications -->
    <div class="page-3">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">${productName}</h2>
            </div>
        </div>

        <div class="content-section">
            ${propertiesHTML ? `<div class="properties-section">
                <h3>Technical Properties</h3>
                <table class="properties-table">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>${propertiesHTML}
                    </tbody>
                </table>
            </div>` : ''}
            ${applicationsHTML ? `<div class="features-column">
                <h3>Applications</h3>${applicationsHTML}
            </div>` : ''}
        </div>
    </div>

    <!-- Page 4 - Performance Benefits -->
    <div class="page-4">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">${productName}</h2>
            </div>
        </div>

        <div class="content-section">
            ${benefitsHTML ? `<div class="benefits-box">
                <h3>Performance Benefits</h3>${benefitsHTML}
            </div>` : ''}

            ${certificationsHTML ? `<div class="features-column">
                <h3>Certification & Testing</h3>${certificationsHTML}
            </div>` : ''}
        </div>

        <div class="footer">
            <div class="footer-content">
                <div class="company-info">
                    <div class="company-name">INMARCO FZC</div>
                    <div class="contact-info">
                        P.O. Box 120284, Sharjah Airport International Free Zone (SAIF-Zone), Sharjah, UAE<br>
                        Tel: +971 6 5578378 | Fax: +971 6 5578948<br>
                        Email: sales@inmarco.ae | Web: www.inmarco.ae
                    </div>
                    <div class="disclaimer">
                        The information provided in this datasheet is intended as a general engineering guideline. Final selection and suitability must be confirmed based on actual operating conditions and application requirements.
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Main processing function
function processAllDocx() {
    const files = fs.readdirSync(DATASHEET_LOT_DIR).filter(f => f.endsWith('.docx'));

    console.log(`Found ${files.length} docx files to process...`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
        const filePath = path.join(DATASHEET_LOT_DIR, file);
        console.log(`\nProcessing: ${file}`);

        try {
            // Extract text from docx
            const text = parseDocxFile(filePath);

            if (!text) {
                console.log(`  ✗ Failed to extract text`);
                errorCount++;
                continue;
            }

            // Parse content
            const sections = parseContent(text);

            // Extract product name from filename
            const productName = file.replace(' Changes.docx', '').trim();

            // Generate HTML
            const html = generateHTML(productName, sections);

            // Save HTML file
            const outputFileName = productName.replace(/[^a-zA-Z0-9]/g, '_') + '.html';
            const outputPath = path.join(OUTPUT_DIR, outputFileName);
            fs.writeFileSync(outputPath, html, 'utf8');

            console.log(`  ✓ Generated: ${outputFileName}`);
            successCount++;

        } catch (error) {
            console.log(`  ✗ Error: ${error.message}`);
            errorCount++;
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing complete!`);
    console.log(`  Success: ${successCount} files`);
    console.log(`  Errors: ${errorCount} files`);
    console.log(`  Output directory: ${OUTPUT_DIR}`);
    console.log(`${'='.repeat(60)}\n`);
}

// Run the script
processAllDocx();
