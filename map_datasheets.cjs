const fs = require('fs');
const path = require('path');

// Read productsData.json
const productsDataPath = './src/data/productsData.json';
const productsData = JSON.parse(fs.readFileSync(productsDataPath, 'utf8'));

// Get list of HTML files
const datasheetDir = './public/datasheets/generated_html';
const htmlFiles = fs.readdirSync(datasheetDir).filter(f => f.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML datasheet files`);

// Normalize function to match product names to HTML filenames
function normalizeForMatching(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '')
    .replace(/_+/g, '_')
    .trim();
}

// Create HTML filename to path mapping
const htmlFileMap = {};
htmlFiles.forEach(file => {
  const nameWithoutExt = file.replace('.html', '');
  const normalized = normalizeForMatching(nameWithoutExt);
  htmlFileMap[normalized] = `/datasheets/generated_html/${file}`;
});

// Manual mappings for special cases
const manualMappings = {
  'hy_105_hd': 'HY_105HD.html',
  'hy_107_hd': 'HY_107HD.html',
  'hy_107e': 'HY_107.html',
  'hy_107_ept': 'HY_107.html',
  'cg_101e': 'CG_101.html',
  'cg_501c': 'HY_501C.html',
  'pa_106g': 'PA_106.html',
  'pa_106e': 'PA_106.html',
  'pe_504p': 'PE_504.html',
  'or_125sr': 'OR_125.html',
  'or_156': 'OR_151.html',
  'in_126s': 'IN_123.html',
  'inmatex_eptfe_sheetgasket': 'INMATEX_ePTFE.html',
  'gm_360': 'GM_310C.html',
  'na_452_ge': 'NA_452_GF.html',
  '600_sintered_ptfe_sheet': 'Type_600.html',
  'aramid_based_wiping_pad': 'Aramid_Wiping_Pad.html'
};

let updatedCount = 0;
let unmatchedProducts = [];
let unmatchedDatasheets = new Set(htmlFiles.map(f => f.replace('.html', '')));

// Update products with datasheet paths
productsData.products.forEach(product => {
  // Try multiple name variations
  const variations = [
    normalizeForMatching(product.name),
    normalizeForMatching(product.slug),
    product.name.replace(/\s+/g, '_'),
    product.slug.replace(/-/g, '_')
  ];

  let matched = false;

  // Check manual mappings first
  for (const variation of variations) {
    if (manualMappings[variation]) {
      product.datasheet = `/datasheets/generated_html/${manualMappings[variation]}`;
      console.log(`✓ Manual mapping: ${product.name} → ${manualMappings[variation]}`);
      updatedCount++;
      matched = true;
      unmatchedDatasheets.delete(manualMappings[variation].replace('.html', ''));
      break;
    }
  }

  if (!matched) {
    // Try automatic matching
    for (const variation of variations) {
      if (htmlFileMap[variation]) {
        product.datasheet = htmlFileMap[variation];
        console.log(`✓ Matched: ${product.name} → ${htmlFileMap[variation]}`);
        updatedCount++;
        matched = true;
        // Extract filename from path to remove from unmatched set
        const filename = htmlFileMap[variation].split('/').pop().replace('.html', '');
        unmatchedDatasheets.delete(filename);
        break;
      }
    }
  }

  if (!matched) {
    unmatchedProducts.push(product.name);
  }
});

// Write updated data back
fs.writeFileSync(productsDataPath, JSON.stringify(productsData, null, 2));

console.log(`\n✅ Updated ${updatedCount} products with datasheets`);

if (unmatchedProducts.length > 0) {
  console.log(`\n⚠️  ${unmatchedProducts.length} products without datasheets:`);
  unmatchedProducts.forEach(name => console.log(`  - ${name}`));
}

if (unmatchedDatasheets.size > 0) {
  console.log(`\n⚠️  ${unmatchedDatasheets.size} unused datasheet files:`);
  Array.from(unmatchedDatasheets).forEach(name => console.log(`  - ${name}.html`));
}
