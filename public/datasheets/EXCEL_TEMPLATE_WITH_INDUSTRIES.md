# Excel Template for Datasheet Generation - Complete Guide

## 📊 Excel Column Structure

Create an Excel file with these columns. Each row = one product datasheet.

### Required Columns

| Column Name | Example Value | Description |
|------------|---------------|-------------|
| **Product_Code** | HY 105, PA 504, CR 124C | Product style code |
| **Product_Name** | Style HY 105 | Display name |
| **Tagline** | Engineered for Mechanical Stability... | Hero page tagline |
| **Industry** | po, ww, chem, fertilizer, etc. | Industry category (see mapping below) |
| **Description_1** | First paragraph text... | First description paragraph |
| **Description_2** | Second paragraph text... | Second description paragraph (optional) |
| **Key_Features** | Feature 1[newline]Feature 2[newline]Feature 3 | Bullet list (use Alt+Enter) |
| **Applications** | Application 1[newline]Application 2 | Bullet list (use Alt+Enter) |
| **Performance_Benefits** | Benefit 1[newline]Benefit 2 | Bullet list (use Alt+Enter) |

### Industry Code Mapping

Use these short codes in the **Industry** column:

| Code | Industry | Background Image |
|------|----------|------------------|
| **po** or **power** | Power | power.jpg |
| **ww** or **water** | Water / Waste Water | water.jpg |
| **chem** or **chemical** | Chemical | chemical.jpg |
| **fer** or **fertilizer** | Fertilizer | fertilizer.jpg |
| **met** or **metallurgy** | Metallurgy | metallurgy.jpg |
| **ong** or **oil** or **gas** | Oil & Gas | oil and gas.jpg |
| **paper** or **pulp** | Pulp & Paper | paper.jpg |
| **marine** | Marine | marine.jpg |
| **food** or **pharma** | Food & Pharma | food and pahrma.jpg |
| **sugar** | Sugar | sugar.jpg |
| **cement** | Cement | cement.jpg |
| **welding** or **general** | General Industrial | cement.jpg |

### Technical Properties Columns

**Option 1: Simple Table (2 columns)**
- pH
- Temperature
- Pressure
- Velocity
- Size

**Option 2: Equipment-Specific Table (4 columns with icons)**
- pH
- Temperature
- Pressure_Rotating
- Pressure_Reciprocating
- Pressure_Static
- Velocity_Rotating
- Velocity_Reciprocating
- Size

### Optional Columns

| Column Name | Purpose |
|------------|---------|
| Version | Version number (default: "V 01") |
| Advantages | Additional bullet list |
| Services | Text block for service types |
| Chemical_Compatibility | Additional section |

## 📝 Example Excel Rows

### Example 1: HY 105 (Equipment-Specific Table)

| Product_Code | Product_Name | Tagline | Industry | Description_1 | Key_Features | pH | Temperature | Pressure_Rotating | Pressure_Reciprocating | Pressure_Static |
|-------------|-------------|---------|----------|---------------|--------------|-----|-------------|-------------------|------------------------|-----------------|
| HY 105 | Style HY 105 | Engineered for Mechanical Stability... | fertilizer | HY 105 is a high-performance... | Feature 1<br>Feature 2<br>Feature 3 | 0-14 | -200 to +300°C | 100 | 200 | 300 |

### Example 2: Style 150C (Simple Table)

| Product_Code | Product_Name | Tagline | Industry | Description_1 | pH | Temperature | Pressure | Velocity |
|-------------|-------------|---------|----------|---------------|-----|-------------|----------|----------|
| 150C | Style 150C | Braided Cotton Packing... | ww | STYLE 150C is a special quality... | 6-14 | 130 | 80 | 5 |

### Example 3: PA 504 (Chemical Industry)

| Product_Code | Product_Name | Tagline | Industry | Description_1 |
|-------------|-------------|---------|----------|---------------|
| PA 504 | Style PA 504 | High Performance... | chem | Description text... |

## 🎯 Product List from Your Image

Based on your table, here's the mapping:

