#!/bin/bash

# Batch PDF Generator for Inmarco Datasheets
#
# This script generates PDFs for all JSON data files in the data/ directory
#
# Requirements:
#   - Node.js and npm installed
#   - puppeteer package: npm install puppeteer

echo "================================================"
echo "Inmarco Datasheet PDF Batch Generator"
echo "================================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if puppeteer is installed
if ! npm list puppeteer &> /dev/null; then
    echo "📦 Installing puppeteer..."
    npm install puppeteer
fi

# Create output directory
mkdir -p output

# Count JSON files
json_count=$(ls -1 data/*.json 2>/dev/null | wc -l | tr -d ' ')

if [ "$json_count" -eq 0 ]; then
    echo "❌ No JSON files found in data/ directory"
    exit 1
fi

echo "📁 Found $json_count datasheet(s) to generate"
echo ""

# Process each JSON file
success_count=0
fail_count=0

for json_file in data/*.json; do
    # Get filename without path and extension
    filename=$(basename "$json_file" .json)

    # Generate PDF
    output_file="output/${filename}.pdf"

    echo "Processing: $filename"

    if node generate-pdf.js "$json_file" "$output_file"; then
        ((success_count++))
    else
        ((fail_count++))
    fi
done

echo ""
echo "================================================"
echo "✅ Successfully generated: $success_count PDF(s)"
if [ "$fail_count" -gt 0 ]; then
    echo "❌ Failed: $fail_count PDF(s)"
fi
echo "📂 PDFs saved in: output/"
echo "================================================"
