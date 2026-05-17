#!/usr/bin/env python3
"""
Parse all 59 MD files from Products directory and create structured productsData.json
with proper rotating/reciprocating/static separation for specifications.
"""

import os
import re
import json
from pathlib import Path

# Base directory
BASE_DIR = "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1"
PRODUCTS_DIR = os.path.join(BASE_DIR, "Products")
OUTPUT_FILE = os.path.join(BASE_DIR, "src/data/productsData.json")

# Category mapping
CATEGORY_MAPPING = {
    "Compression_Packings": "Compression Packings",
    "Flange_Joint_Gaskets": "Flange Joint Gaskets",
    "Metallic_Gaskets": "Metallic Gaskets",
    "Graphite_Moulded_Products": "Graphite Moulded Products",
    "Thermal_Insulation": "Thermal Insulation",
    "Flange_Isolation_Gaskets": "Flange Isolation Gaskets",
    "Wiping_Pad": "Wiping Pad"
}

# Subcategory mapping
SUBCATEGORY_MAPPING = {
    "Hybrid": "Hybrid",
    "Carbon_Graphite": "Carbon Graphite",
    "PTFE": "PTFE",
    "Organic": "Organic",
    "Polyimide": "Polyimide",
    "Fugitive_Emission": "Fugitive Emission",
    "CNAF": "CNAF",
    "Graphite": "Graphite",
    "Expanded_PTFE": "Expanded PTFE",
    "Ring_Type_Joint_Gasket": "Ring Type Joint Gasket",
    "Shim_Joint": "Shim Joint",
    "Double_Jacketed_Gasket": "Double Jacketed Gasket",
    "Soft_Iron_Ring": "Soft Iron Ring",
    "Corrugated_Gasket": "Corrugated Gasket",
    "Laminar_Gasket": "Laminar Gasket",
    "Kammprofile_Gasket": "Kammprofile Gasket",
    "Grafoil_Moulded_Ring": "Grafoil Moulded Ring",
    "Pressure_Seal_Gasket": "Pressure Seal Gasket",
    "Ceramic": "Ceramic",
    "E-Glass": "E-Glass",
    "Welding_Blanket": "Welding Blanket",
    "High_Temperature_Wiping_Pad": "High Temperature Wiping Pad",
    "Aramid_Based_Wiping_Pad": "Aramid Based Wiping Pad",
    "INSULATION_GASKET_KIT_1800_FS": "Insulation Gasket Kit"
}


