import puppeteer from 'puppeteer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const HTML_DIR = path.join(__dirname, 'public/datasheets/new_generated_html');
const PDF_OUTPUT_DIR = path.join(__dirname, 'public/datasheets/pdfs');
const S3_BUCKET = process.env.S3_BUCKET || 'inmarco-datasheets';
const S3_REGION = 'ap-south-1';  // Mumbai region
const S3_PREFIX = 'datasheets/';
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Validate required environment variables
if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
  console.error('Error: AWS credentials not found in environment variables.');
  console.error('Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
  process.exit(1);
}

// Initialize S3 Client
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

// Create PDF output directory if it doesn't exist
if (!fs.existsSync(PDF_OUTPUT_DIR)) {
  fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true });
}

async function convertHtmlToPdf(htmlFilePath, pdfFilePath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Load the HTML file
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const fileUrl = `file://${htmlFilePath}`;

    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Generate PDF with A4 size
    await page.pdf({
      path: pdfFilePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    return true;
  } catch (error) {
    console.error(`Error converting ${htmlFilePath}:`, error.message);
    return false;
  } finally {
    await browser.close();
  }
}

async function uploadToS3(filePath, s3Key) {
  try {
    const fileContent = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'application/pdf'
      // Note: ACL removed as bucket has ACLs disabled
      // Public access is managed at bucket policy level
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error(`Error uploading ${s3Key} to S3:`, error.message);
    return false;
  }
}

async function processDatasheets() {
  console.log('Starting datasheet PDF generation and S3 upload...\n');
  console.log(`HTML Directory: ${HTML_DIR}`);
  console.log(`PDF Output Directory: ${PDF_OUTPUT_DIR}`);
  console.log(`S3 Bucket: ${S3_BUCKET}`);
  console.log(`S3 Region: ${S3_REGION}\n`);

  // Get all HTML files
  const htmlFiles = fs.readdirSync(HTML_DIR).filter(file => file.endsWith('.html'));

  console.log(`Found ${htmlFiles.length} HTML files to process\n`);

  let successCount = 0;
  let failCount = 0;
  let uploadSuccessCount = 0;
  let uploadFailCount = 0;

  for (let i = 0; i < htmlFiles.length; i++) {
    const htmlFile = htmlFiles[i];
    const htmlFilePath = path.join(HTML_DIR, htmlFile);
    const pdfFileName = htmlFile.replace('.html', '.pdf');
    const pdfFilePath = path.join(PDF_OUTPUT_DIR, pdfFileName);
    const s3Key = `${S3_PREFIX}${pdfFileName}`;

    console.log(`[${i + 1}/${htmlFiles.length}] Processing: ${htmlFile}`);

    // Convert to PDF
    console.log(`  → Converting to PDF...`);
    const pdfSuccess = await convertHtmlToPdf(htmlFilePath, pdfFilePath);

    if (pdfSuccess) {
      successCount++;
      console.log(`  ✓ PDF generated: ${pdfFileName}`);

      // Upload to S3
      console.log(`  → Uploading to S3...`);
      const uploadSuccess = await uploadToS3(pdfFilePath, s3Key);

      if (uploadSuccess) {
        uploadSuccessCount++;
        console.log(`  ✓ Uploaded to S3: ${s3Key}`);
      } else {
        uploadFailCount++;
        console.log(`  ✗ Failed to upload to S3`);
      }
    } else {
      failCount++;
      console.log(`  ✗ Failed to generate PDF`);
    }

    console.log('');
  }

  console.log('='.repeat(70));
  console.log('Summary:');
  console.log(`PDF Generation:`);
  console.log(`  ✓ Successfully generated: ${successCount}`);
  console.log(`  ✗ Failed: ${failCount}`);
  console.log(`\nS3 Upload:`);
  console.log(`  ✓ Successfully uploaded: ${uploadSuccessCount}`);
  console.log(`  ✗ Failed: ${uploadFailCount}`);
  console.log('='.repeat(70));

  if (uploadSuccessCount > 0) {
    console.log(`\nPDFs are available at:`);
    console.log(`https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${S3_PREFIX}[filename].pdf`);
  }
}

// Run the script
processDatasheets().catch(console.error);
