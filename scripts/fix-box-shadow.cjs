const fs = require('fs');
const path = require('path');

const DATASHEETS_DIR = path.join(__dirname, '../public/datasheets/new_generated_html');

console.log('🔧 Fixing box-shadow in all HTML datasheets...\n');

// Get all HTML files
const htmlFiles = fs.readdirSync(DATASHEETS_DIR).filter(file => file.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files\n`);

let fixedCount = 0;

htmlFiles.forEach((file, index) => {
    const filePath = path.join(DATASHEETS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove box-shadow from product-image-container
    const originalContent = content;
    content = content.replace(
        /\.product-image-container\s*\{[^}]*box-shadow:[^;]+;([^}]*)\}/g,
        (match) => {
            // Remove the box-shadow line but keep everything else
            return match.replace(/box-shadow:[^;]+;/g, '');
        }
    );

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✓ [${index + 1}/${htmlFiles.length}] Fixed ${file}`);
        fixedCount++;
    } else {
        console.log(`- [${index + 1}/${htmlFiles.length}] Skipped ${file} (no box-shadow found)`);
    }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Fixed ${fixedCount} out of ${htmlFiles.length} files`);
console.log('='.repeat(50) + '\n');
