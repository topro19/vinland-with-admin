const fs = require('fs');
const path = require('path');

// 1. UPDATE 5.HTML (Dairy Catalog to Card Grid)
const dairyFilePath = path.join(__dirname, '..', '_html_source', '5.html');
let dairyHtml = fs.readFileSync(dairyFilePath, 'utf-8');

const dairyProducts = [
  // Karnemelk & Boter (3)
  {
    cat: 'Karnemelk & Boter',
    items: [
      { id: 'auto-5-span-102', descId: 'auto-5-p-84', imgId: 'auto-5-img-karnemelk', name: 'Ambachtelijke Karnemelk', desc: 'Traditioneel 36 uur verzuurd en gekarnd (1L en 0,5L fles)', img: './images/img_015.jpg', badge: null },
      { id: 'auto-5-span-103', descId: 'auto-5-p-85', imgId: 'auto-5-img-framboos', name: 'Karnedrank Framboos', desc: 'Frisse zachte karnemelkdrank met natuurlijke frambozensmaak', img: '/images/placeholder-dairy.svg', badge: 'Foto ontbreekt', badgeId: 'auto-5-span-104' },
      { id: 'auto-5-span-105', descId: 'auto-5-p-86', imgId: 'auto-5-img-boter', name: 'Boerenroomboter Ongezouten', desc: 'Puur gekarnde roomboter van dagverse room in authentieke rol', img: './images/img_014.jpg', badge: null }
    ]
  },
  // Melk & Room (6)
  {
    cat: 'Melk & Room',
    items: [
      { id: 'auto-5-span-107', descId: 'auto-5-p-87', imgId: 'auto-5-img-volle-melk', name: 'Volle Melk', desc: 'Dagvers gepasteuriseerd, puur en volromig van smaak', img: './images/img_016.jpg', badge: null },
      { id: 'auto-5-span-108', descId: 'auto-5-p-88', imgId: 'auto-5-img-halfvolle-melk', name: 'Halfvolle Melk', desc: 'Gepasteuriseerd, lichter alternatief voor dagelijks gebruik', img: './images/img_016.jpg', badge: null },
      { id: 'auto-5-span-109', descId: 'auto-5-p-89', imgId: 'auto-5-img-rauwe-melk', name: 'Rauwe Melk (Melktap)', desc: 'Onbewerkt rechtstreeks uit de gekoelde tap in de boerderijwinkel', img: './images/img_016.jpg', badge: null },
      { id: 'auto-5-span-110', descId: 'auto-5-p-90', imgId: 'auto-5-img-slagroom', name: 'Ongeklopte Slagroom', desc: 'Ongezoet en rijk, perfect op te kloppen voor gebak', img: './images/img_014.jpg', badge: null },
      { id: 'auto-5-span-111', descId: 'auto-5-p-91', imgId: 'auto-5-img-creme-fraiche', name: 'Crème Fraîche', desc: 'Romige, lichtzure room voor verfijnde warme en koude gerechten', img: './images/img_017.jpg', badge: null },
      { id: 'auto-5-span-112', descId: 'auto-5-p-92', imgId: 'auto-5-img-kefir', name: 'Ambachtelijke Kefir', desc: 'Fris-tintelende gefermenteerde melkdrank met levende culturen', img: '/images/placeholder-dairy.svg', badge: null }
    ]
  },
  // Boerderijyoghurt (8)
  {
    cat: 'Boerderijyoghurt',
    items: [
      { id: 'auto-5-span-114', descId: 'auto-5-span-115', imgId: 'auto-5-img-volle-yoghurt', name: 'Volle Yoghurt', desc: 'Vol en romig van verse weidemelk', img: './images/img_017.jpg', badge: null },
      { id: 'auto-5-span-116', descId: 'auto-5-span-117', imgId: 'auto-5-img-halfvolle-yoghurt', name: 'Halfvolle Yoghurt', desc: 'Evenwichtig fris met lichte structuur', img: './images/img_017.jpg', badge: null },
      { id: 'auto-5-span-118', descId: 'auto-5-span-119', imgId: 'auto-5-img-magere-yoghurt', name: 'Magere Yoghurt', desc: 'Heerlijk fris en vetarm', img: './images/img_017.jpg', badge: null },
      { id: 'auto-5-span-120', descId: 'auto-5-span-121', imgId: 'auto-5-img-standyoghurt', name: 'Standyoghurt', desc: 'In de pot gerijpt met stevige lepelbare structuur', img: './images/img_017.jpg', badge: null },
      { id: 'auto-5-span-122', descId: 'auto-5-span-123', imgId: 'auto-5-img-bulgaarse-yoghurt', name: 'Bulgaarse Yoghurt', desc: 'Extra dikke, milde yoghurt naar familierecept', img: './images/img_017.jpg', badge: null },
      { id: 'auto-5-span-124', descId: 'auto-5-span-125', imgId: 'auto-5-img-aardbeien-yoghurt', name: 'Aardbeienyoghurt', desc: 'Romige yoghurt met echte Hollandse aardbeien', img: './images/img_043.jpg', badge: null },
      { id: 'auto-5-span-126', descId: 'auto-5-span-127', imgId: 'auto-5-img-abrikozen-yoghurt', name: 'Abrikozenyoghurt', desc: 'Zachte vruchtenyoghurt met zoete abrikozenstukjes', img: './images/img_043.jpg', badge: null },
      { id: 'auto-5-span-128', descId: 'auto-5-span-129', imgId: 'auto-5-img-vanille-yoghurt', name: 'Vanille Yoghurt', desc: 'Met authentiek natuurlijk Bourbon-vanille extract', img: './images/img_017.jpg', badge: null }
    ]
  },
  // Kwark & Vla (5)
  {
    cat: 'Kwark & Vla',
    items: [
      { id: 'auto-5-span-131', descId: 'auto-5-p-93', imgId: 'auto-5-img-volle-kwark', name: 'Volle Kwark Naturel', desc: 'Stevige, ambachtelijke kwark met zachte smaak en hoog eiwitgehalte', img: './images/img_017.jpg', badge: null },
      { id: 'auto-5-span-132', descId: 'auto-5-p-94', imgId: 'auto-5-img-aardbeien-kwark', name: 'Aardbeien Kwark', desc: 'Eiwitrijke kwark verrijkt met malse stukjes verse aardbei', img: './images/img_043.jpg', badge: null },
      { id: 'auto-5-span-133', descId: 'auto-5-p-95', imgId: 'auto-5-img-abrikozen-kwark', name: 'Abrikozen Kwark', desc: 'Romige kwark met zongerijpte abrikozenstukjes', img: '/images/placeholder-dairy.svg', badge: 'Foto ontbreekt', badgeId: 'auto-5-span-134' },
      { id: 'auto-5-span-136', descId: 'auto-5-p-96', imgId: 'auto-5-img-vanille-vla', name: 'Vanille Vla', desc: 'Ouderwets lekkere, dikke vla bereid volgens ambachtelijk familierecept', img: './images/img_044.jpg', badge: null },
      { id: 'auto-5-span-137', descId: 'auto-5-p-97', imgId: 'auto-5-img-chocolade-vla', name: 'Chocolade Vla', desc: 'Rijke vla met echte volle cacao en dagverse boerderijmelk', img: './images/img_045.jpg', badge: null }
    ]
  }
];

