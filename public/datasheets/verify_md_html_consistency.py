#!/usr/bin/env python3
"""
Verify consistency between MD files and HTML datasheets.
Cross-check product information for accuracy.
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

# Directories
products_dir = Path("../../Products")
html_dir = Path("generated_html")

def extract_md_data(md_path):
    """Extract key data from MD file."""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    data = {
        'file': md_path.name,
        'path': str(md_path),
        'title': '',
        'description': '',
        'features': [],
        'applications': [],
        'specifications': {}
    }

    # Extract title (first h1)
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if title_match:
        data['title'] = title_match.group(1).strip()

    # Extract description (text after title before first heading)
    desc_match = re.search(r'^#\s+.+?\n\n(.+?)(?=\n##|\Z)', content, re.DOTALL | re.MULTILINE)
    if desc_match:
        data['description'] = desc_match.group(1).strip()[:200]  # First 200 chars

    # Extract features
    features_section = re.search(r'##\s+Features?\n(.+?)(?=\n##|\Z)', content, re.DOTALL | re.MULTILINE)
    if features_section:
        features = re.findall(r'[-*]\s+(.+)', features_section.group(1))
        data['features'] = [f.strip() for f in features[:3]]  # First 3

    # Extract applications
    apps_section = re.search(r'##\s+Applications?\n(.+?)(?=\n##|\Z)', content, re.DOTALL | re.MULTILINE)
    if apps_section:
        apps = re.findall(r'[-*]\s+(.+)', apps_section.group(1))
        data['applications'] = [a.strip() for a in apps[:3]]  # First 3

    # Extract specifications
    specs_section = re.search(r'##\s+(?:Technical\s+)?Specifications?\n(.+?)(?=\n##|\Z)', content, re.DOTALL | re.MULTILINE)
    if specs_section:
        spec_lines = re.findall(r'[-*]\s*\*\*(.+?)\*\*:?\s*(.+)', specs_section.group(1))
        for key, value in spec_lines[:5]:  # First 5 specs
            data['specifications'][key.strip()] = value.strip()

    return data

def extract_html_data(html_path):
    """Extract key data from HTML datasheet."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    data = {
        'file': html_path.name,
        'path': str(html_path),
        'title': '',
        'tagline': '',
        'description': '',
        'features': [],
        'applications': [],
        'specifications': {}
    }

    # Extract product name
    product_name = soup.find('h1', class_='product-name')
    if product_name:
        data['title'] = product_name.get_text(strip=True)

    # Extract tagline
    tagline = soup.find('p', class_='product-tagline')
    if tagline:
        data['tagline'] = tagline.get_text(strip=True)

    # Extract description
    description = soup.find('p', class_='description')
    if description:
        data['description'] = description.get_text(strip=True)[:200]

    # Extract features
    features_col = soup.find('div', class_='features-column')
    if features_col:
        feature_items = features_col.find_all('span', class_='feature-text')
        data['features'] = [f.get_text(strip=True) for f in feature_items[:3]]

    # Extract applications
    all_feature_cols = soup.find_all('div', class_='features-column')
    if len(all_feature_cols) > 1:
        app_items = all_feature_cols[1].find_all('span', class_='feature-text')
        data['applications'] = [a.get_text(strip=True) for a in app_items[:3]]

    # Extract specifications from table
    props_table = soup.find('table', class_='properties-table')
    if props_table:
        rows = props_table.find_all('tr')[1:]  # Skip header
        for row in rows[:5]:  # First 5
            cells = row.find_all('td')
            if len(cells) >= 2:
                key = cells[0].get_text(strip=True)
                value = cells[1].get_text(strip=True)
                data['specifications'][key] = value

    return data

def find_matching_html(md_filename):
    """Find matching HTML file for an MD file."""
    # Extract product code from MD filename
    product_code = md_filename.replace('.md', '').replace(' ', '_')

    # Try various patterns
    patterns = [
        f"{product_code}.html",
        f"{product_code.upper()}.html",
        f"{product_code.replace('_', ' ')}.html",
        f"{product_code.replace('_', '')}.html"
    ]

    for pattern in patterns:
        html_path = html_dir / pattern
        if html_path.exists():
            return html_path

    return None

