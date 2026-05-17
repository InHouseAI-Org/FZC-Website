#!/usr/bin/env python3
"""
Check all HTML files for CSS syntax issues.
"""

import os
import re
from pathlib import Path

# Directory containing HTML files
html_dir = Path("generated_html")

def check_css_syntax(file_path):
    """Check for CSS syntax issues in HTML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    issues = []

    # Check for malformed nested CSS like:
    # .content-section {
    # .page-3 .content-section {
    #     padding-bottom: 50mm;
    # }
    #     padding: 12mm 15mm;
    # }

    pattern = r'\.content-section\s*\{[^}]*\.page-3\s+\.content-section'
    if re.search(pattern, content, re.DOTALL):
        issues.append("Malformed nested .content-section CSS rule")

    # Check if benefits-box and footer are on correct page
    # They should be on page-3 or page-4
    if '<div class="benefits-box">' in content:
        # Find which page div contains benefits-box
        page_3_section = re.search(r'<div class="page-3">.*?</div>\s*</body>', content, re.DOTALL)
        page_4_section = re.search(r'<div class="page-4">.*?</div>\s*</body>', content, re.DOTALL)

        benefits_in_page_3 = page_3_section and '<div class="benefits-box">' in page_3_section.group()
        benefits_in_page_4 = page_4_section and '<div class="benefits-box">' in page_4_section.group()

        if not (benefits_in_page_3 or benefits_in_page_4):
            issues.append("benefits-box not found in page-3 or page-4")

    # Check if footer is present and positioned correctly
    if '<div class="footer">' in content:
        page_3_section = re.search(r'<div class="page-3">.*?</div>\s*</body>', content, re.DOTALL)
        page_4_section = re.search(r'<div class="page-4">.*?</div>\s*</body>', content, re.DOTALL)

        footer_in_page_3 = page_3_section and '<div class="footer">' in page_3_section.group()
        footer_in_page_4 = page_4_section and '<div class="footer">' in page_4_section.group()

        if not (footer_in_page_3 or footer_in_page_4):
            issues.append("footer not found in page-3 or page-4")

    return issues

def main():
    # Get all HTML files
    html_files = sorted(html_dir.glob("*.html"))

    if not html_files:
        print("❌ No HTML files found in generated_html/")
        return

    print(f"Checking {len(html_files)} HTML files for CSS and structure issues...\n")

    files_with_issues = []
    clean_files = []

    for html_file in html_files:
        issues = check_css_syntax(html_file)

        if issues:
            files_with_issues.append((html_file.name, issues))
        else:
            clean_files.append(html_file.name)

    # Report results
    print("=" * 80)
    print(f"CSS AND STRUCTURE CHECK RESULTS")
    print("=" * 80)
    print(f"\n✓ Clean files: {len(clean_files)}")
    print(f"⚠ Files with issues: {len(files_with_issues)}")
    print()

    if files_with_issues:
        print("\n" + "=" * 80)
        print("FILES WITH ISSUES:")
        print("=" * 80)
        for filename, issues in files_with_issues:
            print(f"\n  {filename}:")
            for issue in issues:
                print(f"    ⚠ {issue}")

    if not files_with_issues:
        print("\n" + "=" * 80)
        print("✓ ALL FILES ARE CLEAN - NO CSS OR STRUCTURE ISSUES FOUND!")
        print("=" * 80)

    print()

if __name__ == "__main__":
    main()
