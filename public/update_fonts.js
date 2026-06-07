const fs = require('fs');
const path = require('path');

const oldLink = 'href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&amp;display=swap"';
const newLink = 'href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&amp;family=Nunito:ital,wght@0,200..1000;1,200..1000&amp;display=swap"';

for (let i = 2; i <= 9; i++) {
    let filePath = path.join(__dirname, i + '.html');
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // Update the google fonts link
    content = content.replace(oldLink, newLink);

    // Some files might have unescaped &
    const oldLink2 = 'href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"';
    const newLink2 = 'href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"';
    content = content.replace(oldLink2, newLink2);

    // Update tailwind config to use Nunito Sans for body and label, and keep Nunito for headline and display
    content = content.replace(/"label-sm":\s*\["Nunito"\]/g, '"label-sm": ["\'Nunito Sans\'", "sans-serif"]');
    content = content.replace(/"body-lg":\s*\["Nunito"\]/g, '"body-lg": ["\'Nunito Sans\'", "sans-serif"]');
    content = content.replace(/"label-lg":\s*\["Nunito"\]/g, '"label-lg": ["\'Nunito Sans\'", "sans-serif"]');
    content = content.replace(/"body-md":\s*\["Nunito"\]/g, '"body-md": ["\'Nunito Sans\'", "sans-serif"]');

    // Ensure display/headlines use sans-serif fallback as good practice
    content = content.replace(/"display-lg":\s*\["Nunito"\]/g, '"display-lg": ["Nunito", "sans-serif"]');
    content = content.replace(/"display-lg-mobile":\s*\["Nunito"\]/g, '"display-lg-mobile": ["Nunito", "sans-serif"]');
    content = content.replace(/"headline-xl":\s*\["Nunito"\]/g, '"headline-xl": ["Nunito", "sans-serif"]');
    content = content.replace(/"headline-lg":\s*\["Nunito"\]/g, '"headline-lg": ["Nunito", "sans-serif"]');
    content = content.replace(/"headline-md":\s*\["Nunito"\]/g, '"headline-md": ["Nunito", "sans-serif"]');

    fs.writeFileSync(filePath, content);
    console.log('Added Nunito Sans to ' + i + '.html');
}
