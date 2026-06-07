const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

const files = ['2.html', '3.html'];
const sourceDir = path.join(__dirname, '_html_source');

files.forEach(file => {
  const filePath = path.join(sourceDir, file);
  if (!fs.existsSync(filePath)) return;
  
  const html = fs.readFileSync(filePath, 'utf-8');
  const root = parse(html);
  
  let counter = 1;
  const prefix = path.basename(file, '.html');
  
  // Important elements that usually contain editable content
  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'img', 'button', 'a', 'span', 'li'];
  
  tags.forEach(tag => {
    const elements = root.querySelectorAll(tag);
    elements.forEach(el => {
      // Skip if already tagged
      if (el.hasAttribute('data-cms-id')) return;
      
      // Skip icons
      if (el.classNames && el.classNames.includes('material-symbols-outlined')) return;
      if (el.classNames && el.classNames.includes('material-icons')) return;
      
      // Skip if it doesn't really have text (unless it's an image)
      if (tag !== 'img') {
        const text = el.text.trim();
        if (!text) return;
        // Don't tag elements that contain lots of child block elements, we only want the leaf nodes
        if (el.querySelector('div') || el.querySelector('p') || el.querySelector('h2') || el.querySelector('h3') || el.querySelector('ul')) {
          return;
        }
      }

      el.setAttribute('data-cms-id', `auto-${prefix}-${tag}-${counter++}`);
    });
  });
  
  fs.writeFileSync(filePath, root.toString(), 'utf-8');
  console.log(`Tagged ${counter - 1} elements in ${file}`);
});
