const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '_html_source', '5.html');
let html = fs.readFileSync(filePath, 'utf-8');

// Category 1: Karnemelk & Boter
html = html.replace(
  /<li class="flex items-start gap-2\.5 pb-2\.5 border-b border-surface-container\/40">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-102"[^>]*>Ambachtelijke Karnemelk<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-84"[^>]*>Traditioneel 36 uur verzuurd en gekarnd \(1L en 0,5L fles\)<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 pb-2.5 border-b border-surface-container/40 hover:bg-surface-container/20 p-1.5 rounded-xl transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="./images/img_015.jpg" alt="Ambachtelijke Karnemelk" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-karnemelk">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-102">Ambachtelijke Karnemelk</span>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-84">Traditioneel 36 uur verzuurd en gekarnd (1L en 0,5L fles)</p>
                            </div>
                        </li>`
);

html = html.replace(
  /<li class="flex items-start gap-2\.5 pb-2\.5 border-b border-surface-container\/40">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-103"[^>]*>Karnedrank Framboos<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-5-span-104"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-85"[^>]*>Frisse zachte karnemelkdrank met natuurlijke frambozensmaak<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 pb-2.5 border-b border-surface-container/40 hover:bg-surface-container/20 p-1.5 rounded-xl transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="/images/placeholder-dairy.svg" alt="Karnedrank Framboos" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-framboos">
                            </div>
                            <div class="flex-grow min-w-0">
                                <div class="flex items-center justify-between flex-wrap gap-1">
                                    <span class="font-semibold text-on-surface text-sm truncate" data-cms-id="auto-5-span-103">Karnedrank Framboos</span>
                                    <span class="text-[10px] uppercase font-bold bg-amber-500/15 text-amber-800 px-1.5 py-0.5 rounded shrink-0" data-cms-id="auto-5-span-104">Foto ontbreekt</span>
                                </div>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-85">Frisse zachte karnemelkdrank met natuurlijke frambozensmaak</p>
                            </div>
                        </li>`
);