def extract_section(content, section_name):
    """Extract content from a markdown section."""
    pattern = rf'^##\s+{section_name}\s*$\n(.*?)(?=\n##|\Z)'
    match = re.search(pattern, content, re.MULTILINE | re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""


def extract_list_items(text):
    """Extract bullet points from markdown list."""
    items = []
    for line in text.split('\n'):
        line = line.strip()
        if line.startswith('- '):
            items.append(line[2:].strip())
        elif line.startswith('* '):
            items.append(line[2:].strip())
    return items


def parse_slash_separated_specs(content):
    """
    Parse Type A specifications (slash-separated values).
    Example: | Pressure (BAR) | 100 / 200 / 300 |
    Format: Rotating / Reciprocating / Static
    Also handles single-value specs (no slashes).
    """
    specs = {
        "temperature": None,
        "pH": None,
        "sizeRange": None,
        "rotating": {},
        "reciprocating": {},
        "static": {}
    }

    has_slash_separated = False

    # Find the operational parameters table
    lines = content.split('\n')
    in_table = False

    for line in lines:
        line = line.strip()
        if not line or line.startswith('##'):
            continue

        if '|' in line and ('Properties' in line or 'Values' in line):
            in_table = True
            continue

        if in_table and '|' in line:
            # Parse table row
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) < 2:
                continue

            prop = parts[0]
            value = parts[1] if len(parts) > 1 else ""

            # Skip separator rows
            if '---' in prop or '---' in value:
                continue

            # pH
            if 'pH' in prop:
                specs['pH'] = value

            # Temperature
            elif 'Temperature' in prop:
                # Extract value and unit
                temp_match = re.search(r'(-?\d+)\s*to\s*\+?(-?\d+)\s*°?C?', value)
                if temp_match:
                    specs['temperature'] = {
                        "value": f"{temp_match.group(1)} to +{temp_match.group(2)}",
                        "unit": "°C"
                    }
                else:
                    # Try single value or word format (e.g., "Ambient to 80")
                    temp_match2 = re.search(r'Ambient\s+to\s+(-?\d+)', value, re.IGNORECASE)
                    if temp_match2:
                        specs['temperature'] = {
                            "value": f"Ambient to {temp_match2.group(1)}",
                            "unit": "°C"
                        }

            # Pressure with slash separation
            elif 'Pressure' in prop and '/' in value:
                has_slash_separated = True
                values = [v.strip() for v in value.split('/')]
                if len(values) >= 1:
                    specs['rotating']['pressure'] = {"value": values[0], "unit": "bar"}
                if len(values) >= 2:
                    specs['reciprocating']['pressure'] = {"value": values[1], "unit": "bar"}
                if len(values) >= 3:
                    specs['static']['pressure'] = {"value": values[2], "unit": "bar"}

            # Pressure with single value (no slashes)
            elif 'Pressure' in prop and '/' not in value:
                pressure_match = re.search(r'(\d+)', value)
                if pressure_match:
                    specs['pressure'] = {
                        "value": pressure_match.group(1),
                        "unit": "bar"
                    }

            # Velocity with slash separation
            elif 'Velocity' in prop and '/' in value:
                has_slash_separated = True
                values = [v.strip() for v in value.split('/')]
                if len(values) >= 1:
                    specs['rotating']['velocity'] = {"value": values[0], "unit": "m/s"}
                if len(values) >= 2:
                    specs['reciprocating']['velocity'] = {"value": values[1], "unit": "m/s"}
                # Static typically has no velocity
                specs['static']['velocity'] = {"value": "N/A", "unit": "m/s"}

            # Velocity with single value (no slashes)
            elif 'Velocity' in prop and '/' not in value:
                velocity_match = re.search(r'(\d+)', value)
                if velocity_match:
                    specs['velocity'] = {
                        "value": velocity_match.group(1),
                        "unit": "m/s"
                    }

            # Size range
            elif 'Size' in prop:
                size_match = re.search(r'(\d+)\s*(?:sq\s*mm)?\s*[Tt][Oo]\s*(\d+)\s*sq\s*mm', value)
                if size_match:
                    specs['sizeRange'] = {
                        "value": f"{size_match.group(1)} to {size_match.group(2)}",
                        "unit": "sq mm"
                    }

    # If no slash-separated values found, remove empty rotating/reciprocating/static
    if not has_slash_separated:
        if not specs['rotating']:
            del specs['rotating']
        if not specs['reciprocating']:
            del specs['reciprocating']
        if not specs['static']:
            del specs['static']

    return specs


def parse_column_based_specs(content):
    """
    Parse Type B specifications (column-based).
    Example: | Properties | Rotary | Reciprocating | Static |
    """
    specs = {
        "temperature": None,
        "pH": None,
        "sizeRange": None,
        "rotating": {},
        "reciprocating": {},
        "static": {}
    }

    lines = content.split('\n')
    in_table = False
    col_indices = {}

    for line in lines:
        line = line.strip()
        if not line or line.startswith('##'):
            continue

        if '|' in line:
            parts = [p.strip() for p in line.split('|') if p.strip()]

            # Check for header row (case insensitive)
            line_lower = line.lower()
            if 'rotary' in line_lower or 'reciprocating' in line_lower:
                in_table = True
                # Map column indices
                for i, part in enumerate(parts):
                    part_lower = part.lower()
                    if 'rotary' in part_lower or 'rotating' in part_lower:
                        col_indices['rotary'] = i
                    elif 'reciprocating' in part_lower:
                        col_indices['reciprocating'] = i
                    elif 'static' in part_lower:
                        col_indices['static'] = i
                continue

            # Skip separator rows
            if len(parts) > 0 and '---' in parts[0]:
                continue

            if in_table and len(parts) > 1:
                prop = parts[0]

                # pH
                if 'pH' in prop:
                    specs['pH'] = parts[col_indices.get('rotary', 1)]

                # Temperature
                elif 'Temperature' in prop:
                    temp_value = parts[col_indices.get('rotary', 1)]
                    temp_match = re.search(r'(-?\d+)\s*to\s*\+?(-?\d+)', temp_value)
                    if temp_match:
                        specs['temperature'] = {
                            "value": f"{temp_match.group(1)} to +{temp_match.group(2)}",
                            "unit": "°C"
                        }

                # Pressure
                elif 'Pressure' in prop:
                    if 'rotary' in col_indices and len(parts) > col_indices['rotary']:
                        val = parts[col_indices['rotary']]
                        if val and val != '---':
                            specs['rotating']['pressure'] = {"value": val, "unit": "bar"}

                    if 'reciprocating' in col_indices and len(parts) > col_indices['reciprocating']:
                        val = parts[col_indices['reciprocating']]
                        if val and val != '---':
                            specs['reciprocating']['pressure'] = {"value": val, "unit": "bar"}

                    if 'static' in col_indices and len(parts) > col_indices['static']:
                        val = parts[col_indices['static']]
                        if val and val != '---':
                            specs['static']['pressure'] = {"value": val, "unit": "bar"}

                # Velocity
                elif 'Velocity' in prop:
                    if 'rotary' in col_indices and len(parts) > col_indices['rotary']:
                        val = parts[col_indices['rotary']]
                        if val and val != '---':
                            specs['rotating']['velocity'] = {"value": val, "unit": "m/s"}

                    if 'reciprocating' in col_indices and len(parts) > col_indices['reciprocating']:
                        val = parts[col_indices['reciprocating']]
                        if val and val != '---':
                            specs['reciprocating']['velocity'] = {"value": val, "unit": "m/s"}

                    if 'static' in col_indices and len(parts) > col_indices['static']:
                        val = parts[col_indices['static']]
                        specs['static']['velocity'] = {"value": val if val != '---' else "N/A", "unit": "m/s"}

                # Size
                elif 'Size' in prop:
                    size_value = parts[col_indices.get('rotary', 1)]
                    size_match = re.search(r'(\d+)\s*(?:sq\s*mm)?\s*[Tt][Oo]\s*(\d+)\s*sq\s*mm', size_value)
                    if size_match:
                        specs['sizeRange'] = {
                            "value": f"{size_match.group(1)} to {size_match.group(2)}",
                            "unit": "sq mm"
                        }

    # Clean up empty rotating/reciprocating/static sections
    if not specs['rotating']:
        del specs['rotating']
    if not specs['reciprocating']:
        del specs['reciprocating']
    if not specs['static']:
        del specs['static']

    return specs


