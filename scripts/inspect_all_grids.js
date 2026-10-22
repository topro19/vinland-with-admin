const fs = require('fs');

function inspectGrids(filename) {
  const html = fs.readFileSync('_html_source/' + filename, 'utf8');
  console.log('=== ' + filename + ' ===');
  const lines = html.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('grid grid-cols') && (
      lines.slice(i, i + 8).some(sub => sub.includes('product-card') || sub.includes('ice-cream-card') || sub.includes('placeholder-meat') || sub.includes('img_031.jpg'))
    )) {
      // Find previous heading
      let prevHeading = '';
      for (let j = i - 1; j >= Math.max(0, i - 30); j--) {
        if (lines[j].includes('<h2') || lines[j].includes('<h3')) {
          prevHeading = lines[j].replace(/<[^>]+>/g, '').trim();
          break;
        }
      }
      console.log('Line ' + (i + 1) + ' [' + prevHeading + ']: ' + l.trim());
    }
  });
}

inspectGrids('4.html');
inspectGrids('5.html');
inspectGrids('6.html');
inspectGrids('7.html');
