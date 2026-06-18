#!/bin/bash

##############################################################################
# Video Optimization Script for GB2.webm
# Optimizes background video for fast loading and streaming
##############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🎬 Video Optimization Script"
echo "============================="
echo ""

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ FFmpeg is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  macOS:   brew install ffmpeg"
    echo "  Ubuntu:  sudo apt install ffmpeg"
    echo "  Windows: choco install ffmpeg"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ FFmpeg found${NC}"
echo ""

# Video file path
VIDEO_DIR="public/FZC Inmarco Product Shoot"
INPUT_VIDEO="$VIDEO_DIR/GB2.webm"
BACKUP_VIDEO="$VIDEO_DIR/GB2_original_backup.webm"
OPTIMIZED_VIDEO="$VIDEO_DIR/GB2_optimized.webm"
POSTER_IMAGE="$VIDEO_DIR/GB2-poster.webp"

# Check if input video exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo -e "${RED}❌ GB2.webm not found at: $INPUT_VIDEO${NC}"
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(du -h "$INPUT_VIDEO" | cut -f1)
echo "📊 Original file size: $ORIGINAL_SIZE"
echo ""

# Function to create backup
create_backup() {
    echo "💾 Creating backup..."
    if [ -f "$BACKUP_VIDEO" ]; then
        echo -e "${YELLOW}⚠ Backup already exists, skipping...${NC}"
    else
        cp "$INPUT_VIDEO" "$BACKUP_VIDEO"
        echo -e "${GREEN}✓ Backup created: GB2_original_backup.webm${NC}"
    fi
    echo ""
}

# Function to optimize video
optimize_video() {
    local CRF=$1
    local SCALE=$2
    local OUTPUT=$3

    echo "🔧 Optimizing video..."
    echo "   CRF: $CRF (quality)"
    echo "   Resolution: $SCALE"
    echo ""

    ffmpeg -i "$INPUT_VIDEO" \
        -c:v libvpx-vp9 \
        -crf $CRF \
        -b:v 0 \
        -vf "scale=$SCALE" \
        -row-mt 1 \
        -cpu-used 2 \
        -tile-columns 2 \
        -g 240 \
        -threads 8 \
        -quality good \
        -speed 1 \
        -an \
        -movflags +faststart \
        -y \
        "$OUTPUT" \
        2>&1 | grep -E "(time=|size=)" || true

    if [ -f "$OUTPUT" ]; then
        OPTIMIZED_SIZE=$(du -h "$OUTPUT" | cut -f1)
        echo ""
        echo -e "${GREEN}✓ Optimization complete!${NC}"
        echo "   New size: $OPTIMIZED_SIZE"

        # Calculate reduction
        ORIGINAL_BYTES=$(stat -f%z "$INPUT_VIDEO" 2>/dev/null || stat -c%s "$INPUT_VIDEO")
        OPTIMIZED_BYTES=$(stat -f%z "$OUTPUT" 2>/dev/null || stat -c%s "$OUTPUT")
        REDUCTION=$(( 100 - (OPTIMIZED_BYTES * 100 / ORIGINAL_BYTES) ))
        echo "   Reduction: ${REDUCTION}%"
    else
        echo -e "${RED}❌ Optimization failed${NC}"
        return 1
    fi
    echo ""
}

# Function to create poster image
create_poster() {
    echo "🖼️  Creating poster image..."

    ffmpeg -i "$INPUT_VIDEO" \
        -ss 00:00:00 \
        -vframes 1 \
        -q:v 2 \
        -y \
        "$VIDEO_DIR/GB2-poster.jpg" \
        2>&1 | grep -v "^frame=" || true

    if [ -f "$VIDEO_DIR/GB2-poster.jpg" ]; then
        # Convert to WebP for smaller size
        ffmpeg -i "$VIDEO_DIR/GB2-poster.jpg" \
            -quality 85 \
            -y \
            "$POSTER_IMAGE" \
            2>&1 | grep -v "^frame=" || true

        if [ -f "$POSTER_IMAGE" ]; then
            POSTER_SIZE=$(du -h "$POSTER_IMAGE" | cut -f1)
            echo -e "${GREEN}✓ Poster image created: $POSTER_SIZE${NC}"
            rm "$VIDEO_DIR/GB2-poster.jpg" # Remove JPG, keep WebP
        fi
    fi
    echo ""
}

