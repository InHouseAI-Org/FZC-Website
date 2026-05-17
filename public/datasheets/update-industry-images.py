#!/usr/bin/env python3
import os
import re

# Mapping of product codes to industry images
PRODUCT_IMAGE_MAP = {
    'PE_505': 'chemical.jpg',
    'PE_504': 'chemical.jpg',
    'HY_504': 'chemical.jpg',
    'PE_508': 'chemical.jpg',
    'PE_509': 'chemical.jpg',
    'HY_105': 'fertilizer.jpg',
    'HY_105T': 'fertilizer.jpg',
    'HY_107': 'fertilizer.jpg',
    'HY_107E': 'fertilizer.jpg',
    'HY_107_EPT': 'fertilizer.jpg',
    'HY_175': 'power.jpg',
    'PA_106': 'power.jpg',
    'OR_125': 'water.jpg',
    'OR_125G': 'water.jpg',
    'CG_101': 'power.jpg',
    'PE_102': 'chemical.jpg',
    'CG_101E': 'power.jpg',
    'CG_100': 'oil and gas.jpg',
    'CG_102': 'oil and gas.jpg',
    'IN_123': 'metallurgy.jpg',
    'IN_123I': 'metallurgy.jpg',
    'OR_120': 'water.jpg',
    'HY_120AR': 'water.jpg',
    'OR_120F': 'water.jpg',
    'IN_140': 'metallurgy.jpg',
    'CG_900': 'power.jpg',
    'HY_501': 'oil and gas.jpg',
    'CG_503': 'chemical.jpg',
    'PE_104': 'chemical.jpg',
    'OR_151': 'water.jpg',
    'OR_156': 'water.jpg',
    'HY_606': 'power.jpg',
    'HY_501C': 'power.jpg',
    'HY_801': 'oil and gas.jpg',
    'PA_499': 'oil and gas.jpg',
    'IN_125G': 'metallurgy.jpg',
    'HY_510': 'marine.jpg',
    'PE_104C': 'chemical.jpg',
    'HY_105PT': 'fertilizer.jpg',
    'PE_504C': 'chemical.jpg',
    'PA_106G': 'power.jpg',
    'PA_106E': 'paper.jpg',
    'PA_104A': 'power.jpg',
    'PE_504P': 'chemical.jpg',
    'ULTRA_LE_1002': 'oil and gas.jpg',
    'ULTRA_FE_1003': 'oil and gas.jpg',
    'ULTRA_LT_1004': 'oil and gas.jpg',
    'ULTRA_NE_1005': 'oil and gas.jpg',
    'HY_105_HD': 'fertilizer.jpg',
    'HY_105HD': 'fertilizer.jpg',
    'HY_107_HD': 'fertilizer.jpg',
    'HY_107HD': 'fertilizer.jpg',
    'OR_125SR': 'water.jpg',
    'IN_124S': 'power.jpg',
    'IN_124': 'power.jpg',
    'IN_126S': 'power.jpg',
    'GM_300Z': 'power.jpg',
    'GM_310C': 'power.jpg',
    'INMATEX_ePTFE': 'chemical.jpg',
    'INMATEX_1400': 'chemical.jpg',
    'Insulation_Gasket_Kit_1800_FS': 'oil and gas.jpg',
    '750SS_WELDING_BLANKET': 'metallurgy.jpg',
    'GM_360': 'power.jpg',
    'Shim_Joint': 'power.jpg',
    'Laminar_Gasket': 'oil and gas.jpg',
    'Double_Jacketed_Gasket': 'metallurgy.jpg',
    'Ring_Type_Joint_Gasket': 'oil and gas.jpg',
    'Corrugated_Gasket': 'chemical.jpg',
    'Kammprofile_Gasket': 'metallurgy.jpg',
    'Soft_Iron_Ring': 'power.jpg',
    'Type_600': 'chemical.jpg',
    '801CC': 'chemical.jpg',
    'SSF_321': 'metallurgy.jpg',
    'FG_320': 'metallurgy.jpg',
    'SST_323': 'metallurgy.jpg',
    'NA_420': 'chemical.jpg',
    'NA_430': 'chemical.jpg',
    'NA_432': 'chemical.jpg',
    'NA_442': 'chemical.jpg',
    'NA_450': 'chemical.jpg',
    'NA_452_GF': 'chemical.jpg',
    'Aramid_Wiping_Pad': 'metallurgy.jpg',
    'High_Temperature_Wiping_Pad': 'metallurgy.jpg',
}

def update_html_background(file_path, new_image):
    """Update the background image in an HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Pattern to match background-image URL
        pattern = r"background-image:\s*url\('\.\.\/\.\.\/(.*?)'\);"
        replacement = f"background-image: url('../../{new_image}');"

        updated_content = re.sub(pattern, replacement, content)

        # Only write if content changed
        if updated_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def main():
    html_dir = 'generated_html'
    updated_count = 0

    for filename in os.listdir(html_dir):
        if not filename.endswith('.html'):
            continue

        # Get product code from filename (remove .html)
        product_code = filename.replace('.html', '')

        # Check if we have a mapping for this product
        if product_code in PRODUCT_IMAGE_MAP:
            image_file = PRODUCT_IMAGE_MAP[product_code]
            file_path = os.path.join(html_dir, filename)

            if update_html_background(file_path, image_file):
                print(f"✓ Updated {filename} → {image_file}")
                updated_count += 1
            else:
                print(f"- {filename} already has correct image")
        else:
            print(f"⚠ No mapping for {product_code}")

    print(f"\n✅ Updated {updated_count} files")

if __name__ == '__main__':
    main()
