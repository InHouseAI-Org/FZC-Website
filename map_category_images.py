#!/usr/bin/env python3
import json
import os
import random

# Load products data
with open('src/data/productsData.json', 'r') as f:
    products_data = json.load(f)

# Load product mapping
with open('product_mapping.json', 'r') as f:
    product_mapping = json.load(f)

# Create category to image mapping
category_images = {}

# For each category, find products that belong to it and get their images
for category in products_data['categories']:
    category_id = category['id']
    category_slug = category['slug']
    category_name = category['name']

    # Find subcategories in this category
    subcategory_ids = [s['id'] for s in products_data['subcategories'] if s['categoryId'] == category_id]

    # Find products in these subcategories
    category_products = [p for p in products_data['products'] if p.get('subcategoryId') in subcategory_ids]

    # Collect all gallery images from products in this category
    all_images = []
    for product in category_products:
        if 'gallery' in product and product['gallery']:
            all_images.extend(product['gallery'])
        elif product.get('image') and not product['image'].startswith('http'):
            all_images.append(product['image'])

    # Pick a representative image (first one, or random)
    if all_images:
        # Use the first product's first image as representative
        representative_image = all_images[0]
    else:
        representative_image = None

    category_images[category_slug] = {
        'name': category_name,
        'image': representative_image,
        'all_images': all_images[:10]  # Store up to 10 images for variety
    }

# Print the mapping
print(json.dumps(category_images, indent=2))

# Save to file
with open('category_images.json', 'w') as f:
    json.dump(category_images, f, indent=2)

print("\n\nCategory image mapping saved to category_images.json")
