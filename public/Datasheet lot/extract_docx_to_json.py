#!/usr/bin/env python3
"""
Extract structured content from all .docx files in the directory
"""

import json
import os
from pathlib import Path
from docx import Document

def is_heading(paragraph):
    """Check if paragraph is a heading"""
    if paragraph.style.name.startswith('Heading'):
        return True
    # Check if bold and larger font
    if paragraph.runs:
        first_run = paragraph.runs[0]
        if first_run.bold and first_run.font.size and first_run.font.size >= 140000:
            return True
    return False

def get_heading_level(paragraph):
    """Get heading level (1-9)"""
    if paragraph.style.name.startswith('Heading'):
        try:
            return int(paragraph.style.name.replace('Heading ', ''))
        except:
            return 1
    # Default to level 1 for bold large text
    return 1

def is_bullet_or_list(paragraph):
    """Check if paragraph is a bullet point or list item"""
    # Check for bullet character
    text = paragraph.text.strip()
    if text.startswith('•') or text.startswith('-') or text.startswith('*'):
        return True

    # Check for numbered list
    if text and text[0].isdigit() and ('. ' in text[:5] or ') ' in text[:5]):
        return True

    # Check paragraph style
    if 'List' in paragraph.style.name or 'Bullet' in paragraph.style.name:
        return True

    # Check for list formatting in XML
    try:
        pPr = paragraph._element.pPr
        if pPr is not None:
            numPr = pPr.find('.//{http://schemas.openxmlformats.org/wordprocessingml/2006/main}numPr')
            if numPr is not None:
                return True
    except:
        pass

    return False

def clean_bullet_text(text):
    """Remove bullet characters from text"""
    text = text.strip()
    # Remove common bullet characters
    if text.startswith('•'):
        text = text[1:].strip()
    elif text.startswith('-'):
        text = text[1:].strip()
    elif text.startswith('*'):
        text = text[1:].strip()
    # Remove numbered list prefix (e.g., "1. ", "2) ")
    if text and text[0].isdigit():
        for i, char in enumerate(text):
            if char in ['.', ')']:
                text = text[i+1:].strip()
                break
    return text

def extract_document_structure(docx_path):
    """Extract structured content from a .docx file"""
    doc = Document(docx_path)

    structure = {
        "filename": os.path.basename(docx_path),
        "sections": []
    }

    current_section = None
    current_subsection = None
    pending_paragraphs = []
    pending_pointers = []

    def save_pending_content(target):
        """Save accumulated paragraphs and pointers to target"""
        nonlocal pending_paragraphs, pending_pointers
        if pending_pointers:
            target["pointers"] = pending_pointers
            pending_pointers = []
        if pending_paragraphs:
            target["paragraphs"] = pending_paragraphs
            pending_paragraphs = []

    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue

        # Check if it's a heading
        if is_heading(para):
            level = get_heading_level(para)

            if level == 1:
                # Save any pending content to previous section
                if current_subsection:
                    save_pending_content(current_subsection)
                    current_subsection = None
                elif current_section:
                    save_pending_content(current_section)

                # Create new section
                current_section = {
                    "heading": text,
                    "level": level,
                    "subsections": []
                }
                structure["sections"].append(current_section)

            elif level >= 2 and current_section:
                # Save pending content to previous subsection
                if current_subsection:
                    save_pending_content(current_subsection)

                # Create new subsection
                current_subsection = {
                    "heading": text,
                    "level": level,
                    "subsections": []
                }
                current_section["subsections"].append(current_subsection)

        # Check if it's a bullet/list item
        elif is_bullet_or_list(para):
            cleaned_text = clean_bullet_text(text)
            if cleaned_text:
                pending_pointers.append(cleaned_text)

        # Regular paragraph
        else:
            if text:
                pending_paragraphs.append(text)

    # Save any remaining pending content
    if current_subsection:
        save_pending_content(current_subsection)
    elif current_section:
        save_pending_content(current_section)

    # Handle documents without clear headings
    if not structure["sections"] and (pending_paragraphs or pending_pointers):
        default_section = {
            "heading": "Content",
            "level": 1
        }
        if pending_pointers:
            default_section["pointers"] = pending_pointers
        if pending_paragraphs:
            default_section["paragraphs"] = pending_paragraphs
        structure["sections"].append(default_section)

    return structure

def main():
    """Process all .docx files in the current directory"""
    script_dir = Path(__file__).parent
    docx_files = sorted(script_dir.glob("*.docx"))

    if not docx_files:
        print("No .docx files found in the directory")
        return

    print(f"Found {len(docx_files)} .docx files")

    all_documents = []

    for docx_file in docx_files:
        # Skip temporary files
        if docx_file.name.startswith('~$'):
            continue

        print(f"Processing: {docx_file.name}")
        try:
            doc_structure = extract_document_structure(docx_file)
            all_documents.append(doc_structure)
        except Exception as e:
            print(f"Error processing {docx_file.name}: {e}")
            continue

    # Save to JSON file
    output_file = script_dir / "extracted_datasheets.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_documents, f, indent=2, ensure_ascii=False)

    print(f"\nExtracted content from {len(all_documents)} documents")
    print(f"Output saved to: {output_file}")

if __name__ == "__main__":
    main()
