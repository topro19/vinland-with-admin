const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '_html_source', '4.html');
let html = fs.readFileSync(filePath, 'utf-8');

// Natuurkazen (7 varieties)
const natuurkazen = [
  { name: 'Jong', spanId: '128', text: '4 weken gerijpt — Mild, zacht en romig van smaak', img: './images/img_006.jpg', id: 'jong' },
  { name: 'Jong-belegen', spanId: '129', text: '8-10 weken gerijpt — Rijk en soepel van structuur', img: './images/img_006.jpg', id: 'jongbelegen' },
  { name: 'Belegen', spanId: '130', text: '4 maanden gerijpt — Vol van smaak met een lichte pit', img: './images/img_013.jpg', id: 'belegen' },
  { name: 'Extra Belegen', spanId: '131', text: '6-7 maanden gerijpt — Pittig en vol karakter', img: './images/img_013.jpg', id: 'extrabelegen' },
  { name: 'Oud', spanId: '132', text: '10-12 maanden gerijpt — Pikant met rijpingskristallen', img: './images/img_042.jpg', id: 'oud' },
  { name: 'Overjarig', spanId: '133', text: '1+ jaar gerijpt — Zeer intens, brokkelig en complex', img: './images/img_042.jpg', id: 'overjarig' },
  { name: 'Gatenkaas', spanId: '134', text: 'Boerengatenkaas met karakteristieke ronde ogen en nootachtige smaak', img: './images/img_006.jpg', id: 'gatenkaas' }
];

for (const item of natuurkazen) {
  const reg = new RegExp(
    `<li class="flex items-start gap-2 before:content-\\[''\\] before:w-2 before:h-2 before:bg-primary before:rounded-full before:mt-2 shrink-0">\\s*<div><strong class="text-heading-green">${item.name}<\\/strong> <span class="text-sm block text-on-surface-variant\\/80" data-cms-id="auto-4-span-${item.spanId}">[^<]+<\\/span><\\/div>\\s*<\\/li>`
  );
  const replacement = `<li class="flex items-center gap-3 p-2 rounded-xl bg-white/70 hover:bg-white border border-outline-variant/15 shadow-sm transition-all">
                                <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-4-img-kaas-${item.id}">
                                </div>
                                <div class="flex-grow min-w-0">
                                    <strong class="text-heading-green text-sm font-bold block truncate">${item.name}</strong>
                                    <span class="text-xs text-on-surface-variant/80 block line-clamp-1" data-cms-id="auto-4-span-${item.spanId}">${item.text}</span>
                                </div>
                            </li>`;
  if (reg.test(html)) {
    html = html.replace(reg, replacement);
  } else {
    console.warn(`Natuurkaas ${item.name} not matched`);
  }
}

// Grote Kruidenkazen (10 varieties)
const kruidenkazen = [
  { name: 'Fenegriek', liId: '178', spanId: '136', desc: '(Warme, nootachtige smaak)', id: 'fenegriek', img: '/images/placeholder-cheese.svg' },
  { name: 'Brandnetel', liId: '179', spanId: '137', desc: '(Fris en natuurlijk aroma)', id: 'brandnetel', img: '/images/placeholder-cheese.svg' },
  { name: 'Tomaat-knoflook', liId: '180', spanId: '138', desc: '(Hartige mediterrane combinatie)', id: 'tomaat', img: '/images/placeholder-cheese.svg' },
  { name: 'Bieslook', liId: '181', spanId: '139', desc: '(Verfijnde tuinkruidentoets)', id: 'bieslook', img: '/images/placeholder-cheese.svg' },
  { name: 'Tuinkruiden', liId: '182', spanId: '140', desc: '(Klassieke polderkruidenmelange)', id: 'tuinkruiden', img: './images/img_009.jpg' },
  { name: 'Piri-piri', liId: '183', spanId: '141', desc: '(Vurig en pikant)', id: 'piripiri', img: '/images/placeholder-cheese.svg' },
  { name: 'Zwarte peper', liId: '184', spanId: '142', desc: '(Met gebroken peperkorrels)', id: 'peper', img: '/images/placeholder-cheese.svg' },
  { name: 'Knoflook', liId: '185', spanId: '143', desc: '(Rijk en volmondig)', id: 'knoflook', img: '/images/placeholder-cheese.svg' },
  { name: 'Mosterd', liId: '186', spanId: '144', desc: '(Pikant met mosterdzaad)', id: 'mosterd', img: '/images/placeholder-cheese.svg' },
  { name: 'Honing-klaver', liId: '187', spanId: '145', desc: '(Zachtzoete bloemige toets)', id: 'honingklaver', img: '/images/placeholder-cheese.svg' }
];