html = html.replace(
  /<li class="flex items-start gap-2\.5">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-105"[^>]*>Boerenroomboter Ongezouten<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-86"[^>]*>Puur gekarnde roomboter van dagverse room in authentieke rol<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-container/20 transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="./images/img_014.jpg" alt="Boerenroomboter Ongezouten" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-boter">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-105">Boerenroomboter Ongezouten</span>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-86">Puur gekarnde roomboter van dagverse room in authentieke rol</p>
                            </div>
                        </li>`
);

// Category 2: Melk & Room
const melkItems = [
  { id: '107', pId: '87', imgId: 'volle-melk', img: './images/img_016.jpg', name: 'Volle Melk', desc: 'Dagvers gepasteuriseerd, puur en volromig van smaak', last: false },
  { id: '108', pId: '88', imgId: 'halfvolle-melk', img: './images/img_016.jpg', name: 'Halfvolle Melk', desc: 'Gepasteuriseerd, lichter alternatief voor dagelijks gebruik', last: false },
  { id: '109', pId: '89', imgId: 'rauwe-melk', img: './images/img_016.jpg', name: 'Rauwe Melk (Melktap)', desc: 'Onbewerkt rechtstreeks uit de gekoelde tap in de winkel', last: false },
  { id: '110', pId: '90', imgId: 'slagroom', img: './images/img_014.jpg', name: 'Ongeklopte Slagroom', desc: 'Ongezoet en rijk, perfect op te kloppen voor gebak', last: false },
  { id: '111', pId: '91', imgId: 'creme-fraiche', img: './images/img_017.jpg', name: 'Crème Fraîche', desc: 'Romige, lichtzure room voor verfijnde warme en koude gerechten', last: false },
  { id: '112', pId: '92', imgId: 'kefir', img: '/images/placeholder-dairy.svg', name: 'Ambachtelijke Kefir', desc: 'Fris-tintelende gefermenteerde melkdrank met levende culturen', last: true }
];

for (const item of melkItems) {
  const reg = new RegExp(
    `<li class="flex items-start gap-2\\.5(?: pb-2 border-b border-surface-container\\/40)?">\\s*<span[^>]*>check_circle<\\/span>\\s*<div class="flex-grow">\\s*<span[^>]*data-cms-id="auto-5-span-${item.id}"[^>]*>${item.name.replace('(', '\\(').replace(')', '\\)')}<\\/span>\\s*<p[^>]*data-cms-id="auto-5-p-${item.pId}"[^>]*>[^<]+<\\/p>\\s*<\\/div>\\s*<\\/li>`
  );
  const borderClass = item.last ? '' : 'pb-2 border-b border-surface-container/40';
  const replacement = `<li class="flex items-center gap-3 ${borderClass} hover:bg-surface-container/20 p-1.5 rounded-xl transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-${item.imgId}">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-${item.id}">${item.name}</span>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-${item.pId}">${item.desc}</p>
                            </div>
                        </li>`;
  if (reg.test(html)) {
    html = html.replace(reg, replacement);
  } else {
    console.warn(`Melk item ${item.name} not matched`);
  }
}

// Category 3: Boerderijyoghurt
const yoghurtItems = [
  { id: '114', descId: '115', imgId: 'volle-yoghurt', img: './images/img_017.jpg', name: 'Volle Yoghurt', desc: 'Vol en romig van verse weidemelk', last: false },
  { id: '116', descId: '117', imgId: 'halfvolle-yoghurt', img: './images/img_017.jpg', name: 'Halfvolle Yoghurt', desc: 'Evenwichtig fris met lichte structuur', last: false },
  { id: '118', descId: '119', imgId: 'magere-yoghurt', img: './images/img_017.jpg', name: 'Magere Yoghurt', desc: 'Heerlijk fris en vetarm', last: false },
  { id: '120', descId: '121', imgId: 'standyoghurt', img: './images/img_017.jpg', name: 'Standyoghurt', desc: 'In de pot gerijpt met stevige lepelbare structuur', last: false },
  { id: '122', descId: '123', imgId: 'bulgaarse-yoghurt', img: './images/img_017.jpg', name: 'Bulgaarse Yoghurt', desc: 'Extra dikke, milde yoghurt naar familierecept', last: false },
  { id: '124', descId: '125', imgId: 'aardbeien-yoghurt', img: './images/img_043.jpg', name: 'Aardbeienyoghurt', desc: 'Romige yoghurt met echte Hollandse aardbeien', last: false },
  { id: '126', descId: '127', imgId: 'abrikozen-yoghurt', img: './images/img_043.jpg', name: 'Abrikozenyoghurt', desc: 'Zachte vruchtenyoghurt met zoete abrikozenstukjes', last: false },
  { id: '128', descId: '129', imgId: 'vanille-yoghurt', img: './images/img_017.jpg', name: 'Vanille Yoghurt', desc: 'Met authentiek natuurlijk Bourbon-vanille extract', last: true }
];

for (const item of yoghurtItems) {
  const reg = new RegExp(
    `<li class="flex items-start gap-2(?: pb-1\\.5 border-b border-surface-container\\/40)?">\\s*<span[^>]*>check_circle<\\/span>\\s*<div class="flex-grow">\\s*<span[^>]*data-cms-id="auto-5-span-${item.id}"[^>]*>${item.name}<\\/span>\\s*<span[^>]*data-cms-id="auto-5-span-${item.descId}"[^>]*>[^<]+<\\/span>\\s*<\\/div>\\s*<\\/li>`
  );
  const borderClass = item.last ? '' : 'pb-1.5 border-b border-surface-container/40';
  const replacement = `<li class="flex items-center gap-3 ${borderClass} hover:bg-surface-container/20 p-1 rounded-xl transition-colors">
                            <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-${item.imgId}">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-${item.id}">${item.name}</span>
                                <span class="text-xs text-on-surface-variant block truncate" data-cms-id="auto-5-span-${item.descId}">${item.desc}</span>
                            </div>
                        </li>`;
  if (reg.test(html)) {
    html = html.replace(reg, replacement);
  } else {
    console.warn(`Yoghurt item ${item.name} not matched`);
  }
}

// Category 4: Stevige Kwark
html = html.replace(
  /<li class="flex items-start gap-2\.5 pb-2\.5 border-b border-surface-container\/40">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-131"[^>]*>Volle Kwark Naturel<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-93"[^>]*>Stevige, ambachtelijke kwark met zachte smaak en hoog eiwitgehalte<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 pb-2.5 border-b border-surface-container/40 hover:bg-surface-container/20 p-1.5 rounded-xl transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="./images/img_017.jpg" alt="Volle Kwark Naturel" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-volle-kwark">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-131">Volle Kwark Naturel</span>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-93">Stevige, ambachtelijke kwark met zachte smaak en hoog eiwitgehalte</p>
                            </div>
                        </li>`
);

