#!/usr/bin/env python3
"""
Automated Datasheet Converter - Extract from PDFs and Create HY 105 Style Datasheets

This script:
1. Scans all existing PDF datasheets
2. Extracts content using OCR/PDF parsing
3. Intelligently maps data to JSON structure
4. Applies correct industry images
5. Generates HY 105-styled datasheets

Requirements:
    pip install PyPDF2 pdfplumber pytesseract pillow pandas

Usage:
    python extract_and_convert_all.py
"""

import os
import json
import re
from pathlib import Path
import pdfplumber
from typing import Dict, List, Optional

# Industry mapping based on your table
INDUSTRY_MAPPING = {
    "power": "../../public/power.jpg",
    "po": "../../public/power.jpg",
    "water": "../../public/water.jpg",
    "ww": "../../public/water.jpg",
    "waste water": "../../public/water.jpg",
    "chemical": "../../public/chemical.jpg",
    "chem": "../../public/chemical.jpg",
    "fertilizer": "../../public/fertilizer.jpg",
    "fer": "../../public/fertilizer.jpg",
    "fertiliser": "../../public/fertilizer.jpg",
    "metallurgy": "../../public/metallurgy.jpg",
    "met": "../../public/metallurgy.jpg",
    "oil": "../../public/oil and gas.jpg",
    "gas": "../../public/oil and gas.jpg",
    "ong": "../../public/oil and gas.jpg",
    "oil & gas": "../../public/oil and gas.jpg",
    "paper": "../../public/paper.jpg",
    "pulp": "../../public/paper.jpg",
    "pulp & paper": "../../public/paper.jpg",
    "marine": "../../public/marine.jpg",
    "food": "../../public/food and pahrma.jpg",
    "pharma": "../../public/food and pahrma.jpg",
    "sugar": "../../public/sugar.jpg",
    "cement": "../../public/cement.jpg",
    "general": "../../public/cement.jpg"
}

# Product to industry mapping from your table
PRODUCT_INDUSTRY_MAP = {
    "PE 505": "chemical", "PA 503": "chemical", "HY 504": "chemical",
    "PE 509": "chemical", "HY 503": "fertilizer", "HY 507": "fertilizer",
    "HY 105": "fertilizer", "PE 102": "fertilizer", "HY 175": "power",
    "PA 106": "power", "CR 124C": "ww", "PA 501": "power",
    "CG 101E": "ong", "CG 102": "ong", "N 323": "metallurgy",
    "N 123": "metallurgy", "CR 120": "ww", "HY 120W": "metallurgy",
    "CG 900": "power", "CG 503": "chemical", "CN 153": "ww",
    "GN 153": "ww", "HY 605": "power", "HY 601C": "ong",
    "N 125C": "metallurgy", "HY 510": "chem", "FE 104C": "chem",
    "HY 109F": "power", "PA 106E": "paper", "PA 104A": "power",
    "PE 508G": "chem", "ULTRA FE 1002": "ong", "ULTRA FE 1003": "ong",
    "ULTRA FE 1004": "ong", "HY 107 HD": "fertilizer",
    "HY 105 HD": "fertilizer", "N 124S": "power", "GAM 300X": "power",
    "GM 160": "power", "GM 360": "power", "150C": "ww",
    "HY 107": "fertilizer", "PA 104": "power", "PE 104": "chemical",
    "PE 104C": "chemical", "PE 104A": "power", "HY 501": "fertilizer",
    "HY 606": "power", "801CC": "chemical", "OR 125SR": "ong",
    "style 120AR": "ww", "style 100fx": "power", "HY 107HD": "fertilizer",
    "PE 504P": "chemical", "CG 101": "ong", "ULTRA LE 1002": "ong",
    "ULTRA LT 1004": "ong", "HY 510EC": "chemical", "501 C": "power"
}

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF using pdfplumber"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"  ⚠️  Error reading {pdf_path}: {e}")
        return ""

def extract_product_code(filename: str, text: str) -> str:
    """Extract product code from filename or text"""
    # Try filename first
    base = os.path.basename(filename).replace('.pdf', '')

    # Clean up common variations
    code = base.replace('', '').replace('style ', '').replace('Style ', '')
    code = re.sub(r'\s+copy.*', '', code, flags=re.IGNORECASE)
    code = code.strip()

    return code

