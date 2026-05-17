#!/usr/bin/env python3
"""
Fix files with missing or incorrect logo paths.
"""

import os
import re
from pathlib import Path

# Files that need fixing
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

# Correct logo path
CORRECT_LOGO_PATH = "../../../src/assets/inmarco-tagline-logo1.png"
CORRECT_ALT_TEXT = "INMARCO - Innovations in Fluid Sealing"

# Directory containing HTML files
html_dir = Path("generated_html")

def fix_logo_path(file_path):
    """Fix the logo path in an HTML file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match any existing logo img tag
    old_logo_patterns = [
        r'<img\s+src="[^"]*logo[^"]*"\s+alt="[^"]*">',
        r'<img\s+src="[^"]*logo[^"]*"\s+alt="[^"]*"\s*/>',
    ]

    # New logo tag
    new_logo_tag = f'<img src="{CORRECT_LOGO_PATH}" alt="{CORRECT_ALT_TEXT}">'

    # Try to replace existing logo tag
    modified = False
    for pattern in old_logo_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            content = re.sub(pattern, new_logo_tag, content, flags=re.IGNORECASE)
            modified = True
            break

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, "Replaced existing logo tag"

    return False, "No logo tag found to replace"

def main():
    print("Fixing logo paths in files...\n")

    fixed_count = 0
    failed_count = 0

    for filename in FILES_TO_FIX:
        file_path = html_dir / filename

        if not file_path.exists():
            print(f"✗ {filename}: File not found")
            failed_count += 1
            continue

        success, message = fix_logo_path(file_path)

        if success:
            print(f"✓ {filename}: {message}")
            fixed_count += 1
        else:
            print(f"⚠ {filename}: {message}")
            failed_count += 1

    print(f"\n{'=' * 80}")
    print(f"Fixed: {fixed_count}/{len(FILES_TO_FIX)} files")
    if failed_count > 0:
        print(f"Failed: {failed_count} files")
    print(f"{'=' * 80}\n")

if __name__ == "__main__":
    main()
