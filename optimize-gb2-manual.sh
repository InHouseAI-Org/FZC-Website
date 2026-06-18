#!/bin/bash

##############################################################################
# Manual GB2.webm Optimization with Better Settings
##############################################################################

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🎬 GB2.webm Manual Optimization"
echo "==============================="
echo ""

VIDEO_PATH="public/FZC Inmarco Product Shoot/GB2.webm"

# Check if original backup exists, if not use the current file as source
if [ -f "public/FZC Inmarco Product Shoot/GB2_original_backup.webm" ]; then
    SOURCE="public/FZC Inmarco Product Shoot/GB2_original_backup.webm"
    echo "Using backup as source: GB2_original_backup.webm"
else
    SOURCE="$VIDEO_PATH"
    echo "Using current file as source: GB2.webm"
    # Create backup first
    cp "$SOURCE" "public/FZC Inmarco Product Shoot/GB2_backup_$(date +%Y%m%d_%H%M%S).webm"
    echo -e "${GREEN}✓ Backup created${NC}"
fi

echo ""
echo "Current size: $(du -h "$SOURCE" | cut -f1)"
echo ""
echo "Optimization options:"
echo ""
echo "1) Aggressive optimization (CRF 40, 720p) - Smallest file"
echo "2) Balanced optimization (CRF 37, 720p) - Good quality"
echo "3) High quality (CRF 33, 1080p) - Best quality, larger file"
echo "4) Custom settings"
echo "5) Exit"
echo ""
read -p "Choose option [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "🔧 Running aggressive optimization..."
        ffmpeg -i "$SOURCE" \
            -c:v libvpx-vp9 \
            -crf 40 \
            -b:v 0 \
            -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
            -r 24 \
            -cpu-used 1 \
            -row-mt 1 \
            -threads 8 \
            -an \
            -f webm \
            -movflags +faststart \
            -y \
            "$VIDEO_PATH"
        ;;
    2)
        echo ""
        echo "🔧 Running balanced optimization..."
        ffmpeg -i "$SOURCE" \
            -c:v libvpx-vp9 \
            -crf 37 \
            -b:v 0 \
            -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
            -r 24 \
            -cpu-used 1 \
            -row-mt 1 \
            -threads 8 \
            -an \
            -f webm \
            -movflags +faststart \
            -y \
            "$VIDEO_PATH"
        ;;
    3)
        echo ""
        echo "🔧 Running high quality optimization..."
        ffmpeg -i "$SOURCE" \
            -c:v libvpx-vp9 \
            -crf 33 \
            -b:v 0 \
            -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
            -r 30 \
            -cpu-used 1 \
            -row-mt 1 \
            -threads 8 \
            -an \
            -f webm \
            -movflags +faststart \
            -y \
            "$VIDEO_PATH"
        ;;
    4)
        echo ""
        read -p "Enter CRF (20-51, higher=smaller, default=37): " crf
        crf=${crf:-37}
        read -p "Enter width (e.g., 1280 for 720p, 1920 for 1080p): " width
        width=${width:-1280}
        height=$((width * 9 / 16))

        echo ""
        echo "🔧 Running custom optimization (CRF=$crf, ${width}x${height})..."
        ffmpeg -i "$SOURCE" \
            -c:v libvpx-vp9 \
            -crf $crf \
            -b:v 0 \
            -vf "scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2" \
            -r 24 \
            -cpu-used 1 \
            -row-mt 1 \
            -threads 8 \
            -an \
            -f webm \
            -movflags +faststart \
            -y \
            "$VIDEO_PATH"
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    NEW_SIZE=$(du -h "$VIDEO_PATH" | cut -f1)
    echo ""
    echo -e "${GREEN}✅ Optimization complete!${NC}"
    echo ""
    echo "Results:"
    echo "  Original: $(du -h "$SOURCE" | cut -f1)"
    echo "  Optimized: $NEW_SIZE"
    echo ""
    echo "Next steps:"
    echo "  1. Test the video in your browser"
    echo "  2. If on CloudFront, upload and invalidate cache"
    echo "  3. Reload page and check Network tab - should load in <2s"
else
    echo -e "${RED}❌ Optimization failed${NC}"
    exit 1
fi
