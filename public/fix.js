const fs = require('fs');
const path = require('path');

for (let i = 2; i <= 9; i++) {
    let filePath = path.join(__dirname, i + '.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove \n literal after body tag
        content = content.replace(/>\\n/g, '>\n');
        
        // Remove markdown backticks
        content = content.replace(/```html/g, '');
        content = content.replace(/```/g, '');
        
        fs.writeFileSync(filePath, content);
        console.log('Fixed ' + i + '.html');
    }
}
