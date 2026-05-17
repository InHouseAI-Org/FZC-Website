#!/usr/bin/env python3
"""
Create 5 datasheets with complete HTML template
"""

import os

# Datasheet data
datasheets = {
    "HY_107": {
        "code": "HY 107",
        "tagline": "High Mechanical Resistance With Exceptional Flexibility And Wide Material Compatibility",
        "industry": "fertilizer",
        "hero_image": "http://localhost:8765/public/fertilizer.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/HY%20107/HY%20107_1.png",
        "desc1": "HY 107 is a unique multi yarn packing designed for harsh applications having Aramid filament yarn at the corners and PTFE graphited yarn at the faces having core of Aramid filament.",
        "desc2": "This packing provides low friction due to graphite lubricated PTFE faces but ensures resistance to abrasion with tough Aramid filament at the corner. These features contribute to its ability to deliver extended, leak-free performance. Whether in demanding industrial applications or critical sealing scenarios, this packing material ensures reliability and longevity.",
        "features": [
            "Dense construction ensures minimal gaps or voids, contributing to exceptional sealability",
            "When compressed, forms a tight barrier effectively preventing fluid leakage",
            "Designed to withstand high pressure conditions with robust materials and construction",
            "Maintains integrity even under substantial pressure in pumps, valves, or other equipment",
            "Extreme durability when exposed to Ammonia and Carbamate solutions",
            "Tested and qualified as per EN16752 (Centrifugal pumps test procedure for seal packing), tightness class T2"
        ],
        "applications": [
            "Wide chemical resistance handling various corrosive substances without compromising sealing properties",
            "Excellent abrasion resistance ensuring longevity in demanding industrial settings",
            "Penetrates well into irregular surfaces conforming closely to equipment",
            "Ideal for pumps, valves, and other equipment requiring reliable sealing"
        ],
        "tech_props": [
            ("pH", "1-13"),
            ("Temperature (°C)", "-240 to +260"),
            ("Pressure (BAR)", "25 / 100 / 250"),
            ("Velocity (m/s)", "20 / 2 / -"),
            ("Size", "6sq mm TO 28sq mm")
        ],
        "benefits": [
            "Superior compression and recovery characteristics with out-of-true shafts and spindles",
            "Excellent extrusion resistance",
            "Low shaft wear",
            "Exceptional sealability with dense construction",
            "Tested and certified for reliability"
        ]
    },

    "HY_606": {
        "code": "HY 606",
        "tagline": "Engineered for Extreme Abrasion and Corrosion Resistance",
        "industry": "power",
        "hero_image": "http://localhost:8765/public/power.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/HY%20606/HY_606_1.png",
        "desc1": "HY 606 is a high-performance packing made from abrasion-resistant Aldehyde fibre yarn. It is impregnated with PTFE-based Inflon dispersion and treated with break-in and run-in lubricants. These additives reduce friction and protect sleeves and shafts from erosion.",
        "desc2": "The packing's core of Red Inmalon yarn adds resilience and structural strength. Its tough construction ensures dimensional stability and resistance to deformation, making it ideal for demanding industrial operations.",
        "features": [
            "Made from Aldehyde fibre yarn offering exceptional durability against mechanical wear",
            "Resists chemical and acidic reactions ensuring long-term performance in corrosive conditions",
            "Impregnated with Inflon dispersion and dual lubricants minimizing friction",
            "Red Inmalon yarn core provides elasticity and strength",
            "Tough construction resists deformation ensuring consistent sealing performance",
            "Reduces energy loss and wear contributing to smoother equipment function"
        ],
        "applications": [
            "Designed to perform reliably across various equipment types",
            "Suitable for pumps, valves, mixers, and reactors",
            "Ideal for both rotary and reciprocating equipment in tough conditions",
            "Flexible solution for multiple applications"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +300"),
            ("Pressure (BAR)", "300"),
            ("Size", "6sq mm TO 50sq mm")
        ],
        "benefits": [
            "Exceptional resistance to high temperatures and thermal stress",
            "Low friction performance due to advanced PTFE-based lubrication",
            "Suitable for both rotary and reciprocating equipment",
            "Resilient core construction ensures long-lasting structural integrity",
            "Maintains dimensional stability under mechanical and thermal loads"
        ]
    },

    "PA_106": {
        "code": "PA 106",
        "tagline": "High-Performance Abrasion & Brine Resistant Packing for Extreme Conditions",
        "industry": "power",
        "hero_image": "http://localhost:8765/public/power.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PA%20106/PA_106_1.png",
        "desc1": "PA 106 is a high-performance packing made from abrasion-resistant co-polymer fiber yarn, impregnated with PTFE-based Inflon dispersion. It offers excellent resistance to brine, corrosive media, and acidic reactions, making it ideal for harsh industrial environments.",
        "desc2": "Enhanced with break-in and run-in lubricants, it ensures low friction, prevents sleeve and shaft erosion, and maintains dimensional stability under high pressure and temperature. This robust design guarantees long service life and reliable sealing in demanding applications.",
        "features": [
            "Made from tough co-polymer fiber yarn ensuring durability in abrasive environments",
            "PTFE-based impregnation provides excellent resistance to saline water and corrosive chemicals",
            "Incorporates break-in and run-in lubricants for smooth installation and reduced friction",
            "Maintains shape and integrity even under extreme operating conditions",
            "Suitable for a wide range of aggressive media including slurries and chemicals",
            "Ideal for pumps, valves, mixers, reactors in challenging environments"
        ],
        "applications": [
            "Suitable for rotating or reciprocating equipment",
            "Compatible with corrosive and slurry-based media",
            "Ideal for pumps, valves, mixers, and reactors",
            "Designed for heavy-duty industrial equipment"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +300"),
            ("Pressure (BAR)", "500"),
            ("Size", "6sq mm TO 50sq mm")
        ],
        "benefits": [
            "Exceptional resistance to abrasion and brine for reliable performance",
            "PTFE-based impregnation ensures superior chemical resistance",
            "Dual lubrication system provides smooth break-in and extended life",
            "Maintains dimensional stability under extreme conditions",
            "Designed for long service life with reduced maintenance"
        ]
    },

    "CG_900": {
        "code": "CG 900",
        "tagline": "Precision Packing for Demanding Applications",
        "industry": "power",
        "hero_image": "http://localhost:8765/public/power.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/CG%20900/CG_900_1.png",
        "desc1": "Style CG 900 is a premium flexible expanded graphite fiber packing with high carbon content. It is impregnated with proprietary THERMOLUBE dispersion and reinforced with multiple Inconel/SS wires in each strand. The packing also incorporates an inorganic passive corrosion inhibitor to safeguard the parent body from galvanic corrosion and reduce loss on ignition.",
        "desc2": "This construction ensures excellent flexibility, making it ideal for wrapping around small-diameter shafts and spindles. The use of special-grade Inconel wire significantly enhances the mechanical strength of the packing, providing superior resistance to pressure surges. Tested and certified as per SHELL MESC SPEC 77/312 for fugitive emission.",
        "features": [
            "Contains Inorganic Passive Corrosion Inhibitor to prevent galvanic corrosion",
            "Reduces Loss on Ignition ensuring longer service life",
            "Easily wraps around small diameter shafts and spindles without compromising integrity",
            "Inconel wire reinforcement enhances resistance to pressure surges and mechanical stress",
            "Minimal volume loss during operation preventing premature leakage",
            "Automatically adapts during gland tightening reducing maintenance needs"
        ],
        "applications": [
            "THERMOLUBE dispersion fills micro-gaps between yarns ensuring tight sealing",
            "Tested and certified as per SHELL MESC SPEC 77/312",
            "Suitable for pumps and valves in demanding applications",
            "Ideal for fugitive emission control"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +650"),
            ("Pressure (BAR)", "500"),
            ("Size", "3sq mm TO 50sq mm")
        ],
        "benefits": [
            "Ensures dimensional stability under high pressure",
            "Allows flexibility for wrapping around small shafts and spindles",
            "Supports self-adjustment during gland tightening",
            "Reduces loss on ignition preserving packing volume",
            "Offers excellent thermal conductivity and chemical resistance"
        ]
    },

    "HY_501": {
        "code": "HY 501",
        "tagline": "Versatile Packing with Superior Chemical and Thermal Resistance",
        "industry": "fertilizer",
        "hero_image": "http://localhost:8765/public/fertilizer.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/HY%20501/HY_501_1.png",
        "desc1": "HY 501 is a versatile hybrid packing made from Non-Metallic Expanded Pure Graphite yarn. It is impregnated with proprietary Graphite-based dispersion and an INORGANIC PASSIVE CORROSION INHIBITOR. This combination ensures excellent chemical resistance, thermal conductivity, and protection against galvanic corrosion.",
        "desc2": "The packing adapts to surface irregularities, ensuring smooth performance and excellent dry run capabilities. It is chemically inert, self-lubricating, and suitable for use across pumps and valves. Each yarn and the four corners are reinforced with Carbon filament, enhancing its strength.",
        "features": [
            "Made from Non-Metallic Expanded Pure Graphite yarn",
            "Each yarn and corners reinforced with Carbon filament enhancing strength",
            "Exhibits high chemical resistance and excellent thermal conductivity",
            "Non-sticky and does not corrode or erode parent equipment",
            "Self-lubricating to prevent shaft or stem wear",
            "Chemically inert not leaching out any chemicals during operation"
        ],
        "applications": [
            "Unique construction suitable for all types of pumps and valves",
            "Adapts easily to surface irregularities and conforms to stuffing box dimensions",
            "Can be used as an anti-extrusion ring",
            "Suitable for both dynamic and static applications Class 150 up to Class 1500"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +650 (2750°C in Non Oxidizing media)"),
            ("Pressure (BAR)", "150 / 450 / 450"),
            ("Velocity (m/s)", "25 / 20 / -"),
            ("Size", "6sq mm TO 50sq mm")
        ],
        "benefits": [
            "Exceptional chemical resistance to a wide range of media",
            "High thermal conductivity for efficient heat dissipation",
            "Low oxidation rate and long service life",
            "Fire-safe design for use in fire-rated applications",
            "Suitable for high-temperature applications"
        ]
    }
}

