const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '_html_source', '6.html');
let html = fs.readFileSync(filePath, 'utf-8');

// Replace external Unsplash images with reliable local images
html = html.replace(
  'src="https://images.unsplash.com/photo-1533930250856-724392c65330?auto=format&fit=crop&q=80&w=600"',
  'src="./images/img_026.jpg"' // Stracciatella
);

html = html.replace(
  'src="https://images.unsplash.com/photo-1603533871195-afc753177d6f?auto=format&fit=crop&q=80&w=600"',
  'src="./images/img_027.jpg"' // Hazelnoot
);

html = html.replace(
  'src="https://images.unsplash.com/photo-1590085012920-d9a712ddca7c?auto=format&fit=crop&q=80&w=600"',
  'src="./images/img_021.jpg"' // Karamel zeezout
);

html = html.replace(
  'src="https://images.unsplash.com/photo-1579954115545-a95591f28be0?auto=format&fit=crop&q=80&w=600"',
  'src="./images/img_018.jpg"' // Room
);

html = html.replace(
  'src="https://images.unsplash.com/photo-1530331191116-59c9227d8481?auto=format&fit=crop&q=80&w=600"',
  'src="./images/img_022.jpg"' // Stroopwafel
);

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Successfully fixed all unsplash images in 6.html to reliable local assets');
