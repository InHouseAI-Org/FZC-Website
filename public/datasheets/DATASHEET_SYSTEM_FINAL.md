# Inmarco Datasheet System - Final Version

## 🎯 Overview

**One Template. One Style. All Datasheets.**

All datasheets now use the **modern 3-page HY 105 layout**:
- **Page 1:** Hero page with logo, product name, and industry background
- **Page 2:** Product details, features, and applications
- **Page 3:** Technical specifications and performance benefits

## 📊 Datasheet Structure

Every datasheet follows this format (sections are flexible):

```json
{
  "layout": "multi-page",
  "productInfo": {
    "styleCode": "150C",
    "styleName": "Style 150C",
    "fullName": "150C",
    "tagline": "Your product tagline for hero page",
    "version": "V 01"
  },
  "images": {
    "logo": "../../src/assets/inmarco-tagline-logo1.png",
    "hero": "../../public/your-industry-image.jpg"
  },
  "sections": [
    // Your flexible sections here
  ],
  "company": { /* company info */ }
}
```

## 📝 Available Section Types

### 1. Description (Text Paragraphs)
```json
{
  "type": "description",
  "title": "Product Description",
  "content": [
    "First paragraph of description...",
    "Second paragraph..."
  ]
}
```

### 2. Bullet List (Features, Applications, Benefits)
```json
{
  "type": "bullet-list",
  "title": "Key Features" or "Applications" or "Advantages",
  "items": [
    "First bullet point",
    "Second bullet point"
  ]
}
```

### 3. Technical Properties Table

**Option A - Simple 2-Column:**
```json
{
  "type": "technical-properties",
  "title": "Technical Properties",
  "hasEquipmentTypes": false,
  "properties": [
    {"name": "pH", "value": "6-14"},
    {"name": "Temperature (°C)", "value": "130"},
    {"name": "Pressure (BAR)", "value": "80"}
  ]
}
```

**Option B - Equipment-Specific (4 columns):**
```json
{
  "type": "technical-properties",
  "title": "Technical Properties",
  "hasEquipmentTypes": true,
  "properties": [
    {
      "name": "pH",
      "type": "universal",
      "value": "0-14"
    },
    {
      "name": "Pressure (BAR)",
      "type": "equipment-specific",
      "values": {
        "rotating": "100",
        "reciprocating": "200",
        "static": "300"
      }
    }
  ]
}
```

### 4. Text Block (Simple Text)
```json
{
  "type": "text-block",
  "title": "Services" or "Typical Applications",
  "content": "Your text content here..."
}
```

## 🎨 Standard Sections for Most Datasheets

### Recommended Order:

**Page 2:**
1. Description (2 paragraphs)
2. Key Features (bullet list)
3. Applications (bullet list)

**Page 3:**
4. Technical Properties (table)
5. Performance Benefits (bullet list)

### Alternative Sections You Can Add:
- Advantages
- Services
- Chemical Compatibility
- Operating Conditions
- Installation Guidelines
- Maintenance Tips

## 📁 File Structure

```
public/datasheets/
├── flexible-template.html          # Universal template
├── data/
│   ├── style_150C_data.json       # Example
│   ├── HY_105_flexible.json       # Example
│   └── YOUR_PRODUCT_data.json     # Your products
├── output/                         # Generated PDFs
├── generate-pdf.js                 # PDF generator script
└── README files
```

## 🚀 Quick Start

### 1. Create Your Data File

Copy an example and modify:
```bash
cp data/style_150C_data.json data/NEW_PRODUCT_data.json
```

Edit the JSON with your product info.

### 2. View in Browser

Start local server (if not running):
```bash
python3 -m http.server 8765
```

Open: `http://localhost:8765/flexible-template.html?data=data/NEW_PRODUCT_data.json`

### 3. Generate PDF

```bash
node generate-pdf.js data/NEW_PRODUCT_data.json output/NEW_PRODUCT.pdf
```

## 📊 Excel to JSON Conversion

### Excel Column Structure

| Column Name | Maps To | Example |
|------------|---------|---------|
| Product_Code | productInfo.styleCode | "150C" |
| Product_Name | productInfo.styleName | "Style 150C" |
| Tagline | productInfo.tagline | "High Performance..." |
| Hero_Image | images.hero | "../../public/industry.jpg" |
| Description | sections[0].content[] | Use Alt+Enter for multiple paragraphs |
| Key_Features | sections[1].items[] | Use Alt+Enter between items |
| Applications | sections[2].items[] | Use Alt+Enter between items |
| pH | technical properties | "6-14" |
| Temperature | technical properties | "130°C" |
| Pressure_Rotating* | technical properties | "100" (if equipment-specific) |
| Performance_Benefits | sections[].items[] | Use Alt+Enter between items |

*For equipment-specific tables, use columns: `Pressure_Rotating`, `Pressure_Reciprocating`, `Pressure_Static`, etc.

### Convert Excel to JSON

```bash
python excel_to_json_flexible.py products.xlsx data/
```

## 🎯 Key Features

✅ **Consistent Design** - All datasheets look the same
✅ **Flexible Content** - Add any sections you need
✅ **Simple or Complex Tables** - 2-column or equipment-specific
✅ **Easy to Update** - Change template once, affects all
✅ **Print Ready** - Professional A4 PDF export
✅ **Automated Generation** - Bulk create from Excel

## 📋 Common Datasheet Patterns

### Pattern 1: Standard Product
```
Description → Key Features → Applications → Technical Properties → Benefits
```

### Pattern 2: Simple Product
```
Description → Technical Properties → Advantages → Applications
```

### Pattern 3: Complex Product
```
Description → Key Features → Applications → Technical Properties (table 1) →
Chemical Compatibility (table 2) → Performance Benefits → Services
```

## 🔧 Customization

### Change Industry Background Image
Update in JSON:
```json
"images": {
  "hero": "../../public/YOUR_INDUSTRY_IMAGE.jpg"
}
```

### Add New Section Type
All major section types are covered. If you need something custom, sections are rendered in order as specified in the JSON.

### Change Company Information
Update the `company` object in each JSON file.

## ⚡ Batch Operations

### Generate All PDFs
```bash
./generate-all-pdfs.sh
```

### View All Datasheets
All JSON files in `data/` folder will be available at:
```
http://localhost:8765/flexible-template.html?data=data/FILENAME.json
```

## 🎨 The 3-Page Layout

### Page 1 - Hero
- Large INMARCO logo with tagline
- Industry background image
- Product name in large white text
- Product tagline/description
- Red accent bar
- Dark gradient overlay

### Page 2 - Details
- Header with product name
- Content sections (descriptions, features, applications)
- Modern card-style layout
- Red accent dividers

### Page 3 - Specifications
- "Technical Specifications" header
- Technical properties table
- Performance benefits box (red gradient)
- Company footer with contact info

## 📞 Support

For issues:
1. Check JSON syntax (use jsonlint.com)
2. Verify image paths are correct
3. Ensure local server is running (port 8765)
4. Check console for errors

---

**All datasheets now follow the HY 105 style!** 🎉

Simply create JSON files with your product data and the template handles the rest.
