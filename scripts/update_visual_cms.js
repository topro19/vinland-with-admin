const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'visual-cms.js');
let js = fs.readFileSync(filePath, 'utf-8');

// Replace openEditorFor and saveBtn logic
const oldOpenEditorSection = `  // 7. Populate Editor UI based on element type
  function openEditorFor(el) {
    emptyState.style.display = 'none';
    editorContent.style.display = 'block';
    footer.style.display = 'block';
    saveBtn.innerText = 'Save to Database';
    saveBtn.style.background = '';
    saveBtn.disabled = false;
    pendingFile = null;

    const cmsId = el.getAttribute('data-cms-id');
    const isImage = el.tagName.toLowerCase() === 'img';
    activeType = isImage ? 'image' : 'text';`;

const newOpenEditorSection = `  // Preset Farm Media Library for 1-click photo selection
  const farmMediaPresets = [
    { label: 'Kaaswiel (Jong)', url: './images/img_006.jpg', cat: 'Kaas' },
    { label: 'Kaasruim (Rijping)', url: './images/img_013.jpg', cat: 'Kaas' },
    { label: 'Oude Boerenkaas', url: './images/img_042.jpg', cat: 'Kaas' },
    { label: 'Kruidenkaas Wiel', url: './images/img_009.jpg', cat: 'Kaas' },
    { label: 'Komijnekaas Bereiding', url: './images/img_010.jpg', cat: 'Kaas' },
    { label: 'Ambachtelijke Karnemelk', url: './images/img_015.jpg', cat: 'Zuivel' },
    { label: 'Verse Melk Flessen', url: './images/img_016.jpg', cat: 'Zuivel' },
    { label: 'Boerderijyoghurt', url: './images/img_017.jpg', cat: 'Zuivel' },
    { label: 'Zuivel Flessen & Potten', url: './images/img_014.jpg', cat: 'Zuivel' },
    { label: 'Aardbeien Zuivel/Kwark', url: './images/img_043.jpg', cat: 'Zuivel' },
    { label: 'Vanille Vla', url: './images/img_044.jpg', cat: 'Zuivel' },
    { label: 'Chocolade Vla', url: './images/img_045.jpg', cat: 'Zuivel' },
    { label: 'Stoofvlees / Riblap', url: './images/img_029.jpg', cat: 'Vlees' },
    { label: 'Entrecote / Biefstuk', url: './images/img_030.jpg', cat: 'Vlees' },
    { label: 'Ambachtelijke Burgers', url: './images/img_031.jpg', cat: 'Vlees' },
    { label: 'Ambachtelijke Braadworst', url: './images/img_032.jpg', cat: 'Vlees' },
    { label: 'Weidekoeien Grasland', url: './images/img_033.jpg', cat: 'Boerderij' },
    { label: 'Vlees Placeholder', url: '/images/placeholder-meat.svg', cat: 'Placeholder' },
    { label: 'Kaas Placeholder', url: '/images/placeholder-cheese.svg', cat: 'Placeholder' },
    { label: 'Zuivel Placeholder', url: '/images/placeholder-dairy.svg', cat: 'Placeholder' },
    { label: 'Kaasbol Placeholder', url: '/images/placeholder-cheeseball.svg', cat: 'Placeholder' }
  ];

  // 7. Populate Editor UI based on element type
  function openEditorFor(el) {
    emptyState.style.display = 'none';
    editorContent.style.display = 'block';
    footer.style.display = 'block';
    saveBtn.innerText = 'Save to Database';
    saveBtn.style.background = '';
    saveBtn.disabled = false;
    pendingFile = null;

    // Detect if this element is an image or contains an image
    const isImgTag = el.tagName.toLowerCase() === 'img';
    const childImg = el.querySelector ? el.querySelector('img') : null;
    const isBgImg = el.getAttribute('style') && el.getAttribute('style').includes('background-image');
    const isImage = isImgTag || childImg !== null || isBgImg || el.getAttribute('data-cms-type') === 'image';
    activeType = isImage ? 'image' : 'text';

    // Target image element
    const targetImg = isImgTag ? el : (childImg || el);
    const cmsId = targetImg.getAttribute('data-cms-id') || el.getAttribute('data-cms-id');`;

if (!js.includes(oldOpenEditorSection)) {
  console.error('Could not find oldOpenEditorSection in visual-cms.js');
  process.exit(1);
}

js = js.replace(oldOpenEditorSection, newOpenEditorSection);

// Now update the innerHTML of editorContent for image
const oldImageHtml = `    if (isImage) {
      editorContent.innerHTML = \`
        <span class="cms-pill">Image ID: \${cmsId}</span>
        <div class="cms-form-group">
          <label>Upload Replacement Image</label>
          <img src="\${el.src}" class="cms-img-preview" id="cms-img-preview" />
          <input type="file" accept="image/*" class="cms-file-input" id="cms-file-input" />
        </div>
        <div class="cms-form-group" style="margin-top: 14px;">
          <label>Or Image URL</label>
          <input type="text" class="cms-textarea" id="cms-img-url-input" style="height: 42px; font-family: monospace; font-size: 13px;" placeholder="https://... or /images/..." />
        </div>
      \`;
      const urlInput = document.getElementById('cms-img-url-input');
      urlInput.value = el.getAttribute('src') || el.src || '';

      // Handle local image preview & live DOM update
      document.getElementById('cms-file-input').onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          pendingFile = file;
          const url = URL.createObjectURL(file);
          document.getElementById('cms-img-preview').src = url;
          el.src = url;
          urlInput.value = '';
        }
      };

      // Handle direct URL change
      urlInput.oninput = (e) => {
        const newUrl = e.target.value.trim();
        if (newUrl) {
          pendingFile = null;
          document.getElementById('cms-img-preview').src = newUrl;
          el.src = newUrl;
        }
      };
    }`;

