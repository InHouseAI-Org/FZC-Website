# Datasheet Template System - Quick Start

## 🎯 What You Have Now

A complete, automated datasheet generation system that:
- ✅ Uses ONE template for ALL products
- ✅ Generates datasheets from Excel data
- ✅ Supports both simple and complex property tables
- ✅ Maintains consistent branding across all datasheets
- ✅ Easy to update and maintain

## 📁 Files Created

```
public/datasheets/
├── template.html                    # Master template (use for all products)
├── data/
│   ├── HY_105_data.json            # Example: Full table with equipment types
│   └── SAMPLE_SIMPLE_data.json     # Example: Simple 2-column table
├── excel_to_json.py                # Python script to convert Excel → JSON
├── README.md                       # Detailed documentation
├── EXCEL_TEMPLATE_GUIDE.md        # Guide for creating Excel file
└── QUICK_START.md                 # This file
```

## 🚀 Quick Start (3 Steps)

### Step 1: Prepare Your Excel File

Create an Excel file with these columns:

**Minimum Required:**
- `Product_Code` (e.g., "HY 105")
- `Tagline` (hero page text)
- `Description` (use Alt+Enter for multiple paragraphs)
- `Key_Features` (use Alt+Enter between items)
- `Applications` (use Alt+Enter between items)
- `Performance_Benefits` (use Alt+Enter between items)

**For Technical Properties:**

**Option A - Simple Table:**
- `pH`, `Temperature`, `Pressure`, `Size`

**Option B - Equipment-Specific Table:**
- `pH`, `Temperature` (universal values)
- `Pressure_Rotating`, `Pressure_Reciprocating`, `Pressure_Static`
- `Velocity_Rotating`, `Velocity_Reciprocating`
- `Size`

### Step 2: Convert Excel to JSON

```bash
# Install Python dependencies (first time only)
pip install pandas openpyxl

# Run the converter
python excel_to_json.py your_products.xlsx data
```

This creates one JSON file per product in the `data/` folder.

### Step 3: View Your Datasheets

Open in browser:
```
template.html?data=data/HY_105_data.json
template.html?data=data/YOUR_PRODUCT_data.json
```

**To Print/Export as PDF:**
- Open datasheet in browser
- Press Ctrl+P (or Cmd+P on Mac)
- Select "Save as PDF"
- Enable "Background graphics"

## 📊 Two Table Types Explained

### Type 1: Simple 2-Column Table
For products where properties don't vary by equipment type:

| Property | Value |
|----------|-------|
| pH Range | 0-14 |
| Temperature | -200°C to +300°C |
| Pressure | Up to 200 BAR |

**In Excel:** Use columns `pH`, `Temperature`, `Pressure`, etc.

### Type 2: Equipment-Specific Table
For products with different values for rotating/reciprocating/static equipment:

| Properties | 🔄 Rotating | ↔ Reciprocating | ⊗ Static |
|-----------|-------------|-----------------|----------|
| pH | 0-14 | | |
| Pressure (BAR) | 100 | 200 | 300 |
| Velocity (m/s) | 25 | 10 | - |

**In Excel:** Use columns `Pressure_Rotating`, `Pressure_Reciprocating`, `Pressure_Static`, etc.

## 🎨 Customizing the Template

### To Change Design for ALL Datasheets:
Edit `template.html` - changes apply to all products automatically

### To Update One Product:
Edit the product's JSON file in `data/` folder

### To Change Company Info:
Edit the `company` section in each JSON file, or update the default in `excel_to_json.py`

## 📝 Common Tasks

### Adding a New Product
1. Add new row to Excel file
2. Run: `python excel_to_json.py products.xlsx data`
3. Open: `template.html?data=data/NEW_PRODUCT_data.json`

### Updating Product Content
1. Edit the JSON file directly, OR
2. Update Excel and re-run converter

### Changing Page 1 Background Image
Update `Hero_Image` column in Excel with path to your image

### Changing Product Photo
Update `Product_Image` column in Excel with path to your image

## 🎯 Benefits of This System

| Before | After |
|--------|-------|
| Create each datasheet manually | Generate from Excel automatically |
| Inconsistent designs | Single template = consistent branding |
| Hard to update all datasheets | Update template once, affects all |
| Copy-paste errors | Structured data reduces errors |
| Time-consuming | Fast bulk generation |

## 📖 Need More Help?

- **Detailed docs**: See `README.md`
- **Excel guide**: See `EXCEL_TEMPLATE_GUIDE.md`
- **Examples**: Check `HY_105_data.json` and `SAMPLE_SIMPLE_data.json`

## 🔍 Troubleshooting

**Datasheet shows "undefined" text:**
- Check that all required fields are in your JSON file
- Validate JSON syntax (use jsonlint.com)

**Images don't load:**
- Check image paths are correct relative to `template.html`
- Use format: `../../public/your-image.png`

**Excel conversion fails:**
- Ensure pandas and openpyxl are installed: `pip install pandas openpyxl`
- Check Excel column names match exactly (case-sensitive)
- Verify Product_Code column is not empty

**Multi-line text appears as single line:**
- Use Alt+Enter (Windows) or Option+Enter (Mac) in Excel cells
- Or use semicolons (;) to separate items

## 📞 Support

For issues or questions about the template system, refer to the documentation files or contact your development team.

---

**Ready to create datasheets?** Start with Step 1 above! 🚀
