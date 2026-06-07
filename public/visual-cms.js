(function() {
  if (window.__visualCMSReady) return;
  window.__visualCMSReady = true;

  // 1. Inject CSS for the floating panel and editing styles
  const style = document.createElement('style');
  style.innerHTML = `
    /* Disable the cheese cursor globally in edit mode */
    .custom-cursor { display: none !important; }
    body, body * { cursor: auto !important; }
    
    /* Highlight editable elements */
    [data-cms-id] {
      outline: 2px dashed rgba(59, 130, 246, 0.5);
      cursor: pointer !important;
      position: relative;
      transition: all 0.2s;
    }
    [data-cms-id]:hover {
      outline: 2px solid rgba(59, 130, 246, 1);
      background: rgba(59, 130, 246, 0.05);
    }
    .cms-active-element {
      outline: 3px solid rgba(16, 185, 129, 1) !important;
      background: rgba(16, 185, 129, 0.1) !important;
    }
    
    /* Floating Right Panel */
    #cms-panel {
      position: fixed;
      top: 0;
      right: -450px;
      width: 400px;
      height: 100vh;
      background: #ffffff;
      box-shadow: -5px 0 25px rgba(0,0,0,0.15);
      z-index: 999999;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #cms-panel.open {
      right: 0;
    }
    #cms-header {
      background: #111827;
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #cms-header h2 { margin: 0; font-size: 18px; font-weight: 600; }
    #cms-close { background: none; border: none; color: white; cursor: pointer; font-size: 28px; line-height: 1; padding: 0; }
    #cms-body { padding: 24px; flex: 1; overflow-y: auto; }
    #cms-footer { padding: 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
    
    .cms-form-group { margin-bottom: 20px; }
    .cms-form-group label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
    .cms-textarea { width: 100%; height: 250px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; color: #111827; resize: vertical; box-sizing: border-box; line-height: 1.5; }
    .cms-textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
    
    .cms-img-preview { width: 100%; height: 200px; object-fit: contain; border-radius: 6px; border: 1px solid #e5e7eb; background: #f3f4f6; margin-bottom: 16px; }
    .cms-file-input { display: block; width: 100%; font-size: 14px; color: #6b7280; }
    
    .cms-btn { width: 100%; padding: 14px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); }
    .cms-btn:hover { background: #1d4ed8; }
    .cms-btn:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; }
    
    .cms-pill { display: inline-block; padding: 4px 10px; background: #dbeafe; color: #1e40af; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
  `;
  document.head.appendChild(style);

  // 2. Inject Panel HTML into the DOM
  const panel = document.createElement('div');
  panel.id = 'cms-panel';
  panel.innerHTML = `
    <div id="cms-header">
      <h2>Visual CMS Editor</h2>
      <button id="cms-close">&times;</button>
    </div>
    <div id="cms-body">
      <div id="cms-empty-state" style="text-align: center; color: #6b7280; margin-top: 80px;">
        <svg style="width: 48px; height: 48px; margin: 0 auto 16px; opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
        <p>Click any highlighted element on the page to edit its contents here.</p>
      </div>
      <div id="cms-editor-content" style="display: none;"></div>
    </div>
    <div id="cms-footer" style="display: none;">
      <button id="cms-save-btn" class="cms-btn">Save to Database</button>
    </div>
  `;
  document.body.appendChild(panel);

  // 2.5 Add Exit Edit Mode button
  const exitBtn = document.createElement('button');
  exitBtn.innerHTML = 'Exit Edit Mode &times;';
  exitBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    z-index: 9999999;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-family: system-ui, sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
  `;
  exitBtn.onmouseover = () => exitBtn.style.background = '#dc2626';
  exitBtn.onmouseout = () => exitBtn.style.background = '#ef4444';
  exitBtn.onclick = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('edit_mode');
    window.location.href = url.toString();
  };
  document.body.appendChild(exitBtn);

  // 3. State Management
  let activeElement = null;
  let activeType = 'text'; // 'text' | 'image'
  let pendingFile = null;

  // DOM Elements mapping
  const closeBtn = document.getElementById('cms-close');
  const emptyState = document.getElementById('cms-empty-state');
  const editorContent = document.getElementById('cms-editor-content');
  const footer = document.getElementById('cms-footer');
  const saveBtn = document.getElementById('cms-save-btn');

  // Close panel handler
  closeBtn.onclick = () => {
    panel.classList.remove('open');
    if (activeElement) activeElement.classList.remove('cms-active-element');
    activeElement = null;
  };

  // 4. Global Click Interceptor (Capture Phase)
  document.addEventListener('click', (e) => {
    // Prevent interfering with the CMS panel itself
    if (e.target.closest('#cms-panel')) return;

    // Check if we clicked an editable element
    const target = e.target.closest('[data-cms-id]');
    if (target) {
      e.preventDefault();
      e.stopPropagation();

      // Switch active selection
      if (activeElement) activeElement.classList.remove('cms-active-element');
      activeElement = target;
      activeElement.classList.add('cms-active-element');

      // Open the editor
      openEditorFor(target);
      panel.classList.add('open');
    } else {
      // If clicking a normal link, append edit_mode=true and allow navigation
      const link = e.target.closest('a');
      if (link && link.href) {
        e.preventDefault();
        try {
          const url = new URL(link.href);
          // Only append if it's the same origin
          if (url.origin === window.location.origin) {
            url.searchParams.set('edit_mode', 'true');
            window.location.href = url.toString();
          } else {
            window.location.href = link.href;
          }
        } catch (err) {
          window.location.href = link.href;
        }
      }
    }
  }, true);

  // 5. Populate Editor UI based on element type
  function openEditorFor(el) {
    emptyState.style.display = 'none';
    editorContent.style.display = 'block';
    footer.style.display = 'block';
    saveBtn.innerText = 'Save to Database';
    saveBtn.disabled = false;
    pendingFile = null;

    const cmsId = el.getAttribute('data-cms-id');
    const isImage = el.tagName.toLowerCase() === 'img';
    activeType = isImage ? 'image' : 'text';

    if (isImage) {
      editorContent.innerHTML = `
        <span class="cms-pill">Image ID: ${cmsId}</span>
        <div class="cms-form-group">
          <label>Upload Replacement Image</label>
          <img src="${el.src}" class="cms-img-preview" id="cms-img-preview" />
          <input type="file" accept="image/*" class="cms-file-input" id="cms-file-input" />
        </div>
      `;
      // Handle local image preview & live DOM update
      document.getElementById('cms-file-input').onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          pendingFile = file;
          const url = URL.createObjectURL(file);
          document.getElementById('cms-img-preview').src = url;
          el.src = url; // Live update the website preview immediately!
        }
      };
    } else {
      // Assume text content
      const content = el.innerText || el.innerHTML;
      editorContent.innerHTML = `
        <span class="cms-pill">Text ID: ${cmsId}</span>
        <div class="cms-form-group">
          <label>Content</label>
          <textarea class="cms-textarea" id="cms-textarea-input">${content.trim()}</textarea>
        </div>
      `;
      // Live DOM update on type
      document.getElementById('cms-textarea-input').oninput = (e) => {
        el.innerText = e.target.value; // Live update the website preview immediately!
      };
    }
  }

  // 6. Save handler (POST to API)
  saveBtn.onclick = async () => {
    if (!activeElement) return;
    
    saveBtn.innerText = 'Saving...';
    saveBtn.disabled = true;

    const cmsId = activeElement.getAttribute('data-cms-id');
    const formData = new FormData();

    if (activeType === 'image' && pendingFile) {
      formData.append(`image_${cmsId}`, pendingFile);
    } else if (activeType === 'text') {
      const textVal = document.getElementById('cms-textarea-input').value;
      formData.append('texts', JSON.stringify({ [cmsId]: textVal }));
    } else {
      saveBtn.innerText = 'Save to Database';
      saveBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch('/api/admin/save-inline', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        saveBtn.innerText = 'Successfully Saved!';
        saveBtn.style.background = '#10b981'; // Green success color
        setTimeout(() => {
          saveBtn.innerText = 'Save to Database';
          saveBtn.style.background = '';
          saveBtn.disabled = false;
        }, 2000);
      } else {
        alert('Error saving to database: ' + data.error);
        saveBtn.innerText = 'Save to Database';
        saveBtn.disabled = false;
      }
    } catch (e) {
      alert('Network error while saving.');
      saveBtn.innerText = 'Save to Database';
      saveBtn.disabled = false;
    }
  };

  console.log("Visual CMS Loaded Successfully");

})();
