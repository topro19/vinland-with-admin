(function() {
  if (window.__visualCMSReady) return;
  window.__visualCMSReady = true;

  // 1. Inject CSS for the top admin navigation bar, floating panel, and editing states
  const style = document.createElement('style');
  style.innerHTML = `
    /* Disable the cheese cursor globally in edit mode */
    .custom-cursor { display: none !important; }
    body, body * { cursor: auto; }
    
    body.cms-edit-mode-active {
      padding-top: 52px !important;
    }
    
    /* Reposition sticky navbars under the admin bar */
    body.cms-edit-mode-active nav.sticky,
    body.cms-edit-mode-active nav[class*="sticky"],
    body.cms-edit-mode-active header.sticky,
    body.cms-edit-mode-active header[class*="sticky"],
    body.cms-edit-mode-active .sticky {
      top: 52px !important;
    }
    
    /* Highlight editable elements only in EDIT mode */
    body.cms-mode-edit [data-cms-id] {
      outline: 2px dashed rgba(59, 130, 246, 0.6) !important;
      cursor: pointer !important;
      position: relative;
      transition: all 0.2s;
    }
    body.cms-mode-edit [data-cms-id]:hover {
      outline: 2px solid rgba(59, 130, 246, 1) !important;
      background: rgba(59, 130, 246, 0.08) !important;
    }
    body.cms-mode-edit .cms-active-element {
      outline: 3px solid rgba(16, 185, 129, 1) !important;
      background: rgba(16, 185, 129, 0.12) !important;
    }

    /* In NAVIGATE mode, hide outlines for clear preview */
    body.cms-mode-nav [data-cms-id] {
      outline: none !important;
      cursor: pointer;
    }
    
    /* Top Admin Navigation Bar */
    #cms-admin-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 52px;
      background: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
      z-index: 9999998;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f8fafc;
      box-sizing: border-box;
      gap: 12px;
    }

    .cms-bar-left, .cms-bar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cms-bar-left {
      flex: 1;
      overflow: hidden;
    }

    .cms-editor-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      color: #34d399;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .cms-live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      display: inline-block;
      animation: cmsPulse 2s infinite;
    }

    @keyframes cmsPulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
      100% { opacity: 1; transform: scale(1); }
    }

    .cms-bar-sep {
      height: 22px;
      width: 1px;
      background: rgba(255, 255, 255, 0.15);
      margin: 0 4px;
      flex-shrink: 0;
    }

    /* Page Navigation Tabs */
    .cms-page-tabs {
      display: flex;
      align-items: center;
      gap: 4px;
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 2px 0;
    }
    .cms-page-tabs::-webkit-scrollbar {
      display: none;
    }

    .cms-page-tab {
      padding: 5px 11px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
      border: 1px solid transparent;
    }
    .cms-page-tab:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .cms-page-tab.active {
      background: #059669;
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      border-color: rgba(52, 211, 153, 0.4);
    }
    .cms-page-tab.active::after {
      content: 'Editing';
      font-size: 9px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.25);
      padding: 1px 4px;
      border-radius: 3px;
      letter-spacing: 0.2px;
      text-transform: uppercase;
    }

    /* Interactive Mode Switcher */
    .cms-mode-switch {
      display: inline-flex;
      align-items: center;
      background: #1e293b;
      padding: 3px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }
    .cms-mode-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      background: transparent;
      color: #94a3b8;
    }
    .cms-mode-btn:hover {
      color: #ffffff;
    }
    .cms-mode-btn.active {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    /* Shortcut buttons */
    .cms-admin-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.15s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .cms-admin-link:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .cms-exit-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      background: #dc2626;
      color: #ffffff;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: background 0.15s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .cms-exit-btn:hover {
      background: #b91c1c;
    }
    
    /* Floating Right Side Editing Panel */
    #cms-panel {
      position: fixed;
      top: 52px;
      right: -450px;
      width: 400px;
      height: calc(100vh - 52px);
      background: #ffffff;
      box-shadow: -5px 0 25px rgba(0, 0, 0, 0.18);
      z-index: 9999999;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      font-family: ui-sans-serif, system-ui, sans-serif;
      box-sizing: border-box;
    }
    #cms-panel.open {
      right: 0;
    }
    #cms-header {
      background: #0f172a;
      color: white;
      padding: 18px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    #cms-header h2 { margin: 0; font-size: 16px; font-weight: 600; }
    #cms-close { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 24px; line-height: 1; padding: 0; transition: color 0.15s; }
    #cms-close:hover { color: white; }
    #cms-body { padding: 22px; flex: 1; overflow-y: auto; }
    #cms-footer { padding: 18px 22px; border-top: 1px solid #e2e8f0; background: #f8fafc; }
    
    .cms-form-group { margin-bottom: 18px; }
    .cms-form-group label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
    .cms-textarea { width: 100%; height: 220px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; color: #0f172a; resize: vertical; box-sizing: border-box; line-height: 1.5; }
    .cms-textarea:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18); }
    
    .cms-img-preview { width: 100%; height: 180px; object-fit: contain; border-radius: 6px; border: 1px solid #e2e8f0; background: #f1f5f9; margin-bottom: 12px; }
    .cms-file-input { display: block; width: 100%; font-size: 13px; color: #64748b; }
    
    .cms-btn { width: 100%; padding: 12px; background: #059669; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.25); }
    .cms-btn:hover { background: #047857; }
    .cms-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
    
    .cms-pill { display: inline-block; padding: 3px 8px; background: #e0e7ff; color: #3730a3; border-radius: 9999px; font-size: 11px; font-weight: 600; margin-bottom: 14px; }
  `;
  document.head.appendChild(style);

  // Set default body mode classes
  document.body.classList.add('cms-edit-mode-active');
  document.body.classList.add('cms-mode-edit');

  // 2. Determine current active page slug
  function getActiveSlug() {
    const p = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (!p || p === '2' || p === '2.html') return '2';
    return p.replace(/\.html$/, '');
  }

  const activeSlug = getActiveSlug();
  const pages = [
    { slug: '2', name: 'Home', path: '/2.html?edit_mode=true' },
    { slug: '3', name: 'Over Ons', path: '/3.html?edit_mode=true' },
    { slug: '4', name: 'Kaas', path: '/4.html?edit_mode=true' },
    { slug: '5', name: 'Zuivel', path: '/5.html?edit_mode=true' },
    { slug: '6', name: 'IJs', path: '/6.html?edit_mode=true' },
    { slug: '7', name: 'Vlees', path: '/7.html?edit_mode=true' },
    { slug: '8', name: 'Verkooppunten', path: '/8.html?edit_mode=true' },
    { slug: '9', name: 'Contact', path: '/9.html?edit_mode=true' }
  ];

  const pageTabsHtml = pages.map(p => {
    const isActive = p.slug === activeSlug;
    return `<a href="${p.path}" class="cms-page-tab ${isActive ? 'active' : ''}">${p.name}</a>`;
  }).join('');

  // 3. Inject Top Admin Navigation Bar
  const adminBar = document.createElement('div');
  adminBar.id = 'cms-admin-bar';
  adminBar.innerHTML = `
    <div class="cms-bar-left">
      <div class="cms-editor-badge" title="Visual In-line Editing Active">
        <span class="cms-live-dot"></span>
        Visual CMS
      </div>
      <div class="cms-bar-sep"></div>
      <div class="cms-page-tabs" title="Switch page to edit">
        ${pageTabsHtml}
      </div>
    </div>
    <div class="cms-bar-right">
      <div class="cms-mode-switch" title="Toggle between clicking to edit elements vs clicking to navigate">
        <button type="button" id="cms-mode-edit-btn" class="cms-mode-btn active">✏️ Edit Mode</button>
        <button type="button" id="cms-mode-nav-btn" class="cms-mode-btn">🧭 Navigate Site</button>
      </div>
      <div class="cms-bar-sep"></div>
      <a href="/admin" target="_blank" class="cms-admin-link" title="Open Admin CMS Dashboard">📊 Dashboard</a>
      <a href="/admin/media" target="_blank" class="cms-admin-link" title="Open Media Library">🖼️ Media</a>
      <button type="button" id="cms-exit-btn" class="cms-exit-btn" title="Exit visual editor and return to public website">Exit &times;</button>
    </div>
  `;
  document.body.prepend(adminBar);

  // 4. Inject Right Editing Panel HTML into DOM
  const panel = document.createElement('div');
  panel.id = 'cms-panel';
  panel.innerHTML = `
    <div id="cms-header">
      <h2>Element Editor</h2>
      <button id="cms-close" title="Close panel">&times;</button>
    </div>
    <div id="cms-body">
      <div id="cms-empty-state" style="text-align: center; color: #64748b; margin-top: 80px;">
        <svg style="width: 44px; height: 44px; margin: 0 auto 14px; opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
        <p style="font-size: 14px; margin: 0 0 6px 0; font-weight: 600; color: #334155;">Select an element</p>
        <p style="font-size: 12px; margin: 0;">Click any highlighted text or image on the page to edit it here.</p>
      </div>
      <div id="cms-editor-content" style="display: none;"></div>
    </div>
    <div id="cms-footer" style="display: none;">
      <button id="cms-save-btn" class="cms-btn">Save to Database</button>
    </div>
  `;
  document.body.appendChild(panel);

  // 5. State Management
  let activeElement = null;
  let activeType = 'text'; // 'text' | 'image'
  let pendingFile = null;
  let editorMode = 'edit'; // 'edit' | 'navigate'

  // DOM Elements mapping
  const closeBtn = document.getElementById('cms-close');
  const emptyState = document.getElementById('cms-empty-state');
  const editorContent = document.getElementById('cms-editor-content');
  const footer = document.getElementById('cms-footer');
  const saveBtn = document.getElementById('cms-save-btn');
  const editModeBtn = document.getElementById('cms-mode-edit-btn');
  const navModeBtn = document.getElementById('cms-mode-nav-btn');
  const exitBtn = document.getElementById('cms-exit-btn');

  // Mode Switch Handlers
  editModeBtn.onclick = () => {
    editorMode = 'edit';
    editModeBtn.classList.add('active');
    navModeBtn.classList.remove('active');
    document.body.classList.add('cms-mode-edit');
    document.body.classList.remove('cms-mode-nav');
  };

  navModeBtn.onclick = () => {
    editorMode = 'navigate';
    navModeBtn.classList.add('active');
    editModeBtn.classList.remove('active');
    document.body.classList.add('cms-mode-nav');
    document.body.classList.remove('cms-mode-edit');
    // Close active panel if open
    panel.classList.remove('open');
    if (activeElement) activeElement.classList.remove('cms-active-element');
    activeElement = null;
  };

  // Exit button handler
  exitBtn.onclick = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('edit_mode');
    window.location.href = url.toString();
  };

  // Close panel handler
  closeBtn.onclick = () => {
    panel.classList.remove('open');
    if (activeElement) activeElement.classList.remove('cms-active-element');
    activeElement = null;
  };

  // 6. Global Click Interceptor (Capture Phase)
  document.addEventListener('click', (e) => {
    // 1. Ignore any click inside the CMS panel or the top admin navigation bar
    if (e.target.closest('#cms-panel') || e.target.closest('#cms-admin-bar')) {
      return;
    }

    // 2. In NAVIGATE mode: let user browse the site normally with edit_mode preserved
    if (editorMode === 'navigate') {
      const link = e.target.closest('a');
      if (link && link.href) {
        e.preventDefault();
        try {
          const u = new URL(link.href, window.location.origin);
          if (u.origin === window.location.origin) {
            u.searchParams.set('edit_mode', 'true');
            window.location.href = u.toString();
          } else {
            window.location.href = link.href;
          }
        } catch {
          window.location.href = link.href;
        }
      }
      return;
    }

    // 3. In EDIT mode: Allow modifier key (Cmd/Ctrl/Alt) click on links to navigate
    if (e.metaKey || e.ctrlKey || e.altKey) {
      const link = e.target.closest('a');
      if (link && link.href) {
        e.preventDefault();
        const u = new URL(link.href, window.location.origin);
        if (u.origin === window.location.origin) {
          u.searchParams.set('edit_mode', 'true');
          window.location.href = u.toString();
        } else {
          window.location.href = link.href;
        }
        return;
      }
    }

    // 4. In EDIT mode: Check if clicked element has data-cms-id
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
      // If clicking a normal link (without data-cms-id), append edit_mode=true and allow navigation
      const link = e.target.closest('a');
      if (link && link.href) {
        e.preventDefault();
        try {
          const url = new URL(link.href, window.location.origin);
          if (url.origin === window.location.origin) {
            url.searchParams.set('edit_mode', 'true');
            window.location.href = url.toString();
          } else {
            window.location.href = link.href;
          }
        } catch {
          window.location.href = link.href;
        }
      }
    }
  }, true);

  // 7. Populate Editor UI based on element type
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
    activeType = isImage ? 'image' : 'text';

    if (isImage) {
      editorContent.innerHTML = `
        <span class="cms-pill">Image ID: ${cmsId}</span>
        <div class="cms-form-group">
          <label>Upload Replacement Image</label>
          <img src="${el.src}" class="cms-img-preview" id="cms-img-preview" />
          <input type="file" accept="image/*" class="cms-file-input" id="cms-file-input" />
        </div>
        <div class="cms-form-group" style="margin-top: 14px;">
          <label>Or Image URL</label>
          <input type="text" class="cms-textarea" id="cms-img-url-input" style="height: 42px; font-family: monospace; font-size: 13px;" placeholder="https://... or /images/..." />
        </div>
      `;
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
    } else {
      // Text content
      const content = el.innerText || el.textContent || '';
      editorContent.innerHTML = `
        <span class="cms-pill">Text ID: ${cmsId}</span>
        <div class="cms-form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="margin: 0;">Content</label>
            <span style="font-size: 11px; color: #64748b;">Supports text & line breaks</span>
          </div>
          <textarea class="cms-textarea" id="cms-textarea-input"></textarea>
        </div>
      `;
      const textarea = document.getElementById('cms-textarea-input');
      textarea.value = content.trim();

      // Live DOM update on type
      textarea.oninput = (e) => {
        el.innerHTML = e.target.value.replace(/\n/g, '<br>');
      };
    }
  }

  // 8. Save handler (POST to API)
  saveBtn.onclick = async () => {
    if (!activeElement) return;
    
    saveBtn.innerText = 'Saving...';
    saveBtn.disabled = true;

    const cmsId = activeElement.getAttribute('data-cms-id');
    const formData = new FormData();

    if (activeType === 'image') {
      if (pendingFile) {
        formData.append(`image_${cmsId}`, pendingFile);
      } else {
        const urlVal = document.getElementById('cms-img-url-input')?.value;
        if (urlVal) {
          formData.append('texts', JSON.stringify({ [cmsId]: urlVal.trim() }));
        } else {
          saveBtn.innerText = 'Save to Database';
          saveBtn.disabled = false;
          return;
        }
      }
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
        saveBtn.innerText = 'Saved Successfully!';
        saveBtn.style.background = '#059669';
        setTimeout(() => {
          saveBtn.innerText = 'Save to Database';
          saveBtn.style.background = '';
          saveBtn.disabled = false;
        }, 2000);
      } else {
        alert('Error saving: ' + (data.error || 'Server error'));
        saveBtn.innerText = 'Save to Database';
        saveBtn.disabled = false;
      }
    } catch {
      alert('Network error while saving. Please check your connection.');
      saveBtn.innerText = 'Save to Database';
      saveBtn.disabled = false;
    }
  };

  console.log('Visual CMS Loaded with Admin Navigation Bar');
})();