| Product Code | Industry Code | Background Image |
|-------------|---------------|------------------|
| PE 505 | chemical | chemical.jpg |
| PA 503 | chemical | chemical.jpg |
| HY 504 | chemical | chemical.jpg |
| PE 509 | chemical | chemical.jpg |
| HY 503 | fertilizer | fertilizer.jpg |
| HY 507 | fertilizer | fertilizer.jpg |
| HY 105 | fertilizer | fertilizer.jpg |
| PE 102 | fertilizer | fertilizer.jpg |
| HY 175 | power | power.jpg |
| PA 106 | power | power.jpg |
| CR 124C | ww | water.jpg |
| PA 501 | power | power.jpg |
| PE 102 | chemical | chemical.jpg |
| CG 101E | ong | oil and gas.jpg |
| CG 102 | ong | oil and gas.jpg |
| N 323 | metallurgy | metallurgy.jpg |
| N 123 | metallurgy | metallurgy.jpg |
| CR 120 | ww | water.jpg |
| HY 120W | metallurgy | metallurgy.jpg |
| CG 900 | power | power.jpg |
| CG 503 | chemical | chemical.jpg |
| CN 153 | ww | water.jpg |
| GN 153 | ww | water.jpg |
| HY 605 | po | power.jpg |
| HY 601C | ong | oil and gas.jpg |
| HY 605 | ong | oil and gas.jpg |
| N 125C | metallurgy | metallurgy.jpg |
| HY 510 | chem | chemical.jpg |
| FE 104C | chem | chemical.jpg |
| HY 109F | po | power.jpg |
| PA 106E | pulp paper | paper.jpg |
| PA 104A | po | power.jpg |
| PE 508G | chem | chemical.jpg |
| ULTRA FE 1002 | ong | oil and gas.jpg |
| ULTRA FE 1003 | ong | oil and gas.jpg |
| ULTRA FE 1004 | ong | oil and gas.jpg |
| ThermoWIPING PAD | wire drawing | general |
| HY 107 HD | fer | fertilizer.jpg |
| HY 105 HD | fer | fertilizer.jpg |
| N 124S | po | power.jpg |
| N 124S | po | power.jpg |
| GAM 300X | po | power.jpg |
| GM 160 | po | power.jpg |
| SWMATX EPDM SHEET/GASKET | chem | chemical.jpg |
| INSULATION GASKET KIT 150/3 FS | ong | oil and gas.jpg |
| 7505S WELDING BLANKET | welding-bo | general |
| GM 360 | po | power.jpg |

## 🔧 How to Use

### Step 1: Create Your Excel File

1. Copy the column headers above
2. Fill in one row per product
3. Use Alt+Enter (Windows) or Option+Enter (Mac) for multi-line cells
4. Use the industry codes from the mapping table

### Step 2: Convert to JSON

```bash
python excel_to_json_flexible.py your_products.xlsx data/
```

### Step 3: Generate PDFs

```bash
# Single product
node generate-pdf.js data/PRODUCT_CODE_data.json output/PRODUCT_CODE.pdf

# All products
./generate-all-pdfs.sh
```

## 📋 Excel Cell Formatting Tips

### Multi-line Text (Features, Applications, Benefits)

**In Excel:**
```
Feature 1
Feature 2
Feature 3
```

To add line breaks: Press `Alt+Enter` (Windows) or `Option+Enter` (Mac)

### Description Paragraphs

**Option A: Two Columns**
- Description_1: First paragraph
- Description_2: Second paragraph

**Option B: Single Column with Line Breaks**
- Description: Paragraph 1[Alt+Enter][Alt+Enter]Paragraph 2

## ✅ Validation Checklist

Before converting:
- [ ] Product_Code column has no empty cells
- [ ] Industry codes match the mapping table
- [ ] Multi-line cells use Alt+Enter (not just Enter)
- [ ] No special characters that break JSON
- [ ] Technical property columns match (simple OR equipment-specific, not mixed)

## 🎨 Result

Each product will get:
- **Page 1:** Hero with correct industry background image
- **Page 2:** Product details with your content
- **Page 3:** Technical specs and benefits

All with consistent, professional design! 🎉

## 📞 Need Help?

Common issues:
- **Wrong background image?** Check industry code spelling
- **Multi-line not working?** Use Alt+Enter in Excel cells
- **Missing data?** Check required columns are filled
- **JSON errors?** Validate column names match exactly

---

**Ready to create datasheets!** Fill your Excel and run the converter.
