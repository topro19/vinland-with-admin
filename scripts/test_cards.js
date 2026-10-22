const fs = require('fs');

function inspectFullCard(file, marker) {
  const html = fs.readFileSync('_html_source/' + file, 'utf8');
  const idx = html.indexOf(marker);
  if (idx !== -1) {
    console.log('=== ' + file + ' ===');
    console.log(html.substring(idx, idx + 1000));
  }
}

inspectFullCard('4.html', '<div class="product-card');
inspectFullCard('5.html', '<div class="product-card');
inspectFullCard('6.html', '<div class="ice-cream-card');
inspectFullCard('7.html', '<div class="group bg-white rounded-xl');
