#!/usr/bin/env python3
"""
Create batch 3 datasheets (PE 104A, PE 104C, PE 504P, PE 508, PE 509)
Data extracted from original PDF datasheets
"""

import os

# Datasheet data extracted from original PDFs
datasheets = {
    "PE_104A": {
        "code": "PE 104A",
        "tagline": "High Performance Sealing with Strength of Aramid and Softness of PTFE",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PE%20104A/PE_104A_1.png",
        "desc1": "PE 104A is a high-performance gland packing developed for control valves in demanding industrial environments. It features an aramid yarn core that offers excellent mechanical strength and wear resistance. The outer PTFE jacket ensures smooth operation and chemical compatibility across various media.",
        "desc2": "Enhanced with fluoro polymer dispersion and corrosion inhibitors, PE 104A delivers long-lasting sealing performance. Its construction allows effective heat dissipation and minimal leakage. Style PE 104A delivers consistent sealing efficiency and long service life.",
        "features": [
            "The packing is built around a high-strength aramid yarn core, offering excellent resistance to wear, abrasion, and mechanical stress ideal for dynamic valve operations",
            "The outer layer of pure PTFE yarn ensures low-friction sealing and superior chemical compatibility, enabling smooth valve movement and reduced energy loss",
            "The packing is treated with advanced fluoropolymer dispersion and corrosion inhibitors, enhancing its durability and resistance to aggressive industrial media",
            "A PTFE suspensoid acts as a blocking agent within the packing, effectively sealing micro-paths and minimizing leakage even under fluctuating conditions",
            "The packing adapts well to surface imperfections, ensuring a tight seal and reducing the risk of bypass leakage in both static and dynamic applications",
            "Designed for user convenience, PE 104A allows quick installation and removal, minimizing downtime during maintenance and improving operational efficiency",
            "Suitable for a wide range of fluids including steam, hydrocarbons, acids, alkalis, and solvents, making it a reliable choice across multiple industries"
        ],
        "applications": [
            "Developed specifically for control valves in demanding industrial environments",
            "Suitable for both dynamic and static sealing applications",
            "Compatible with steam, hydrocarbons, acids, alkalis, and solvents",
            "Ideal for industries requiring reliable sealing with minimal maintenance"
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
            "Quick installation and removal for improved operational efficiency"
        ]
    },

    "PE_104C": {
        "code": "PE 104C",
        "tagline": "Innovative Packing with High-Tech Materials",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PE%20104C/PE_104C_1.png",
        "desc1": "104C is a high-performance gland packing designed for control valves operating under extreme industrial conditions. It offers excellent resilience, mechanical strength, and sealing reliability, making it ideal for high-pressure and high-temperature environments.",
        "desc2": "The packing features a carbon yarn core treated with fluoropolymer dispersion and corrosion inhibitors, surrounded by a pure PTFE yarn jacket lubricated with PTFE suspensoid. This advanced construction ensures long-lasting performance, chemical resistance, and smooth operation across a wide range of applications.",
        "features": [
            "The packing is constructed using a combination of PTFE and carbon yarn, engineered for durability and high performance",
            "Its carbon yarn core is reinforced to withstand mechanical stress and thermal fluctuations in control valve operations",
            "The outer PTFE jacket provides excellent chemical resistance and ensures smooth, low-friction sealing",
            "Treated with a fluoropolymer dispersion and corrosion inhibitor, the packing resists degradation in aggressive media",
            "The PTFE suspensoid acts as a blocking agent, enhancing sealing efficiency and reducing leakage",
            "Designed for easy installation and removal, minimizing downtime during maintenance",
            "Suitable for a wide range of industrial media, including hydrocarbons, steam, acids, alkalis, and solvents",
            "The packing conforms well to stuffing box dimensions, adapting to surface irregularities for optimal sealing",
            "Certified as per ISO 15848-CO2-BH-SSA0-t"
        ],
        "applications": [
            "Designed for control valves operating under extreme industrial conditions",
            "Suitable for both dynamic and static applications, including control and plug valves",
            "Compatible with hydrocarbons, steam, acids, alkalis, and solvents",
            "Ideal for frequently operated control valves requiring excellent leakage control"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-240 to +260"),
            ("Pressure (BAR)", "300"),
            ("Size", "6.5sq mm TO 50sq mm")
        ],
        "benefits": [
            "Excellent leakage control in frequently operated control valve",
            "High mechanical and thermal stability",
            "Very high recovery factor for reliable sealing",
            "PTFE suspensoid enhances sealing and blocks leakage paths",
            "Dissipates heat without hardening",
            "Easy to install and remove during maintenance",
            "ISO 15848-CO2-BH-SSA0-t certified"
        ]
    },

    "PE_504P": {
        "code": "PE 504P",
        "tagline": "High-Performance Premium Packing for Industrial Stress",
        "industry": "oilandgas",
        "hero_image": "http://localhost:8765/public/oil.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PE%20504P/PE_504P_1.png",
        "desc1": "The PE 504P is crafted from Premium grade expanded PTFE with graphite, molecularly bonded for enhanced performance. It delivers exceptional chemical resistance, outstanding heat dissipation, and high resilience, ensuring a longer service life. Its anti-friction properties also help prevent wear and erosion on shafts and sleeves.",
        "desc2": "The packing maintains dimensional stability, needs minimal gland pressure, and operates reliably at high speeds with low leakage. It is compatible with a broad range of industrial media, except for strong oxidizers, molten alkali metals, and fluorine compounds. It is perfectly suited for pumps, valves, reactors, and other high-performance industrial applications.",
        "features": [
            "PE 504P is made from a distinctive combination of Premium grade PTFE and Graphite, designed to deliver improved performance",
            "The packing is engineered to provide exceptional heat dissipation and chemical resistance in demanding industrial conditions",
            "Its friction-reducing design protects rotating machinery from wear and erosion during prolonged use",
            "The strong, durable build keeps its shape and ensures secure sealing even during changing conditions",
            "Its broad chemical compatibility enables usage across a variety of industrial applications",
            "Widely recognized across sectors for its reliable performance and low upkeep demands",
            "Commonly deployed in pumps, valves, agitators, and various high-speed rotary systems",
            "Tested and qualified as per EN16752 (Centrifugal pumps test procedure for seal packing), tightness class T1"
        ],
        "applications": [
            "Perfectly suited for pumps, valves, reactors, and other high-performance industrial applications",
            "Commonly deployed in pumps, valves, agitators, and various high-speed rotary systems",
            "Compatible with a broad range of industrial media except strong oxidizers, molten alkali metals, and fluorine compounds",
            "Ideal for high-speed operations requiring minimal wear"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +300"),
            ("Pressure (BAR)", "100 / 200 / 300"),
            ("Velocity (m/s)", "25 / 10 / ---"),
            ("Size", "3sq mm TO 35sq mm")
        ],
        "benefits": [
            "Engineered to endure and perform reliably in challenging operational conditions",
            "Optimized for smooth performance and expanded equipment life through minimal wear",
            "Ensures consistent sealing with reduced maintenance needs",
            "Suited for diverse industrial processes and compatible with various media types",
            "Performs reliably under dynamic conditions including high-speed operations",
            "Facilitates streamlined and secure functioning across multiple process industry sectors",
            "EN16752 qualified with Tightness class T1 certification"
        ]
    },

    "PE_508": {
        "code": "PE 508",
        "tagline": "Versatile Packing for Dynamic and Static Applications",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PE%20508/PE_508_1.png",
        "desc1": "PE 508 is a diagonally braided packing made from pure PTFE filament yarn, integrated with a proprietary break-in lubricant. This combination ensures smooth startup, enhanced pressure resistance, and long-lasting performance. Its non-toxic and inert composition supports safe and stable operation.",
        "desc2": "The packing is dimensionally stable, offering consistent sealing performance over extended use. It minimizes maintenance needs and ensures operational reliability, making it ideal for demanding industrial environments where durability and precision are critical.",
        "features": [
            "Made from high-quality pure PTFE filament yarn, ensuring excellent chemical resistance and non-reactivity with process media",
            "The unique diagonal braid enhances structural integrity, providing uniform sealing pressure and dimensional stability",
            "Proprietary lubricant embedded in the yarn allows smooth startup and reduces wear during initial operation",
            "Performs reliably across a broad temperature range (–240°C to +290°C) and pH spectrum (0–14), suitable for diverse environments",
            "Withstands pressures up to 350 bar, making it ideal for demanding sealing applications in industrial systems",
            "Its stable structure minimizes leakage and wear, reducing downtime and maintenance costs over extended use",
            "Non-toxic and chemically inert, ensuring safe handling and compatibility with sensitive or hazardous fluids"
        ],
        "applications": [
            "Suitable for both rotary and static sealing applications across industrial equipment",
            "Ideal for demanding industrial environments where durability and precision are critical",
            "Compatible with sensitive or hazardous fluids requiring non-toxic and inert materials",
            "Designed for pumps, valves, and high-pressure industrial systems"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-240 to +290"),
            ("Pressure (BAR)", "350"),
            ("Size", "3sq mm TO 35sq mm")
        ],
        "benefits": [
            "Exceptional resistance to high pressure and mechanical stress",
            "Dimensionally stable design ensures consistent sealing and long service life",
            "Integrated break-in lubricant enables smooth startup and reduces initial wear",
            "Suitable for both rotary and static sealing applications across industrial equipment",
            "Non-toxic and chemically inert for safe and clean operation",
            "Low friction and wear characteristics enhance equipment efficiency",
            "Designed for reliable performance in demanding industrial environments"
        ]
    },

    "PE_509": {
        "code": "PE 509",
        "tagline": "High-Performance PTFE Braided Packing for General Industrial Applications",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PE%20509/PE_509_1.png",
        "desc1": "PE 509 is crafted from 100% pure PTFE, offering excellent chemical resistance and thermal stability. It is designed for general industrial applications where clean, non-toxic, and non-flammable materials are essential. The packing ensures reliable sealing performance with minimal maintenance.",
        "desc2": "Its square-section design and skin-friendly nature make it ideal for diverse environments. With low dust generation and high durability, Style PE 509 supports safe handling and long service life. It is environmentally safe, recyclable, and suitable for use across a wide range of plant operations.",
        "features": [
            "Manufactured using high-purity PTFE, this packing offers outstanding resistance to chemicals and thermal stress, making it ideal for a wide range of industrial applications",
            "The material is non-hazardous and gentle on the skin, ensuring safe handling and use in environments where cleanliness and safety are priorities",
            "It remains stable under elevated temperatures and does not support combustion, providing reliable performance in heat-intensive operations",
            "Designed to minimize dust generation, this packing helps maintain a cleaner workspace and reduces the risk of airborne particles during handling",
            "Its inert nature allows it to perform effectively in contact with a broad spectrum of chemicals, making it suitable for diverse sealing needs",
            "The product is recyclable and poses no known environmental hazards when used and disposed of properly, supporting sustainable practices",
            "With a robust braided structure, it adapts well to various sealing configurations and maintains integrity over extended use"
        ],
        "applications": [
            "Designed for general industrial applications where clean, non-toxic, and non-flammable materials are essential",
            "Suitable for both static and dynamic sealing applications across various industries",
            "Ideal for diverse environments requiring safe handling and long service life",
            "Compatible with a wide range of plant operations and industrial chemicals"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-240 to +260"),
            ("Pressure (BAR)", "300"),
            ("Size", "6.5sq mm TO 50sq mm")
        ],
        "benefits": [
            "Exceptional resistance to high temperatures and chemically aggressive environments",
            "Non-toxic, non-flammable, and safe for use in clean and sensitive applications",
            "Low dust generation ensures a cleaner workspace and safer handling",
            "Suitable for both static and dynamic sealing applications across various industries",
            "Stable under thermal stress without releasing hazardous fumes under normal use",
            "Environmentally safe design with recyclable material composition",
            "Compatible with a wide range of industrial chemicals and process conditions"
        ]
    }
}

# HTML template (same as before)
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