let dairyGridHtml = `<div class="space-y-12">`;

for (const catGroup of dairyProducts) {
  dairyGridHtml += `
    <div>
      <div class="flex items-center justify-between border-b border-outline-variant/30 pb-2 mb-6">
        <h3 class="font-headline-lg text-headline-lg text-primary flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-primary inline-block"></span>
          ${catGroup.cat}
        </h3>
        <span class="text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">${catGroup.items.length} producten</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">`;

  for (const item of catGroup.items) {
    dairyGridHtml += `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between border border-surface-variant/20">
          <div class="h-48 overflow-hidden relative bg-surface-container">
            <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-cms-id="${item.imgId}">
            ${item.badge ? `<span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="${item.badgeId}">${item.badge}</span>` : ''}
          </div>
          <div class="p-md text-center flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-headline-md text-headline-md text-heading-green" data-cms-id="${item.id}">${item.name}</h3>
              <p class="text-xs text-on-surface-variant mt-1.5" data-cms-id="${item.descId}">${item.desc}</p>
            </div>
            <div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="px-sm py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm rounded-full">Dagvers</span>
            </div>
          </div>
        </div>`;
  }

  dairyGridHtml += `
      </div>
    </div>`;
}

dairyGridHtml += `
    <!-- Makerij callout card -->
    <div class="bg-primary/5 p-8 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
      <div>
        <div class="flex items-center gap-2 text-primary font-bold mb-2">
          <span class="material-symbols-outlined">storefront</span>
          Direct van de Bron
        </div>
        <h4 class="font-headline-lg text-primary mb-2" data-cms-id="auto-5-h4-83">Vers uit eigen Makerij</h4>
        <p class="text-sm text-on-surface-variant max-w-2xl leading-relaxed" data-cms-id="auto-5-p-98">
          Al onze 22 zuivelproducten worden wekelijks vers bereid. We gebruiken uitsluitend de melk van onze eigen weidekoeien, zonder kunstmatige geur- of smaakstoffen.
        </p>
      </div>
      <div class="flex-shrink-0 flex items-center gap-4">
        <span class="text-sm font-semibold text-primary" data-cms-id="auto-5-span-138">22 variëteiten verkrijgbaar</span>
        <a href="9.html" class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors" data-cms-id="auto-5-a-139">
          Winkelinfo <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
    </div>
  </div>`;