html = html.replace(
  /<li class="flex items-start gap-2\.5 pb-2\.5 border-b border-surface-container\/40">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-132"[^>]*>Aardbeien Kwark<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-94"[^>]*>Eiwitrijke kwark verrijkt met malse stukjes verse aardbei<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 pb-2.5 border-b border-surface-container/40 hover:bg-surface-container/20 p-1.5 rounded-xl transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="./images/img_043.jpg" alt="Aardbeien Kwark" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-aardbeien-kwark">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-132">Aardbeien Kwark</span>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-94">Eiwitrijke kwark verrijkt met malse stukjes verse aardbei</p>
                            </div>
                        </li>`
);

html = html.replace(
  /<li class="flex items-start gap-2\.5">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-133"[^>]*>Abrikozen Kwark<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-5-span-134"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-95"[^>]*>Romige kwark met zongerijpte abrikozenstukjes<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-container/20 transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="/images/placeholder-dairy.svg" alt="Abrikozen Kwark" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-abrikozen-kwark">
                            </div>
                            <div class="flex-grow min-w-0">
                                <div class="flex items-center justify-between flex-wrap gap-1">
                                    <span class="font-semibold text-on-surface text-sm truncate" data-cms-id="auto-5-span-133">Abrikozen Kwark</span>
                                    <span class="text-[10px] uppercase font-bold bg-amber-500/15 text-amber-800 px-1.5 py-0.5 rounded shrink-0" data-cms-id="auto-5-span-134">Foto ontbreekt</span>
                                </div>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-95">Romige kwark met zongerijpte abrikozenstukjes</p>
                            </div>
                        </li>`
);

// Category 5: Traditionele Vla
html = html.replace(
  /<li class="flex items-start gap-2\.5 pb-2\.5 border-b border-surface-container\/40">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-136"[^>]*>Vanille Vla<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-96"[^>]*>Ouderwets lekkere, dikke vla bereid volgens ambachtelijk familierecept<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 pb-2.5 border-b border-surface-container/40 hover:bg-surface-container/20 p-1.5 rounded-xl transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="./images/img_044.jpg" alt="Vanille Vla" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-vanille-vla">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-136">Vanille Vla</span>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-96">Ouderwets lekkere, dikke vla bereid volgens ambachtelijk familierecept</p>
                            </div>
                        </li>`
);

html = html.replace(
  /<li class="flex items-start gap-2\.5">[\s\S]*?<span[^>]*data-cms-id="auto-5-span-137"[^>]*>Chocolade Vla<\/span>[\s\S]*?<p[^>]*data-cms-id="auto-5-p-97"[^>]*>Rijke vla met echte volle cacao en dagverse boerderijmelk<\/p>[\s\S]*?<\/li>/,
  `<li class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-container/20 transition-colors">
                            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container relative group">
                                <img src="./images/img_045.jpg" alt="Chocolade Vla" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-cms-id="auto-5-img-chocolade-vla">
                            </div>
                            <div class="flex-grow min-w-0">
                                <span class="font-semibold text-on-surface text-sm truncate block" data-cms-id="auto-5-span-137">Chocolade Vla</span>
                                <p class="text-xs text-on-surface-variant mt-0.5 line-clamp-1" data-cms-id="auto-5-p-97">Rijke vla met echte volle cacao en dagverse boerderijmelk</p>
                            </div>
                        </li>`
);

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Successfully updated 5.html dairy products with images');
