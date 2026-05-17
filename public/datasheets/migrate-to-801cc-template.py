#!/usr/bin/env python3
"""
Migrate files to use 801CC template styling
"""

import os
import re
from bs4 import BeautifulSoup

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

def extract_data_from_html(html_content):
    """Extract product data from HTML"""
    soup = BeautifulSoup(html_content, 'html.parser')

    data = {
        'product_name': '',
        'product_subtitle': '',
        'description_paragraphs': [],
        'features': [],
        'advantages': [],
        'specifications': {}
    }

    # Extract product name
    title_tag = soup.find('title')
    if title_tag:
        data['product_name'] = title_tag.get_text().replace(' - Technical Datasheet', '').strip()

    product_name_elem = soup.find('h1', class_='product-name')
    if product_name_elem:
        data['product_name'] = product_name_elem.get_text(strip=True)

    # Extract subtitle
    subtitle_elem = soup.find('p', class_='product-tagline')
    if subtitle_elem:
        data['product_subtitle'] = subtitle_elem.get_text(strip=True)

    # Extract descriptions
    desc_elem = soup.find('p', class_='description-text')
    if desc_elem:
        data['description_paragraphs'].append(desc_elem.get_text(strip=True))

    desc_elems = soup.find_all('p', class_='description')
    for desc in desc_elems:
        text = desc.get_text(strip=True)
        if text and text not in data['description_paragraphs']:
            data['description_paragraphs'].append(text)

    # Extract features
    for section in soup.find_all('div', class_='section'):
        h3 = section.find('h3', class_='section-title')
        if h3 and 'Feature' in h3.get_text():
            for item in section.find_all('div', class_='feature-item'):
                text = item.get_text(strip=True)
                if text:
                    data['features'].append(text)

    # If no features found, try alternative structure
    if not data['features']:
        features_grid = soup.find('div', class_='features-grid')
        if features_grid:
            for item in features_grid.find_all('div', class_='feature-item'):
                span = item.find('span')
                if span:
                    text = span.get_text(strip=True)
                    if text:
                        data['features'].append(text)

    # Extract advantages/applications
    for section in soup.find_all('div', class_='section'):
        h3 = section.find('h3', class_='section-title')
        if h3 and ('Application' in h3.get_text() or 'Advantage' in h3.get_text() or 'Benefit' in h3.get_text()):
            for item in section.find_all('div', class_='application-item'):
                text = item.get_text(strip=True)
                if text:
                    data['advantages'].append(text)

    # Extract specifications
    specs_table = soup.find('table', class_='specs-table')
    if specs_table:
        for row in specs_table.find_all('tr'):
            cells = row.find_all('td')
            if len(cells) >= 2:
                key = cells[0].get_text(strip=True)
                value = cells[1].get_text(strip=True)
                if key and value:
                    data['specifications'][key] = value

    return data

def generate_html_from_template(template_path, data, product_code, bg_image):
    """Generate HTML using 801CC template"""

    # Read template
    with open(template_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace background image
    html = re.sub(
        r"background-image:\s*url\('\.\.\/\.\.\/(.*?)'\);",
        f"background-image: url('../../{bg_image}');",
        html
    )

    # Replace title
    html = re.sub(
        r'<title>.*?</title>',
        f'<title>{data["product_name"]} - Technical Datasheet</title>',
        html
    )

    # Replace product name in hero (page 1)
    html = re.sub(
        r'<h1 class="product-name">.*?</h1>',
        f'<h1 class="product-name">{data["product_name"]}</h1>',
        html
    )

    # Replace tagline
    html = re.sub(
        r'<p class="product-tagline">.*?</p>',
        f'<p class="product-tagline">{data["product_subtitle"]}</p>',
        html
    )

    # Replace product name in headers (page 2 and 3)
    html = re.sub(
        r'<h2 class="page-2-title">.*?</h2>',
        f'<h2 class="page-2-title">{data["product_name"]}</h2>',
        html,
        count=1
    )

    # Build description HTML
    desc_html = ''
    for i, para in enumerate(data['description_paragraphs']):
        style = ' style="margin-bottom: 0;"' if i == len(data['description_paragraphs']) - 1 else ''
        desc_html += f'''                    <p class="description"{style}>
                        {para}
                    </p>

'''

    # Replace descriptions
    desc_pattern = r'<div class="description-text">.*?</div>'
    desc_replacement = f'''<div class="description-text">
{desc_html}                </div>'''
    html = re.sub(desc_pattern, desc_replacement, html, flags=re.DOTALL)

    # Build features HTML (split into two columns)
    mid_point = len(data['features']) // 2
    features_col1 = data['features'][:mid_point] if data['features'] else []
    features_col2 = data['features'][mid_point:] if data['features'] else []

    features_html1 = ''
    for feat in features_col1:
        features_html1 += f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{feat}</span>
                    </div>
'''

    features_html2 = ''
    for feat in features_col2:
        features_html2 += f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{feat}</span>
                    </div>
'''

    # Replace features columns
    # First column
    pattern1 = r'<div class="features-column">.*?<h3>Key Features</h3>(.*?)</div>\s*<div class="features-column">'
    replacement1 = f'''<div class="features-column">
                    <h3>Key Features</h3>
{features_html1}                </div>

                <div class="features-column">'''
    html = re.sub(pattern1, replacement1, html, flags=re.DOTALL)

    # Second column
    pattern2 = r'<h3>Performance Advantages</h3>(.*?)</div>\s*</div>'
    replacement2 = f'''<h3>Performance Advantages</h3>
{features_html2}                </div>
            </div>'''
    html = re.sub(pattern2, replacement2, html, flags=re.DOTALL)

    # Build specifications table
    specs_html = ''
    if data['specifications']:
        specs_html = '''                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
'''
        for key, value in data['specifications'].items():
            specs_html += f'''                        <tr>
                            <td>{key}</td>
                            <td>{value}</td>
                        </tr>
'''
        specs_html += '''                    </tbody>'''

    # Replace specifications table
    specs_pattern = r'<table class="properties-table">.*?</table>'
    specs_replacement = f'''<table class="properties-table">
{specs_html}
                </table>'''
    html = re.sub(specs_pattern, specs_replacement, html, flags=re.DOTALL)

    return html

def main():
    html_dir = 'generated_html'
    template_path = os.path.join(html_dir, '801CC.html')
    migrated_count = 0

    if not os.path.exists(template_path):
        print(f"❌ Template not found: {template_path}")
        return

    for product_code in OLD_TEMPLATE_FILES:
        filename = f"{product_code}.html"
        file_path = os.path.join(html_dir, filename)

        if not os.path.exists(file_path):
            print(f"⚠ File not found: {filename}")
            continue

        try:
            # Read current HTML
            with open(file_path, 'r', encoding='utf-8') as f:
                old_html = f.read()

            # Extract data
            data = extract_data_from_html(old_html)

            # Get background image
            bg_image = PRODUCT_IMAGE_MAP.get(product_code, 'chemical.jpg')

            # Generate new HTML from 801CC template
            new_html = generate_html_from_template(template_path, data, product_code, bg_image)

            # Write new HTML
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_html)

            print(f"✓ Migrated {filename} using 801CC template")
            migrated_count += 1

        except Exception as e:
            print(f"✗ Error migrating {filename}: {e}")
            import traceback
            traceback.print_exc()

    print(f"\n✅ Successfully migrated {migrated_count}/{len(OLD_TEMPLATE_FILES)} files to 801CC template")

if __name__ == '__main__':
    main()