// Replace the old grid section in 5.html
const oldGridRegex = /<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
if (oldGridRegex.test(dairyHtml)) {
  dairyHtml = dairyHtml.replace(oldGridRegex, `${dairyGridHtml}\n        </div>\n    </section>`);
  fs.writeFileSync(dairyFilePath, dairyHtml, 'utf-8');
  console.log('Successfully transformed 5.html dairy catalog into card grid');
} else {
  console.error('Could not match old dairy grid in 5.html');
}

// 2. UPDATE 4.HTML (Cheese Catalog to Card Grid)
const cheeseFilePath = path.join(__dirname, '..', '_html_source', '4.html');
let cheeseHtml = fs.readFileSync(cheeseFilePath, 'utf-8');

const largeCheeseGroups = [
  {
    cat: 'Natuurkazen',
    badge: '7 variëteiten',
    items: [
      { id: 'auto-4-img-kaas-jong', title: 'Jong', descId: 'auto-4-span-128', desc: '4 weken gerijpt — Mild, zacht en romig van smaak', img: './images/img_006.jpg', tag: '4 weken' },
      { id: 'auto-4-img-kaas-jongbelegen', title: 'Jong-belegen', descId: 'auto-4-span-129', desc: '8-10 weken gerijpt — Rijk en soepel van structuur', img: './images/img_006.jpg', tag: '8-10 wkn' },
      { id: 'auto-4-img-kaas-belegen', title: 'Belegen', descId: 'auto-4-span-130', desc: '4 maanden gerijpt — Vol van smaak met een lichte pit', img: './images/img_013.jpg', tag: '4 mnd' },
      { id: 'auto-4-img-kaas-extrabelegen', title: 'Extra Belegen', descId: 'auto-4-span-131', desc: '6-7 maanden gerijpt — Pittig en vol karakter', img: './images/img_013.jpg', tag: '6-7 mnd' },
      { id: 'auto-4-img-kaas-oud', title: 'Oud', descId: 'auto-4-span-132', desc: '10-12 maanden gerijpt — Pikant met rijpingskristallen', img: './images/img_042.jpg', tag: '10-12 mnd' },
      { id: 'auto-4-img-kaas-overjarig', title: 'Overjarig', descId: 'auto-4-span-133', desc: '1+ jaar gerijpt — Zeer intens, brokkelig en complex', img: './images/img_042.jpg', tag: '1+ jaar' },
      { id: 'auto-4-img-kaas-gatenkaas', title: 'Gatenkaas', descId: 'auto-4-span-134', desc: 'Boerengatenkaas met karakteristieke ronde ogen en nootachtige smaak', img: './images/img_006.jpg', tag: 'Traditie' }
    ]
  },
  {
    cat: 'Grote Kruidenkazen',
    badge: '10 variëteiten',
    items: [
      { id: 'auto-4-img-kaas-fenegriek', title: 'Fenegriek', descId: 'auto-4-span-136', desc: 'Warme, nootachtige smaak met fenegriekzaad', img: '/images/placeholder-cheese.svg', tag: 'Kruiden' },
      { id: 'auto-4-img-kaas-brandnetel', title: 'Brandnetel', descId: 'auto-4-span-137', desc: 'Fris en natuurlijk aroma met gedroogde brandnetel', img: '/images/placeholder-cheese.svg', tag: 'Kruiden' },
      { id: 'auto-4-img-kaas-tomaat', title: 'Tomaat-knoflook', descId: 'auto-4-span-138', desc: 'Hartige mediterrane combinatie van zongedroogde tomaat en knoflook', img: '/images/placeholder-cheese.svg', tag: 'Mediterraan' },
      { id: 'auto-4-img-kaas-bieslook', title: 'Bieslook', descId: 'auto-4-span-139', desc: 'Verfijnde tuinkruidentoets met verse bieslook', img: '/images/placeholder-cheese.svg', tag: 'Kruiden' },
      { id: 'auto-4-img-kaas-tuinkruiden', title: 'Tuinkruiden', descId: 'auto-4-span-140', desc: 'Klassieke polderkruidenmelange vol aroma', img: './images/img_009.jpg', tag: 'Kruiden' },
      { id: 'auto-4-img-kaas-piripiri', title: 'Piri-piri', descId: 'auto-4-span-141', desc: 'Vurig en pikant met rode chilipeper', img: '/images/placeholder-cheese.svg', tag: 'Pikant' },
      { id: 'auto-4-img-kaas-peper', title: 'Zwarte peper', descId: 'auto-4-span-142', desc: 'Met grof gebroken zwarte peperkorrels', img: '/images/placeholder-cheese.svg', tag: 'Pikant' },
      { id: 'auto-4-img-kaas-knoflook', title: 'Knoflook', descId: 'auto-4-span-143', desc: 'Rijk en volmondig met pure knoflooktoets', img: '/images/placeholder-cheese.svg', tag: 'Kruiden' },
      { id: 'auto-4-img-kaas-mosterd', title: 'Mosterd', descId: 'auto-4-span-144', desc: 'Pikant met hele goudgele mosterdzaadjes', img: '/images/placeholder-cheese.svg', tag: 'Kruiden' },
      { id: 'auto-4-img-kaas-honingklaver', title: 'Honing-klaver', descId: 'auto-4-span-145', desc: 'Zachtzoete bloemige toets van honingklaver', img: '/images/placeholder-cheese.svg', tag: 'Zoet' }
    ]
  },
  {
    cat: 'Komijn & Magere Kazen',
    badge: '5 variëteiten',
    items: [
      { id: 'auto-4-img-kaas-jongkomijn', title: 'Jonge komijnekaas', descId: 'auto-4-span-147', desc: 'Zachte boerenkaas met geurige komijnzaadjes', img: './images/img_010.jpg', tag: 'Komijn' },
      { id: 'auto-4-img-kaas-belegenkomijn', title: 'Belegen komijnekaas', descId: 'auto-4-span-148', desc: 'Voller gerijpte komijnekaas met krachtige smaak', img: './images/img_010.jpg', tag: 'Komijn' },
      { id: 'auto-4-img-kaas-magerejong', title: 'Magere jonge kaas (±25+)', descId: 'auto-4-span-149', desc: 'Lager vetgehalte met behoud van milde boerensmaak', img: '/images/placeholder-cheese.svg', tag: 'Mager 25+' },
      { id: 'auto-4-img-kaas-magerekomijn', title: 'Magere jonge komijnekaas (±25+)', descId: 'auto-4-span-150', desc: 'Verantwoorde magere kaas verrijkt met komijn', img: './images/img_010.jpg', tag: 'Mager 25+' },
      { id: 'auto-4-img-kaas-magereitaliaans', title: 'Magere Italiaanse kruiden (±25+)', descId: 'auto-4-span-151', desc: 'Magere kaas met zongedroogde mediterrane kruiden', img: '/images/placeholder-cheese.svg', tag: 'Mager 25+' }
    ]
  }
];

