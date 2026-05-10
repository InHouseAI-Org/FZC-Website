#!/usr/bin/env python3
import json
import os
from pathlib import Path

# Load the JSON file
with open('src/data/productsData.json', 'r') as f:
    data = json.load(f)

# Base path for images
image_base_path = "public/FZC Inmarco Product Shoot"

def find_webp_images(product_name, current_image_path):
    """Find exactly 3 WebP images for a product"""

    # Try to extract folder name from current image path
    if current_image_path and '/FZC Inmarco Product Shoot/' in current_image_path:
        # Extract folder name from path like "/FZC Inmarco Product Shoot/PE 505/PE 505_1.webp"
        parts = current_image_path.split('/FZC Inmarco Product Shoot/')
        if len(parts) > 1:
            folder_path = parts[1].split('/')[0]
            full_folder_path = os.path.join(image_base_path, folder_path)
        else:
            return None
    else:
        # Try to match by product name
        full_folder_path = os.path.join(image_base_path, product_name)

    # Check if folder exists
    if not os.path.exists(full_folder_path):
        return None

    # Find all WebP images in the folder
    webp_files = sorted([f for f in os.listdir(full_folder_path) if f.endswith('.webp')])

    if len(webp_files) < 3:
        return None

    # Take exactly 3 images
    selected_images = webp_files[:3]

    # Create full paths
    image_paths = [f"/FZC Inmarco Product Shoot/{os.path.basename(full_folder_path)}/{img}" for img in selected_images]

    return image_paths

# Update products
updated_count = 0
skipped_count = 0

for product in data['products']:
    current_image = product.get('image', '')

    # Skip if it's an external URL
    if current_image.startswith('http'):
        skipped_count += 1
        continue

    # Skip if already has images array with 3 items
    if 'images' in product and len(product['images']) == 3:
        continue

    # Find 3 WebP images
    images = find_webp_images(product['name'], current_image)

    if images:
        product['images'] = images
        # Keep the old image field as fallback
        if not product.get('image'):
            product['image'] = images[0]
        updated_count += 1
        print(f"✓ Updated {product['name']}: {len(images)} images")
    else:
        skipped_count += 1
        print(f"✗ Skipped {product['name']}: Not enough WebP images found")

# Save the updated JSON
with open('src/data/productsData.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"Summary:")
print(f"  Updated: {updated_count} products")
print(f"  Skipped: {skipped_count} products")
print(f"{'='*60}")
