# Inmarco Datasheet Template System

## Overview
This template system allows you to create consistent, professional datasheets for all products by simply providing structured data in JSON format. All datasheets share the same design and layout, with only the content and images changing.

## Files Structure

```
public/datasheets/
├── template.html              # Main template file (DO NOT EDIT for individual products)
├── data/                      # Data files for each product
│   ├── HY_105_data.json      # Example: Full table with equipment types
│   └── SAMPLE_SIMPLE_data.json # Example: Simple 2-column table
└── README.md                  # This file
```

## How to Use

### Creating a New Datasheet

1. **Create a JSON data file** in the `data/` folder:
   - Copy either `HY_105_data.json` (for complex table) or `SAMPLE_SIMPLE_data.json` (for simple table)
   - Name it: `[PRODUCT_CODE]_data.json` (e.g., `FG_320_data.json`)

2. **Fill in your product data** following the structure below

3. **View the datasheet** by opening:
   ```
   template.html?data=data/YOUR_PRODUCT_data.json
   ```

## Data Structure Explained

### Product Information
```json
"productInfo": {
  "styleCode": "HY 105",           // Short product code
  "styleName": "Style HY 105",     // Product name for hero
  "fullName": "HY 105", // Full name for page 2
  "tagline": "Your tagline here",  // Hero page tagline
  "version": "V 01"                // Version number
}
```

### Images
```json
"images": {
  "hero": "../../public/fertilizer.jpg",  // Background image for page 1
  "productMain": "../../public/product.png" // Product image for page 2
}
```

### Description
Array of paragraphs that will appear on page 2:
```json
"description": [
  "First paragraph...",
  "Second paragraph..."
]
```

### Features
```json
"features": {
  "keyFeatures": [
    "Feature 1",
    "Feature 2"
  ],
  "applications": [
    "Application 1",
    "Application 2"
  ]
}
```

### Technical Properties - Two Types

#### Type 1: Simple 2-Column Table
```json
"technicalProperties": {
  "hasEquipmentTypes": false,  // Important: set to false
  "properties": [
    {
      "name": "pH Range",
      "type": "simple",
      "value": "0-14"
    }
  ]
}
```

#### Type 2: Equipment-Specific Table (Rotating/Reciprocating/Static)
```json
"technicalProperties": {
  "hasEquipmentTypes": true,  // Important: set to true
  "equipmentTypes": {
    "rotating": {
      "icon": "fa-sync-alt",
      "label": "Rotating"
    },
    "reciprocating": {
      "icon": "fa-arrows-alt-h",
      "label": "Reciprocating"
    },
    "static": {
      "icon": "fa-circle",
      "label": "Static"
    }
  },
  "properties": [
    {
      "name": "pH",
      "type": "universal",  // Spans all columns
      "value": "0-14"
    },
    {
      "name": "Pressure (BAR)",
      "type": "equipment-specific",  // Different value per equipment type
      "values": {
        "rotating": "100",
        "reciprocating": "200",
        "static": "300"
      }
    }
  ]
}
```

### Performance Benefits
```json
"performanceBenefits": [
  "Benefit 1",
  "Benefit 2"
]
```

### Company Information
```json
"company": {
  "name": "INMARCO FZC",
  "address": "P.O. Box 120284, ...",
  "phone": "+971 6 5578378",
  "fax": "+971 6 5578948",
  "email": "sales@inmarco.ae",
  "website": "www.inmarco.ae",
  "disclaimer": "All information..."
}
```

## Converting Excel to JSON

When you receive the Excel file with product data:

1. **Column Mapping**:
   - Product Code → `productInfo.styleCode`
   - Product Name → `productInfo.styleName`
   - Tagline → `productInfo.tagline`
   - Description 1 → `description[0]`
   - Description 2 → `description[1]`
   - Features → `features.keyFeatures` (split by line/delimiter)
   - Applications → `features.applications` (split by line/delimiter)
   - Technical specs → `technicalProperties.properties`
   - Benefits → `performanceBenefits`

2. **Scripts** (can be created):
   - Python script to convert Excel → JSON
   - Or use online Excel to JSON converters with the correct column mapping

## Advantages of This System

✅ **Single Source of Truth**: All datasheets use one template
✅ **Easy Updates**: Change template.html once, affects all datasheets
✅ **Consistent Branding**: Every datasheet looks the same
✅ **Easy Data Management**: JSON files are easy to edit and version control
✅ **Excel Compatible**: Can bulk-create datasheets from Excel
✅ **Flexible**: Supports both simple and complex property tables
✅ **Print Ready**: Uses A4 page size, ready for PDF export

## Printing/Exporting to PDF

1. Open the datasheet in browser
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. Select "Save as PDF"
4. Ensure "Print backgrounds" is enabled
5. Save the PDF

## Updating All Datasheets

To update design/layout for ALL datasheets:
1. Edit `template.html` only
2. All datasheets will automatically use the new design

To update content for ONE datasheet:
1. Edit only the corresponding JSON file in `data/` folder
2. Refresh the page to see changes

## Need Help?

- Check `HY_105_data.json` for a complete example
- Check `SAMPLE_SIMPLE_data.json` for a simple example
- Make sure JSON is valid (use a JSON validator)
- Ensure image paths are correct relative to template.html
