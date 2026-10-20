const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '_html_source', '7.html');
let html = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Rundergehakt<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-124"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Rundergehakt" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-gehakt">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-124">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Traditioneel soepvlees<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-126"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Traditioneel soepvlees" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-soepvlees">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-126">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Schenkel met been<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-128"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Schenkel met been" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-schenkels">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-128">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Mager gemalen tartaar<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-130"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Mager gemalen tartaar" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-tartaar">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-130">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Malse bieflappen<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-134"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Malse bieflappen" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-bieflappen">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-134">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Sucadelappen<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-136"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Sucadelappen" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-sucade">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-136">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Haasbiefstuk \/ Ossenhaas<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-140"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Haasbiefstuk / Ossenhaas" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-haasbiefstuk">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-140">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Bavette \(Vanglap\)<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-142"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Bavette (Vanglap)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-bavette">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-142">Foto ontbreekt</span>
                        </div>`
  },
  {
    target: /<div class="aspect-square bg-surface-container\/60 flex flex-col items-center justify-center p-4 text-center">[\s\S]*?<span class="text-\[11px\] font-medium text-on-surface-variant"[^>]*>Picanha \(Staartstuk\)<\/span>[\s\S]*?<span[^>]*data-cms-id="auto-7-span-144"[^>]*>Foto ontbreekt<\/span>[\s\S]*?<\/div>/,
    replace: `<div class="aspect-square bg-surface-container overflow-hidden relative group/img">
                            <img src="/images/placeholder-meat.svg" alt="Picanha (Staartstuk)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="auto-7-img-picanha">
                            <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="auto-7-span-144">Foto ontbreekt</span>
                        </div>`
  }
];

let count = 0;
for (const rep of replacements) {
  if (rep.target.test(html)) {
    html = html.replace(rep.target, rep.replace);
    count++;
  } else {
    console.warn('Match not found for one replacement in 7.html');
  }
}

fs.writeFileSync(filePath, html, 'utf-8');
console.log(`Successfully updated ${count} of ${replacements.length} placeholder cards in 7.html`);