# HTML template
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{code} - Technical Datasheet</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
{CSS_STYLES}
    </style>
</head>
<body>
    <!-- Page 1 - Hero -->
    <div class="page-1">
        <div class="header">
            <div class="logo-section">
                <img src="http://localhost:8765/src/assets/inmarco-tagline-logo1.png" alt="INMARCO - Innovations in Fluid Sealing">
            </div>
        </div>

        <div class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="red-accent"></div>
                <h1 class="product-name">{code}</h1>
                <p class="product-tagline">{tagline}</p>
            </div>
        </div>
    </div>

    <!-- Page 2 - Technical Details -->
    <div class="page-2">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">Style {code}</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="description-with-image">
                <div class="description-text">
                    <p class="description">{desc1}</p>
                    <p class="description" style="margin-bottom: 0;">{desc2}</p>
                </div>

                <div class="side-product-image">
                    <div class="product-image-container">
                        <img src="{product_image}" alt="{code}" class="product-image-small" onerror="this.style.display='none'">
                    </div>
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
{tech_props_html}
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

# CSS (same for all)
CSS = """
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

        .page-2 {{
            width: 100%;
            height: 290mm;
            background: white;
            position: relative;
            page-break-after: always;
        }}

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

        .side-product-image {{
            flex-shrink: 0;
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
"""

