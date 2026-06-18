import fs from 'fs';
import path from 'path';

const productsFilePath = './src/data/productsData.json';

console.log('🔧 Fixing duplicate product IDs...\n');

// Read the products file
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

// Create backup
const backupPath = productsFilePath + '.backup-ids';
fs.writeFileSync(backupPath, JSON.stringify(productsData, null, 2));
console.log(`✅ Backup created: ${backupPath}\n`);

let idCounter = 1;
let fixedCount = 0;
const idMap = new Map(); // Track old ID -> new ID for reference

// Fix each category
for (const category in productsData) {
  const products = productsData[category];

  if (Array.isArray(products)) {
    console.log(`📁 Processing category: ${category} (${products.length} products)`);

    for (let i = 0; i < products.length; i++) {
      const oldId = products[i].id;
      const newId = idCounter;

      products[i].id = newId;
      idMap.set(`${category}-${oldId}`, newId);

      if (oldId !== newId) {
        fixedCount++;
      }

      idCounter++;
    }
  }
}

// Write the fixed data
fs.writeFileSync(productsFilePath, JSON.stringify(productsData, null, 2));

console.log('\n✅ All product IDs have been renumbered sequentially!');
console.log(`\n📊 Summary:`);
console.log(`   Total products: ${idCounter - 1}`);
console.log(`   IDs changed: ${fixedCount}`);
console.log(`   New ID range: 1 to ${idCounter - 1}`);
console.log(`\n✅ File updated: ${productsFilePath}`);
console.log(`📦 Backup saved: ${backupPath}`);
