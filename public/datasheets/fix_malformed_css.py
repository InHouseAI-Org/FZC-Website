#!/usr/bin/env python3
"""
Fix malformed nested CSS rules in HTML files.
"""

import os
import re
from pathlib import Path

# Files with malformed CSS
FILES_TO_FIX = [
    "750SS_WELDING_BLANKET.html",
    "HY_504.html",
    "IN_123.html",
    "IN_123I.html",
    "IN_140.html",
    "NA_420.html",
    "NA_430.html",
    "NA_432.html",
    "NA_442.html",
    "NA_450.html",
    "NA_452_GF.html",
    "OR_125G.html",
    "PA_104A.html",
    "PA_499.html",
    "PE_102.html",
    "PE_104.html",
    "PE_104A.html",
    "PE_104C.html",
    "PE_504.html",
    "PE_508.html",
    "PE_509.html",
    "SSF_321.html",
    "SST_323.html",
]

# Directory containing HTML files
html_dir = Path("generated_html")

def fix_css_syntax(file_path):
    """Fix the malformed nested CSS rule."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the malformed CSS:
    # .content-section {
    #
    # .page-3 .content-section {
    #     padding-bottom: 50mm;
    # }
    #     padding: 12mm 15mm;
    # }

    # Find and replace with correct structure
    pattern = r'(\.content-section\s*\{)\s*(\.page-3\s+\.content-section\s*\{\s*padding-bottom:\s*50mm;\s*\})\s*(padding:\s*12mm\s+15mm;\s*\})'

    replacement = r'''.content-section {
            padding: 12mm 15mm;
        }

        .page-3 .content-section {
            padding-bottom: 50mm;
        }'''

    # Check if pattern exists
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "Fixed malformed CSS"

    return False, "Pattern not found or already fixed"

def main():
    print("Fixing malformed CSS in files...\n")

    fixed_count = 0
    skipped_count = 0
    error_count = 0

    for filename in FILES_TO_FIX:
        file_path = html_dir / filename

        if not file_path.exists():
            print(f"✗ {filename}: File not found")
            error_count += 1
            continue

        try:
            success, message = fix_css_syntax(file_path)

            if success:
                print(f"✓ {filename}: {message}")
                fixed_count += 1
            else:
                print(f"⚠ {filename}: {message}")
                skipped_count += 1
        except Exception as e:
            print(f"✗ {filename}: Error - {str(e)}")
            error_count += 1

    print(f"\n{'=' * 80}")
    print(f"Fixed: {fixed_count} files")
    if skipped_count > 0:
        print(f"Skipped: {skipped_count} files (already correct or pattern not matched)")
    if error_count > 0:
        print(f"Errors: {error_count} files")
    print(f"{'=' * 80}\n")

if __name__ == "__main__":
    main()
