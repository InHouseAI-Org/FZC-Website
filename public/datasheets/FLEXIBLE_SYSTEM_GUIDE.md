# Flexible Datasheet Template System - Complete Guide

## 🎯 Overview

This is a **completely flexible** datasheet system that can handle:
- ✅ **Single-page** layouts (like Style 150C)
- ✅ **Multi-page** layouts (like HY 105)
- ✅ **Any combination of sections** in any order
- ✅ **Different section types**: descriptions, bullet lists, tables, text blocks
- ✅ **Simple or complex** property tables

## 📊 Two Layout Types

### Layout 1: Single-Page (Compact)
Example: Style 150C
- One page with all content
- Brown section headers
- Yellow/gold table headers
- Compact, traditional technical datasheet style

**Use when:**
- Product has simple specifications
- Content fits on one page
- Need traditional technical document look

### Layout 2: Multi-Page (Modern)
Example: HY 105
- 3 pages: Hero → Details → Specifications
- Modern gradient design
- Red accent colors
- Magazine-style layout

**Use when:**
- Product has extensive information
- Want modern, premium presentation
- Marketing-focused approach

## 📁 Data Structure

### Basic Structure

```json
{
  "layout": "single-page" or "multi-page",
  "productInfo": {
    "styleCode": "150C",
    "styleName": "150C",
    "fullTitle": "Optional subtitle/description",
    "tagline": "For multi-page hero",
    "version": "V 01"
  },
  "images": {
    "logo": "path/to/logo.png",
    "hero": "path/to/background.jpg",  // For multi-page only
    "productMain": "path/to/product.png",  // Optional
    "cert": "path/to/certification.png"  // Optional, for single-page
  },
  "sections": [
    // Array of section objects (explained below)
  ],
  "company": {
    // Company information (same for all)
  }
}
```

## 📋 Section Types

You can use **any sections in any order**. Here are the available types:

### 1. Description Section
Paragraphs of text

```json
{
  "type": "description",
  "title": "Description",
  "content": [
    "First paragraph...",
    "Second paragraph..."
  ]
}
```

### 2. Bullet List Section
List with bullet points

```json
{
  "type": "bullet-list",
  "title": "Advantages" or "Key Features" or "Applications",
  "items": [
    "First bullet point",
    "Second bullet point",
    "Third bullet point"
  ]
}
```

### 3. Technical Properties Table
Two variations:

**A) Simple 2-Column Table:**
```json
{
  "type": "technical-properties",
  "title": "Operational Parameters",
  "hasEquipmentTypes": false,
  "properties": [
    {
      "name": "pH",
      "value": "6-14"
    },
    {
      "name": "TEMPERATURE (°C)",
      "value": "130"
    }
  ]
}
```

**B) Equipment-Specific Table (4 columns):**
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

### 4. Text Block Section
Simple text block (not bulleted)

```json
{
  "type": "text-block",
  "title": "Typical Applications" or "Services",
  "content": "Rotary/Centrifugal Pumps, valves, etc."
}
```

## 🎨 Complete Examples

### Example 1: Single-Page Datasheet (Style 150C)

```json
{
  "layout": "single-page",
  "productInfo": {
    "styleCode": "150C",
    "styleName": "150C",
    "fullTitle": "Braided Cotton Packing with Graphite Flakes",
    "version": "V 01"
  },
  "images": {
    "logo": "../../src/assets/inmarco-logo.png"
  },
  "sections": [
    {
      "type": "description",
      "title": "Description",
      "content": [
        "Product description paragraph..."
      ]
    },
    {
      "type": "technical-properties",
      "title": "Operational Parameters",
      "hasEquipmentTypes": false,
      "properties": [
        {"name": "pH", "value": "6-14"},
        {"name": "TEMPERATURE (°C)", "value": "130"}
      ]
    },
    {
      "type": "bullet-list",
      "title": "Advantages",
      "items": [
        "Advantage 1",
        "Advantage 2"
      ]
    },
    {
      "type": "text-block",
      "title": "Typical Applications",
      "content": "Rotary/Centrifugal Pumps, valves, etc."
    },
    {
      "type": "text-block",
      "title": "Services",
      "content": "River Water, Surface Water, D.M. Water, etc."
    }
  ],
  "company": { /* ... */ }
}
```

### Example 2: Multi-Page Datasheet (HY 105)

