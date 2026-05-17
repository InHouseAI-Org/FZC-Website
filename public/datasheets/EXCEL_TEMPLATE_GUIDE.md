# Excel Template Guide for Datasheet Generation

## Excel Column Structure

Create an Excel file with the following columns. Each row represents one product.

### Required Columns

| Column Name | Example Value | Notes |
|------------|---------------|-------|
| **Product_Code** | HY 105 | Unique product identifier |
| **Tagline** | Engineered for Mechanical Stability in High-Load Equipment | Appears on hero page |
| **Description** | Paragraph 1<br>Paragraph 2 | Use Alt+Enter for line breaks between paragraphs |
| **Key_Features** | Feature 1<br>Feature 2<br>Feature 3 | Bullet points, use Alt+Enter between items |
| **Applications** | Application 1<br>Application 2 | Bullet points, use Alt+Enter between items |
| **Performance_Benefits** | Benefit 1<br>Benefit 2 | Bullet points, use Alt+Enter between items |

### Optional Columns

| Column Name | Example Value | Notes |
|------------|---------------|-------|
| **Version** | V 01 | Version number (defaults to "V 01") |
| **Hero_Image** | ../../public/fertilizer.jpg | Path to background image |
| **Product_Image** | ../../public/HY_105.png | Path to product photo |

### Technical Properties - Option 1: Simple Table (2 columns)

Use these columns for products with simple property tables:

| Column Name | Example Value |
|------------|---------------|
| **pH** or **pH_Range** | 0-14 |
| **Temperature** or **Temperature_Range** | -200°C to +300°C |
| **Pressure** or **Pressure_Range** | Up to 200 BAR |
| **Size** or **Size_Range** | 3mm to 35mm |

### Technical Properties - Option 2: Equipment-Specific Table

Use these columns for products with equipment-specific values:

| Column Name | Example Value | Notes |
|------------|---------------|-------|
| **pH** | 0-14 | Universal value (spans all columns) |
| **Temperature** | -200 to +300°C | Universal value |
| **Pressure_Rotating** | 100 | Value for rotating equipment |
| **Pressure_Reciprocating** | 200 | Value for reciprocating equipment |
| **Pressure_Static** | 300 | Value for static equipment |
| **Velocity_Rotating** | 25 | Value for rotating equipment (m/s) |
| **Velocity_Reciprocating** | 10 | Value for reciprocating equipment (m/s) |
| **Size** | 3sq mm TO 35sq mm | Universal value |

## Excel File Example

### Row 1: Headers
```
Product_Code | Tagline | Description | Key_Features | Applications | ...
```

### Row 2: Product 1 (HY 105)
```
HY 105 | Engineered for... | HY 105 is...[newline]This packing is... | Feature 1[newline]Feature 2 | ...
```

### Row 3: Product 2 (FG 320)
```
FG 320 | High Temperature... | Description text... | Features... | ...
```

## Tips for Excel

1. **Line Breaks**: Press `Alt+Enter` (Windows) or `Option+Enter` (Mac) inside a cell to add line breaks
2. **Multiple Items**: Each feature, application, or benefit should be on a new line within the same cell
3. **Delimiters**: Alternatively, you can use semicolons (;) to separate items
4. **Empty Cells**: Leave cells empty if data is not applicable
5. **Consistency**: Make sure all products use the same column structure

## Example Excel Cell Content

### Description Cell:
```
HY 105 is a high-performance gland packing made from a dense braid of Aramid Yarn corners and PTFE Yarn faces, reinforced with a resilient Aramid fiber core.

This packing is designed for demanding industrial environments, offering excellent chemical resistance, high pressure tolerance, and dimensional stability.
```
(Note: The empty line represents Alt+Enter in Excel)

### Key_Features Cell:
```
Unique combination of aramid yarn corners and PTFE Yarn faces
Reinforced with a high-tensile Aramid fiber core
PTFE faces treated with inert lubricants
Aramid corners lubricated with fluoropolymer dispersion
Delivers reliable sealing in demanding environments
```
(Each line separated by Alt+Enter)

## Using the Python Script

Once your Excel file is ready:

```bash
# Install required package (first time only)
pip install pandas openpyxl

# Convert Excel to JSON
python excel_to_json.py your_products.xlsx data

# This creates JSON files in the data/ folder
```

## Viewing Generated Datasheets

After running the script, view each datasheet:

```
template.html?data=data/HY_105_data.json
template.html?data=data/FG_320_data.json
```

## Column Mapping Reference

| Excel Column | JSON Path | Type |
|-------------|-----------|------|
| Product_Code | productInfo.styleCode | String |
| Tagline | productInfo.tagline | String |
| Description | description[] | Array |
| Key_Features | features.keyFeatures[] | Array |
| Applications | features.applications[] | Array |
| Performance_Benefits | performanceBenefits[] | Array |
| pH | technicalProperties.properties[].value | String/Object |
| Temperature | technicalProperties.properties[].value | String/Object |
| Pressure_* | technicalProperties.properties[].values{} | Object |

## Troubleshooting

**Issue**: Script fails to read Excel
- **Solution**: Make sure you have `pandas` and `openpyxl` installed
- Run: `pip install pandas openpyxl`

**Issue**: Empty JSON files generated
- **Solution**: Check that Product_Code column is not empty and column names match exactly

**Issue**: Multi-line text appears as one line
- **Solution**: Make sure you used Alt+Enter (not just Enter) in Excel cells

**Issue**: Special characters look wrong
- **Solution**: Save Excel file as `.xlsx` format (not `.xls`)
