const fs = require('fs');
const path = require('path');

for (let i = 2; i <= 9; i++) {
    let filePath = path.join(__dirname, i + '.html');
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix mobile padding for the hours box
    content = content.replace(
        /"bg-white p-xl rounded-2xl premium-shadow artisanal-border space-y-lg"/g,
        '"bg-white p-margin-mobile md:p-xl rounded-2xl premium-shadow artisanal-border space-y-lg"'
    );

    // 2. Fix mobile padding for the location box
    content = content.replace(
        /"p-lg bg-white rounded-xl artisanal-border premium-shadow"/g,
        '"p-margin-mobile md:p-lg bg-white rounded-xl artisanal-border premium-shadow"'
    );

    // 3. Fix text size for the headers in that section
    content = content.replace(
        /<h2 class="font-headline-lg text-headline-lg text-primary">Openingstijden Boerderijwinkel\s*<\/h2>/g,
        '<h2 class="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-primary">Openingstijden Boerderijwinkel</h2>'
    );
    
    content = content.replace(
        /<h2 class="font-headline-lg text-headline-lg text-primary">Kom langs bij onze boerderij\s*<\/h2>/g,
        '<h2 class="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-primary">Kom langs bij onze boerderij</h2>'
    );

    // 4. Remove extra points from footer
    // We will remove Bestellen & Afhalen, Algemene Voorwaarden, and Privacy Policy
    content = content.replace(/\s*<a[^>]*>Bestellen &amp; Afhalen<\/a>/g, '');
    content = content.replace(/\s*<a[^>]*>Algemene Voorwaarden<\/a>/g, '');
    content = content.replace(/\s*<a[^>]*>Privacy Policy<\/a>/g, '');

    // Let's also ensure icon flex-shrink-0 is there just in case
    content = content.replace(
        /<span class="material-symbols-outlined text-primary text-4xl">schedule<\/span>/g,
        '<span class="material-symbols-outlined text-primary text-4xl flex-shrink-0">schedule</span>'
    );
    content = content.replace(
        /<span class="material-symbols-outlined text-primary text-4xl">location_on<\/span>/g,
        '<span class="material-symbols-outlined text-primary text-4xl flex-shrink-0">location_on</span>'
    );

    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + i + '.html');
}
