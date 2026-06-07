const fs = require('fs');
let html = fs.readFileSync('_html_source/2.html', 'utf8');
const id = 'home-hero-title';
const content = 'Kaasboerderij De\nWestplaat';
const regex = new RegExp(`data-cms-id="${id}"([^>]*)>([^<]*)`, 'g');
console.log('Regex:', regex);
html = html.replace(regex, `data-cms-id="${id}"$1>${content}`);
console.log('Matched and replaced:', html.includes(content));
console.log('HTML snippet:', html.substring(html.indexOf('home-hero-title') - 20, html.indexOf('home-hero-title') + 100));