def detect_industry(product_code: str, text: str) -> str:
    """Detect industry from product code or text content"""
    # Check product mapping first
    for key, industry in PRODUCT_INDUSTRY_MAP.items():
        if key.lower() in product_code.lower():
            return industry

    # Check text for industry keywords
    text_lower = text.lower()
    if any(word in text_lower for word in ['fertilizer', 'fertiliser', 'urea', 'ammonia']):
        return "fertilizer"
    elif any(word in text_lower for word in ['power', 'boiler', 'turbine', 'steam']):
        return "power"
    elif any(word in text_lower for word in ['water', 'waste water', 'sewage', 'effluent']):
        return "ww"
    elif any(word in text_lower for word in ['oil', 'gas', 'petroleum', 'lng', 'lpg']):
        return "ong"
    elif any(word in text_lower for word in ['chemical', 'acid', 'alkali', 'solvent']):
        return "chemical"
    elif any(word in text_lower for word in ['metallurgy', 'steel', 'metal', 'foundry']):
        return "metallurgy"
    elif any(word in text_lower for word in ['paper', 'pulp']):
        return "paper"

    # Default
    return "general"

def parse_technical_properties(text: str) -> Dict:
    """Parse technical properties from text"""
    properties = []

    # Look for common property patterns
    ph_match = re.search(r'pH\s*[:=]?\s*(\d+[-–]\d+|\d+)', text, re.IGNORECASE)
    temp_match = re.search(r'[Tt]emperature.*?[:=]?\s*([-\d]+\s*(?:to|-)?\s*[+]?\d+\s*°?C)', text)
    pressure_match = re.search(r'[Pp]ressure.*?[:=]?\s*(\d+)\s*(?:BAR|bar)', text)
    velocity_match = re.search(r'[Vv]elocity.*?[:=]?\s*(\d+)\s*(?:m/s|m\/s)', text)
    size_match = re.search(r'[Ss]ize.*?[:=]?\s*(\d+\s*mm.*?to.*?\d+\s*mm|[\d.]+\s*mm)', text, re.IGNORECASE)

    # Check for equipment-specific values
    has_equipment_types = 'rotating' in text.lower() or 'reciprocating' in text.lower()

    if has_equipment_types:
        # Try to extract equipment-specific values
        return {
            "hasEquipmentTypes": True,
            "properties": [
                {"name": "pH", "type": "universal", "value": ph_match.group(1) if ph_match else "N/A"},
                {"name": "Temperature (°C)", "type": "universal", "value": temp_match.group(1) if temp_match else "N/A"}
            ]
        }
    else:
        # Simple table
        if ph_match:
            properties.append({"name": "pH", "value": ph_match.group(1)})
        if temp_match:
            properties.append({"name": "Temperature (°C)", "value": temp_match.group(1)})
        if pressure_match:
            properties.append({"name": "Pressure (BAR)", "value": pressure_match.group(1)})
        if velocity_match:
            properties.append({"name": "Velocity (m/s)", "value": velocity_match.group(1)})
        if size_match:
            properties.append({"name": "Size", "value": size_match.group(1)})

        return {
            "hasEquipmentTypes": False,
            "properties": properties if properties else [{"name": "Specification", "value": "See datasheet"}]
        }

def extract_bullet_points(text: str, section_name: str) -> List[str]:
    """Extract bullet points from a section"""
    # Find section and extract content
    pattern = rf'{section_name}[:\s]+(.*?)(?=\n\n|\n[A-Z][a-z]+:|$)'
    match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)

    if not match:
        return []

    section_text = match.group(1)

    # Split by bullet points or line breaks
    lines = [line.strip() for line in section_text.split('\n') if line.strip()]

    # Clean up and filter
    bullets = []
    for line in lines:
        line = re.sub(r'^[•●▪◦▫-]\s*', '', line)
        if len(line) > 10 and not line.isupper():  # Filter out headers
            bullets.append(line)

    return bullets[:10]  # Limit to 10 items

def parse_description(text: str) -> List[str]:
    """Extract description paragraphs"""
    # Look for description section
    desc_patterns = [
        r'Description[:\s]+(.*?)(?=\n\n[A-Z]|\nProperties|\nAdvantages|\nApplications|$)',
        r'^(.*?)(?=\n\n[A-Z]|\nProperties)'
    ]

    for pattern in desc_patterns:
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            desc_text = match.group(1).strip()
            # Split into paragraphs
            paragraphs = [p.strip() for p in desc_text.split('\n\n') if len(p.strip()) > 50]
            return paragraphs[:2] if paragraphs else [desc_text[:500]]

    # Fallback: Use first substantial text block
    lines = text.split('\n')
    substantial = [l for l in lines if len(l) > 100]
    return [substantial[0]] if substantial else ["Product description not available."]

