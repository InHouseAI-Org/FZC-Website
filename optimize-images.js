import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  webp: {
    quality: 85,
    effort: 6, // 0-6, higher = better compression but slower
  },
  avif: {
    quality: 80,
    effort: 4, // 0-9, higher = better compression but slower
  }
};

// Track statistics
const stats = {
  processed: 0,
  errors: 0,
  originalSize: 0,
  newSize: 0
};

// Function to get file size
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

// Function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to optimize a single image
async function optimizeImage(inputPath, outputDir = null) {
  try {
    const originalSize = getFileSize(inputPath);
    stats.originalSize += originalSize;

    const ext = path.extname(inputPath).toLowerCase();
    const basename = path.basename(inputPath, ext);
    const dirname = outputDir || path.dirname(inputPath);

    // Ensure output directory exists
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    const webpPath = path.join(dirname, `${basename}.webp`);
    const avifPath = path.join(dirname, `${basename}.avif`);

    console.log(`\nProcessing: ${path.basename(inputPath)}`);
    console.log(`  Original: ${formatBytes(originalSize)}`);

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();

    // Create WebP version
    await sharp(inputPath)
      .webp(config.webp)
      .toFile(webpPath);

    const webpSize = getFileSize(webpPath);
    stats.newSize += webpSize;

    const reduction = ((1 - webpSize / originalSize) * 100).toFixed(1);
    console.log(`  WebP: ${formatBytes(webpSize)} (-${reduction}%)`);

    // Create AVIF version (better compression but slower)
    await sharp(inputPath)
      .avif(config.avif)
      .toFile(avifPath);

    const avifSize = getFileSize(avifPath);
    const avifReduction = ((1 - avifSize / originalSize) * 100).toFixed(1);
    console.log(`  AVIF: ${formatBytes(avifSize)} (-${avifReduction}%)`);

    stats.processed++;
    return { success: true, originalSize, webpSize, avifSize };
  } catch (error) {
    console.error(`  ❌ Error processing ${inputPath}:`, error.message);
    stats.errors++;
    return { success: false, error: error.message };
  }
}

// Function to find all images in a directory
function findImages(dir, extensions = ['.jpg', '.jpeg', '.png']) {
  const images = [];

  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);

      if (item.isDirectory()) {
        scanDir(fullPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (extensions.includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  }

  scanDir(dir);
  return images;
}

// Main function
async function main() {
  console.log('🎨 Image Optimization Script');
  console.log('================================\n');

  const publicDir = path.join(__dirname, 'public');

  // Priority 1: Optimize large JPG files in public root
  console.log('📌 Step 1: Optimizing large industry images...');
  const industryImages = [
    'Sustainability.jpg',
    'power.jpg',
    'water.jpg',
    'metallurgy.jpg',
    'cement.jpg',
    'marine.jpg',
    'sugar.jpg',
    'fertilizer.jpg',
    'chemical.jpg',
    'paper.jpg',
    'oil and gas.jpg',
    'food and pahrma.jpg'
  ];

  for (const img of industryImages) {
    const imgPath = path.join(publicDir, img);
    if (fs.existsSync(imgPath)) {
      await optimizeImage(imgPath);
    }
  }

  // Priority 2: Optimize product images
  console.log('\n\n📌 Step 2: Optimizing product images...');
  const productShootDir = path.join(publicDir, 'FZC Inmarco Product Shoot');

  if (fs.existsSync(productShootDir)) {
    const productImages = findImages(productShootDir, ['.jpg', '.jpeg', '.png']);
    console.log(`Found ${productImages.length} product images to optimize\n`);

    for (const imgPath of productImages) {
      await optimizeImage(imgPath);
    }
  }

  // Print summary
  console.log('\n\n📊 OPTIMIZATION SUMMARY');
  console.log('================================');
  console.log(`✅ Successfully processed: ${stats.processed} images`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`📦 Original total size: ${formatBytes(stats.originalSize)}`);
  console.log(`📦 WebP total size: ${formatBytes(stats.newSize)}`);

  const totalReduction = ((1 - stats.newSize / stats.originalSize) * 100).toFixed(1);
  console.log(`💾 Total reduction: ${totalReduction}%`);
  console.log(`💰 Space saved: ${formatBytes(stats.originalSize - stats.newSize)}`);
}

// Run the script
main().catch(console.error);
