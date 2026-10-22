const fs = require('fs');

let code = fs.readFileSync('src/app/[[...slug]]/route.ts', 'utf8');

const targetStr = `    for (const [id, content] of Object.entries(contentMap)) {
      if (content) {
        const node = root.querySelector(\`[data-cms-id="\${id}"]\`);`;

const replacementStr = `    // 1. Inject custom saved catalogue grids
    for (const [id, content] of Object.entries(contentMap)) {
      if (id.startsWith('grid_') && content) {
        const gridId = id.replace('grid_', '');
        const gridNode = root.querySelector(\`[data-cms-catalog-grid="\${gridId}"]\`);
        if (gridNode) {
          gridNode.innerHTML = content;
        }
      }
    }

    // 2. Inject individual element overrides
    for (const [id, content] of Object.entries(contentMap)) {
      if (content && !id.startsWith('grid_')) {
        const node = root.querySelector(\`[data-cms-id="\${id}"]\`);`;

const normalize = s => s.replace(/\r\n/g, '\n');

if (normalize(code).includes(normalize(targetStr))) {
  // Replace in normalized
  const updated = normalize(code).replace(normalize(targetStr), normalize(replacementStr));
  fs.writeFileSync('src/app/[[...slug]]/route.ts', updated, 'utf8');
  console.log('Successfully updated src/app/[[...slug]]/route.ts');
} else {
  console.error('Target not found in src/app/[[...slug]]/route.ts');
}