def generate_datasheet_json(pdf_path: str, output_dir: str):
    """Generate JSON datasheet from PDF"""
    print(f"\n📄 Processing: {os.path.basename(pdf_path)}")

    # Extract text
    text = extract_text_from_pdf(pdf_path)
    if not text:
        print("  ❌ Could not extract text")
        return

    # Parse data
    product_code = extract_product_code(pdf_path, text)
    industry = detect_industry(product_code, text)
    hero_image = INDUSTRY_MAPPING.get(industry, "../../public/cement.jpg")

    # Extract sections
    description = parse_description(text)
    features = extract_bullet_points(text, "(?:Key )?Features?")
    applications = extract_bullet_points(text, "Applications?")
    advantages = extract_bullet_points(text, "Advantages?")
    benefits = extract_bullet_points(text, "(?:Performance )?Benefits?")

    # Combine benefits and advantages if needed
    if not benefits and advantages:
        benefits = advantages
    elif not benefits:
        benefits = ["High-performance sealing solution", "Durable construction", "Reliable performance"]

    # Technical properties
    tech_props = parse_technical_properties(text)

    # Build JSON structure
    data = {
        "layout": "multi-page",
        "productInfo": {
            "styleCode": product_code,
            "styleName": f"Style {product_code}",
            "fullName": f"{product_code}",
            "tagline": f"High-Performance Sealing Solution",  # Can be customized
            "version": "V 01"
        },
        "images": {
            "logo": "../../src/assets/inmarco-tagline-logo1.png",
            "hero": hero_image
        },
        "sections": []
    }

    # Add description
    if description:
        data["sections"].append({
            "type": "description",
            "title": "Product Description",
            "content": description
        })

    # Add features
    if features:
        data["sections"].append({
            "type": "bullet-list",
            "title": "Key Features",
            "items": features
        })

    # Add applications
    if applications:
        data["sections"].append({
            "type": "bullet-list",
            "title": "Applications",
            "items": applications
        })

    # Add technical properties
    data["sections"].append({
        "type": "technical-properties",
        "title": "Technical Properties",
        **tech_props
    })

    # Add benefits
    if benefits:
        data["sections"].append({
            "type": "bullet-list",
            "title": "Performance Benefits",
            "items": benefits
        })

    # Add company info
    data["company"] = {
        "name": "INMARCO FZC",
        "address": "P.O. Box 120284, Sharjah Airport International Free Zone (SAIF-Zone), Sharjah, UAE",
        "phone": "+971 6 5578378",
        "fax": "+971 6 5578948",
        "email": "sales@inmarco.ae",
        "website": "www.inmarco.ae",
        "disclaimer": "All information and recommendations given in this technical data sheet are correct to the best of our knowledge. However, because of the wide variety of application and operating conditions, we cannot derive the final conclusion. This above information can only serve as a guideline."
    }

    # Save JSON
    output_file = os.path.join(output_dir, f"{product_code.replace(' ', '_')}_data.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  ✅ Created: {output_file}")
    print(f"  🏭 Industry: {industry} → {os.path.basename(hero_image)}")

def main():
    print("="*80)
    print("INMARCO DATASHEET CONVERTER")
    print("Extracting from PDFs and Creating HY 105 Style Datasheets")
    print("="*80)

    # Paths
    datasheet_dir = "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Industrial Website Homepage Design v1/Datasheet"
    output_dir = "data"

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Find all PDFs
    pdf_files = []
    for root, dirs, files in os.walk(datasheet_dir):
        for file in files:
            if file.endswith('.pdf') and not file.startswith('.'):
                pdf_files.append(os.path.join(root, file))

    print(f"\n📁 Found {len(pdf_files)} PDF datasheets")
    print(f"📂 Output directory: {output_dir}/")
    print("\nProcessing...\n")

    # Process each PDF
    success_count = 0
    for pdf_path in pdf_files:
        try:
            generate_datasheet_json(pdf_path, output_dir)
            success_count += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")

    print("\n" + "="*80)
    print(f"✅ Successfully processed: {success_count}/{len(pdf_files)} datasheets")
    print(f"📂 JSON files saved in: {output_dir}/")
    print("\nNext steps:")
    print("  1. Review generated JSON files")
    print("  2. Run: ./generate-all-pdfs.sh")
    print("  3. Find PDFs in: output/")
    print("="*80)

if __name__ == "__main__":
    main()
