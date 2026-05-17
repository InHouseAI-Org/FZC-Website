#!/usr/bin/env python3
"""
Create batch 2 datasheets (PE 104, HY 105T, OR 125, PA 106E, PA 499)
Data extracted from original PDF datasheets
"""

import os

# Datasheet data extracted from original PDFs
datasheets = {
    "PE_104": {
        "code": "PE 104",
        "tagline": "Versatile Packing for Dynamic and Static Applications",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PE%20104/PE_104_1.png",
        "desc1": "PE 104 is a high-performance packing made from virgin PTFE fiber yarn, interlock braided with proprietary lubricant and PTFE dispersion. Its non-toxic and chemically inert nature ensures purity and safety of fluid media. The construction offers excellent dimensional stability and resists disintegration during use.",
        "desc2": "It is designed for reliable, leak-free performance in both dynamic and static conditions. The packing maintains its integrity under demanding operational parameters, helping reduce maintenance and downtime. Style PE 104 delivers consistent sealing efficiency and long service life.",
        "features": [
            "Made from high-quality virgin PTFE fiber yarn, ensuring excellent chemical resistance and purity in sealing applications",
            "The interlock braided structure enhances mechanical strength and prevents unraveling, even under high stress",
            "Incorporates a special lubricant and PTFE dispersion within the molecular structure, reducing friction and wear during operation",
            "Maintains shape and integrity under varying pressures and temperatures, suitable for both dynamic and static conditions",
            "Safe for use in sensitive environments, as it does not contaminate the media and remains chemically inert",
            "Designed for extended service life with minimal maintenance, reducing downtime and operational costs",
            "Withstands mechanical stress and chemical exposure without breaking down, even in demanding environments",
            "Tested and certified as per EN16752 (Centrifugal pumps test procedure for seal packing), Tightness class T1"
        ],
        "applications": [
            "Suitable for both dynamic and static sealing applications",
            "Non-toxic and inert, ideal for use in clean and sensitive environments",
            "Compatible with pumps, valves, and rotating equipment across diverse industries",
            "FDA certified as per 21.CFR.177.1550 for food contact applications"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-240 to +260"),
            ("Pressure (BAR)", "300"),
            ("Size", "6.5sq mm TO 50sq mm")
        ],
        "benefits": [
            "Exceptional dimensional stability for consistent sealing under varying conditions",
            "Resists disintegration during operation, ensuring long-term reliability",
            "Non-toxic and inert, ideal for use in clean and sensitive environments",
            "Low friction and wear due to proprietary PTFE dispersion and lubricant",
            "Designed for extended service life with minimal maintenance requirements",
            "EN16752 qualified with Tightness class T1 certification"
        ]
    },

    "HY_105T": {
        "code": "HY 105T",
        "tagline": "Advanced Aramid-PTFE Packing for Superior Strength",
        "industry": "fertilizer",
        "hero_image": "http://localhost:8765/public/fertilizer.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/HY%20105T/HY_105T_1.png",
        "desc1": "HY 105T is a high-performance gland packing made from Aldehyde Yarn corners and PTFE Yarn faces, reinforced with a resilient PTFE cord core. Its dense braided construction ensures excellent strength, dimensional stability, and sealing capability under extreme conditions. This makes it ideal for pumps, valves, mixers, and reactors.",
        "desc2": "The packing is lubricated with advanced fluoropolymer and inert compounds, reducing friction and wear during operation. It handles a wide range of aggressive media like ammonia, urea, carbamate, and dry abrasives. With high pressure resistance and broad chemical compatibility, it excels in fertilizer, chemical, and paint industries.",
        "features": [
            "Combines Aldehyde Yarn corners with PTFE Yarn faces and a high-tensile PTFE cord core, delivering superior mechanical strength and sealing performance",
            "Withstands pressures up to 500 bar, making it ideal for high-pressure applications in pumps, valves, and reactors",
            "PTFE fibers and specialized lubricants reduce friction, ensuring cooler shaft runs and minimizing wear on plungers and valve stems",
            "Resistant to a wide range of aggressive media including ammonia, urea, carbamate, detergents, pigments, and synthetic materials",
            "Performs reliably in dry, abrasive, and corrosive environments, extending service life even under harsh operating conditions",
            "Suitable for centrifugal, reciprocating, and plunger pumps, as well as agitators, mixers, extruders, and more",
            "Dense braided structure ensures excellent sealability and dimensional stability, reducing the risk of leakage or packing failure",
            "Lubricated with high-temperature inert compounds for extended service life"
        ],
        "applications": [
            "Ideal for use in centrifugal, reciprocating, and plunger pumps",
            "Suitable for valves, agitators, mixers, extruders, and reactors",
            "Designed for critical applications in the fertilizer industry",
            "Suitable for chemical and paint industries handling aggressive media"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +280"),
            ("Pressure (BAR)", "500"),
            ("Size", "5sq mm TO 35sq mm")
        ],
        "benefits": [
            "Exceptional high-pressure resistance up to 500 bar",
            "Low friction operation ensures minimal wear on shafts and plungers",
            "Excellent chemical compatibility with ammonia, urea, carbamate, and more",
            "Dense braided construction provides superior seal integrity and dimensional stability",
            "Suitable for centrifugal, reciprocating, and plunger pumps, as well as valves and mixers",
            "Performs reliably in dry, abrasive, and corrosive environments"
        ]
    },

    "OR_125": {
        "code": "OR 125",
        "tagline": "Proprietary Dispersion for Superior Chemical Resistance",
        "industry": "water",
        "hero_image": "http://localhost:8765/public/water.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/OR%20125/OR_125_1.png",
        "desc1": "OR 125 is a premium-grade packing made from high-strength acrylic fiber. It is impregnated with proprietary PTFE based dispersion, enhancing its chemical resistance and sealing performance. The packing offers excellent mechanical integrity and durability.",
        "desc2": "Its advanced composition ensures minimal shaft wear and superior lubrication. Designed for consistent performance, Style OR 125 is an economical and efficient solution for various industrial sealing needs.",
        "features": [
            "Impregnated with proprietary PTFE based dispersion, the packing offers superior resistance to a wide range of chemicals, ensuring long-term reliability in challenging environments",
            "Braided from strong acrylic fibers, it offers superior durability and tensile strength compared to traditional natural or vegetable fiber-based packings",
            "The PTFE treatment provides smooth lubrication, reducing friction and minimizing wear on shafts and other moving components",
            "The advanced impregnation process increases packing density, resulting in better sealing efficiency and reduced leakage under pressure",
            "Designed to balance performance and affordability, it serves as a reliable choice for industrial sealing without compromising on quality",
            "The packing maintains its integrity across a wide temperature range, ensuring consistent sealing performance even under fluctuating thermal conditions",
            "Designed to perform safely in clean water systems, it minimizes contamination and supports hygienic operation in sensitive environments"
        ],
        "applications": [
            "Safe for use in clean water systems and mild chemical environments",
            "Economical design suitable for general-purpose industrial sealing",
            "Compatible with pumps and valves in water treatment facilities",
            "Suitable for applications requiring minimal contamination"
        ],
        "tech_props": [
            ("pH", "4-10"),
            ("Temperature (°C)", "Ambient to +260"),
            ("Pressure (BAR)", "150"),
            ("Size", "3sq mm TO 35sq mm")
        ],
        "benefits": [
            "Enhanced sealing density through proprietary PTFE dispersion",
            "Excellent lubrication ensures minimal shaft wear and longer equipment life",
            "Superior mechanical strength compared to natural and vegetable fiber packings",
            "Safe for use in clean water systems and mild chemical environments",
            "Economical design suitable for general-purpose industrial sealing",
            "Maintains performance across a wide temperature range up to 260°C"
        ]
    },

    "PA_106E": {
        "code": "PA 106E",
        "tagline": "High Mechanical Resistant With Exceptional Flexibility And Wide Material Compatibility",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PA%20106E/PA_106E_1.png",
        "desc1": "PA 106E is a superior packing material designed to resist both abrasion and corrosion. It is crafted from Aramid fiber yarn, which is thoroughly impregnated with a PTFE suspension and incorporates a specialized inert lubricant for initial use.",
        "desc2": "This packing features an interlock construction. The combination of the run-in lubricant and PTFE suspension enhances its antifriction properties, thereby preventing wear on sleeves and shafts.",
        "features": [
            "The combination of fibrous Aramid and PTFE provides rich lubrication, significantly reducing friction even when sealing abrasive or viscous media, pigments, and molten synthetic formulations",
            "The tough fibrous Aramid construction ensures excellent dimensional stability and resistance to deformation under demanding conditions",
            "This packing offers outstanding resistance to penetration and fatigue caused by abrasive particles during service, ensuring long-lasting performance",
            "The packing material is non-contaminating, making it suitable for applications where purity is crucial",
            "Excellent slip properties protect shaft sleeves, reducing wear and extending the lifespan of equipment",
            "Additionally, its abrasion resistance ensures longevity, even in demanding industrial settings",
            "Dense impregnation provides blocking characteristics",
            "Tested and qualified as per EN16752 (Centrifugal pumps test procedure for seal packing), tightness class T2"
        ],
        "applications": [
            "Suitable for applications handling abrasive or viscous media",
            "Compatible with pigments and molten synthetic formulations",
            "Ideal for pumps and valves requiring superior abrasion resistance",
            "Non-contaminating design for purity-critical applications"
        ],
        "tech_props": [
            ("pH", "1-13"),
            ("Temperature (°C)", "-200 to +300"),
            ("Pressure (BAR)", "350 / 500 / 500"),
            ("Velocity (m/s)", "25 / 25 / ---"),
            ("Size", "6sq mm TO 50sq mm")
        ],
        "benefits": [
            "Excellent abrasion resistance",
            "Dense impregnation provides blocking characteristics",
            "Superior compression and recovery characteristics with out-of-true shafts and spindles",
            "Excellent extrusion resistance",
            "Low shaft wear",
            "EN16752 qualified with Tightness class T2 certification"
        ]
    },

    "PA_499": {
        "code": "PA 499",
        "tagline": "High Mechanical Resistant With Exceptional Flexibility And Wide Material Compatibility",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PA%20499/PA_499_1.png",
        "desc1": "PA 499 is an advanced synthetic packing tough, soft, flexible with enhanced sliding feature, impregnated with fluoropolymer dispersion. This new generation packing addresses the limitations of earlier synthetic packings, making it suitable for challenging applications combined with abrasion and chemical media.",
        "desc2": "By combining the durability of aramid with the low friction characteristics of material like carbon fiber, it stands out as an excellent choice for diverse applications. This innovative packing material offers flexibility, wear resistance, and efficient performance, while preventing abrasion and shaft damage, and is easy to install with minimal adjustments.",
        "features": [
            "Offers excellent flexibility and wear resistance, ensuring long-lasting performance",
            "Generates less heat during operation, enhancing efficiency and safety",
            "Safe for use in various environments without causing corrosion or contamination",
            "Resists abrasion effectively without causing sleeve scoring, unlike traditional aramid packing",
            "Reduced water consumption: Significantly lowers water consumption, contributing to cost savings and environmental sustainability",
            "Prevents shaft scoring, a common issue with many synthetic packings",
            "Conforms readily to stuffing box configurations, allowing for easy installation with minimal gland torque and adjustments",
            "Protection against galvanic corrosion: Does not cause galvanic corrosion, thereby protecting the sleeve",
            "Tested and qualified as per EN16752 (Centrifugal pumps test procedure for seal packing), tightness class T2"
        ],
        "applications": [
            "Suitable for challenging applications combined with abrasion and chemical media",
            "Ideal for pumps and valves requiring low shaft wear",
            "Compatible with diverse industrial applications",
            "Easy installation with minimal gland torque and adjustments"
        ],
        "tech_props": [
            ("pH", "1-13"),
            ("Temperature (°C)", "-150 to +260"),
            ("Pressure (BAR)", "150 / 250 / ---"),
            ("Velocity (m/s)", "15 / 20 / ---"),
            ("Size", "5sq mm TO 50sq mm")
        ],
        "benefits": [
            "Excellent abrasion resistance",
            "Dense impregnation provides blocking characteristics",
            "Superior compression and recovery characteristics with out-of-true shafts and spindles",
            "Excellent extrusion resistance",
            "Low shaft wear",
            "Reduced water consumption for cost savings and environmental sustainability",
            "EN16752 qualified with Tightness class T2 certification"
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

        .version {{
            font-size: 8pt;
            color: #888;
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

        .industry-image {{
            display: none;
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
            margin-bottom: 8mm;
            line-height: 1;
        }}

        .tagline {{
            font-size: 13pt;
            color: #f0f0f0;
            line-height: 1.5;
            margin-bottom: 15mm;
        }}

        /* Page 2 - Details */
        .page-2 {{
            width: 100%;
            min-height: 297mm;
            background: white;
            padding: 15mm;
            page-break-after: always;
        }}

        .page-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10mm;
            padding-bottom: 5mm;
            border-bottom: 2px solid #e31e24;
        }}

        .page-title {{
            font-size: 24pt;
            font-weight: 700;
            color: #2b2a29;
        }}

        .content-section {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8mm;
            margin-bottom: 10mm;
        }}

        .product-image-container {{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 5mm;
        }}

        .product-image {{
            max-width: 100%;
            max-height: 60mm;
            object-fit: contain;
        }}

        .description {{
            font-size: 10pt;
            line-height: 1.6;
            color: #4a4a4a;
        }}

        .description p {{
            margin-bottom: 4mm;
        }}

        .section-title {{
            font-size: 14pt;
            font-weight: 700;
            color: #2b2a29;
            margin: 8mm 0 4mm 0;
            padding-bottom: 2mm;
            border-bottom: 2px solid #e31e24;
        }}

        .features-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
            margin-bottom: 8mm;
        }}

        .feature-item {{
            display: flex;
            align-items: flex-start;
            font-size: 9pt;
            line-height: 1.4;
            color: #4a4a4a;
        }}

        .feature-item i {{
            color: #e31e24;
            margin-right: 3mm;
            margin-top: 1mm;
            font-size: 8pt;
        }}

        /* Page 3 - Specifications */
        .page-3 {{
            width: 100%;
            min-height: 297mm;
            background: white;
            padding: 15mm;
        }}

        .spec-table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10mm;
        }}

        .spec-table th {{
            background: #2b2a29;
            color: white;
            padding: 4mm;
            text-align: left;
            font-size: 11pt;
            font-weight: 600;
        }}

        .spec-table td {{
            padding: 4mm;
            border: 1px solid #ddd;
            font-size: 10pt;
        }}

        .spec-table tr:nth-child(even) {{
            background: #f9f9f9;
        }}

        .benefits-list {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3mm;
            margin-bottom: 10mm;
        }}

        .benefit-item {{
            display: flex;
            align-items: flex-start;
            font-size: 9pt;
            line-height: 1.4;
            color: #4a4a4a;
        }}

        .benefit-item i {{
            color: #e31e24;
            margin-right: 3mm;
            margin-top: 1mm;
            font-size: 8pt;
        }}

        .footer {{
            position: absolute;
            bottom: 10mm;
            left: 15mm;
            right: 15mm;
            padding-top: 5mm;
            border-top: 2px solid #e31e24;
            font-size: 8pt;
            color: #666;
        }}

        .footer-content {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5mm;
        }}

        .footer h4 {{
            font-size: 9pt;
            color: #2b2a29;
            margin-bottom: 2mm;
        }}

        @media print {{
            body {{
                width: 210mm;
                height: 297mm;
            }}
            .page-1, .page-2, .page-3 {{
                page-break-after: always;
            }}
        }}
    </style>