def compare_data(md_data, html_data):
    """Compare MD and HTML data, return issues."""
    issues = []

    # Compare titles (loose match)
    md_title = md_data['title'].upper().replace(' ', '').replace('-', '')
    html_title = html_data['title'].upper().replace(' ', '').replace('-', '')

    if md_title and html_title and md_title not in html_title and html_title not in md_title:
        issues.append(f"Title mismatch: MD='{md_data['title']}' vs HTML='{html_data['title']}'")

    # Compare feature counts
    if len(md_data['features']) > 0 and len(html_data['features']) == 0:
        issues.append(f"HTML missing features (MD has {len(md_data['features'])})")

    # Compare application counts
    if len(md_data['applications']) > 0 and len(html_data['applications']) == 0:
        issues.append(f"HTML missing applications (MD has {len(md_data['applications'])})")

    # Compare specifications
    if len(md_data['specifications']) > 0 and len(html_data['specifications']) == 0:
        issues.append(f"HTML missing specifications (MD has {len(md_data['specifications'])})")

    return issues

def main():
    print("=" * 80)
    print("MD FILES vs HTML DATASHEETS - CONSISTENCY VERIFICATION")
    print("=" * 80)
    print()

    # Find all MD files
    md_files = list(products_dir.rglob("*.md"))
    print(f"Found {len(md_files)} MD files in Products directory")

    # Find all HTML files
    html_files = list(html_dir.glob("*.html"))
    print(f"Found {len(html_files)} HTML datasheets")
    print()

    # Track results
    matched = 0
    mismatched = 0
    missing_html = 0
    issues_found = []

    print("Checking each MD file for matching HTML datasheet...\n")

    for md_file in sorted(md_files):
        product_name = md_file.stem

        # Find matching HTML
        html_file = find_matching_html(md_file.name)

        if not html_file:
            missing_html += 1
            print(f"✗ {product_name}: No matching HTML datasheet found")
            continue

        # Extract and compare data
        try:
            md_data = extract_md_data(md_file)
            html_data = extract_html_data(html_file)

            issues = compare_data(md_data, html_data)

            if issues:
                mismatched += 1
                print(f"⚠ {product_name}: Issues found")
                for issue in issues:
                    print(f"    - {issue}")
                issues_found.append({
                    'product': product_name,
                    'md_file': str(md_file),
                    'html_file': str(html_file),
                    'issues': issues
                })
            else:
                matched += 1
                print(f"✓ {product_name}: Consistent")

        except Exception as e:
            print(f"✗ {product_name}: Error - {str(e)}")
            mismatched += 1

    # Check for HTML files without MD files
    print("\n" + "=" * 80)
    print("Checking for HTML datasheets without MD files...\n")

    md_names = set([md.stem.upper().replace(' ', '').replace('_', '') for md in md_files])
    orphaned_html = []

    for html_file in sorted(html_files):
        html_name = html_file.stem.upper().replace(' ', '').replace('_', '')

        if html_name not in md_names:
            orphaned_html.append(html_file.name)
            print(f"⚠ {html_file.name}: No matching MD file found")

    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✓ Matched & Consistent: {matched}")
    print(f"⚠ Matched with Issues: {mismatched}")
    print(f"✗ Missing HTML: {missing_html}")
    print(f"⚠ Orphaned HTML: {len(orphaned_html)}")
    print("=" * 80)

    # Detailed issues
    if issues_found:
        print("\nDETAILED ISSUES:")
        print("=" * 80)
        for item in issues_found:
            print(f"\n{item['product']}:")
            print(f"  MD: {item['md_file']}")
            print(f"  HTML: {item['html_file']}")
            print("  Issues:")
            for issue in item['issues']:
                print(f"    - {issue}")

    print()

if __name__ == "__main__":
    main()
