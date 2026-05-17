#!/usr/bin/env python3
"""
Verify that all HTML datasheets use the correct logo path.
Expected: ../../../src/assets/inmarco-tagline-logo1.png
"""

import os
import re
from pathlib import Path

# Expected logo path
EXPECTED_LOGO_PATH = "../../../src/assets/inmarco-tagline-logo1.png"

# Directory containing HTML files
html_dir = Path("generated_html")

def check_logo_path(file_path):
    """Check if HTML file uses the correct logo path."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all img tags with logo-related patterns
    logo_pattern = r'<img\s+src="([^"]+)"\s+alt="INMARCO[^"]*"'
    matches = re.findall(logo_pattern, content)

    if not matches:
        return None, "No logo img tag found"

    logo_src = matches[0]
    if logo_src == EXPECTED_LOGO_PATH:
        return True, logo_src
    else:
        return False, logo_src

def main():
    # Get all HTML files
    html_files = sorted(html_dir.glob("*.html"))

    if not html_files:
        print("❌ No HTML files found in generated_html/")
        return

    print(f"Checking {len(html_files)} HTML files for logo paths...\n")

    correct_files = []
    incorrect_files = []
    no_logo_files = []

    for html_file in html_files:
        result, path = check_logo_path(html_file)

        if result is None:
            no_logo_files.append((html_file.name, path))
        elif result:
            correct_files.append(html_file.name)
        else:
            incorrect_files.append((html_file.name, path))

    # Report results
    print("=" * 80)
    print(f"LOGO PATH VERIFICATION RESULTS")
    print("=" * 80)
    print(f"\n✓ Files with CORRECT logo path: {len(correct_files)}")
    print(f"✗ Files with INCORRECT logo path: {len(incorrect_files)}")
    print(f"⚠ Files with NO logo found: {len(no_logo_files)}")
    print()

    if incorrect_files:
        print("\n" + "=" * 80)
        print("FILES WITH INCORRECT LOGO PATHS:")
        print("=" * 80)
        for filename, path in incorrect_files:
            print(f"\n  File: {filename}")
            print(f"  Current path: {path}")
            print(f"  Expected:     {EXPECTED_LOGO_PATH}")

    if no_logo_files:
        print("\n" + "=" * 80)
        print("FILES WITH NO LOGO IMG TAG:")
        print("=" * 80)
        for filename, issue in no_logo_files:
            print(f"  • {filename}: {issue}")

    if not incorrect_files and not no_logo_files:
        print("\n" + "=" * 80)
        print("✓ ALL FILES USE THE CORRECT LOGO PATH!")
        print("=" * 80)
        print(f"\nAll {len(correct_files)} HTML files correctly use:")
        print(f"  {EXPECTED_LOGO_PATH}")

    print()

if __name__ == "__main__":
    main()