for (const item of kruidenkazen) {
  const reg = new RegExp(
    `<li class="flex items-center gap-2 before:content-\\[''\\] before:w-2 before:h-2 before:bg-accent-brown before:rounded-full" data-cms-id="auto-4-li-${item.liId}"><strong class="text-heading-green">${item.name}<\\/strong> <span class="text-xs text-on-surface-variant\\/80" data-cms-id="auto-4-span-${item.spanId}">[^<]+<\\/span><\\/li>`
  );
  const replacement = `<li class="flex items-center gap-3 p-2 rounded-xl bg-white/70 hover:bg-white border border-outline-variant/15 shadow-sm transition-all" data-cms-id="auto-4-li-${item.liId}">
                                <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-4-img-kaas-${item.id}">
                                </div>
                                <div class="flex-grow min-w-0">
                                    <strong class="text-heading-green text-sm font-bold block truncate">${item.name}</strong>
                                    <span class="text-xs text-on-surface-variant/80 block line-clamp-1" data-cms-id="auto-4-span-${item.spanId}">${item.desc}</span>
                                </div>
                            </li>`;
  if (reg.test(html)) {
    html = html.replace(reg, replacement);
  } else {
    console.warn(`Kruidenkaas ${item.name} not matched`);
  }
}

// Komijn & Magere Kazen (5 varieties)
const komijnMagere = [
  { name: 'Jonge komijnekaas', spanId: '147', desc: 'Zachte boerenkaas met geurige komijnzaadjes', id: 'jongkomijn', img: './images/img_010.jpg' },
  { name: 'Belegen komijnekaas', spanId: '148', desc: 'Voller gerijpte komijnekaas met krachtige smaak', id: 'belegenkomijn', img: './images/img_010.jpg' },
  { name: 'Magere jonge kaas (±25+)', spanId: '149', desc: 'Lager vetgehalte met behoud van milde boerensmaak', id: 'magerejong', img: '/images/placeholder-cheese.svg' },
  { name: 'Magere jonge komijnekaas (±25+)', spanId: '150', desc: 'Verantwoorde magere kaas verrijkt met komijn', id: 'magerekomijn', img: './images/img_010.jpg' },
  { name: 'Magere Italiaanse kruiden (±25+)', spanId: '151', desc: 'Magere kaas met zongedroogde mediterrane kruiden', id: 'magereitaliaans', img: '/images/placeholder-cheese.svg' }
];