</head>
<body>
    <!-- Page 1: Hero -->
    <div class="page-1">
        <div class="header">
            <div class="logo-section">
                <img src="http://localhost:8765/public/logo.png" alt="Inmarco Logo">
            </div>
        </div>
        <div class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="red-accent"></div>
                <h1 class="product-name">Style {code}</h1>
                <p class="tagline">{tagline}</p>
            </div>
        </div>
    </div>

    <!-- Page 2: Product Details -->
    <div class="page-2">
        <div class="page-header">
            <h2 class="page-title">{code}</h2>
        </div>

        <div class="content-section">
            <div class="product-image-container">
                <img src="{product_image}" alt="{code}" class="product-image">
            </div>
            <div class="description">
                <p>{desc1}</p>
                <p>{desc2}</p>
            </div>
        </div>

        <h3 class="section-title">Features</h3>
        <div class="features-grid">
{features_html}
        </div>

        <h3 class="section-title">Applications</h3>
        <div class="features-grid">
{applications_html}
        </div>
    </div>

    <!-- Page 3: Specifications -->
    <div class="page-3">
        <div class="page-header">
            <h2 class="page-title">Technical Specifications</h2>
        </div>

        <table class="spec-table">
            <thead>
                <tr>
                    <th>Properties</th>
                    <th>Values</th>
                </tr>
            </thead>
            <tbody>
{tech_props_html}
            </tbody>
        </table>

        <h3 class="section-title">Performance Benefits</h3>
        <div class="benefits-list">
{benefits_html}
        </div>

        <div class="footer">
            <div class="footer-content">
                <div>
                    <h4>INMARCO FZC</h4>
                    <p>P.O. Box 120284, Sharjah Airport International Free Zone (SAIF-Zone), Sharjah, UAE</p>
                    <p>Tel. No.: +971 6 5578378 | Fax No.: +971 6 5578948</p>
                </div>
                <div>
                    <h4>Contact Information</h4>
                    <p>Email: sales@inmarco.ae</p>
                    <p>Web: www.inmarco.ae</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>'''

# Create output directory
output_dir = "generated_html"
os.makedirs(output_dir, exist_ok=True)

# Generate HTML files
for key, data in datasheets.items():
    # Generate features HTML
    features_html = "\n".join([
        f'            <div class="feature-item"><i class="fas fa-check-circle"></i><span>{feature}</span></div>'
        for feature in data["features"]
    ])

    # Generate applications HTML
    applications_html = "\n".join([
        f'            <div class="feature-item"><i class="fas fa-check-circle"></i><span>{app}</span></div>'
        for app in data["applications"]
    ])

    # Generate technical properties HTML
    tech_props_html = "\n".join([
        f'                <tr><td><strong>{prop[0]}</strong></td><td>{prop[1]}</td></tr>'
        for prop in data["tech_props"]
    ])

    # Generate benefits HTML
    benefits_html = "\n".join([
        f'            <div class="benefit-item"><i class="fas fa-star"></i><span>{benefit}</span></div>'
        for benefit in data["benefits"]
    ])

    # Fill template
    html_content = HTML_TEMPLATE.format(
        code=data["code"],
        tagline=data["tagline"],
        hero_image=data["hero_image"],
        product_image=data["product_image"],
        desc1=data["desc1"],
        desc2=data["desc2"],
        features_html=features_html,
        applications_html=applications_html,
        tech_props_html=tech_props_html,
        benefits_html=benefits_html
    )

    # Write file
    output_path = os.path.join(output_dir, f"{key}.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"✓ Created {output_path}")

print(f"\n✓ Successfully created {len(datasheets)} datasheets in {output_dir}/")
