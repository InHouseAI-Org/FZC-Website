import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Products that were modified in the last commit
const MODIFIED_DATASHEETS = [
  'Insulation_Gasket_Kit_1800_FS',
  'ULTRA_FE_1003',
  'ULTRA_NE_1005'
];

const S3_BUCKET = 'inmarco-datasheets';
const S3_REGION = 'ap-south-1';

const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function imageToBase64(imagePath: string): string | null {
  if (!fs.existsSync(imagePath)) {
    console.warn(`  ⚠ Image not found: ${imagePath}`);
    return null;
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
  };

  const mimeType = mimeTypes[ext] || 'image/png';
  return `data:${mimeType};base64,${base64}`;
}

async function convertHTMLToPDF(htmlPath: string, pdfPath: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Read HTML content
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const htmlDir = path.dirname(htmlPath);

    // Replace logo image
    const logoPath = path.join(process.cwd(), 'src/assets/inmarco-tagline-logo1.webp');
    const logoBase64 = imageToBase64(logoPath);
    if (logoBase64) {
      htmlContent = htmlContent.replace(
        '../../../src/assets/inmarco-tagline-logo1.webp',
        logoBase64
      );
    }

    // Replace background images in CSS
    const bgImagePath = path.join(htmlDir, '../../fertilizer.jpg');
    const bgBase64 = imageToBase64(bgImagePath);
    if (bgBase64) {
      htmlContent = htmlContent.replace(
        /url\(['"]?\.\.\/\.\.\/fertilizer\.jpg['"]?\)/g,
        `url('${bgBase64}')`
      );
    }

    // Replace background images in inline styles (e.g., oil and gas.jpg)
    const inlineStyleRegex = /style=["']([^"']*background-image:\s*url\(['"]?(\.\.\/\.\.\/[^'")]+)['"]?\)[^"']*)["']/g;
    let styleMatch;
    const processedStyles = new Map<string, string>();

    while ((styleMatch = inlineStyleRegex.exec(htmlContent)) !== null) {
      const fullStyle = styleMatch[1];
      const imagePath = styleMatch[2];

      if (!processedStyles.has(imagePath)) {
        const decodedImgPath = decodeURIComponent(imagePath);
        const absImgPath = path.join(htmlDir, decodedImgPath);
        const imgBase64 = imageToBase64(absImgPath);

        if (imgBase64) {
          processedStyles.set(imagePath, imgBase64);
        }
      }
    }

    // Apply all processed inline style replacements
    processedStyles.forEach((base64, originalPath) => {
      const escapedPath = originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      htmlContent = htmlContent.replace(
        new RegExp(`url\\(['"]?${escapedPath}['"]?\\)`, 'g'),
        `url('${base64}')`
      );
    });

    // Replace product images - find all img src attributes with relative paths
    const imgRegex = /src=["'](\.\.\/\.\.\/[^"']+)["']/g;
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const relPath = match[1];
      const decodedPath = decodeURIComponent(relPath);
      const absPath = path.join(htmlDir, decodedPath);
      const base64 = imageToBase64(absPath);
      if (base64) {
        htmlContent = htmlContent.replace(
          new RegExp(`src=["']${relPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
          `src="${base64}"`
        );
      }
    }

    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    console.log(`✓ Converted to PDF: ${path.basename(pdfPath)}`);
  } finally {
    await browser.close();
  }
}

async function uploadToS3(filePath: string, s3Key: string) {
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: fileContent,
    ContentType: 'application/pdf',
    CacheControl: 'public, max-age=31536000', // Cache for 1 year
  });

  try {
    await s3Client.send(command);
    console.log(`✓ Uploaded to S3: ${s3Key}`);
  } catch (error) {
    console.error(`✗ Failed to upload ${s3Key}:`, error);
    throw error;
  }
}

async function main() {
  const datasheetDir = path.join(process.cwd(), 'public/datasheets/new_generated_html');
  const pdfOutputDir = path.join(process.cwd(), 'public/datasheets/pdf');

  // Create PDF output directory if it doesn't exist
  if (!fs.existsSync(pdfOutputDir)) {
    fs.mkdirSync(pdfOutputDir, { recursive: true });
  }

  console.log('Starting conversion and upload of modified datasheets...\n');

  for (const datasheet of MODIFIED_DATASHEETS) {
    const htmlFileName = `${datasheet}.html`;
    const pdfFileName = `${datasheet}.pdf`;

    const htmlPath = path.join(datasheetDir, htmlFileName);
    const pdfPath = path.join(pdfOutputDir, pdfFileName);
    const s3Key = `datasheets/${pdfFileName}`;

    console.log(`\nProcessing: ${datasheet}`);
    console.log(`  HTML: ${htmlPath}`);
    console.log(`  PDF: ${pdfPath}`);
    console.log(`  S3 Key: ${s3Key}`);

    if (!fs.existsSync(htmlPath)) {
      console.warn(`⚠ Warning: ${htmlFileName} not found at ${htmlPath}`);
      continue;
    }

    // Convert HTML to PDF
    await convertHTMLToPDF(htmlPath, pdfPath);

    // Upload PDF to S3
    await uploadToS3(pdfPath, s3Key);
  }

  console.log('\n✓ All datasheets converted and uploaded successfully!');
  console.log(`\nPDFs are now accessible at:`);
  console.log(`https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/datasheets/[filename].pdf`);
}

main().catch(console.error);
