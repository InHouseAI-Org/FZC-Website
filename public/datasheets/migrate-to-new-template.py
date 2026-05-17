#!/usr/bin/env python3
"""
Migrate old template HTML files to the new template format
"""

import os
import re
from bs4 import BeautifulSoup

# Files that need migration
OLD_TEMPLATE_FILES = [
    '750SS_WELDING_BLANKET', 'Aramid_Wiping_Pad', 'Corrugated_Gasket',
    'Double_Jacketed_Gasket', 'FG_320', 'GM_300Z', 'GM_310C', 'HY_175',
    'HY_501C', 'HY_504', 'High_Temperature_Wiping_Pad', 'INMATEX_1400',
    'INMATEX_ePTFE', 'IN_123', 'IN_123I', 'Insulation_Gasket_Kit_1800_FS',
    'Kammprofile_Gasket', 'Laminar_Gasket', 'NA_420', 'NA_430', 'NA_432',
    'NA_442', 'NA_450', 'NA_452_GF', 'OR_125G', 'OR_151',
    'Ring_Type_Joint_Gasket', 'SSF_321', 'SST_323', 'Shim_Joint',
    'Soft_Iron_Ring', 'Type_600'
]

# Industry image mapping
PRODUCT_IMAGE_MAP = {
    'GM_300Z': 'power.jpg',
    'GM_310C': 'power.jpg',
    'HY_175': 'power.jpg',
    'HY_501C': 'power.jpg',
    'HY_504': 'chemical.jpg',
    'IN_123': 'metallurgy.jpg',
    'IN_123I': 'metallurgy.jpg',
    'OR_125G': 'water.jpg',
    'OR_151': 'water.jpg',
    'INMATEX_ePTFE': 'chemical.jpg',
    'INMATEX_1400': 'chemical.jpg',
    'Insulation_Gasket_Kit_1800_FS': 'oil and gas.jpg',
    '750SS_WELDING_BLANKET': 'metallurgy.jpg',
    'Shim_Joint': 'power.jpg',
    'Laminar_Gasket': 'oil and gas.jpg',
    'Double_Jacketed_Gasket': 'metallurgy.jpg',
    'Ring_Type_Joint_Gasket': 'oil and gas.jpg',
    'Corrugated_Gasket': 'chemical.jpg',
    'Kammprofile_Gasket': 'metallurgy.jpg',
    'Soft_Iron_Ring': 'power.jpg',
    'Type_600': 'chemical.jpg',
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

def extract_data_from_old_html(html_content):
    """Extract product data from old template HTML"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'product_name': '',
        'product_subtitle': '',
        'description': '',
        'features': [],
        'applications': [],
        'specifications': {},
        'advantages': []
    }

    # Extract product name
    product_name_elem = soup.find('div', class_='product-name')
    if product_name_elem:
        data['product_name'] = product_name_elem.get_text(strip=True)

    # Extract subtitle
    subtitle_elem = soup.find('div', class_='product-subtitle')
    if subtitle_elem:
        data['product_subtitle'] = subtitle_elem.get_text(strip=True)

    # Extract description
    desc_elem = soup.find('div', class_='description')
    if desc_elem:
        data['description'] = desc_elem.get_text(strip=True)

    # Extract features
    features_box = soup.find('div', class_='features-grid')
    if features_box:
        for feature in features_box.find_all('div', class_='feature-item'):
            text = feature.get_text(strip=True)
            if text:
                data['features'].append(text)

    # Extract applications
    app_box = soup.find('div', class_='applications-box')
    if app_box:
        for li in app_box.find_all('li'):
            text = li.get_text(strip=True)
            if text:
                data['applications'].append(text)

    # Extract specifications from table
    specs_table = soup.find('table', class_='properties-table')
    if specs_table:
        for row in specs_table.find_all('tr')[1:]:  # Skip header
            cells = row.find_all('td')
            if len(cells) >= 2:
                key = cells[0].get_text(strip=True)
                value = cells[1].get_text(strip=True)
                if key and value:
                    data['specifications'][key] = value

    return data

def generate_new_html(data, product_code, bg_image):
    """Generate HTML using new template format"""

    # Split features into chunks for better layout
    features_html = ''
    if data['features']:
        for feat in data['features']:
            features_html += f'                        <div class="feature-item">\n'
            features_html += f'                            <i class="fas fa-check-circle"></i>\n'
            features_html += f'                            <span>{feat}</span>\n'
            features_html += f'                        </div>\n'

    # Generate applications HTML
    applications_html = ''
    if data['applications']:
        for app in data['applications']:
            applications_html += f'                        <div class="application-item">\n'
            applications_html += f'                            <i class="fas fa-industry"></i>\n'
            applications_html += f'                            <span>{app}</span>\n'
            applications_html += f'                        </div>\n'

    # Generate specifications table rows
    specs_rows = ''
    if data['specifications']:
        for key, value in data['specifications'].items():
            specs_rows += f'                        <tr>\n'
            specs_rows += f'                            <td class="spec-label">{key}</td>\n'
            specs_rows += f'                            <td class="spec-value">{value}</td>\n'
            specs_rows += f'                        </tr>\n'

    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{data['product_name']} - Technical Datasheet</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        @page {{
            size: A4;
            margin: 0;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #2b2a29;
            background: white;
            width: 210mm;
            min-height: 297mm;
            align-content: center;
            margin: 0 auto;
        }}

        /* Page 1 - Hero */
        .page-1 {{
            width: 100%;
            height: 290mm;
            background: linear-gradient(135deg, #2b2a29 0%, #1a1918 100%);
            position: relative;
            overflow: hidden;
            page-break-after: always;
        }}

        .header {{
            padding: 20mm 15mm;
            display: flex;
            justify-content: center;
            align-items: center;
        }}

        .logo-section {{
            color: white;
        }}

        .logo-section img {{
            height: 200px;
            width: auto;
        }}

        /* Hero section */
        .hero-section {{
            position: relative;
            margin-top: 10px;
            height: 100%;
            background-image: url('../../{bg_image}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }}

        .hero-overlay {{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(43, 42, 41, 0.95) 0%, rgba(43, 42, 41, 0.7) 50%, transparent 100%);
        }}

        .hero-content {{
            position: relative;
            z-index: 10;
            padding: 35mm 15mm 0 15mm;
            max-width: 150mm;
        }}

        .red-accent {{
            width: 50mm;
            height: 4px;
            background: #e31e24;
            margin-bottom: 10mm;
        }}

        .product-name {{
            font-size: 52pt;
            font-weight: 700;
            color: white;
            margin-bottom: 6mm;
            letter-spacing: -1.5px;
            line-height: 1.1;
        }}

        .product-tagline {{
            font-size: 16pt;
            color: #e5e5e5;
            line-height: 1.5;
            margin-bottom: 8mm;
        }}

        /* Page 2 - Description & Features */
        .page-2 {{
            width: 100%;
            max-height: 290mm;
            padding: 15mm 15mm;
            background: white;
            page-break-after: always;
        }}

        .page-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8mm;
            padding-bottom: 4mm;
            border-bottom: 2px solid #e31e24;
        }}

        .page-header h2 {{
            font-size: 24pt;
            color: #2b2a29;
        }}

        .page-number {{
            font-size: 10pt;
            color: #666;
        }}

        .section {{
            margin-bottom: 8mm;
        }}

        .section-title {{
            font-size: 14pt;
            color: #e31e24;
            margin-bottom: 4mm;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }}

        .section-title i {{
            font-size: 12pt;
        }}

        .description-text {{
            font-size: 11pt;
            line-height: 1.7;
            color: #333;
            text-align: justify;
        }}

        .features-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6mm;
            margin-top: 5mm;
        }}

        .feature-item {{
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 4mm;
            background: #f8f9fa;
            border-radius: 4px;
            border-left: 3px solid #e31e24;
        }}

        .feature-item i {{
            color: #e31e24;
            margin-top: 2px;
            flex-shrink: 0;
        }}

        .feature-item span {{
            font-size: 10pt;
            line-height: 1.5;
            color: #333;
        }}

        /* Page 3 - Applications & Specifications */
        .page-3 {{
            width: 100%;
            max-height: 290mm;
            padding: 15mm 15mm;
            background: white;
            page-break-after: always;
        }}

        .applications-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4mm;
            margin-top: 5mm;
        }}

        .application-item {{
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 3mm;
            background: #fff8f8;
            border-radius: 4px;
            border-left: 3px solid #e31e24;
        }}

        .application-item i {{
            color: #e31e24;
            font-size: 10pt;
            flex-shrink: 0;
        }}

        .application-item span {{
            font-size: 10pt;
            color: #333;
        }}

        .specs-table {{
            width: 100%;
            margin-top: 5mm;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}

        .specs-table tr {{
            border-bottom: 1px solid #e5e5e5;
        }}

        .specs-table tr:last-child {{
            border-bottom: none;
        }}

        .specs-table td {{
            padding: 4mm 5mm;
            font-size: 10pt;
        }}

        .spec-label {{
            font-weight: 600;
            color: #2b2a29;
            width: 40%;
        }}

        .spec-value {{
            color: #555;
        }}

        .specs-table tr:nth-child(even) {{
            background: #f8f9fa;
        }}

        .footer {{
            position: absolute;
            bottom: 10mm;
            left: 15mm;
            right: 15mm;
            padding-top: 5mm;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8pt;
            color: #666;
        }}
    </style>
</head>
<body>
    <!-- Page 1: Hero -->
    <div class="page-1">
        <div class="header">
            <div class="logo-section">
                <img src="../../../src/assets/inmarco-tagline-logo1.png" alt="INMARCO - Innovations in Fluid Sealing">
            </div>
        </div>

        <div class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="red-accent"></div>
                <h1 class="product-name">{data['product_name']}</h1>
                <p class="product-tagline">{data['product_subtitle']}</p>
            </div>
        </div>
    </div>

    <!-- Page 2: Description & Features -->
    <div class="page-2">
        <div class="page-header">
            <h2>{data['product_name']}</h2>
            <span class="page-number">Page 2</span>
        </div>

        <div class="section">
            <h3 class="section-title">
                <i class="fas fa-file-alt"></i>
                Product Description
            </h3>
            <p class="description-text">{data['description']}</p>
        </div>

        {f"""<div class="section">
            <h3 class="section-title">
                <i class="fas fa-star"></i>
                Key Features
            </h3>
            <div class="features-grid">
{features_html}            </div>
        </div>""" if data['features'] else ''}
    </div>

    <!-- Page 3: Applications & Specifications -->
    <div class="page-3">
        <div class="page-header">
            <h2>{data['product_name']}</h2>
            <span class="page-number">Page 3</span>
        </div>

        {f"""<div class="section">
            <h3 class="section-title">
                <i class="fas fa-industry"></i>
                Applications
            </h3>
            <div class="applications-grid">
{applications_html}            </div>
        </div>""" if data['applications'] else ''}

        {f"""<div class="section">
            <h3 class="section-title">
                <i class="fas fa-cog"></i>
                Technical Specifications
            </h3>
            <table class="specs-table">
{specs_rows}            </table>
        </div>""" if data['specifications'] else ''}

        <div class="footer">
            <span>INMARCO FZC - Industrial Fluid Sealing Solutions</span>
            <span>www.inmarco.ae</span>
        </div>
    </div>
</body>
</html>'''

    return html

def main():
    html_dir = 'generated_html'
    migrated_count = 0

    for product_code in OLD_TEMPLATE_FILES:
        filename = f"{product_code}.html"
        file_path = os.path.join(html_dir, filename)

        if not os.path.exists(file_path):
            print(f"⚠ File not found: {filename}")
            continue

        try:
            # Read old HTML
            with open(file_path, 'r', encoding='utf-8') as f:
                old_html = f.read()

            # Extract data
            data = extract_data_from_old_html(old_html)

            # Get background image
            bg_image = PRODUCT_IMAGE_MAP.get(product_code, 'chemical.jpg')

            # Generate new HTML
            new_html = generate_new_html(data, product_code, bg_image)

            # Write new HTML
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_html)

            print(f"✓ Migrated {filename} → {bg_image}")
            migrated_count += 1

        except Exception as e:
            print(f"✗ Error migrating {filename}: {e}")

    print(f"\n✅ Successfully migrated {migrated_count}/{len(OLD_TEMPLATE_FILES)} files")

if __name__ == '__main__':
    main()
