#!/bin/bash

echo "🎬 Video Optimization Script"
echo "================================"
echo ""

# Create backup directory
mkdir -p "public/video_backups"

# Function to optimize video
optimize_video() {
    local input="$1"
    local output="$2"
    local target_bitrate="$3"
    local scale="$4"

    echo "Processing: $(basename "$input")"

    # Get original file size
    original_size=$(du -h "$input" | cut -f1)
    echo "  Original size: $original_size"

    # Backup original
    backup_path="public/video_backups/$(basename "$input").backup"
    if [ ! -f "$backup_path" ]; then
        cp "$input" "$backup_path"
    fi

    # Create temporary output file
    temp_output="${output}.temp.webm"

    # Optimize with ffmpeg
    # Using VP9 codec with 2-pass encoding for best quality/size ratio
    if [ -n "$scale" ]; then
        # With scaling
        ffmpeg -i "$input" -c:v libvpx-vp9 -b:v "$target_bitrate" \
            -vf "scale=$scale" \
            -c:a libopus -b:a 64k \
            -row-mt 1 -cpu-used 2 \
            -deadline good -quality good \
            -crf 35 -maxrate "${target_bitrate}" -bufsize "$(echo "$target_bitrate" | sed 's/k/*2k/')" \
            -y "$temp_output" 2>&1 | grep -E "(time=|size=|Duration:)" || true
    else
        # Without scaling
        ffmpeg -i "$input" -c:v libvpx-vp9 -b:v "$target_bitrate" \
            -c:a libopus -b:a 64k \
            -row-mt 1 -cpu-used 2 \
            -deadline good -quality good \
            -crf 33 -maxrate "${target_bitrate}" -bufsize "$(echo "$target_bitrate" | sed 's/k/*2k/')" \
            -y "$temp_output" 2>&1 | grep -E "(time=|size=|Duration:)" || true
    fi

    if [ $? -eq 0 ] && [ -f "$temp_output" ]; then
        mv "$temp_output" "$output"
        new_size=$(du -h "$output" | cut -f1)
        echo "  New size: $new_size"

        # Calculate reduction
        original_bytes=$(stat -f%z "$backup_path")
        new_bytes=$(stat -f%z "$output")
        reduction=$(echo "scale=1; (1 - $new_bytes / $original_bytes) * 100" | bc)
        echo "  Reduction: ${reduction}%"
        echo ""
    else
        echo "  ❌ Error processing video"
        rm -f "$temp_output"
        echo ""
    fi
}

# Optimize GB2.webm (background video - aggressive compression)
echo "📌 Optimizing background video (GB2.webm)..."
optimize_video \
    "public/FZC Inmarco Product Shoot/GB2.webm" \
    "public/FZC Inmarco Product Shoot/GB2.webm" \
    "1200k" \
    "1280:720"

# Optimize product render videos (less aggressive)
echo "📌 Optimizing product render videos..."

optimize_video \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/RTJ 3167_Render_2.webm" \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/RTJ 3167_Render_2.webm" \
    "600k" \
    ""

optimize_video \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/IG Kit_Render_3.webm" \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/IG Kit_Render_3.webm" \
    "600k" \
    ""

optimize_video \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/PTFE_Render_1.webm" \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/PTFE_Render_1.webm" \
    "500k" \
    ""

optimize_video \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/Yellow Wiping Pad_Render_1.webm" \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/Yellow Wiping Pad_Render_1.webm" \
    "500k" \
    ""

optimize_video \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/Ultra FE 1003_Render.webm" \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/Ultra FE 1003_Render.webm" \
    "600k" \
    ""

optimize_video \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/GM 310C_Render_2.webm" \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/GM 310C_Render_2.webm" \
    "500k" \
    ""

optimize_video \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/IN 123_Render_1.webm" \
    "public/FZC Inmarco Product Shoot/Renders/WEBM/IN 123_Render_1.webm" \
    "700k" \
    ""

echo "✅ Video optimization complete!"
echo ""
echo "📊 Summary:"
echo "Backups saved to: public/video_backups/"
echo "Original videos have been replaced with optimized versions"
