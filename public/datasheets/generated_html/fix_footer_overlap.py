#!/usr/bin/env python3
import os
import re
import glob

# Get all HTML files
html_files = glob.glob("*.html")

for filename in html_files:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has page-4
        if 'class="page-4"' in content:
            print(f"Skipping {filename} - already has page 4")
            continue
        
        # Skip if no benefits-box
        if '<div class="benefits-box">' not in content:
            print(f"Skipping {filename} - no benefits section")
            continue
        
        modified = False
        
        # 1. Add page-break-after to page-3 CSS
        if '.page-3 {' in content and 'page-break-after: always;' not in content.split('.page-3 {')[1].split('}')[0]:
            content = content.replace(
                '        /* Page 3 - Properties and Benefits */\n        .page-3 {\n            width: 100%;\n            height: 290mm;\n            background: white;\n            position: relative;\n        }',
                '        /* Page 3 - Properties */\n        .page-3 {\n            width: 100%;\n            height: 290mm;\n            background: white;\n            position: relative;\n            page-break-after: always;\n        }\n\n        /* Page 4 - Performance Benefits */\n        .page-4 {\n            width: 100%;\n            height: 290mm;\n            background: white;\n            position: relative;\n        }'
            )
            modified = True
        
        # 2. Find and extract benefits-box section
        benefits_pattern = r'(\s*<div class="benefits-box">.*?</div>\s*</div>)'
        benefits_match = re.search(benefits_pattern, content, re.DOTALL)
        
        if benefits_match:
            benefits_section = benefits_match.group(1)
            
            # 3. Find and extract footer section
            footer_pattern = r'(\s*<div class="footer">.*?</div>\s*</div>)'
            footer_match = re.search(footer_pattern, content, re.DOTALL)
            
            if footer_match:
                footer_section = footer_match.group(1)
                
                # 4. Remove benefits and footer from page 3
                content_without_benefits = content.replace(benefits_section, '')
                content_without_footer = content_without_benefits.replace(footer_section, '')
                
                # 5. Find the closing tag of page-3
                page3_end = content_without_footer.rfind('</div>\n\n</body>')
                
                if page3_end > 0:
                    # 6. Insert page 4 with benefits and footer
                    page4_content = f'''
    <!-- Page 4 - Performance Benefits -->
    <div class="page-4">
        <div class="page-2-header">
            <div>
                <div style="font-size: 11pt; color: #e31e24; margin-bottom: 3mm;">TECHNICAL DATASHEET</div>
                <h2 class="page-2-title">Performance Benefits</h2>
            </div>
        </div>

        <div class="content-section">{benefits_section}
        </div>
{footer_section}
    </div>
'''
                    
                    content = content_without_footer[:page3_end] + page4_content + content_without_footer[page3_end:]
                    modified = True
        
        if modified:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed {filename}")
        else:
            print(f"- No changes needed for {filename}")
    
    except Exception as e:
        print(f"✗ Error processing {filename}: {e}")

print("\nDone!")