# Function to create multiple quality versions
create_multi_quality() {
    echo "📐 Creating multiple quality versions..."
    echo ""

    # 1080p version
    echo "  Creating 1080p version..."
    ffmpeg -i "$INPUT_VIDEO" \
        -c:v libvpx-vp9 -crf 33 -vf "scale=1920:-1" \
        -b:v 0 -an -movflags +faststart -y \
        "$VIDEO_DIR/GB2_1080p.webm" \
        2>&1 | grep -E "(time=|size=)" || true

    # 720p version
    echo "  Creating 720p version..."
    ffmpeg -i "$INPUT_VIDEO" \
        -c:v libvpx-vp9 -crf 35 -vf "scale=1280:-1" \
        -b:v 0 -an -movflags +faststart -y \
        "$VIDEO_DIR/GB2_720p.webm" \
        2>&1 | grep -E "(time=|size=)" || true

    # 480p version (mobile)
    echo "  Creating 480p version (mobile)..."
    ffmpeg -i "$INPUT_VIDEO" \
        -c:v libvpx-vp9 -crf 37 -vf "scale=854:-1" \
        -b:v 0 -an -movflags +faststart -y \
        "$VIDEO_DIR/GB2_480p.webm" \
        2>&1 | grep -E "(time=|size=)" || true

    echo ""
    echo -e "${GREEN}✓ Multi-quality versions created!${NC}"
    echo ""
    echo "File sizes:"
    du -h "$VIDEO_DIR"/GB2_*.webm | sed 's/^/  /'
    echo ""
}

# Function to compare videos
compare_videos() {
    echo "📊 File Size Comparison"
    echo "======================="
    echo ""
    echo "Original:  $(du -h "$INPUT_VIDEO" | cut -f1)"
    echo "Optimized: $(du -h "$OPTIMIZED_VIDEO" | cut -f1)"
    echo ""

    # Calculate percentage
    ORIGINAL_BYTES=$(stat -f%z "$INPUT_VIDEO" 2>/dev/null || stat -c%s "$INPUT_VIDEO")
    OPTIMIZED_BYTES=$(stat -f%z "$OPTIMIZED_VIDEO" 2>/dev/null || stat -c%s "$OPTIMIZED_VIDEO")
    REDUCTION=$(( 100 - (OPTIMIZED_BYTES * 100 / ORIGINAL_BYTES) ))

    echo -e "${GREEN}Size reduction: ${REDUCTION}%${NC}"
    echo ""
}

# Function to replace original
replace_original() {
    echo "🔄 Replacing original with optimized version..."
    read -p "Are you sure? This will replace GB2.webm (y/n): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mv "$OPTIMIZED_VIDEO" "$INPUT_VIDEO"
        echo -e "${GREEN}✓ Original replaced with optimized version!${NC}"
        echo "  Backup is available at: GB2_original_backup.webm"
    else
        echo "Operation cancelled. Original file unchanged."
    fi
    echo ""
}

# Main menu
main_menu() {
    echo ""
    echo "What would you like to do?"
    echo ""
    echo "  1) Create backup"
    echo "  2) Optimize video (recommended settings)"
    echo "  3) Optimize video (custom settings)"
    echo "  4) Create poster image"
    echo "  5) Create multiple quality versions (1080p, 720p, 480p)"
    echo "  6) Compare original vs optimized"
    echo "  7) Replace original with optimized"
    echo "  8) Do everything (recommended)"
    echo "  9) Exit"
    echo ""
    read -p "Enter choice [1-9]: " choice

    case $choice in
        1)
            create_backup
            main_menu
            ;;
        2)
            create_backup
            optimize_video 35 "1280:-1" "$OPTIMIZED_VIDEO"
            main_menu
            ;;
        3)
            create_backup
            echo "Enter CRF value (20-40, lower=better quality, default=35):"
            read CRF
            CRF=${CRF:-35}
            echo "Enter resolution (e.g., 1920:-1 for 1080p, 1280:-1 for 720p):"
            read SCALE
            SCALE=${SCALE:-1280:-1}
            optimize_video $CRF "$SCALE" "$OPTIMIZED_VIDEO"
            main_menu
            ;;
        4)
            create_poster
            main_menu
            ;;
        5)
            create_backup
            create_multi_quality
            main_menu
            ;;
        6)
            if [ -f "$OPTIMIZED_VIDEO" ]; then
                compare_videos
            else
                echo -e "${RED}❌ Optimized video not found. Run optimization first.${NC}"
                echo ""
            fi
            main_menu
            ;;
        7)
            if [ -f "$OPTIMIZED_VIDEO" ]; then
                replace_original
            else
                echo -e "${RED}❌ Optimized video not found. Run optimization first.${NC}"
                echo ""
            fi
            main_menu
            ;;
        8)
            echo -e "${BLUE}🚀 Running full optimization...${NC}"
            echo ""
            create_backup
            optimize_video 35 "1280:-1" "$OPTIMIZED_VIDEO"
            create_poster
            compare_videos
            replace_original

            echo ""
            echo -e "${GREEN}✅ All optimizations complete!${NC}"
            echo ""
            echo "Next steps:"
            echo "  1. Test the video in your browser"
            echo "  2. Upload to CloudFront (if different from local)"
            echo "  3. Invalidate CloudFront cache:"
            echo "     aws cloudfront create-invalidation --distribution-id YOUR_ID --paths '/assets/products/GB2.webm'"
            echo ""
            ;;
        9)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            main_menu
            ;;
    esac
}

# Show info
echo "Input video: $INPUT_VIDEO"
echo "Original size: $ORIGINAL_SIZE"
echo ""

# Run menu
main_menu
