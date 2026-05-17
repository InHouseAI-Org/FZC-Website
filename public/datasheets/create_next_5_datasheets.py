#!/usr/bin/env python3
"""
Create next 5 datasheets (CG 101, CG 102, HY 105HD, PA 104A, PE 102)
"""

import os

# Datasheet data extracted from original PDFs
datasheets = {
    "CG_101": {
        "code": "CG 101",
        "tagline": "Advanced Sealing Solutions for Diverse Industrial Applications",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/CG%20101/CG_101_1.png",
        "desc1": "CG 101 is a high-performance packing manufactured from carbon filament yarn. It is impregnated with a thermally cured graphite-based in-therm dispersion, which acts as a blocking agent and further reduces stem friction. This packing is designed to prevent leakage of gaseous or liquid materials. Additionally, it incorporates a passive corrosion inhibitor to prevent galvanic corrosion.",
        "desc2": "Adequate lubrication allows for extremely low friction runs, making it strong yet pliable without brittleness. The packing also provides excellent heat dissipation for cooler shaft runs, ensuring superior sealing services.",
        "features": [
            "Thoroughly impregnated with graphite-based in-therm dispersion ensuring minimal gaps or voids",
            "Impregnation contributes to exceptional friction-free runs even in high endurance",
            "When compressed forms a tight barrier effectively preventing fluid leakage",
            "Designed to withstand high-pressure conditions with robust materials and construction",
            "Boasts wide chemical resistance handling various corrosive substances",
            "Handles acids, alkalis, solvents, organic chemicals, gases, steam and thermic fluids",
            "Abrasion resistance ensures longevity even in demanding industrial settings",
            "Packing material penetrates well into irregular surfaces conforming closely to equipment"
        ],
        "applications": [
            "Suitable for both dynamic and static applications",
            "Fire-safe design for use in inflammable applications",
            "Ideal for pumps, valves, and other equipment requiring reliable sealing",
            "Suitable for diverse industrial applications across multiple sectors"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +650"),
            ("Pressure (BAR)", "250"),
            ("Velocity (m/s)", "25"),
            ("Size", "3sq mm TO 50sq mm")
        ],
        "benefits": [
            "Resistant to a wide range of chemicals including acids, alkalis, solvents, gases and steam",
            "Excellent heat dissipation for cooler shaft runs ensuring superior sealing services",
            "Strong yet pliable without brittleness providing durability and flexibility",
            "Low oxidation rate and long service life in high-temperature applications",
            "Fire-safe design for use in inflammable applications"
        ]
    },

    "CG_102": {
        "code": "CG 102",
        "tagline": "Engineered for Extreme Conditions – Reliable Sealing with Advanced Graphite Technology",
        "industry": "oilandgas",
        "hero_image": "http://localhost:8765/public/oil.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/CG%20102/CG_102_1.png",
        "desc1": "CG 102 is crafted from premium expanded graphite yarn with 98% carbon content, reinforced with Inconel wire. It is impregnated with proprietary graphite based dispersion and a corrosion inhibitor to protect equipment from galvanic damage. This ensures durability and reliability in high-pressure environments.",
        "desc2": "The resilient inconel wire enhances structural strength, while the self-lubricating graphite aids stem adjustment during gland tightening. High temperature graphite based lubrication prevents leakage in both static and dynamic equipment, making it ideal for valves, autoclaves, and rotary kilns.",
        "features": [
            "Made from expanded graphite yarn with a minimum 98% carbon content",
            "Ensures excellent thermal conductivity and chemical resistance across a wide range of industrial media",
            "Braided with strong yet flexible Inconel wire maintaining structural integrity",
            "Optional multi-wire reinforcement for surge resistance",
            "Developed through in-house R&D this advanced dispersion prevents leakage",
            "Enhances sealing performance in both static and dynamic equipment",
            "The packing generates its own lubrication allowing smooth stem adjustment",
            "Integrated sacrificial metal corrosion inhibitors safeguard equipment from galvanic corrosion"
        ],
        "applications": [
            "Ideal for use in valves, autoclaves, rotary kilns",
            "Systems handling steam, hydrocarbons, thermic fluids, hot oil and cooling water",
            "Safe for use in sensitive environments as it does not contaminate the media",
            "Suitable for rotary and rising-stem valve applications from Class 150 to Class 1500"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-240 to +260"),
            ("Pressure (BAR)", "300"),
            ("Size", "3sq mm TO 50sq mm")
        ],
        "benefits": [
            "Exceptional high temperature resistance up to 3315°C in non-oxidizing media",
            "Low oxidation rate ensures long service life in extreme thermal environments",
            "Fire-safe design suitable for fire-rated industrial applications",
            "Reinforced with Inconel wire for superior pressure resistance and structural integrity",
            "Self-lubricating graphite aids stem adjustment and reduces wear during operation",
            "Corrosion inhibitor prevents galvanic corrosion protecting valve stems and bodies"
        ]
    },

    "HY_105HD": {
        "code": "HY 105HD",
        "tagline": "Designed for Critical Applications in Urea and Ammonia Systems",
        "industry": "fertilizer",
        "hero_image": "http://localhost:8765/public/fertilizer.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/HY%20105HD/HY_105HD_1.png",
        "desc1": "HY 105HD is a dense braided gland packing made with Aramid Yarn corners and PTFE Yarn faces. It includes a high-tensile Aramid fiber core for strength and dimensional stability. Designed for high-pressure and high-temperature environments.",
        "desc2": "This high-density packing is ideal for critical fertilizer industry applications. Aramid yarn is treated with antifrictional fluoropolymer and break-in lubricant, while PTFE faces use inert, heat-resistant lubricant. This ensures low friction and protects plunger and valve stems.",
        "features": [
            "High-Density Braided Construction densely braided using Aramid and PTFE yarns",
            "Ensures excellent sealability and dimensional stability under high mechanical stress",
            "Aramid Yarn corners provide structural strength and resistance to corner failures",
            "PTFE Yarn faces offer low friction and cool shaft operation",
            "Aramid fibers treated with antifrictional fluoropolymer and break-in lubricant",
            "PTFE faces lubricated with inert high-temperature-resistant compounds",
            "Resistant to ammonia, urea, carbamate condensate, detergents, pigments",
            "PTFE's low-friction properties reduce wear on plungers and valve stems"
        ],
        "applications": [
            "Ideal for use in centrifugal, reciprocating, and plunger pumps",
            "Suitable for valves, agitators, mixers, extruders, and reactors",
            "Designed for critical applications in the fertilizer industry",
            "Suitable for reciprocating, centrifugal and plunger pumps in fertilizer applications"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-200 to +300"),
            ("Pressure (BAR)", "100 / 200 / 300"),
            ("Velocity (m/s)", "25 / 10 / -"),
            ("Size", "3sq mm TO 35sq mm")
        ],
        "benefits": [
            "Exceptional high pressure resistance due to strong Aramid fiber core",
            "Low friction PTFE faces ensure cool shaft operation and reduced wear",
            "High-density braided construction for superior sealability and dimensional stability",
            "Wide chemical compatibility including ammonia, urea and carbamate solutions",
            "Operates effectively across a wide temperature range",
            "Designed for critical applications in the fertilizer industry with reliable performance"
        ]
    },

    "PA_104A": {
        "code": "PA 104A",
        "tagline": "High Performance Sealing with Strength of Aramid and Softness of PTFE",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PA%20104A/PA_104A_1.png",
        "desc1": "PA 104A is a high-performance gland packing developed for control valves in demanding industrial environments. It features an aramid yarn core that offers excellent mechanical strength and wear resistance. The outer PTFE jacket ensures smooth operation and chemical compatibility across various media.",
        "desc2": "Enhanced with fluoro polymer dispersion and corrosion inhibitors, PA 104A delivers long-lasting sealing performance. Its construction allows effective heat dissipation and minimal leakage. Style PA 104A delivers consistent sealing efficiency and long service life.",
        "features": [
            "Built around a high-strength aramid yarn core offering excellent resistance to wear and abrasion",
            "Ideal for dynamic valve operations and mechanical stress",
            "Outer layer of pure PTFE yarn ensures low-friction sealing and superior chemical compatibility",
            "Enables smooth valve movement and reduced energy loss",
            "Treated with advanced fluoropolymer dispersion and corrosion inhibitors",
            "PTFE suspensoid acts as a blocking agent within the packing",
            "Effectively sealing micro-paths and minimizing leakage",
            "Adapts well to surface imperfections ensuring a tight seal"
        ],
        "applications": [
            "Designed for user convenience allows quick installation and removal",
            "Minimizing downtime during maintenance and improving operational efficiency",
            "Suitable for a wide range of fluids including steam, hydrocarbons, acids, alkalis and solvents",
            "Suitable for both dynamic and static sealing applications"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-240 to +260"),
            ("Pressure (BAR)", "300"),
            ("Size", "6.5sq mm TO 50sq mm")
        ],
        "benefits": [
            "Exceptional dimensional stability for consistent sealing under varying conditions",
            "Resists disintegration during operation ensuring long-term reliability",
            "Non-toxic and inert ideal for use in clean and sensitive environments",
            "Low friction and wear due to proprietary PTFE dispersion and lubricant",
            "Designed for extended service life with minimal maintenance requirements"
        ]
    },

    "PE_102": {
        "code": "PE 102",
        "tagline": "Precision Engineered for Chemical Resistance and Thermal Stability",
        "industry": "chemical",
        "hero_image": "http://localhost:8765/public/chemical.jpg",
        "product_image": "http://localhost:8765/public/FZC%20Inmarco%20Product%20Shoot/PE%20102/PE_102_1.png",
        "desc1": "PE 102 is an inter-braided packing made from expanded PTFE and graphite fiber. This molecular blend offers excellent chemical resistance, reduced friction, and enhanced heat conduction. It ensures superior sealing performance compared to conventional PTFE graphite packings.",
        "desc2": "The packing uses K-fibre from WL Gore Inc., with graphite blended during polymerisation for structural integrity. This prevents disintegration, maintains lubrication, and supports long-term use. Ideal for pumps without cooling water, it delivers unmatched reliability and efficiency.",
        "features": [
            "With a unique PTFE and graphite blend withstands a wide range of corrosive media",
            "Includes acids, alkalis and organic chemicals",
            "Graphite integration improves heat dissipation allowing equipment to run cooler",
            "The packing minimizes friction against shafts and sleeves reducing wear",
            "Exhibits low thermal expansion maintaining consistent sealing performance",
            "Prevents static charge build-up making it safe for use in sensitive environments",
            "Graphite is molecularly bonded during polymerisation ensuring continuous lubrication",
            "Flexible and easy to cut simplifies fitting and maintenance"
        ],
        "applications": [
            "Suitable for pumps, valves, reactors and agitators across various industrial applications",
            "Ideal for pumps without cooling water delivers unmatched reliability",
            "Safe for use in sensitive chemical and hydrocarbon environments",
            "Superior sealing performance compared to conventional PTFE graphite packings"
        ],
        "tech_props": [
            ("pH", "0-14"),
            ("Temperature (°C)", "-240 to +300"),
            ("Pressure (BAR)", "300"),
            ("Size", "3sq mm TO 35sq mm")
        ],
        "benefits": [
            "Exceptional resistance to a wide range of chemicals including acids, alkali and hydrocarbons",
            "High thermal conductivity ensures cooler operation and reduced friction in dynamic equipment",
            "Low thermal expansion maintains sealing integrity under fluctuating temperatures",
            "No static charge build-up making it safe for sensitive chemical environments",
            "Graphite bonded during polymerization ensures long-term lubrication and prevents hardening"
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