def parse_simple_specs(content):
    """
    Parse Type C specifications (simple table without rotary/reciprocating/static).
    Used for gaskets and other non-compression-packing products.
    """
    specs = {}

    lines = content.split('\n')
    in_table = False

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if '|' in line and ('Property' in line or 'Value' in line or 'Specifications' in line):
            in_table = True
            continue

        if in_table and '|' in line:
            parts = [p.strip() for p in line.split('|') if p.strip()]

            # Skip separator rows
            if len(parts) > 0 and '---' in parts[0]:
                continue

            if len(parts) >= 2:
                prop = parts[0]
                value = parts[1]

                # Temperature
                if 'Temperature' in prop:
                    temp_match = re.search(r'(-?\d+)\s*°?C?\s*to\s*\+?(-?\d+)\s*°?C?', value)
                    if temp_match:
                        specs['temperature'] = {
                            "value": f"{temp_match.group(1)} to +{temp_match.group(2)}",
                            "unit": "°C"
                        }

                # Pressure
                elif 'Pressure' in prop:
                    pressure_match = re.search(r'(\d+)\s*bar', value, re.IGNORECASE)
                    if pressure_match:
                        specs['pressure'] = {
                            "value": pressure_match.group(1),
                            "unit": "bar"
                        }

                # Other properties
                elif prop and value:
                    # Convert to camelCase key
                    key = prop.replace(' ', '').replace('-', '')
                    key = key[0].lower() + key[1:] if key else key
                    specs[key] = value

    return specs


