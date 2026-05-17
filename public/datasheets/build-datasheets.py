#!/usr/bin/env python3
"""
Build individual datasheet HTML files for each product
Uses the exact HY_105.html styling and structure
"""

import json
import os
from pathlib import Path

# HTML template with proper styling
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product_code} - Technical Datasheet</title>
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
            background-image: url('{hero_image}');
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
            color: #ffffff;
            max-width: 140mm;
            line-height: 1.5;
            font-weight: 300;
        }}

        /* Page 2 - Technical Details */
        .page-2 {{
            width: 100%;
            height: 290mm;
            background: white;
            position: relative;
            page-break-after: always;
        }}

        /* Page 3 - Properties and Benefits */
        .page-3 {{
            width: 100%;
            height: 290mm;
            background: white;
            position: relative;
        }}

        .page-2-header {{
            background: linear-gradient(135deg, #2b2a29 0%, #1a1918 100%);
            padding: 15mm;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .page-2-title {{
            font-size: 28pt;
            font-weight: bold;
        }}

        .product-image-container {{
            background: white;
            border-radius: 5mm;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 3px solid #e31e24;
        }}

        .product-image-small {{
            width: 70mm;
            height: 70mm;
            border-radius: 4mm;
            object-fit: contain;
            display: block;
        }}

        .content-section {{
            padding: 12mm 15mm;
        }}

        .description-with-image {{
            display: flex;
            gap: 10mm;
            align-items: flex-start;
            margin-bottom: 10mm;
        }}

        .description-text {{
            flex: 1;
        }}

        .description {{
            font-size: 10pt;
            line-height: 1.6;
            color: #333;
            margin-bottom: 10mm;
            text-align: justify;
        }}

        .section-divider {{
            height: 2px;
            background: #e31e24;
            margin: 8mm 0;
        }}

        .features-grid {{
            display: flex;
            gap: 10mm;
            margin-bottom: 10mm;
        }}

        .features-column {{
            flex: 1;
        }}

        .features-column h3 {{
            font-size: 13pt;
            color: #2b2a29;
            margin-bottom: 5mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #e31e24;
            font-weight: 600;
        }}

        .feature-item {{
            display: flex;
            margin-bottom: 4mm;
            font-size: 9pt;
            line-height: 1.5;
        }}

        .bullet {{
            color: #e31e24;
            font-weight: bold;
            margin-right: 3mm;
            font-size: 12pt;
        }}

        .feature-text {{
            flex: 1;
            color: #444;
        }}

        /* Properties Table */
        .properties-section {{
            background: #f5f5f5;
            padding: 8mm;
            border-radius: 3mm;
            border-left: 4px solid #e31e24;
            margin-bottom: 8mm;
        }}

        .properties-section h3 {{
            font-size: 14pt;
            color: #2b2a29;
            margin-bottom: 5mm;
        }}

        .properties-table {{
            width: 100%;
            border-collapse: collapse;
        }}

        .properties-table th {{
            background: #2b2a29;
            color: white;
            padding: 3mm;
            text-align: left;
            font-size: 9pt;
            font-weight: 600;
        }}

        .properties-table td {{
            padding: 2.5mm 3mm;
            border-bottom: 1px solid #ddd;
            font-size: 9pt;
            color: #333;
        }}

        .properties-table tr:last-child td {{
            border-bottom: none;
        }}

        .properties-table td:first-child {{
            font-weight: 600;
            color: #2b2a29;
        }}

        /* Benefits Box */
        .benefits-box {{
            background: linear-gradient(135deg, #e31e24 0%, #c41a20 100%);
            color: white;
            padding: 8mm;
            border-radius: 3mm;
            margin-bottom: 8mm;
        }}

        .benefits-box h3 {{
            font-size: 14pt;
            margin-bottom: 4mm;
        }}

        .benefit-item {{
            display: flex;
            align-items: flex-start;
            margin-bottom: 3mm;
            font-size: 9pt;
            line-height: 1.4;
        }}

        .benefit-item:last-child {{
            margin-bottom: 0;
        }}

        .check-icon {{
            color: white;
            font-weight: bold;
            margin-right: 3mm;
            font-size: 11pt;
        }}

        /* Footer */
        .footer {{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #2b2a29;
            color: white;
            padding: 8mm 15mm;
        }}

        .footer-content {{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .company-info {{
            font-size: 7pt;
            line-height: 1.6;
        }}

        .company-name {{
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 2mm;
            color: #e31e24;
        }}

        .contact-info {{
            color: #ccc;
        }}

        .disclaimer {{
            font-size: 6pt;
            color: #888;
            margin-top: 3mm;
            max-width: 160mm;
        }}
    </style>
</head>
<body>
    <!-- Page 1 - Hero -->
    <div class="page-1">
        <div class="header">
            <div class="logo-section">
                <img src="{logo_image}" alt="INMARCO - Innovations in Fluid Sealing">
            </div>
        </div>

        <div class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="red-accent"></div>
                <h1 class="product-name">{product_code}</h1>
                <p class="product-tagline">{tagline}</p>
            </div>
        </div>
    </div>

    <!-- Page 2 - Technical Details -->
    <div class="page-2">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">{product_code}</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="description-with-image">
                <div class="description-text">
{description_html}
                </div>
            </div>

            <div class="section-divider"></div>

            <div class="features-grid">
                <div class="features-column">
                    <h3>Key Features</h3>
{features_html}
                </div>

                <div class="features-column">
                    <h3>Applications</h3>
{applications_html}
                </div>
            </div>
        </div>
    </div>

    <!-- Page 3 - Technical Properties and Performance Benefits -->
    <div class="page-3">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">Technical Specifications</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="properties-section">
                <h3>Technical Properties</h3>
                <table class="properties-table">
                    <tr>
                        <th>Properties</th>
                        <th style="text-align: center;">
                            <i class="fas fa-sync-alt" style="font-size: 14pt;"></i>
                            <br><span style="font-size: 7pt; font-weight: normal;">Rotating</span>
                        </th>
                        <th style="text-align: center;">
                            <i class="fas fa-arrows-alt-h" style="font-size: 14pt;"></i>
                            <br><span style="font-size: 7pt; font-weight: normal;">Reciprocating</span>
                        </th>
                        <th style="text-align: center;">
                            <i class="fas fa-circle" style="font-size: 14pt;"></i>
                            <br><span style="font-size: 7pt; font-weight: normal;">Static</span>
                        </th>
                    </tr>
{properties_html}
                </table>
            </div>

            <div class="benefits-box">
                <h3>Performance Benefits</h3>
{benefits_html}
            </div>
        </div>

        <div class="footer">
            <div class="footer-content">
                <div class="company-info">
                    <div class="company-name">INMARCO FZC</div>
                    <div class="contact-info">
                        P.O. Box 120284, Sharjah Airport International Free Zone (SAIF-Zone), Sharjah, UAE<br>
                        Tel: +971 6 5578378 | Fax: +971 6 5578948<br>
                        Email: sales@inmarco.ae | Web: www.inmarco.ae
                    </div>
                    <div class="disclaimer">
                        All information and recommendations given in this technical data sheet are correct to the best of our knowledge. However, because of the wide variety of application and operating conditions, we cannot derive the final conclusion. This above information can only serve as a guideline.
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>'''


def build_datasheet(json_file, output_dir):
    """Build a complete datasheet HTML from JSON"""

    # Load JSON
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Extract product info
    product_code = data['productInfo']['styleCode']
    tagline = data['productInfo'].get('tagline', 'High-Performance Sealing Solution')
    hero_image = data['images'].get('hero', 'http://localhost:8765/public/fertilizer.jpg')
    logo_image = data['images'].get('logo', 'http://localhost:8765/src/assets/inmarco-tagline-logo1.png')

    # Extract sections
    description_paragraphs = []
    features = []
    applications = []
    benefits = []
    properties = []

    for section in data.get('sections', []):
        if section['type'] == 'description':
            description_paragraphs = section.get('content', [])
        elif section['type'] == 'bullet-list':
            if 'Feature' in section.get('title', ''):
                features = section.get('items', [])
            elif 'Application' in section.get('title', ''):
                applications = section.get('items', [])
            elif 'Benefit' in section.get('title', ''):
                benefits = section.get('items', [])
        elif section['type'] == 'technical-properties':
            properties = section.get('properties', [])

    # Build description HTML
    if description_paragraphs:
        description_html = '\n'.join([f'                    <p class="description">{p}</p>'
                                     for p in description_paragraphs[:2]])
    else:
        description_html = '                    <p class="description">Technical datasheet for ' + product_code + '</p>'

    # Build features HTML
    if features:
        features_html = '\n'.join([f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{feat}</span>
                    </div>''' for feat in features[:5]])
    else:
        features_html = '                    <div class="feature-item"><span class="bullet">●</span><span class="feature-text">High-performance sealing solution</span></div>'

    # Build applications HTML
    if applications:
        applications_html = '\n'.join([f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{app}</span>
                    </div>''' for app in applications[:4]])
    else:
        applications_html = '                    <div class="feature-item"><span class="bullet">●</span><span class="feature-text">Industrial applications</span></div>'

    # Build properties HTML
    if properties:
        properties_html = ''
        for prop in properties:
            name = prop.get('name', '')
            value = prop.get('value', 'N/A')
            prop_type = prop.get('type', 'universal')

            if prop_type == 'universal' or 'type' not in prop:
                properties_html += f'''                    <tr>
                        <td>{name}</td>
                        <td colspan="3" style="text-align: center;">{value}</td>
                    </tr>
'''
    else:
        properties_html = '''                    <tr>
                        <td>pH</td>
                        <td colspan="3" style="text-align: center;">0-14</td>
                    </tr>
                    <tr>
                        <td>Temperature (°C)</td>
                        <td colspan="3" style="text-align: center;">-200 to +300°C</td>
                    </tr>
'''

    # Build benefits HTML
    if benefits:
        benefits_html = '\n'.join([f'''                <div class="benefit-item">
                    <span class="check-icon">✓</span>
                    <span>{ben}</span>
                </div>''' for ben in benefits[:5]])
    else:
        benefits_html = '''                <div class="benefit-item">
                    <span class="check-icon">✓</span>
                    <span>High-performance sealing solution</span>
                </div>'''

    # Generate HTML
    html = HTML_TEMPLATE.format(
        product_code=product_code,
        tagline=tagline,
        hero_image=hero_image,
        logo_image=logo_image,
        description_html=description_html,
        features_html=features_html,
        applications_html=applications_html,
        properties_html=properties_html,
        benefits_html=benefits_html
    )

    # Save file
    output_file = os.path.join(output_dir, f"{product_code.replace(' ', '_')}.html")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✅ {product_code:20s} → {output_file}")
    return output_file


def main():
    print("="*80)
    print("BUILDING INDIVIDUAL DATASHEETS")
    print("="*80)

    data_dir = "data"
    output_dir = "generated_html"

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Get all JSON files
    json_files = sorted(list(Path(data_dir).glob("*_data.json")))

    print(f"\nFound {len(json_files)} products")
    print(f"Output: {output_dir}/\n")

    success_count = 0
    for json_file in json_files:
        try:
            build_datasheet(json_file, output_dir)
            success_count += 1
        except Exception as e:
            print(f"❌ Error: {json_file.name} - {e}")

    print(f"\n{'='*80}")
    print(f"✅ Successfully built {success_count}/{len(json_files)} datasheets")
    print(f"📂 Location: {output_dir}/")
    print(f"{'='*80}")


if __name__ == "__main__":
    main()