# Generate HTML files
output_dir = "generated_html"
os.makedirs(output_dir, exist_ok=True)

for filename, data in datasheets.items():
    # Build HTML components
    features_html = '\n'.join([f'                    <div class="feature-item">\n                        <span class="bullet">●</span>\n                        <span class="feature-text">{feat}</span>\n                    </div>' for feat in data['features']])

    applications_html = '\n'.join([f'                    <div class="feature-item">\n                        <span class="bullet">●</span>\n                        <span class="feature-text">{app}</span>\n                    </div>' for app in data['applications']])

    tech_props_html = '\n'.join([f'                    <tr>\n                        <td>{name}</td>\n                        <td colspan="3" style="text-align: center;">{value}</td>\n                    </tr>' for name, value in data['tech_props']])

    benefits_html = '\n'.join([f'                <div class="benefit-item">\n                    <span class="check-icon">✓</span>\n                    <span>{ben}</span>\n                </div>' for ben in data['benefits']])

    # Format CSS with hero image
    css_formatted = CSS.format(hero_image=data['hero_image'])

    # Generate HTML
    html = HTML_TEMPLATE.format(
        code=data['code'],
        tagline=data['tagline'],
        desc1=data['desc1'],
        desc2=data['desc2'],
        product_image=data['product_image'],
        features_html=features_html,
        applications_html=applications_html,
        tech_props_html=tech_props_html,
        benefits_html=benefits_html,
        CSS_STYLES=css_formatted
    )

    # Write file
    output_file = os.path.join(output_dir, f"{filename}.html")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✅ Created: {filename}.html")

print(f"\n✅ All 5 datasheets created in {output_dir}/")
