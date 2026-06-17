#!/bin/bash

echo "📦 Preparing optimized assets for S3 upload"
echo "============================================"
echo ""

# Create staging directory
STAGING_DIR="s3-upload-staging"
rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR/assets/images"
mkdir -p "$STAGING_DIR/assets/products/Industries"
mkdir -p "$STAGING_DIR/assets/products/Renders/WEBM"

echo "📁 Organizing optimized images..."

# Copy industry images (WebP versions)
echo "  → Industry images..."
cp public/*.webp "$STAGING_DIR/assets/images/" 2>/dev/null || true

# Copy product images (WebP versions)
echo "  → Product images..."
find "public/FZC Inmarco Product Shoot" -name "*.webp" -exec cp {} "$STAGING_DIR/assets/products/Industries/" \; 2>/dev/null || true

# Copy optimized videos
echo "  → Optimized videos..."
cp "public/FZC Inmarco Product Shoot/GB2.webm" "$STAGING_DIR/assets/products/" 2>/dev/null || true
cp "public/FZC Inmarco Product Shoot/Renders/WEBM/"*.webm "$STAGING_DIR/assets/products/Renders/WEBM/" 2>/dev/null || true

echo ""
echo "📊 Upload Statistics:"
echo "-------------------"
echo "Industry images: $(find "$STAGING_DIR/assets/images" -name "*.webp" | wc -l | tr -d ' ') files"
echo "Product images: $(find "$STAGING_DIR/assets/products/Industries" -name "*.webp" | wc -l | tr -d ' ') files"
echo "Videos: $(find "$STAGING_DIR/assets/products" -name "*.webm" | wc -l | tr -d ' ') files"
echo ""

# Calculate total size
total_size=$(du -sh "$STAGING_DIR" | cut -f1)
echo "Total size to upload: $total_size"
echo ""

echo "✅ Files ready in: $STAGING_DIR/"
echo ""
echo "📤 Next steps:"
echo "============="
echo ""
echo "Option 1 - AWS CLI (if configured):"
echo "-----------------------------------"
echo "# Upload to S3 with correct content types and caching"
echo "aws s3 sync $STAGING_DIR/assets/ s3://YOUR-BUCKET-NAME/assets/ \\"
echo "  --cache-control 'public, max-age=31536000' \\"
echo "  --metadata-directive REPLACE \\"
echo "  --content-type 'image/webp' \\"
echo "  --exclude '*' --include '*.webp'"
echo ""
echo "aws s3 sync $STAGING_DIR/assets/ s3://YOUR-BUCKET-NAME/assets/ \\"
echo "  --cache-control 'public, max-age=31536000' \\"
echo "  --metadata-directive REPLACE \\"
echo "  --content-type 'video/webm' \\"
echo "  --exclude '*' --include '*.webm'"
echo ""
echo "# Invalidate CloudFront cache"
echo "aws cloudfront create-invalidation --distribution-id YOUR-DIST-ID --paths '/assets/*'"
echo ""
echo "Option 2 - Manual upload via AWS Console:"
echo "------------------------------------------"
echo "1. Open AWS S3 Console"
echo "2. Navigate to your bucket"
echo "3. Upload contents of '$STAGING_DIR/assets/' to 's3://your-bucket/assets/'"
echo "4. Set Cache-Control: public, max-age=31536000"
echo "5. Invalidate CloudFront cache: /assets/*"
echo ""
