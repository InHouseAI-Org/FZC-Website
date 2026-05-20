#!/bin/bash

# HTML to PDF Batch Converter for Inmarco Datasheets
#
# This script converts all HTML files in generated_html/ to PDFs
#
# Requirements:
#   - Node.js and npm installed
#   - puppeteer package: npm install puppeteer

echo "================================================"
echo "Inmarco Datasheet HTML to PDF Converter"
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

# Run the conversion script
node convert-html-to-pdf.js
