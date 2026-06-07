const fs = require('fs');
const path = require('path');

for (let i = 2; i <= 9; i++) {
    let filePath = path.join(__dirname, i + '.html');
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix footer links
    content = content.replace(/"#">Boerderijwinkel/g, '"2.html">Boerderijwinkel');
    content = content.replace(/"#">Ons Assortiment/g, '"4.html">Ons Assortiment');
    content = content.replace(/"#">Over de Familie/g, '"3.html">Over de Familie');
    content = content.replace(/"#">Verkooppunten/g, '"8.html">Verkooppunten');
    content = content.replace(/"#">Contact &amp; Route/g, '"9.html">Contact &amp; Route');
    content = content.replace(/"#">Bestellen &amp; Afhalen/g, '"9.html">Bestellen &amp; Afhalen');

    content = content.replace(/"#"><span class="material-symbols-outlined">face_nod/g, '"https://facebook.com" target="_blank"><span class="material-symbols-outlined">face_nod');
    content = content.replace(/"#"><span class="material-symbols-outlined">camera_alt/g, '"https://instagram.com" target="_blank"><span class="material-symbols-outlined">camera_alt');

    fs.writeFileSync(filePath, content);
    console.log('Fixed footer links in ' + i + '.html');
}