let cheeseGridHtml = `<div class="space-y-12 mb-xl">`;

for (const group of largeCheeseGroups) {
  cheeseGridHtml += `
    <div>
      <div class="flex items-center justify-between border-b border-outline-variant/30 pb-2 mb-6">
        <h3 class="font-headline-lg text-headline-lg text-heading-green flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-heading-green inline-block"></span>
          ${group.cat}
        </h3>
        <span class="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">${group.badge}</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">`;

  for (const item of group.items) {
    cheeseGridHtml += `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between border border-surface-variant/20">
          <div class="h-48 overflow-hidden relative bg-surface-container">
            <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-cms-id="${item.id}">
            <span class="absolute top-2 right-2 text-[10px] bg-secondary-container/90 text-on-secondary-container px-2 py-0.5 rounded font-medium shadow-sm">${item.tag}</span>
          </div>
          <div class="p-md text-center flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-headline-md text-headline-md text-heading-green">${item.title}</h3>
              <p class="text-xs text-on-surface-variant mt-1.5" data-cms-id="${item.descId}">${item.desc}</p>
            </div>
            <div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="px-sm py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm rounded-full">Boerenkaas</span>
            </div>
          </div>
        </div>`;
  }

  cheeseGridHtml += `
      </div>
    </div>`;
}

cheeseGridHtml += `</div>`;

// Replace the 3-column text list box in 4.html
const oldCheeseSectionRegex = /<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">[\s\S]*?Totaal 22 variëteiten grote kaas, dagelijks vers versneden in onze winkel\.[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

if (oldCheeseSectionRegex.test(cheeseHtml)) {
  cheeseHtml = cheeseHtml.replace(oldCheeseSectionRegex, cheeseGridHtml);
  fs.writeFileSync(cheeseFilePath, cheeseHtml, 'utf-8');
  console.log('Successfully transformed 4.html large cheese catalog into card grid');
} else {
  console.error('Could not match old cheese section in 4.html');
}
