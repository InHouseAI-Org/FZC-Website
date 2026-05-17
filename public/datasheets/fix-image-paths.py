#!/usr/bin/env python3
"""
Fix image paths in all JSON files to use localhost URLs
This allows Puppeteer to load images properly when generating PDFs
"""

import json
import os
from pathlib import Path

def fix_image_paths(json_file):
    """Update image paths to use localhost URLs"""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Update logo path
    if 'images' in data and 'logo' in data['images']:
        old_logo = data['images']['logo']
        # Convert ../../src/assets/inmarco-tagline-logo1.png to http://localhost:8765/src/assets/inmarco-tagline-logo1.png
        if old_logo.startswith('../../'):
            new_logo = 'http://localhost:8765/' + old_logo.replace('../../', '')
            data['images']['logo'] = new_logo
            print(f"  Logo: {old_logo} → {new_logo}")

    # Update hero image path
    if 'images' in data and 'hero' in data['images']:
        old_hero = data['images']['hero']
        # Convert ../../public/fertilizer.jpg to http://localhost:8765/public/fertilizer.jpg
        if old_hero.startswith('../../'):
            new_hero = 'http://localhost:8765/' + old_hero.replace('../../', '')
            data['images']['hero'] = new_hero
            print(f"  Hero: {old_hero} → {new_hero}")

    # Save updated JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    print("="*80)
    print("FIXING IMAGE PATHS FOR PDF GENERATION")
    print("="*80)

    data_dir = "data"
    json_files = list(Path(data_dir).glob("*.json"))

    print(f"\nFound {len(json_files)} JSON files to update\n")

    for json_file in json_files:
        print(f"📝 {json_file.name}")
        fix_image_paths(json_file)

    print("\n" + "="*80)
    print(f"✅ Updated {len(json_files)} JSON files")
    print("Image paths now use localhost URLs for proper PDF rendering")
    print("="*80)

if __name__ == "__main__":
    main()
