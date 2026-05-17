#!/usr/bin/env python3
"""
Excel to JSON Converter for Inmarco Datasheets

This script converts an Excel file with product data into JSON files
that can be used with the datasheet template.

Excel Structure Expected:
- Each row represents one product
- Columns should match the field names below
"""

import pandas as pd
import json
import sys
import os
from pathlib import Path


def parse_list_field(value):
    """Convert string with line breaks or delimiters into list"""
    if pd.isna(value) or value == '':
        return []

    # Try splitting by newline first
    if '\n' in str(value):
        items = [item.strip() for item in str(value).split('\n') if item.strip()]
    # Try splitting by semicolon
    elif ';' in str(value):
        items = [item.strip() for item in str(value).split(';') if item.strip()]
    # Try splitting by pipe
    elif '|' in str(value):
        items = [item.strip() for item in str(value).split('|') if item.strip()]
    else:
        # Single item
        items = [str(value).strip()]

    return items


def parse_technical_properties(df_row):
    """Parse technical properties from Excel columns"""

    # Check if equipment-specific columns exist
    has_equipment_types = False
    for col in df_row.index:
        if 'rotating' in col.lower() or 'reciprocating' in col.lower():
            has_equipment_types = True
            break

    if has_equipment_types:
        # Equipment-specific table
        properties = []

        # Add pH if present
        if 'pH' in df_row.index and not pd.isna(df_row['pH']):
            properties.append({
                "name": "pH",
                "type": "universal",
                "value": str(df_row['pH'])
            })

        # Add Temperature if present
        if 'Temperature' in df_row.index and not pd.isna(df_row['Temperature']):
            properties.append({
                "name": "Temperature (°C)",
                "type": "universal",
                "value": str(df_row['Temperature'])
            })

        # Add Pressure (equipment-specific)
        if all(col in df_row.index for col in ['Pressure_Rotating', 'Pressure_Reciprocating', 'Pressure_Static']):
            properties.append({
                "name": "Pressure (BAR)",
                "type": "equipment-specific",
                "values": {
                    "rotating": str(df_row['Pressure_Rotating']) if not pd.isna(df_row['Pressure_Rotating']) else "-",
                    "reciprocating": str(df_row['Pressure_Reciprocating']) if not pd.isna(df_row['Pressure_Reciprocating']) else "-",
                    "static": str(df_row['Pressure_Static']) if not pd.isna(df_row['Pressure_Static']) else "-"
                }
            })

        # Add Velocity (equipment-specific)
        if all(col in df_row.index for col in ['Velocity_Rotating', 'Velocity_Reciprocating']):
            properties.append({
                "name": "Velocity (m/s)",
                "type": "equipment-specific",
                "values": {
                    "rotating": str(df_row['Velocity_Rotating']) if not pd.isna(df_row['Velocity_Rotating']) else "-",
                    "reciprocating": str(df_row['Velocity_Reciprocating']) if not pd.isna(df_row['Velocity_Reciprocating']) else "-",
                    "static": "-"
                }
            })

        # Add Size if present
        if 'Size' in df_row.index and not pd.isna(df_row['Size']):
            properties.append({
                "name": "Size",
                "type": "universal",
                "value": str(df_row['Size'])
            })

        return {
            "hasEquipmentTypes": True,
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
            "properties": properties
        }
    else:
        # Simple 2-column table
        properties = []

        # Map common property names
        property_mapping = {
            'pH': 'pH Range',
            'pH_Range': 'pH Range',
            'Temperature': 'Temperature Range',
            'Temperature_Range': 'Temperature Range',
            'Pressure': 'Pressure',
            'Pressure_Range': 'Pressure Range',
            'Size': 'Size Range',
            'Size_Range': 'Size Range'
        }

        for excel_col, display_name in property_mapping.items():
            if excel_col in df_row.index and not pd.isna(df_row[excel_col]):
                properties.append({
                    "name": display_name,
                    "type": "simple",
                    "value": str(df_row[excel_col])
                })

        return {
            "hasEquipmentTypes": False,
            "properties": properties
        }


