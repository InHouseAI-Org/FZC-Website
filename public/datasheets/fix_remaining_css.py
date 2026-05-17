#!/usr/bin/env python3
"""
Fix remaining files with malformed nested CSS (different pattern).
"""

import os
import re
from pathlib import Path

# Files with different malformed CSS pattern
FILES_TO_FIX = [
    "PA_104A.html",
    "PA_499.html",
    "PE_102.html",
    "PE_104.html",
    "PE_104A.html",
    "PE_104C.html",
    "PE_504.html",
    "PE_508.html",
    "PE_509.html",
]

# Directory containing HTML files
html_dir = Path("generated_html")

def fix_css_syntax(file_path):
    """Fix the malformed nested CSS rule with grid layout."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the malformed CSS with grid layout:
    # .content-section {
    #
    # .page-3 .content-section {
    #     padding-bottom: 50mm;
    # }
    #     display: grid;
    #     grid-template-columns: 1fr 1fr;
    #     gap: 8mm;
    #     margin-bottom: 10mm;
    # }

    # More flexible pattern
    pattern = r'(\.content-section\s*\{)\s*(\.page-3\s+\.content-section\s*\{[^}]+\})\s*(display:\s*grid;[^}]+\})'

    # Check if pattern exists
    match = re.search(pattern, content, re.DOTALL)
    if match:
        # Extract the page-3 rule and the grid content
        page_3_rule = match.group(2).strip()
        grid_content = match.group(3).strip()[:-1]  # Remove the closing brace

        replacement = f'''.content-section {{
            {grid_content}
        }}

        {page_3_rule}'''

        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "Fixed malformed CSS with grid layout"

    return False, "Pattern not found or already fixed"

def main():
    print("Fixing remaining files with malformed CSS...\n")

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
