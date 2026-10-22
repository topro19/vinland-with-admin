const fs = require('fs');

['4.html', '5.html', '6.html', '7.html'].forEach(p => {
  const html = fs.readFileSync('_html_source/' + p, 'utf8');
  console.log('=== ' + p + ' ===');
  const lines = html.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('grid-cols') && (
      lines.slice(i, i + 10).some(sub => sub.includes('product-card') || sub.includes('ice-cream-card') || sub.includes('placeholder-meat'))
    )) {
      console.log('Line ' + (i + 1) + ': ' + l.trim());
    }
  });
});
