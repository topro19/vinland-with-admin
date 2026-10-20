const fs = require('fs');
const path = require('path');

const cheeseFilePath = path.join(__dirname, '..', '_html_source', '4.html');
let cheeseHtml = fs.readFileSync(cheeseFilePath, 'utf-8');

const kaasbollen = [
  { h4Id: '107', spanId: '164', name: 'Italiaanse kruiden', num: 1, desc: 'Mediterrane kruidenmelange met basilicum en oregano' },
  { h4Id: '108', spanId: '165', name: 'Brandnetel', num: 2, desc: 'Zacht en fris aroma van jonge lentebietjes en brandnetel' },
  { h4Id: '109', spanId: '166', name: 'Fenegriek', num: 3, desc: 'Heerlijk nootachtig aroma met pure fenegriekzaadjes' },
  { h4Id: '110', spanId: '167', name: 'Bieslook', num: 4, desc: 'Subtiele, frisse bieslooktoets voor borrel en lunch' },
  { h4Id: '111', spanId: '168', name: 'Tuinkruiden', num: 5, desc: 'Rijke melange van klassieke Hollandse polderkruiden' },
  { h4Id: '112', spanId: '169', name: 'Honing-klaver', num: 6, desc: 'Zachtzoete bloemige combinatie met echte honing' },
  { h4Id: '113', spanId: '170', name: 'Pesto', num: 7, desc: 'Volle Italiaanse pesto met basilicum en pijnboompitjes' },
  { h4Id: '114', spanId: '171', name: 'Piri-piri', num: 8, desc: 'Pikante borrelkaas met vurig rode chilipepers' },
  { h4Id: '115', spanId: '172', name: 'Knoflook-ui', num: 9, desc: 'Hartige combinatie van zoete ui en aromatische knoflook' },
  { h4Id: '116', spanId: '173', name: 'Komijn', num: 10, desc: 'Klassiek geurige komijnzaadjes in romige boerenkaas' },
  { h4Id: '117', spanId: '174', name: 'Komijn-kruidnagel', num: 11, desc: 'Traditionele Friese nagelkaas smaaksensatie' },
  { h4Id: '118', spanId: '175', name: 'Mosterd', num: 12, desc: 'Pittig en knisperend met hele grove mosterdzaadjes' },
  { h4Id: '119', spanId: '176', name: 'Zwarte peper', num: 13, desc: 'Stevige pit van grof gebroken zwarte peperkorrels' },
  { h4Id: '120', spanId: '177', name: 'Sambal', num: 14, desc: 'Vurig gekruid met authentieke rode sambal' }
];

let bollenGrid = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">`;

for (const bol of kaasbollen) {
  bollenGrid += `
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between border border-surface-variant/20">
      <div class="h-48 overflow-hidden relative bg-surface-container">
        <img src="/images/placeholder-cheeseball.svg" alt="${bol.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-cms-id="auto-4-img-bol-${bol.num}">
        <span class="absolute top-2 right-2 text-[10px] bg-secondary-container/90 text-on-secondary-container px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-4-span-${bol.spanId}">±900g bol</span>
      </div>
      <div class="p-md text-center flex-grow flex flex-col justify-between">
        <div>
          <h3 class="font-headline-md text-headline-md text-heading-green" data-cms-id="auto-4-h4-${bol.h4Id}">${bol.name}</h3>
          <p class="text-xs text-on-surface-variant mt-1.5">${bol.desc}</p>
        </div>
        <div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span class="px-sm py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm rounded-full">Kruidenbolletje</span>
        </div>
      </div>
    </div>`;
}

bollenGrid += `</div>`;

const oldBollenRegex = /<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-sm">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;

if (oldBollenRegex.test(cheeseHtml)) {
  cheeseHtml = cheeseHtml.replace(oldBollenRegex, `${bollenGrid}\n            </div>\n        </div>\n    </section>`);
  fs.writeFileSync(cheeseFilePath, cheeseHtml, 'utf-8');
  console.log('Successfully updated 4.html kaasbollen to standard card grid');
} else {
  console.error('Could not match old bollen grid in 4.html');
}
