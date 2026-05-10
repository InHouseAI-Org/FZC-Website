#!/usr/bin/env python3
"""
Script to update productsData.json with information from markdown files.
"""

import json
import os
import re
from pathlib import Path

# Base paths
BASE_DIR = Path("/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1")
PRODUCTS_DIR = BASE_DIR / "Products"
JSON_FILE = BASE_DIR / "src/data/productsData.json"

def extract_description(content):
    """Extract description from markdown content."""
    # Look for ## Description section
    desc_match = re.search(r'##\s+Description\s*\n+(.*?)(?=\n##|\Z)', content, re.DOTALL | re.IGNORECASE)
    if desc_match:
        desc = desc_match.group(1).strip()
        # Get first paragraph or first 2-3 sentences
        paragraphs = [p.strip() for p in desc.split('\n\n') if p.strip()]
        if paragraphs:
            return paragraphs[0]

    # Fallback: look for any text after title before first ## section
    intro_match = re.search(r'^#[^#].*?\n+(.*?)(?=\n##|\Z)', content, re.DOTALL)
    if intro_match:
        intro = intro_match.group(1).strip()
        paragraphs = [p.strip() for p in intro.split('\n\n') if p.strip()]
        if paragraphs:
            return paragraphs[0]

    return ""

def extract_features(content):
    """Extract features from markdown content."""
    features = []

    # Look for ## Features or ## Advantages section
    features_match = re.search(r'##\s+(Features|Advantages|Key Features)\s*\n+(.*?)(?=\n##|\Z)', content, re.DOTALL | re.IGNORECASE)
    if features_match:
        features_text = features_match.group(2).strip()
        # Extract bullet points
        lines = features_text.split('\n')
        for line in lines:
            line = line.strip()
            # Match various bullet point formats
            if re.match(r'^[-*•]\s+', line):
                feature = re.sub(r'^[-*•]\s+', '', line).strip()
                if feature and len(feature) > 5:  # Avoid very short items
                    features.append(feature)

    # Limit to 6 most important features
    return features[:6]

def extract_specifications(content):
    """Extract key specifications from operational parameters table."""
    specs = {}

    # Look for operational parameters table
    table_match = re.search(r'##\s+Operational Parameters.*?\n\n(.*?)(?=\n##|\Z)', content, re.DOTALL | re.IGNORECASE)
    if table_match:
        table_text = table_match.group(1)

        # Extract temperature
        temp_match = re.search(r'Temperature.*?[|:]\s*([^\n|]+)', table_text, re.IGNORECASE)
        if temp_match:
            specs['temperature'] = temp_match.group(1).strip()

        # Extract pressure
        pressure_match = re.search(r'Pressure.*?[|:]\s*([^\n|]+)', table_text, re.IGNORECASE)
        if pressure_match:
            specs['pressure'] = pressure_match.group(1).strip()

        # Extract pH
        ph_match = re.search(r'pH.*?[|:]\s*([^\n|]+)', table_text, re.IGNORECASE)
        if ph_match:
            specs['pH'] = ph_match.group(1).strip()

    return specs

def find_markdown_file(product_name, slug):
    """Find corresponding markdown file for a product."""
    # Special case mappings
    special_mappings = {
        'HY 105 HD': 'HY 105HD',
        'HY 107 HD': 'HY 107HD',
        'HY 510': 'HY 510EC',
        'OR 125F': 'OR 125',
        'IN 124S': 'style 124',
        'INMATEX EPTFE SHEET/GASKET': 'INMATEX EPTFE SHEET-GASKET',
        'PE 504C': 'PE 504P',  # May need verification
        'HY 107E': 'HY 107',  # May need verification
    }

    # Check special mappings first
    if product_name in special_mappings:
        mapped_name = special_mappings[product_name]
    else:
        mapped_name = product_name

    # Try different naming patterns
    possible_names = [
        mapped_name,
        product_name,
        product_name.replace(' ', ''),
        product_name.replace('/', '-'),
        product_name.replace(' / ', '_'),
        product_name.replace(' / ', ' '),
        slug.upper().replace('-', '_'),
        slug.upper().replace('-', ' '),
        slug.upper().replace('-', ''),
    ]

    # First pass: Look for exact matches
    for root, dirs, files in os.walk(PRODUCTS_DIR):
        for file in files:
            if file.endswith('.md'):
                file_base = os.path.splitext(file)[0]
                # Check for exact match
                for name in possible_names:
                    if name.upper() == file_base.upper():
                        return os.path.join(root, file)

    # Second pass: Look for partial matches (only if no exact match found)
    for root, dirs, files in os.walk(PRODUCTS_DIR):
        for file in files:
            if file.endswith('.md'):
                file_base = os.path.splitext(file)[0]
                # Check if any possible name matches
                for name in possible_names:
                    if name.upper() in file_base.upper():
                        return os.path.join(root, file)

    return None

def process_product(product):
    """Process a single product and update it with markdown data."""
    product_name = product.get('name', '')
    product_slug = product.get('slug', '')

    print(f"Processing: {product_name} ({product_slug})")

    # Find markdown file
    md_file = find_markdown_file(product_name, product_slug)

    if not md_file:
        print(f"  ⚠️  Markdown file not found for {product_name}")
        return product, False

    print(f"  ✓ Found markdown: {os.path.basename(md_file)}")

    # Read markdown content
    try:
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  ✗ Error reading file: {e}")
        return product, False

    # Extract data
    description = extract_description(content)
    features = extract_features(content)
    specs = extract_specifications(content)

    # Update product
    updated = False
    if description:
        product['description'] = description
        updated = True
        print(f"  ✓ Updated description ({len(description)} chars)")

    if features:
        product['features'] = features
        updated = True
        print(f"  ✓ Updated features ({len(features)} items)")

    if specs:
        if 'specifications' not in product:
            product['specifications'] = {}
        product['specifications'].update(specs)
        updated = True
        print(f"  ✓ Updated specifications")

    return product, updated

def main():
    """Main function to update all products."""
    print("="*80)
    print("Updating productsData.json with markdown content")
    print("="*80)

    # Load JSON
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_products = 0
    updated_products = 0

    # Create category map for reference
    category_map = {cat['id']: cat['name'] for cat in data.get('categories', [])}
    subcategory_map = {sub['id']: sub['name'] for sub in data.get('subcategories', [])}

    # Process all products
    products = data.get('products', [])
    print(f"\nFound {len(products)} products to process\n")
    print("-" * 80)

    for i, product in enumerate(products):
        total_products += 1

        # Get category and subcategory names for context
        subcat_id = product.get('subcategoryId', '')
        subcat_name = subcategory_map.get(subcat_id, 'Unknown')

        print(f"\n[{i+1}/{len(products)}] Subcategory: {subcat_name}")

        updated_product, was_updated = process_product(product)
        data['products'][i] = updated_product
        if was_updated:
            updated_products += 1

    # Save updated JSON
    print("\n" + "="*80)
    print(f"Saving updated JSON file...")
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✓ Successfully saved to {JSON_FILE}")
    print("="*80)
    print(f"\n📊 Summary:")
    print(f"  Total products processed: {total_products}")
    print(f"  Products updated: {updated_products}")
    print(f"  Products not found: {total_products - updated_products}")
    print("="*80)

if __name__ == "__main__":
    main()
