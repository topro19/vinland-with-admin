const fs = require('fs');
let html = fs.readFileSync('_html_source/2.html', 'utf8');
const id = 'home-hero-title';
const content = 'Kaasboerderij De\nWestplaat';

html = html.replace(
  new RegExp(`data-cms-id="${id}"([^>]*)>([^<]*)`, 'g'),
  `data-cms-id="${id}"$1>${content}`
);

console.log(html.substring(html.indexOf('home-hero-title') - 20, html.indexOf('home-hero-title') + 300));