const newImageHtml = `    if (isImage) {
      const currentSrc = targetImg.getAttribute('src') || targetImg.src || '';
      
      const presetHtml = farmMediaPresets.map((p, idx) => \`
        <button type="button" class="cms-preset-chip" data-preset-url="\${p.url}" title="\${p.label}" style="display: flex; flex-direction: column; align-items: center; padding: 4px; border: 1px solid #e2e8f0; border-radius: 6px; background: white; cursor: pointer; transition: all 0.15s; font-size: 10px; color: #334155;">
          <div style="width: 100%; height: 38px; border-radius: 4px; overflow: hidden; background: #f8fafc; margin-bottom: 2px;">
            <img src="\${p.url}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
          </div>
          <span style="display: block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">\${p.label}</span>
        </button>
      \`).join('');

      editorContent.innerHTML = \`
        <span class="cms-pill">Image ID: \${cmsId}</span>
        
        <div class="cms-form-group">
          <label>Current Image Preview</label>
          <div style="width: 100%; height: 150px; border-radius: 8px; overflow: hidden; background: #f8fafc; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <img src="\${currentSrc}" class="cms-img-preview" id="cms-img-preview" style="max-height: 100%; max-width: 100%; object-fit: contain; margin-bottom: 0;" />
          </div>
        </div>

        <div class="cms-form-group">
          <label style="font-weight: 600; color: #1e293b;">1. Upload New Image from Computer</label>
          <input type="file" accept="image/*" class="cms-file-input" id="cms-file-input" style="padding: 6px; background: white; border: 1px dashed #cbd5e1; border-radius: 6px; cursor: pointer;" />
        </div>

        <div class="cms-form-group" style="margin-top: 12px;">
          <label style="font-weight: 600; color: #1e293b;">2. Or Enter Image URL / Path</label>
          <input type="text" class="cms-textarea" id="cms-img-url-input" style="height: 38px; font-family: monospace; font-size: 12px;" placeholder="https://... or ./images/..." />
        </div>

        <div class="cms-form-group" style="margin-top: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label style="margin: 0; font-weight: 700; color: #00461a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">3. Or 1-Click Pick From Farm Library</label>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; max-height: 175px; overflow-y: auto; padding: 6px; background: #f1f5f9; border-radius: 8px; border: 1px solid #e2e8f0;" id="cms-presets-grid">
            \${presetHtml}
          </div>
        </div>
      \`;

      const urlInput = document.getElementById('cms-img-url-input');
      urlInput.value = currentSrc;

      function updateCardBadgeIfPresent() {
        const card = targetImg.closest('.group') || targetImg.closest('li') || targetImg.parentElement;
        if (card) {
          const badge = card.querySelector('[data-cms-id*="span"], [data-cms-id*="badge"]');
          if (badge && badge.innerText.toLowerCase().includes('ontbreekt')) {
            badge.innerText = 'Foto geplaatst';
            badge.style.backgroundColor = '#105223';
            badge.style.color = '#ffffff';
          }
        }
      }

      // Handle local image file preview & live DOM update
      document.getElementById('cms-file-input').onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          pendingFile = file;
          const url = URL.createObjectURL(file);
          document.getElementById('cms-img-preview').src = url;
          if (targetImg.tagName.toLowerCase() === 'img') {
            targetImg.src = url;
          }
          urlInput.value = '';
          updateCardBadgeIfPresent();
        }
      };

      // Handle direct URL change
      urlInput.oninput = (e) => {
        const newUrl = e.target.value.trim();
        if (newUrl) {
          pendingFile = null;
          document.getElementById('cms-img-preview').src = newUrl;
          if (targetImg.tagName.toLowerCase() === 'img') {
            targetImg.src = newUrl;
          }
          updateCardBadgeIfPresent();
        }
      };

      // Handle 1-click Preset selection
      document.querySelectorAll('#cms-presets-grid .cms-preset-chip').forEach(btn => {
        btn.onclick = () => {
          const selectedUrl = btn.getAttribute('data-preset-url');
          if (selectedUrl) {
            pendingFile = null;
            document.getElementById('cms-img-preview').src = selectedUrl;
            if (targetImg.tagName.toLowerCase() === 'img') {
              targetImg.src = selectedUrl;
            }
            urlInput.value = selectedUrl;
            updateCardBadgeIfPresent();
          }
        };
      });
    }`;

if (!js.includes(oldImageHtml)) {
  console.error('Could not find oldImageHtml in visual-cms.js');
  process.exit(1);
}

js = js.replace(oldImageHtml, newImageHtml);

// Also in saveBtn.onclick, ensure targetImg data-cms-id is saved
const oldSaveBtnLogic = `    const cmsId = activeElement.getAttribute('data-cms-id');
    const formData = new FormData();`;

const newSaveBtnLogic = `    const isImg = activeType === 'image';
    const childImg = activeElement.querySelector ? activeElement.querySelector('img') : null;
    const targetNode = (isImg && activeElement.tagName.toLowerCase() !== 'img' && childImg) ? childImg : activeElement;
    const cmsId = targetNode.getAttribute('data-cms-id') || activeElement.getAttribute('data-cms-id');
    const formData = new FormData();`;

js = js.replace(oldSaveBtnLogic, newSaveBtnLogic);

fs.writeFileSync(filePath, js, 'utf-8');
console.log('Successfully updated public/visual-cms.js with rich image editor and presets');