```json
{
  "layout": "multi-page",
  "productInfo": {
    "styleCode": "HY 105",
    "styleName": "Style HY 105",
    "fullName": "HY 105",
    "tagline": "Engineered for Mechanical Stability...",
    "version": "V 01"
  },
  "images": {
    "logo": "../../src/assets/inmarco-tagline-logo1.png",
    "hero": "../../public/fertilizer.jpg"
  },
  "sections": [
    {
      "type": "description",
      "title": "Product Description",
      "content": ["Paragraph 1...", "Paragraph 2..."]
    },
    {
      "type": "bullet-list",
      "title": "Key Features",
      "items": ["Feature 1", "Feature 2"]
    },
    {
      "type": "technical-properties",
      "title": "Technical Properties",
      "hasEquipmentTypes": true,
      "properties": [ /* ... */ ]
    },
    {
      "type": "bullet-list",
      "title": "Performance Benefits",
      "items": ["Benefit 1", "Benefit 2"]
    }
  ],
  "company": { /* ... */ }
}
```

## 🔧 Customization Options

### Mix and Match Sections

You can have any combination:

**Option A:**
1. Description
2. Technical Properties
3. Advantages

**Option B:**
1. Description
2. Key Features
3. Applications
4. Technical Properties
5. Performance Benefits
6. Services

**Option C:**
1. Technical Properties
2. Description
3. Applications

**The order and types are completely flexible!**

### Multiple Tables

You can even have multiple property tables:

```json
"sections": [
  {
    "type": "technical-properties",
    "title": "Physical Properties",
    "hasEquipmentTypes": false,
    "properties": [ /* ... */ ]
  },
  {
    "type": "technical-properties",
    "title": "Operational Limits",
    "hasEquipmentTypes": true,
    "properties": [ /* ... */ ]
  }
]
```

## 📊 Excel Integration

### Excel Column Structure

**Basic Columns (all products):**
- `Layout` → "single-page" or "multi-page"
- `Product_Code`
- `Style_Name`
- `Full_Title` (optional)
- `Tagline` (for multi-page)
- `Version`

**Section Columns:**
- `Description` (multi-paragraph, use Alt+Enter)
- `Key_Features` (bullet list, use Alt+Enter)
- `Advantages` (bullet list, use Alt+Enter)
- `Applications` (text or bullet list)
- `Services` (text block)
- `Performance_Benefits` (bullet list)

**Technical Properties:**
- For simple: `pH`, `Temperature`, `Pressure`, `Velocity`, `Size`
- For equipment-specific: `pH`, `Temperature`, `Pressure_Rotating`, `Pressure_Reciprocating`, `Pressure_Static`, etc.

### Excel to JSON Conversion

The Python script needs to be updated to handle the flexible format. I'll create that next.

## 🚀 Usage

### View a Datasheet

```
flexible-template.html?data=data/style_150C_data.json
flexible-template.html?data=data/HY_105_flexible.json
```

### Print/Export PDF

1. Open datasheet in browser
2. Ctrl+P (or Cmd+P)
3. Select "Save as PDF"
4. Enable "Background graphics"

## 💡 Benefits of Flexible System

| Feature | Benefit |
|---------|---------|
| **Modular Sections** | Add/remove/reorder sections as needed |
| **Multiple Layouts** | Choose single or multi-page per product |
| **No Code Changes** | All changes via JSON data only |
| **Consistent Branding** | Same template, different configurations |
| **Future-Proof** | Easy to add new section types |
| **Excel Compatible** | Bulk generate from spreadsheets |

## 📝 Quick Reference

### Section Type Cheat Sheet

```
description       → Paragraphs of text
bullet-list       → Bullet points with title
technical-properties → Table (simple or equipment-specific)
text-block        → Single text paragraph
```

### Common Section Titles

- Description
- Key Features
- Applications
- Advantages
- Technical Properties
- Operational Parameters
- Performance Benefits
- Typical Applications
- Services
- Chemical Compatibility

## 🔍 Validation Checklist

Before creating datasheet, verify:

- [ ] `layout` is "single-page" or "multi-page"
- [ ] All required `productInfo` fields present
- [ ] Each section has `type`, `title`, and appropriate content
- [ ] Technical properties have `hasEquipmentTypes` boolean
- [ ] Image paths are correct relative to template
- [ ] JSON syntax is valid

## 📞 Next Steps

1. **Create your data file** following the structure above
2. **Test it** by opening `flexible-template.html?data=YOUR_FILE.json`
3. **Refine** the content as needed
4. **Export to PDF** when ready

The system is now completely flexible - you control everything through the JSON data structure! 🎉
