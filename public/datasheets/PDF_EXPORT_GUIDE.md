# PDF Export Guide for Datasheets

## Method 1: Manual Export (Browser) - Recommended

This is the simplest method and works perfectly for all datasheets.

### Steps:

1. **Open the datasheet in your browser:**
   - Navigate to the `datasheets` folder
   - Open `flexible-template.html` in Chrome, Safari, or Firefox
   - The URL will show: `data=data/style_150C_data.json` (or similar)

2. **Print to PDF:**

   **On Mac:**
   - Press `Cmd + P`
   - In the print dialog:
     - Destination: Select "Save as PDF"
     - Paper Size: A4
     - Margins: None
     - ✅ Check "Background graphics"
   - Click "Save"

   **On Windows:**
   - Press `Ctrl + P`
   - In the print dialog:
     - Destination: Select "Save as PDF" or "Microsoft Print to PDF"
     - Paper Size: A4
     - Margins: None
     - ✅ Check "Background graphics"
   - Click "Save"

3. **Result:**
   - Single-page datasheets → 1-page PDF
   - Multi-page datasheets → 3-page PDF
   - Perfect print quality with all colors and styles

### Browser-Specific Tips:

**Chrome** (Best for PDF export):
- Settings → More tools → Print
- Or right-click → Print

**Safari:**
- File → Export as PDF
- Or File → Print → Save as PDF

**Firefox:**
- File → Print → Save to PDF

## Method 2: Automated Export (Node.js + Puppeteer)

For bulk generation of many datasheets at once.

### Requirements:
```bash
npm install puppeteer --legacy-peer-deps
```

### Generate Single PDF:
```bash
node generate-pdf.js data/style_150C_data.json output/150C.pdf
node generate-pdf.js data/HY_105_flexible.json output/HY_105.pdf
```

### Generate All PDFs:
```bash
chmod +x generate-all-pdfs.sh
./generate-all-pdfs.sh
```

This will create PDFs for all JSON files in the `data/` folder and save them to `output/` folder.

## Method 3: Python Script (Alternative)

If you prefer Python, here's a script using Selenium:

```python
# Requires: pip install selenium webdriver-manager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import json
import os

def generate_pdf(data_file, output_file):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    template_path = os.path.abspath('flexible-template.html')
    url = f"file://{template_path}?data={data_file}"

    driver.get(url)

    # Print settings
    settings = {
        'printBackground': True,
        'paperWidth': 8.27,  # A4 width in inches
        'paperHeight': 11.69  # A4 height in inches
    }

    pdf = driver.execute_cdp_cmd('Page.printToPDF', settings)

    with open(output_file, 'wb') as f:
        import base64
        f.write(base64.b64decode(pdf['data']))

    driver.quit()
    print(f"✅ Generated: {output_file}")

# Usage
generate_pdf('data/style_150C_data.json', 'output/150C.pdf')
```

## Quick Reference

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **Manual (Browser)** | 1-5 datasheets | Easy, no setup, perfect quality | Manual process |
| **Node.js Script** | Bulk generation | Automated, batch processing | Requires Node.js setup |
| **Python Script** | Python users | Automated, familiar language | Requires Python + Selenium |

## Troubleshooting

### Issue: Background colors not showing
**Solution:** Make sure "Background graphics" is enabled in print settings

### Issue: PDF is blank
**Solution:**
- Check that the JSON file path is correct
- Open in browser first to verify it loads properly
- Make sure images paths in JSON are correct

### Issue: Images missing in PDF
**Solution:**
- Use relative paths in JSON: `../../public/image.png`
- Verify image files exist at those paths

### Issue: Multi-page datasheet shows on one page
**Solution:**
- Use Chrome browser (best for CSS page breaks)
- Ensure template has `page-break-after: always` CSS

## For Style 150C Specifically

**Browser Method:**
1. Open: `flexible-template.html?data=data/style_150C_data.json`
2. Press Cmd+P (Mac) or Ctrl+P (Windows)
3. Enable "Background graphics"
4. Save as PDF

**Result:** 1-page PDF with brown headers and yellow table, matching the original design.

## Batch Export All Datasheets

### Quick Batch (Manual):
1. Open each datasheet in browser (in separate tabs)
2. Cmd+P on each tab
3. Save each as PDF

### Automated Batch (Script):
```bash
./generate-all-pdfs.sh
```
All PDFs will be in the `output/` folder.

---

**Recommended:** Use Method 1 (Browser) for best results with least setup time.
