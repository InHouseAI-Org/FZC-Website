#!/usr/bin/env python3
"""
Fix footer overlap by moving benefits box and footer to page 4.
"""

import os
import re
from pathlib import Path

# Files to fix
FILES_TO_FIX = [
    "INMATEX_1400.html",
    "INMATEX_ePTFE.html",
    "Insulation_Gasket_Kit_1800_FS.html",
]

# Directory containing HTML files
html_dir = Path("generated_html")

def fix_footer_overlap(file_path):
    """Move benefits box and footer from page 3 to page 4."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match:
    # </table>
    # </div>
    #
    # <div class="benefits-box">
    # ...benefits content...
    # </div>
    # </div>
    #
    # <div class="footer">
    # ...footer content...
    # </div>
    # </div>

    # Find the benefits-box and footer section on page-3
    pattern = r'(</table>\s*</div>)\s*(<div class="benefits-box">.*?</div>\s*</div>)\s*(<div class="footer">.*?</div>\s*</div>\s*</div>)'

    match = re.search(pattern, content, re.DOTALL)

    if match:
        # Extract sections
        table_end = match.group(1)
        benefits_section = match.group(2)
        footer_section = match.group(3)

        # Create page 4 with benefits and footer
        page_4 = f'''</table>
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
            {benefits_section}
        </div>

        {footer_section}
    </div>'''

        # Replace the old structure with new page 4 structure
        content = re.sub(pattern, page_4, content, flags=re.DOTALL)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True, "Moved benefits and footer to page 4"

    return False, "Pattern not found - may already be fixed or different structure"

def main():
    print("Fixing footer overlap in remaining files...\n")

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
            success, message = fix_footer_overlap(file_path)

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
        print(f"Skipped: {skipped_count} files")
    if error_count > 0:
        print(f"Errors: {error_count} files")
    print(f"{'=' * 80}\n")

if __name__ == "__main__":
    main()
