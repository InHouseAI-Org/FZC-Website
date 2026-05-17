#!/usr/bin/env python3
"""
Migrate old 3-page template files to new CG 100 4-page template.
Fixes:
- Absolute positioned footer
- Old CSS structure
- 3-page layout → 4-page layout
- spec-table → properties-table
- benefits-list → benefits-box
"""

import os
import re
from pathlib import Path

# Files to migrate
FILES_TO_MIGRATE = [
    "OR_125.html",
]

html_dir = Path("generated_html")

# Read the CG 100 template as reference
cg_100_path = html_dir / "CG_100.html"
with open(cg_100_path, 'r', encoding='utf-8') as f:
    cg_100_content = f.read()

# Extract CSS from CG 100
css_match = re.search(r'<style>(.*?)</style>', cg_100_content, re.DOTALL)
correct_css = css_match.group(1) if css_match else ""

def migrate_file(file_path):
    """Migrate a single file from old template to new CG 100 template."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract product name from title
    title_match = re.search(r'<title>(.*?) - Technical Datasheet</title>', content)
    product_code = title_match.group(1) if title_match else "Product"

    # Extract style name from hero
    style_match = re.search(r'<h1 class="product-name">Style (.*?)</h1>', content)
    style_name = style_match.group(1) if style_match else product_code

    # Extract tagline
    tagline_match = re.search(r'<p class="tagline">(.*?)</p>', content, re.DOTALL)
    tagline = tagline_match.group(1).strip() if tagline_match else "Advanced Sealing Solution"

    # Extract background image
    bg_match = re.search(r"background-image: url\('([^']+)'\);", content)
    bg_image = bg_match.group(1) if bg_match else "../../power.jpg"

    # Extract page title
    page_title_match = re.search(r'<h2 class="page-title">(.*?)</h2>', content)
    page_title = page_title_match.group(1) if page_title_match else style_name

    # Extract product image
    img_match = re.search(r'<img src="([^"]+)" alt="[^"]+" class="product-image">', content)
    product_image = img_match.group(1) if img_match else ""

    # Extract description paragraphs
    desc_section = re.search(r'<div class="description">(.*?)</div>', content, re.DOTALL)
    if desc_section:
        desc_paras = re.findall(r'<p>(.*?)</p>', desc_section.group(1), re.DOTALL)
        desc_1 = desc_paras[0].strip() if len(desc_paras) > 0 else ""
        desc_2 = desc_paras[1].strip() if len(desc_paras) > 1 else ""
    else:
        desc_1 = desc_2 = ""

    # Extract features
    features_section = re.search(r'<h3 class="section-title">Features</h3>\s*<div class="features-grid">(.*?)</div>', content, re.DOTALL)
    if features_section:
        feature_items = re.findall(r'<span>(.*?)</span>', features_section.group(1), re.DOTALL)
        features = [f.strip() for f in feature_items if f.strip()]
    else:
        features = []

    # Extract applications
    apps_section = re.search(r'<h3 class="section-title">Applications</h3>\s*<div class="features-grid">(.*?)</div>', content, re.DOTALL)
    if apps_section:
        app_items = re.findall(r'<span>(.*?)</span>', apps_section.group(1), re.DOTALL)
        applications = [a.strip() for a in app_items if a.strip()]
    else:
        applications = []

    # Extract technical specifications table
    spec_table = re.search(r'<table class="spec-table">.*?<tbody>(.*?)</tbody>', content, re.DOTALL)
    if spec_table:
        spec_rows = re.findall(r'<tr><td><strong>(.*?)</strong></td><td>(.*?)</td></tr>', spec_table.group(1))
    else:
        spec_rows = []

    # Extract performance benefits
    benefits_section = re.search(r'<h3 class="section-title">Performance Benefits</h3>\s*<div class="benefits-list">(.*?)</div>', content, re.DOTALL)
    if benefits_section:
        benefit_items = re.findall(r'<span>(.*?)</span>', benefits_section.group(1), re.DOTALL)
        benefits = [b.strip() for b in benefit_items if b.strip()]
    else:
        benefits = []

    # Build features HTML (2 columns)
    features_col1_items = []
    for f in features:
        features_col1_items.append(f'                    <div class="feature-item">\n                        <span class="bullet">●</span>\n                        <span class="feature-text">{f}</span>\n                    </div>')
    features_col1_html = "\n".join(features_col1_items)

    apps_items = []
    for a in applications:
        apps_items.append(f'                    <div class="feature-item">\n                        <span class="bullet">●</span>\n                        <span class="feature-text">{a}</span>\n                    </div>')
    apps_html = "\n".join(apps_items)

    features_html = f'''            <div class="features-grid">
                <div class="features-column">
                    <h3>Features</h3>
{features_col1_html}
                </div>

                <div class="features-column">
                    <h3>Applications</h3>
{apps_html}
                </div>
            </div>'''

    # Build specs table HTML
    specs_items = []
    for prop, val in spec_rows:
        specs_items.append(f'                        <tr>\n                            <td>{prop}</td>\n                            <td>{val}</td>\n                        </tr>')
    specs_html = "\n".join(specs_items)

    # Build benefits HTML
    benefits_items = []
    for b in benefits:
        benefits_items.append(f'                <div class="benefit-item">\n                    <span class="check-icon">✓</span>\n                    <span>{b}</span>\n                </div>')
    benefits_html = "\n".join(benefits_items)

    # Build new HTML with CG 100 template structure
    new_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product_code} - Technical Datasheet</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
{correct_css}
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

        <div class="hero-section" style="background-image: url('{bg_image}');">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="red-accent"></div>
                <h1 class="product-name">{style_name}</h1>
                <p class="product-tagline">{tagline}</p>
            </div>
        </div>
    </div>

    <!-- Page 2 - Technical Details -->
    <div class="page-2">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">{page_title}</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="description-with-image">
                <div class="description-text">
                    <p class="description">
                        {desc_1}
                    </p>

                    <p class="description" style="margin-bottom: 0;">
                        {desc_2}
                    </p>
                </div>

                <div class="side-product-image">
                    <div class="product-image-container">
                        <img src="{product_image}" alt="{page_title}" class="product-image-small" onerror="this.style.display='none'">
                    </div>
                </div>
            </div>

            <div class="section-divider"></div>

{features_html}
        </div>
    </div>

    <!-- Page 3 - Technical Properties -->
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
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
{specs_html}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Page 4 - Performance Benefits -->
    <div class="page-4">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">Performance Benefits</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="benefits-box">
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
</html>
'''

    # Write the new content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_html)

    return True

def main():
    print("Migrating old template files to CG 100 template...\n")

    fixed_count = 0
    error_count = 0

    for filename in FILES_TO_MIGRATE:
        file_path = html_dir / filename

        if not file_path.exists():
            print(f"✗ {filename}: File not found")
            error_count += 1
            continue

        try:
            migrate_file(file_path)
            print(f"✓ {filename}: Migrated to CG 100 template")
            fixed_count += 1
        except Exception as e:
            print(f"✗ {filename}: Error - {str(e)}")
            error_count += 1

    print(f"\n{'=' * 80}")
    print(f"Migrated: {fixed_count} files")
    if error_count > 0:
        print(f"Errors: {error_count} files")
    print(f"{'=' * 80}\n")

if __name__ == "__main__":
    main()
