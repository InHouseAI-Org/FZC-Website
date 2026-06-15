#!/usr/bin/env python3
import zipfile
import xml.etree.ElementTree as ET
import re
import os

def extract_text_from_docx(docx_path):
    """Extract text from docx file"""
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            xml_content = zip_ref.read('word/document.xml')

        root = ET.fromstring(xml_content)
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text_elements = root.findall('.//w:t', namespaces)
        text = ''.join([elem.text for elem in text_elements if elem.text])

        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

def parse_sections(text):
    """Parse text into sections - handles both numbered and unnumbered formats"""
    sections = {
        'product_overview': '',
        'key_features': [],
        'performance_advantages': [],
        'technical_properties': [],
        'applications': [],
        'service_media': [],
        'performance_benefits': [],
        'certifications': []
    }

    # Try numbered format first (PRODUCT OVERVIEW)
    overview_match = re.search(r'(?:1\.\s*)?PRODUCT OVERVIEW(.*?)(?=(?:\d+\.\s*)?(?:KEY FEATURES|Key Features|APPLICATIONS|$))', text, re.DOTALL | re.IGNORECASE)
    if overview_match:
        sections['product_overview'] = overview_match.group(1).strip()
    else:
        # Find description - look for "is a/is an" pattern until "Key Features"
        # Or find from product name to Key Features
        key_feat_pos = text.find('Key Features')
        if key_feat_pos == -1:
            key_feat_pos = text.find('KEY FEATURES')

        if key_feat_pos != -1:
            # Search backwards from Key Features for "is a" or "is an"
            before_key_feat = text[:key_feat_pos]
            is_a_pos = max(before_key_feat.rfind(' is a '), before_key_feat.rfind(' is an '))
            if is_a_pos != -1:
                # Find start of sentence (go back max 300 chars)
                search_start = max(0, is_a_pos - 300)
                desc_segment = text[search_start:key_feat_pos]
                # Find the first capital letter after period or start
                sent_match = re.search(r'(?:^|\.)\s*([A-Z][^.]+.*?)$', desc_segment, re.DOTALL)
                if sent_match:
                    sections['product_overview'] = sent_match.group(1).strip()
                else:
                    sections['product_overview'] = desc_segment.strip()

    # Extract Key Features - simpler approach
    feat_start = text.find('Key Features●')
    if feat_start == -1:
        feat_start = text.find('KEY FEATURES')
    if feat_start != -1:
        # Find the end - look for next section
        feat_end = min([pos for pos in [
            text.find('Applications●', feat_start),
            text.find('Applications', feat_start + 20),
            text.find('Technical', feat_start),
            len(text)
        ] if pos != -1])

        features_text = text[feat_start:feat_end]
        # Remove the header
        features_text = re.sub(r'Key Features|KEY FEATURES', '', features_text, flags=re.IGNORECASE)
        # Split by bullet
        features = [f.strip().rstrip('.') for f in features_text.split('●') if len(f.strip()) > 15]
        sections['key_features'] = features[:10]

    # Extract Performance Advantages - similar approach
    perf_start = max(text.find('Performance Advantages'), text.find('PERFORMANCE ADVANTAGES'))
    if perf_start != -1:
        perf_end = min([pos for pos in [
            text.find('Applications', perf_start),
            text.find('Technical', perf_start),
            text.find('Service Media', perf_start),
            len(text)
        ] if pos != -1])

        perf_text = text[perf_start:perf_end]
        perf_text = re.sub(r'Performance Advantages|PERFORMANCE ADVANTAGES', '', perf_text, flags=re.IGNORECASE)
        advantages = [a.strip().rstrip('.') for a in perf_text.split('●') if len(a.strip()) > 15]
        sections['performance_advantages'] = advantages[:10]

    # Extract Technical Properties/Specifications
    props_match = re.search(r'(?:Technical (?:Properties|Specifications)|TECHNICAL PROPERTIES)(.*?)(?=Applications|Service|Performance|Certification|$)', text, re.DOTALL | re.IGNORECASE)
    if props_match:
        props_text = props_match.group(1).strip()
        # Try to extract Property: Value or PropertyValue pairs
        # First try table format
        prop_lines = re.findall(r'([^\n●]+?)(?::|(?=[A-Z][a-z]+\s*\d)|(?=\d+\s*[°C|Bar|mm]))\s*([^\n●]+)', props_text)
        for prop, value in prop_lines:
            prop_clean = prop.strip()
            value_clean = value.strip()
            if (prop_clean and value_clean and
                prop_clean not in ['Property', 'Value', 'PropertyValue'] and
                len(prop_clean) < 100 and len(value_clean) < 200):
                sections['technical_properties'].append({
                    'property': prop_clean,
                    'value': value_clean
                })

    # Extract Applications
    apps_start = max(text.find('Applications●'), text.find('APPLICATIONS'))
    if apps_start != -1:
        apps_end = min([pos for pos in [
            text.find('Technical', apps_start),
            text.find('Service Media', apps_start),
            text.find('Performance', apps_start),
            text.find('Certification', apps_start),
            len(text)
        ] if pos != -1])

        apps_text = text[apps_start:apps_end]
        apps_text = re.sub(r'Applications|APPLICATIONS', '', apps_text, flags=re.IGNORECASE)
        apps = [a.strip().rstrip('.') for a in apps_text.split('●') if len(a.strip()) > 10]
        sections['applications'] = apps[:10]

    # Extract Service Media
    media_match = re.search(r'(?:Service Media|SERVICE MEDIA)(.*?)(?=Performance|Benefits|Certification|Disclaimer|$)', text, re.DOTALL | re.IGNORECASE)
    if media_match:
        media_text = media_match.group(1).strip()
        media = re.split(r'●', media_text)
        sections['service_media'] = [m.strip().rstrip('.') for m in media if len(m.strip()) > 5][:10]

    # Extract Performance Benefits (separate from advantages)
    benefits_match = re.search(r'(?:Performance Benefits|PERFORMANCE BENEFITS)(.*?)(?=Certification|Testing|Disclaimer|$)', text, re.DOTALL | re.IGNORECASE)
    if benefits_match:
        benefits_text = benefits_match.group(1).strip()
        benefits = re.split(r'●', benefits_text)
        # If we have benefits, use them; otherwise use advantages
        benefit_list = [b.strip() for b in benefits if len(b.strip()) > 10][:8]
        if benefit_list:
            sections['performance_benefits'] = benefit_list
        elif sections['performance_advantages']:
            sections['performance_benefits'] = sections['performance_advantages'][:8]
    elif sections['performance_advantages']:
        sections['performance_benefits'] = sections['performance_advantages'][:8]

    # Extract Certifications/Testing
    cert_match = re.search(r'(?:Certification|Testing|CERTIFICATION|TESTING)(.*?)(?:Disclaimer|DISCLAIMER|$)', text, re.DOTALL | re.IGNORECASE)
    if cert_match:
        cert_text = cert_match.group(1).strip()
        certs = re.split(r'●', cert_text)
        sections['certifications'] = [c.strip().rstrip('.') for c in certs if len(c.strip()) > 5][:10]

    return sections