def convert_excel_to_json(excel_file, output_dir='data'):
    """Convert Excel file to multiple JSON files (one per product)"""

    # Read Excel file
    print(f"Reading Excel file: {excel_file}")
    df = pd.read_excel(excel_file)

    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Process each row (product)
    for idx, row in df.iterrows():
        try:
            # Skip empty rows
            if pd.isna(row.get('Product_Code', '')):
                continue

            product_code = str(row['Product_Code']).strip()
            print(f"\nProcessing: {product_code}")

            # Build JSON structure
            data = {
                "productInfo": {
                    "styleCode": product_code,
                    "styleName": f"Style {product_code}",
                    "fullName": f"{product_code}",
                    "tagline": str(row.get('Tagline', 'High Performance Sealing Solution')),
                    "version": str(row.get('Version', 'V 01'))
                },
                "images": {
                    "hero": str(row.get('Hero_Image', '../../public/fertilizer.jpg')),
                    "productMain": str(row.get('Product_Image', '../../public/product.png'))
                },
                "description": parse_list_field(row.get('Description', '')),
                "features": {
                    "keyFeatures": parse_list_field(row.get('Key_Features', '')),
                    "applications": parse_list_field(row.get('Applications', ''))
                },
                "technicalProperties": parse_technical_properties(row),
                "performanceBenefits": parse_list_field(row.get('Performance_Benefits', '')),
                "company": {
                    "name": "INMARCO FZC",
                    "address": "P.O. Box 120284, Sharjah Airport International Free Zone (SAIF-Zone), Sharjah, UAE",
                    "phone": "+971 6 5578378",
                    "fax": "+971 6 5578948",
                    "email": "sales@inmarco.ae",
                    "website": "www.inmarco.ae",
                    "disclaimer": "All information and recommendations given in this technical data sheet are correct to the best of our knowledge. However, because of the wide variety of application and operating conditions, we cannot derive the final conclusion. This above information can only serve as a guideline."
                }
            }

            # Save to JSON file
            output_file = os.path.join(output_dir, f"{product_code}_data.json")
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            print(f"✓ Created: {output_file}")

        except Exception as e:
            print(f"✗ Error processing row {idx}: {e}")
            continue

    print(f"\n✓ Conversion complete! JSON files saved in '{output_dir}/' directory")


def print_excel_template():
    """Print expected Excel column names"""
    print("\n" + "="*80)
    print("EXPECTED EXCEL COLUMNS")
    print("="*80)
    print("""
Required Columns:
- Product_Code        (e.g., "HY 105")
- Tagline            (e.g., "Engineered for Mechanical Stability...")
- Description        (Multiple paragraphs, separated by line breaks)
- Key_Features       (Multiple features, separated by line breaks or semicolons)
- Applications       (Multiple applications, separated by line breaks or semicolons)
- Performance_Benefits (Multiple benefits, separated by line breaks or semicolons)

Optional Columns:
- Version            (e.g., "V 01")
- Hero_Image         (Path to background image)
- Product_Image      (Path to product image)

Technical Properties (Simple Table):
- pH or pH_Range
- Temperature or Temperature_Range
- Pressure or Pressure_Range
- Size or Size_Range

Technical Properties (Equipment-Specific Table):
- pH                    (universal value)
- Temperature           (universal value)
- Pressure_Rotating     (value for rotating equipment)
- Pressure_Reciprocating (value for reciprocating equipment)
- Pressure_Static       (value for static equipment)
- Velocity_Rotating     (value for rotating equipment)
- Velocity_Reciprocating (value for reciprocating equipment)
- Size                  (universal value)

Notes:
- Use line breaks (Alt+Enter in Excel) to separate multiple items
- Or use semicolons (;) or pipes (|) as delimiters
""")
    print("="*80 + "\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python excel_to_json.py <excel_file> [output_directory]")
        print("\nExample: python excel_to_json.py products.xlsx data")
        print_excel_template()
        sys.exit(1)

    excel_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'data'

    if not os.path.exists(excel_file):
        print(f"Error: File '{excel_file}' not found!")
        sys.exit(1)

    convert_excel_to_json(excel_file, output_dir)
