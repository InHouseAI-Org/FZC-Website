#!/bin/bash

echo "🗂️  Reorganizing S3 staging folder to match original structure"
echo "=============================================================="

# Remove old staging and recreate
rm -rf s3-upload-staging
mkdir -p s3-upload-staging/assets/products
mkdir -p s3-upload-staging/assets/images

echo ""
echo "📁 Step 1: Copying optimized images with proper folder structure..."

# Copy each folder from public to staging, preserving structure
cd "public/FZC Inmarco Product Shoot"

# Find all .webp files and copy them with their folder structure
find . -name "*.webp" -type f | while read file; do
    # Get directory path
    dir=$(dirname "$file")
    # Create directory in staging
    mkdir -p "../../s3-upload-staging/assets/products/$dir"
    # Copy file
    cp "$file" "../../s3-upload-staging/assets/products/$dir/"
done

cd ../..

echo "  ✅ Product images organized"

echo ""
echo "📁 Step 2: Copying industry images..."

# Copy industry images from public root
cp public/*.webp s3-upload-staging/assets/images/ 2>/dev/null || true
cp "public/worldwide-global-map-outline-black-background/sl_070722_51460_20.webp" \
   s3-upload-staging/assets/images/worldwide-global-map-outline-black-background/ 2>/dev/null || true

echo "  ✅ Industry images copied"

echo ""
echo "📁 Step 3: Copying optimized videos..."

# Copy optimized videos
cp "public/FZC Inmarco Product Shoot/GB2.webm" s3-upload-staging/assets/products/ 2>/dev/null || true
mkdir -p s3-upload-staging/assets/products/Renders/WEBM
cp "public/FZC Inmarco Product Shoot/Renders/WEBM/"*.webm s3-upload-staging/assets/products/Renders/WEBM/ 2>/dev/null || true

echo "  ✅ Videos copied"

echo ""
echo "📊 Summary:"
echo "=========="
echo "Product folders:"
find s3-upload-staging/assets/products -type d -mindepth 1 -maxdepth 1 | wc -l | xargs echo "  Folders:"
echo "Product images:"
find s3-upload-staging/assets/products -name "*.webp" -type f | wc -l | xargs echo "  WebP files:"
echo "Videos:"
find s3-upload-staging/assets/products -name "*.webm" -type f | wc -l | xargs echo "  WebM files:"
echo "Industry images:"
find s3-upload-staging/assets/images -name "*.webp" -type f | wc -l | xargs echo "  WebP files:"

echo ""
echo "✅ Reorganization complete!"
echo ""
echo "📤 Structure now matches original and is ready for S3 upload"
