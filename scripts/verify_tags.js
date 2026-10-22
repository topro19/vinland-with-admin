const fs = require('fs');

['4.html', '5.html', '6.html', '7.html'].forEach(p => {
  const html = fs.readFileSync('_html_source/' + p, 'utf8');
  const grids = (html.match(/data-cms-catalog-grid="[^"]+"/g) || []);
  const cards = (html.match(/data-cms-card="true"/g) || []);
  console.log(p, 'grids:', grids, 'cards count:', cards.length);
});
