const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', '[[...slug]]', 'route.ts');
let code = fs.readFileSync(filePath, 'utf-8');

code = code.replace(
  "node.setAttribute('src', content);",
  "node.setAttribute('src', content);\n          } else if (node.querySelector('img')) {\n            node.querySelector('img').setAttribute('src', content);"
);

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Successfully updated src/app/[[...slug]]/route.ts');
