#!/usr/bin/env python3
"""
Convert 4-page datasheets to 3-page layout by combining specs and benefits on page 3.
"""

import os
import re
from pathlib import Path

# Files to convert
FILES_TO_CONVERT = [
    "PA_499.html",
    "PE_102.html",
    "PE_104.html",
    "PE_104A.html",
    "PE_104C.html",
    "PE_504.html",
    "PE_508.html",
    "PE_509.html",
]

html_dir = Path("generated_html")

def convert_to_3_pages(file_path):
    """Convert a 4-page datasheet to 3 pages."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove .page-4 CSS definition
    content = re.sub(
        r'/\* Page 4 - Performance Benefits \*/\s*\.page-4 \{[^}]+\}',
        '',
        content,
        flags=re.DOTALL
    )

    # Update page-3 to not have page-break-after
    content = re.sub(
        r'(\.page-3 \{[^}]*?)page-break-after: always;',
        r'\1',
        content,
        flags=re.DOTALL
    )

    # Find the properties table
    table_match = re.search(r'(<table class="properties-table">.*?</table>)', content, re.DOTALL)
    if not table_match:
        return False, "Could not find properties table"

    table_html = table_match.group(1)

    # Find page 4 benefits
    benefits_match = re.search(
        r'<div class="benefits-box">(.*?)</div>\s*</div>\s*<div class="footer">',
        content,
        re.DOTALL
    )

    if not benefits_match:
        return False, "Could not find benefits section"

    benefits_content = benefits_match.group(1)

    # Find footer
    footer_match = re.search(
        r'(<div class="footer">.*?</div>\s*</div>)',
        content,
        re.DOTALL
    )

    if not footer_match:
        return False, "Could not find footer"

    footer_html = footer_match.group(1)

    # Build new combined page 3
    new_page3 = f'''    <!-- Page 3 - Technical Specifications & Performance Benefits -->
    <div class="page-3">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">Technical Specifications & Benefits</h2>
            </div>
        </div>

        <div class="content-section">
            <div class="properties-section">
                <h3>Technical Properties</h3>
                {table_html}
            </div>

            <div class="benefits-box">
{benefits_content}
            </div>
        </div>

        {footer_html}
    </div>
</body>
</html>'''

    # Replace from page 3 comment to end of file
    content = re.sub(
        r'<!-- Page 3.*?</html>',
        new_page3,
        content,
        flags=re.DOTALL
    )

    # Update print media query if exists
    content = re.sub(
        r'@media print \{.*?\}',
        '@media print {\n            body {\n                width: 210mm;\n                height: 297mm;\n            }\n            .page-1, .page-2 {\n                page-break-after: always;\n            }\n        }',
        content,
        flags=re.DOTALL
    )

    # Write the updated content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True, "Converted to 3-page layout"

def main():
    print("Converting 4-page datasheets to 3-page layout...\n")

    converted_count = 0
    error_count = 0

    for filename in FILES_TO_CONVERT:
        file_path = html_dir / filename

        if not file_path.exists():
            print(f"✗ {filename}: File not found")
            error_count += 1
            continue

        try:
            success, message = convert_to_3_pages(file_path)

            if success:
                print(f"✓ {filename}: {message}")
                converted_count += 1
            else:
                print(f"✗ {filename}: {message}")
                error_count += 1
        except Exception as e:
            print(f"✗ {filename}: Error - {str(e)}")
            error_count += 1

    print(f"\n{'=' * 80}")
    print(f"Converted: {converted_count} files")
    if error_count > 0:
        print(f"Errors: {error_count} files")
    print(f"{'=' * 80}\n")

if __name__ == "__main__":
    main()
