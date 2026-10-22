const fs = require('fs');

let code = fs.readFileSync('src/app/api/admin/save-inline/route.ts', 'utf8');

// Add fs and path import at top
if (!code.includes("import fs from 'fs'")) {
  code = "import fs from 'fs'\nimport path from 'path'\n" + code;
}

// Remove dynamic import inside try block if redundant
code = code.replace("const path = await import('path')", "// path imported at top");

fs.writeFileSync('src/app/api/admin/save-inline/route.ts', code, 'utf8');
console.log('Fixed imports in save-inline route');