for (const item of komijnMagere) {
  const escapedName = item.name.replace('(', '\\(').replace(')', '\\)').replace('+', '\\+');
  const reg = new RegExp(
    `<li class="flex items-start gap-2 before:content-\\[''\\] before:w-2 before:h-2 before:bg-outline-sage before:rounded-full before:mt-2 shrink-0">\\s*<div><strong class="text-heading-green">${escapedName}<\\/strong> <span class="text-sm block text-on-surface-variant\\/80" data-cms-id="auto-4-span-${item.spanId}">[^<]+<\\/span><\\/div>\\s*<\\/li>`
  );
  const replacement = `<li class="flex items-center gap-3 p-2 rounded-xl bg-white/70 hover:bg-white border border-outline-variant/15 shadow-sm transition-all">
                                <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-4-img-kaas-${item.id}">
                                </div>
                                <div class="flex-grow min-w-0">
                                    <strong class="text-heading-green text-sm font-bold block truncate">${item.name}</strong>
                                    <span class="text-xs text-on-surface-variant/80 block line-clamp-1" data-cms-id="auto-4-span-${item.spanId}">${item.desc}</span>
                                </div>
                            </li>`;
  if (reg.test(html)) {
    html = html.replace(reg, replacement);
  } else {
    console.warn(`Komijn/Magere ${item.name} not matched`);
  }
}

// Kaasbolletjes (14 varieties)
const kaasbollen = [
  { h4Id: '107', spanId: '164', name: 'Italiaanse kruiden', num: 1 },
  { h4Id: '108', spanId: '165', name: 'Brandnetel', num: 2 },
  { h4Id: '109', spanId: '166', name: 'Fenegriek', num: 3 },
  { h4Id: '110', spanId: '167', name: 'Bieslook', num: 4 },
  { h4Id: '111', spanId: '168', name: 'Tuinkruiden', num: 5 },
  { h4Id: '112', spanId: '169', name: 'Honing-klaver', num: 6 },
  { h4Id: '113', spanId: '170', name: 'Pesto', num: 7 },
  { h4Id: '114', spanId: '171', name: 'Piri-piri', num: 8 },
  { h4Id: '115', spanId: '172', name: 'Knoflook-ui', num: 9 },
  { h4Id: '116', spanId: '173', name: 'Komijn', num: 10 },
  { h4Id: '117', spanId: '174', name: 'Komijn-kruidnagel', num: 11 },
  { h4Id: '118', spanId: '175', name: 'Mosterd', num: 12 },
  { h4Id: '119', spanId: '176', name: 'Zwarte peper', num: 13 },
  { h4Id: '120', spanId: '177', name: 'Sambal', num: 14 }
];

for (const bol of kaasbollen) {
  const reg = new RegExp(
    `<div class="bg-surface-cream rounded-xl p-md border border-outline-variant\\/20 shadow-sm flex flex-col justify-between text-center hover:border-primary\\/40 transition-colors">\\s*<div>\\s*<span class="material-symbols-outlined[^>]*>[^<]+<\\/span>\\s*<h4 class="font-headline-sm text-sm font-bold text-heading-green" data-cms-id="auto-4-h4-${bol.h4Id}">${bol.name}<\\/h4>\\s*<\\/div>\\s*<span class="text-\\[11px\\] font-semibold text-secondary-container bg-secondary\\/10 py-0\\.5 px-1\\.5 rounded-full mt-2" data-cms-id="auto-4-span-${bol.spanId}">±900g bol<\\/span>\\s*<\\/div>`
  );
  const replacement = `<div class="bg-surface-cream rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm flex flex-col justify-between text-center hover:border-primary/40 transition-colors group">
                        <div class="h-24 bg-surface-container overflow-hidden relative">
                            <img src="/images/placeholder-cheeseball.svg" alt="${bol.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-4-img-bol-${bol.num}">
                        </div>
                        <div class="p-2">
                            <h4 class="font-headline-sm text-xs font-bold text-heading-green truncate" data-cms-id="auto-4-h4-${bol.h4Id}">${bol.name}</h4>
                            <span class="text-[10px] font-semibold text-secondary-container bg-secondary/10 py-0.5 px-1.5 rounded-full mt-1 inline-block" data-cms-id="auto-4-span-${bol.spanId}">±900g bol</span>
                        </div>
                    </div>`;
  if (reg.test(html)) {
    html = html.replace(reg, replacement);
  } else {
    console.warn(`Kaasbol ${bol.name} not matched`);
  }
}

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Successfully updated 4.html cheese products with images');
