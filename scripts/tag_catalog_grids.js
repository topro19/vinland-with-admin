const fs = require('fs');

// 1. Tag 4.html
let html4 = fs.readFileSync('_html_source/4.html', 'utf8');
html4 = html4.replace(
  /<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">/g,
  (match, offset) => {
    // Find preceding heading
    const before = html4.substring(Math.max(0, offset - 600), offset);
    if (before.includes('Natuurkazen')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="kaas-natuur">';
    } else if (before.includes('Grote Kruidenkazen')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="kaas-kruiden">';
    } else if (before.includes('Komijn & Magere Kazen')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="kaas-speciaal">';
    } else if (before.includes('kaasbolletjes') || before.includes('Kaasbolletjes')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="kaas-bolletjes">';
    }
    return match;
  }
);
html4 = html4.replace(/<div class="product-card/g, '<div data-cms-card="true" class="product-card');
fs.writeFileSync('_html_source/4.html', html4, 'utf8');

// 2. Tag 5.html
let html5 = fs.readFileSync('_html_source/5.html', 'utf8');
html5 = html5.replace(
  /<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">/g,
  (match, offset) => {
    const before = html5.substring(Math.max(0, offset - 600), offset);
    if (before.includes('Karnemelk & Boter')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="zuivel-karnemelk">';
    } else if (before.includes('Melk & Room')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="zuivel-melk">';
    } else if (before.includes('Boerderijyoghurt')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="zuivel-yoghurt">';
    } else if (before.includes('Kwark & Vla')) {
      return '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="zuivel-kwark">';
    }
    return match;
  }
);
html5 = html5.replace(/<div class="product-card/g, '<div data-cms-card="true" class="product-card');
fs.writeFileSync('_html_source/5.html', html5, 'utf8');

// 3. Tag 6.html
let html6 = fs.readFileSync('_html_source/6.html', 'utf8');
html6 = html6.replace(
  '<div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">',
  '<div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md" data-cms-catalog-grid="ijs-smaken">'
);
html6 = html6.replace(/<div\s+class="ice-cream-card/g, '<div data-cms-card="true" class="ice-cream-card');
fs.writeFileSync('_html_source/6.html', html6, 'utf8');

// 4. Tag 7.html
let html7 = fs.readFileSync('_html_source/7.html', 'utf8');
html7 = html7.replace(
  '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-md">',
  '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-md" data-cms-catalog-grid="vlees-rund">'
);
html7 = html7.replace(
  '<div class="grid grid-cols-1 sm:grid-cols-2 gap-md">',
  '<div class="grid grid-cols-1 sm:grid-cols-2 gap-md" data-cms-catalog-grid="vlees-bewerkt">'
);
// In 7.html, tag the meat cards inside these grids
html7 = html7.replace(
  /<div class="group bg-white rounded-xl overflow-hidden border/g,
  '<div data-cms-card="true" class="group bg-white rounded-xl overflow-hidden border'
);
fs.writeFileSync('_html_source/7.html', html7, 'utf8');

console.log('Successfully tagged all catalog grids and cards.');