def parse_md_file(filepath):
    """Parse a single markdown file and extract product information."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract product name from title
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    product_name = title_match.group(1).strip() if title_match else ""

    # If no title, use filename
    if not product_name:
        product_name = Path(filepath).stem

    # Remove "Style", "Inmarco Style", etc. from product name
    product_name = re.sub(r'^(Inmarco\s+)?Style\s+', '', product_name, flags=re.IGNORECASE)

    # Extract path components for category/subcategory
    path_parts = Path(filepath).parts
    products_idx = path_parts.index('Products')

    category_folder = path_parts[products_idx + 1] if len(path_parts) > products_idx + 1 else ""
    subcategory_folder = path_parts[products_idx + 2] if len(path_parts) > products_idx + 2 else ""

    category = CATEGORY_MAPPING.get(category_folder, category_folder.replace('_', ' '))
    subcategory = SUBCATEGORY_MAPPING.get(subcategory_folder, subcategory_folder.replace('_', ' '))

    # Extract sections
    description = extract_section(content, 'Description') or extract_section(content, 'Overview')
    features = extract_section(content, 'Features') or extract_section(content, 'Key Features')
    applications = extract_section(content, 'Applications')
    advantages = extract_section(content, 'Advantages')

    # Parse specifications based on format
    specs = None

    # Check if it has operational parameters table
    if 'Operational Parameters' in content or 'operational parameters' in content.lower():
        # Check format type - look for column-based format (Property or Properties header with Rotary/Reciprocating/Static columns)
        if re.search(r'\|\s*Propert(?:y|ies)\s*\|\s*Rotar(?:y|ating)\s*\|', content, re.IGNORECASE):
            # Type B: Column-based
            specs = parse_column_based_specs(content)
        elif re.search(r'\d+\s*/\s*\d+', content):
            # Type A: Slash-separated
            specs = parse_slash_separated_specs(content)
        else:
            # Single-value operational parameters
            specs = parse_slash_separated_specs(content)
    elif 'Specifications' in content or 'Technical Data' in content:
        # Type C: Simple specifications
        specs = parse_simple_specs(content)

    # Clean up specs - remove if all values are None/empty
    if specs:
        # Remove None values
        specs = {k: v for k, v in specs.items() if v is not None and v != {} and v != []}
        # If specs is empty after cleanup, set to None
        if not specs:
            specs = None

    # Convert features and applications to arrays
    features_list = extract_list_items(features) if features else []
    applications_list = extract_list_items(applications) if applications else []
    advantages_list = extract_list_items(advantages) if advantages else []

    # If applications is just text without bullets, use it as is
    if not applications_list and applications:
        applications_list = [applications]

    # Generate product ID from name
    product_id = re.sub(r'[^a-zA-Z0-9]+', '-', product_name).lower().strip('-')

    product = {
        "id": product_id,
        "name": product_name,
        "category": category,
        "subcategory": subcategory,
        "description": description or "",
        "features": features_list,
        "advantages": advantages_list if advantages_list else [],
        "applications": applications_list,
        "images": [],
        "gallery": [],
        "datasheet": ""
    }

    if specs:
        product["specifications"] = specs

    return product


def main():
    """Main function to parse all MD files and create JSON."""
    print(f"Scanning {PRODUCTS_DIR} for MD files...")

    # Find all MD files
    md_files = []
    for root, dirs, files in os.walk(PRODUCTS_DIR):
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))

    print(f"Found {len(md_files)} MD files")

    # Parse all files
    products = []
    categories_set = set()
    subcategories_set = set()

    for md_file in sorted(md_files):
        try:
            print(f"Parsing {os.path.basename(md_file)}...")
            product = parse_md_file(md_file)
            products.append(product)
            categories_set.add(product['category'])
            subcategories_set.add(product['subcategory'])
        except Exception as e:
            print(f"Error parsing {md_file}: {e}")

    # Build categories array
    categories = []
    for cat_folder, cat_name in CATEGORY_MAPPING.items():
        if cat_name in categories_set:
            cat_id = cat_folder.lower()
            categories.append({
                "id": cat_id,
                "name": cat_name,
                "description": f"High-quality {cat_name.lower()} for industrial applications",
                "image": f"/images/categories/{cat_id}.jpg"
            })

    # Build subcategories array
    subcategories = []
    for subcat_folder, subcat_name in SUBCATEGORY_MAPPING.items():
        if subcat_name in subcategories_set:
            # Find parent category
            parent_cat = None
            for md_file in md_files:
                if subcat_folder in md_file:
                    path_parts = Path(md_file).parts
                    products_idx = path_parts.index('Products')
                    category_folder = path_parts[products_idx + 1]
                    parent_cat = CATEGORY_MAPPING.get(category_folder)
                    break

            if parent_cat:
                subcat_id = subcat_folder.lower()
                subcategories.append({
                    "id": subcat_id,
                    "name": subcat_name,
                    "category": parent_cat,
                    "description": f"{subcat_name} products"
                })

    # Create final JSON structure
    output = {
        "categories": sorted(categories, key=lambda x: x['name']),
        "subcategories": sorted(subcategories, key=lambda x: (x['category'], x['name'])),
        "products": sorted(products, key=lambda x: (x['category'], x['subcategory'], x['name']))
    }

    # Write to file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}")
    print(f"Successfully created {OUTPUT_FILE}")
    print(f"{'='*60}")
    print(f"Categories: {len(categories)}")
    print(f"Subcategories: {len(subcategories)}")
    print(f"Products: {len(products)}")
    print(f"{'='*60}")

    # Print sample product with specs
    for p in products:
        if 'specifications' in p and 'rotating' in p.get('specifications', {}):
            print(f"\nSample product with rotating/reciprocating/static specs:")
            print(f"Name: {p['name']}")
            print(f"Category: {p['category']}")
            print(json.dumps(p['specifications'], indent=2))
            break


if __name__ == '__main__':
    main()
