#!/usr/bin/env python3
"""
Generate individual HTML files from JSON data using HY_105.html as template
This preserves all the correct styling and formatting
"""

import json
import os
from pathlib import Path

def generate_html_from_json(json_file, template_html, output_html):
    """Generate HTML file from JSON data"""

    # Load JSON data
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Read template
    with open(template_html, 'r', encoding='utf-8') as f:
        html = f.read()

    # Extract data
    product_code = data['productInfo']['styleCode']
    product_name = data['productInfo']['styleName']
    tagline = data['productInfo'].get('tagline', '')
    full_name = data['productInfo'].get('fullName', product_name)
    hero_image = data['images'].get('hero', '../../public/fertilizer.jpg')
    logo_image = data['images'].get('logo', '../../src/assets/inmarco-tagline-logo1.png')

    # Get sections
    description_paragraphs = []
    features = []
    applications = []
    benefits = []
    tech_props = None

    for section in data.get('sections', []):
        if section['type'] == 'description':
            description_paragraphs = section.get('content', [])
        elif section['type'] == 'bullet-list':
            if 'Feature' in section['title']:
                features = section.get('items', [])
            elif 'Application' in section['title']:
                applications = section.get('items', [])
            elif 'Benefit' in section['title']:
                benefits = section.get('items', [])
        elif section['type'] == 'technical-properties':
            tech_props = section

    # Replace title
    html = html.replace('<title>HY 105 - Technical Datasheet</title>',
                       f'<title>{product_code} - Technical Datasheet</title>')

    # Replace hero background image
    html = html.replace("background-image: url('../../public/fertilizer.jpg');",
                       f"background-image: url('{hero_image}');")

    # Replace logo
    html = html.replace('src="../../src/assets/inmarco-tagline-logo1.png"',
                       f'src="{logo_image}"')

    # Replace product name in hero
    html = html.replace('<h1 class="product-name">HY 105</h1>',
                       f'<h1 class="product-name">{product_code}</h1>')

    # Replace tagline
    html = html.replace('<p class="product-tagline">Engineered for Mechanical Stability in High-Load Equipment</p>',
                       f'<p class="product-tagline">{tagline}</p>')

    # Replace page 2 title
    html = html.replace('<h2 class="page-2-title">HY 105</h2>',
                       f'<h2 class="page-2-title">{product_code}</h2>')

    # Replace description paragraphs
    if description_paragraphs:
        desc_html = '\n'.join([f'                    <p class="description">\n                        {p}\n                    </p>'
                               for p in description_paragraphs[:2]])
        # Find and replace the description section
        old_desc_start = html.find('<div class="description-text">')
        old_desc_end = html.find('</div>\n\n                <div class="side-product-image">')
        if old_desc_start != -1 and old_desc_end != -1:
            html = html[:old_desc_start] + f'''<div class="description-text">
{desc_html}
                </div>

                <div class="side-product-image">''' + html[old_desc_end+len('</div>\n\n                <div class="side-product-image">'):]

    # Replace features
    if features:
        features_html = '\n'.join([f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{feat}</span>
                    </div>''' for feat in features[:5]])

        # Find and replace features section
        old_features_start = html.find('<h3>Key Features</h3>')
        old_features_end = html.find('</div>\n\n                <div class="features-column">\n                    <h3>Applications</h3>')
        if old_features_start != -1 and old_features_end != -1:
            html = html[:old_features_start] + f'''<h3>Key Features</h3>
{features_html}
                </div>

                <div class="features-column">
                    <h3>Applications</h3>''' + html[old_features_end+len('</div>\n\n                <div class="features-column">\n                    <h3>Applications</h3>'):]

    # Replace applications
    if applications:
        apps_html = '\n'.join([f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{app}</span>
                    </div>''' for app in applications[:4]])

        # Find and replace applications section
        old_apps_start = html.find('<h3>Applications</h3>')
        old_apps_end = html.find('</div>\n            </div>\n        </div>\n\n    </div>\n\n    <!-- Page 3')
        if old_apps_start != -1 and old_apps_end != -1:
            html = html[:old_apps_start] + f'''<h3>Applications</h3>
{apps_html}
                </div>
            </div>
        </div>

    </div>

    <!-- Page 3''' + html[old_apps_end+len('</div>\n            </div>\n        </div>\n\n    </div>\n\n    <!-- Page 3'):]

    # Replace technical properties if available
    if tech_props and tech_props.get('properties'):
        props_html = ''
        for prop in tech_props['properties']:
            prop_name = prop.get('name', '')
            if 'type' in prop:  # Equipment-specific
                prop_type = prop.get('type')
                if prop_type == 'universal':
                    props_html += f'''                    <tr>
                        <td>{prop_name}</td>
                        <td colspan="3" style="text-align: center;">{prop.get('value', 'N/A')}</td>
                    </tr>
'''
            else:  # Simple property
                props_html += f'''                    <tr>
                        <td>{prop_name}</td>
                        <td colspan="3" style="text-align: center;">{prop.get('value', 'N/A')}</td>
                    </tr>
'''

        # Replace properties table rows
        old_table_start = html.find('<tr>\n                        <td>pH</td>')
        old_table_end = html.find('</table>')
        if old_table_start != -1 and old_table_end != -1:
            html = html[:old_table_start] + props_html + '                ' + html[old_table_end:]

    # Replace benefits
    if benefits:
        benefits_html = '\n'.join([f'''                <div class="benefit-item">
                    <span class="check-icon">✓</span>
                    <span>{ben}</span>
                </div>''' for ben in benefits[:5]])

        # Find and replace benefits section
        old_benefits_start = html.find('<h3>Performance Benefits</h3>')
        old_benefits_end = html.find('</div>\n        </div>\n\n        <div class="footer">')
        if old_benefits_start != -1 and old_benefits_end != -1:
            html = html[:old_benefits_start] + f'''<h3>Performance Benefits</h3>
{benefits_html}
            </div>
        </div>

        <div class="footer">''' + html[old_benefits_end+len('</div>\n        </div>\n\n        <div class="footer">'):]

    # Write output
    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✅ Generated: {output_html}")

def main():
    print("="*80)
    print("GENERATING HTML FILES FROM JSON DATA")
    print("="*80)

    template_file = "HY_105.html"
    data_dir = "data"
    output_dir = "generated_html"

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Get all JSON files
    json_files = list(Path(data_dir).glob("*_data.json"))

    print(f"\nFound {len(json_files)} JSON files")
    print(f"Template: {template_file}")
    print(f"Output directory: {output_dir}/\n")

    success_count = 0
    for json_file in json_files:
        try:
            product_code = json_file.stem.replace('_data', '')
            output_file = os.path.join(output_dir, f"{product_code}.html")
            generate_html_from_json(json_file, template_file, output_file)
            success_count += 1
        except Exception as e:
            print(f"❌ Error processing {json_file.name}: {e}")

    print(f"\n{'='*80}")
    print(f"✅ Successfully generated {success_count}/{len(json_files)} HTML files")
    print(f"📂 Output directory: {output_dir}/")
    print(f"{'='*80}")

if __name__ == "__main__":
    main()