def generate_html(product_name, tagline, sections):
    """Generate HTML content"""

    # Format description with paragraphs
    desc_paragraphs = sections['product_overview'].replace('\n\n', '<br><br>')

    # Generate feature items
    features_html = '\n'.join([
        f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{feature}</span>
                    </div>''' for feature in sections['key_features']
    ])

    # Generate performance advantages
    advantages_html = '\n'.join([
        f'''                    <div class="feature-item">
                        <span class="bullet">●</span>
                        <span class="feature-text">{adv}</span>
                    </div>''' for adv in sections['performance_advantages']
    ])

    # Generate properties table rows
    properties_html = '\n'.join([
        f'''                        <tr>
                            <td>{prop['property']}</td>
                            <td>{prop['value']}</td>
                        </tr>''' for prop in sections['technical_properties']
    ])

    # Generate applications
    applications_html = '\n'.join([
        f'''                <div class="feature-item">
                    <span class="bullet">●</span>
                    <span class="feature-text">{app}</span>
                </div>''' for app in sections['applications']
    ])

    # Generate service media
    service_media_html = '\n'.join([
        f'''                <div class="feature-item">
                    <span class="bullet">●</span>
                    <span class="feature-text">{media}</span>
                </div>''' for media in sections['service_media']
    ])

    # Generate benefits
    benefits_html = '\n'.join([
        f'''                <div class="benefit-item">
                    <span class="check-icon">✓</span>
                    <span>{benefit}</span>
                </div>''' for benefit in sections['performance_benefits']
    ])

    # Generate certifications
    certifications_html = '\n'.join([
        f'''                <div class="feature-item">
                    <span class="bullet">●</span>
                    <span class="feature-text">{cert}</span>
                </div>''' for cert in sections['certifications']
    ])

    html_template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product_name} - Technical Datasheet</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        @page {{
            size: A4 portrait;
            margin: 0;
        }}

        @media print {{
            body {{
                margin: 0;
                padding: 0;
            }}
            .product-image-container {{
                box-shadow: none !important;
            }}
        }}

        html {{
            margin: 0;
            padding: 0;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #2b2a29;
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
        }}

        /* Page 1 - Hero */
        .page-1 {{
            width: 210mm;
            height: 297mm;
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
            background-image: url('../../oil and gas.jpg');
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
            width: 210mm;
            height: 297mm;
            background: white;
            position: relative;
            page-break-after: always;
        }}

        /* Page 3 - Properties */
        .page-3 {{
            width: 210mm;
            height: 297mm;
            background: white;
            position: relative;
            page-break-after: always;
        }}

        /* Page 4 - Performance Benefits */
        .page-4 {{
            width: 210mm;
            height: 297mm;
            background: white;
            position: relative;
        }}

        .page-2-header {{
            background: linear-gradient(135deg, #2b2a29 0%, #1a1918 100%);
            padding: 12mm 15mm;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .page-2-title {{
            font-size: 28pt;
            font-weight: bold;
        }}

        .content-section {{
            padding: 10mm 15mm;
        }}

        .description-with-image {{
            margin-bottom: 6mm;
        }}

        .description-text {{
            display: block;
        }}

        .description {{
            font-size: 10pt;
            line-height: 1.5;
            color: #333;
            margin-bottom: 0;
            text-align: justify;
        }}

        .side-product-image {{
            float: right;
            margin-left: 5mm;
            margin-bottom: 5mm;
        }}

        .product-image-container {{
            background: white;
            border-radius: 5mm;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 3px solid #e31e24;
        }}

        .product-image-small {{
            height: 50mm;
            border-radius: 4mm;
            object-fit: contain;
            display: block;
        }}

        .section-divider {{
            height: 2px;
            background: #e31e24;
            margin: 5mm 0;
        }}

        .features-grid {{
            display: flex;
            gap: 10mm;
            margin-bottom: 0;
        }}

        .features-column {{
            flex: 1;
        }}

        .features-column h3 {{
            font-size: 12pt;
            color: #2b2a29;
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #e31e24;
            font-weight: 600;
        }}

        .feature-item {{
            display: flex;
            margin-bottom: 1mm;
            font-size: 8.5pt;
            line-height: 1.4;
        }}

        .bullet {{
            color: #e31e24;
            font-weight: bold;
            margin-right: 3mm;
            font-size: 8pt;
            margin-top: 0.8mm;
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
                <img src="../../../src/assets/inmarco-tagline-logo1.png" alt="INMARCO - Innovations in Fluid Sealing">
            </div>
        </div>

        <div class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="red-accent"></div>
                <h1 class="product-name">{product_name}</h1>
                <p class="product-tagline">{tagline}</p>
            </div>
        </div>
    </div>

    <!-- Page 2 - Technical Details -->
    <div class="page-2">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">{product_name}</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="description-with-image">
                <div class="description-text">
                    <p class="description" style="margin-bottom: 0;">
                        {desc_paragraphs}
                    </p>
                </div>
            </div>

            <div class="section-divider"></div>

            <div class="features-grid">
                <div class="features-column">
                    <h3>Key Features</h3>
{features_html}
                </div>

                <div class="features-column">
                    <h3>Performance Advantages</h3>
{advantages_html}
                </div>
            </div>
            </div>
        </div>
    </div>

    <!-- Page 3 - Technical Properties and Applications -->
    <div class="page-3">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">{product_name}</h2>
            </div>
        </div>

        <div class="content-section">
            {'<div class="properties-section"><h3>Technical Properties</h3><table class="properties-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>' + properties_html + '</tbody></table></div>' if properties_html else ''}
            {'<div class="features-column"><h3>Applications</h3>' + applications_html + '</div>' if applications_html else ''}
        </div>
    </div>

    <!-- Page 4 - Performance Benefits -->
    <div class="page-4">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">{product_name}</h2>
            </div>
        </div>

        <div class="content-section">
            {'<div class="benefits-box"><h3>Performance Benefits</h3>' + benefits_html + '</div>' if benefits_html else ''}

            {'<div class="features-column"><h3>Service Media</h3>' + service_media_html + '</div>' if service_media_html else ''}

            {'<div class="features-column"><h3>Certification & Testing</h3>' + certifications_html + '</div>' if certifications_html else ''}
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
                        All technical information, recommendations, and performance data provided in this technical datasheet are based on current knowledge, laboratory testing, and industrial experience. Actual product performance may vary depending on operating conditions, equipment design, installation practices, process media, pressure, temperature, and application environment.
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>'''

    return html_template

# Batch 1 files with their taglines
batch1_files = [
    ("107HD Changes.docx", "HY 107HD", "High-density combination packing for critical fertilizer plant operations"),
    ("750 SS Welding Blanket Changes.docx", "750 SS Welding Blanket", "High-temperature protection solution for welding applications"),
    ("Aramid Wiping Pad Changes.docx", "Aramid Wiping Pad", "High-performance surface preparation and cleaning solution"),
    ("CG 100 Changes.docx", "CG 100", "Compressed non-asbestos fiber sheet gasket material"),
    ("CG 101 Changes.docx", "CG 101", "Enhanced compressed fiber gasket for demanding applications"),
    ("CG 102 Changes.docx", "CG 102", "Premium compressed fiber sheet for critical sealing"),
    ("CORRUGATED METAL GASKET Changes.docx", "Corrugated Metal Gasket", "Precision-engineered metallic sealing solution"),
    ("DOUBLE JACKETED GASKET (DJ)Changes.docx", "Double Jacketed Gasket", "Superior protection and sealing for aggressive media"),
    ("FG 320 Changes.docx", "FG 320", "Flexible graphite sheet for high-temperature applications"),
    ("GM 300Z Changes.docx", "GM 300Z", "Advanced compressed fiber gasket material"),
]

# Process batch 1
base_dir = "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website/public/Datasheet lot"
output_dir = "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website/public/datasheets/new_generated_html"

print("Processing Batch 1...")
print("=" * 60)

for filename, product_name, tagline in batch1_files:
    filepath = os.path.join(base_dir, filename)
    output_filename = product_name.replace(' ', '_').replace('/', '_') + '.html'
    output_path = os.path.join(output_dir, output_filename)

    print(f"\nProcessing: {filename}")
    print(f"  Product: {product_name}")

    # Extract text
    text = extract_text_from_docx(filepath)
    if not text:
        print("  ✗ Failed to extract text")
        continue

    # Parse sections
    sections = parse_sections(text)

    # Generate HTML
    html_content = generate_html(product_name, tagline, sections)

    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"  ✓ Generated: {output_filename}")

print("\n" + "=" * 60)
print("Batch 1 complete!")
print("=" * 60)
