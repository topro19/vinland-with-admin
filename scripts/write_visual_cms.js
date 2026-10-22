const fs = require('fs');

const visualCmsCode = `(function() {
  if (window.__visualCMSReady) return;
  window.__visualCMSReady = true;

  // 1. Inject CSS for the top admin navigation bar, floating panel, editing states, dynamic cards, and modal
  const style = document.createElement('style');
  style.innerHTML = \`
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
    
    /* Hide editor-only elements in NAVIGATE mode */
    body.cms-mode-nav .cms-card-delete-btn,
    body.cms-mode-nav .cms-add-card-slot,
    body.cms-mode-nav .cms-header-add-btn {
      display: none !important;
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
      scrollbar-width: none;
      padding: 2px 0;
    }
    .cms-page-tabs::-webkit-scrollbar { display: none; }

    .cms-page-tab {
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.15s ease;
      border: 1px solid transparent;
    }
    .cms-page-tab:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }
    .cms-page-tab.active {
      color: #ffffff;
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
      font-weight: 600;
    }

    /* Mode Switcher Buttons */
    .cms-mode-switch {
      display: inline-flex;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 2px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      flex-shrink: 0;
    }

    .cms-mode-btn {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      border: none;
      background: transparent;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .cms-mode-btn.active {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    /* Top Save Button */
    .cms-top-save-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #059669;
      color: #ffffff;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);
    }
    .cms-top-save-btn:hover {
      background: #047857;
      transform: translateY(-1px);
    }
    .cms-top-save-btn.has-changes {
      background: #d97706;
      box-shadow: 0 0 12px rgba(217, 119, 6, 0.5);
      animation: cmsPulseAmber 1.8s infinite;
    }
    @keyframes cmsPulseAmber {
      0%, 100% { box-shadow: 0 0 8px rgba(217, 119, 6, 0.6); }
      50% { box-shadow: 0 0 16px rgba(245, 158, 11, 0.9); }
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

    /* Delete Card Button */
    .cms-card-delete-btn {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 35;
      width: 30px;
      height: 30px;
      border-radius: 9999px;
      background: #ef4444;
      color: #ffffff;
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.22);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0.9;
    }
    .cms-card-delete-btn:hover {
      background: #dc2626;
      transform: scale(1.15);
      opacity: 1;
      box-shadow: 0 6px 14px rgba(220, 38, 38, 0.45);
    }

    /* Dashed Add Card Slot in Grids */
    .cms-add-card-slot {
      border: 2px dashed rgba(16, 185, 129, 0.5);
      background: rgba(16, 185, 129, 0.04);
      border-radius: 12px;
      min-height: 260px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 24px;
      text-align: center;
      box-sizing: border-box;
      user-select: none;
    }
    .cms-add-card-slot:hover {
      border-color: #059669;
      background: rgba(16, 185, 129, 0.09);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(5, 150, 105, 0.15);
    }
    .cms-add-card-circle {
      width: 46px;
      height: 46px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      color: #047857;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      transition: all 0.2s ease;
    }
    .cms-add-card-slot:hover .cms-add-card-circle {
      transform: scale(1.12) rotate(90deg);
      background: #059669;
      color: #ffffff;
    }
    .cms-add-card-title {
      font-size: 13px;
      font-weight: 700;
      color: #065f46;
      margin-bottom: 3px;
    }
    .cms-add-card-sub {
      font-size: 11px;
      color: #047857;
      opacity: 0.8;
    }

    /* Section Header Add Button */
    .cms-header-add-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #047857;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      margin-left: 8px;
    }
    .cms-header-add-btn:hover {
      background: #059669;
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(5, 150, 105, 0.25);
    }

    /* Modal for Deleting Cards */
    #cms-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(3px);
      z-index: 10000000;
      display: none;
      align-items: center;
      justify-content: center;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #cms-modal-box {
      background: #ffffff;
      border-radius: 14px;
      width: 90%;
      max-width: 420px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      padding: 24px;
      box-sizing: border-box;
      transform: scale(0.95);
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #cms-modal-backdrop.open {
      display: flex;
    }
    #cms-modal-backdrop.open #cms-modal-box {
      transform: scale(1);
      opacity: 1;
    }

    /* Newly added card animation */
    @keyframes cmsCardSpawn {
      0% { opacity: 0; transform: scale(0.9) translateY(12px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .cms-card-spawning {
      animation: cmsCardSpawn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      outline: 3px solid #10b981 !important;
    }
  \`;
  document.head.appendChild(style);

  // Set default body mode classes
  document.body.classList.add('cms-edit-mode-active');
  document.body.classList.add('cms-mode-edit');

  // 2. Determine current active page slug
  function getActiveSlug() {
    const p = window.location.pathname.replace(/^\\/+|\\/+$/g, '');
    if (!p || p === '2' || p === '2.html') return '2';
    return p.replace(/\\.html$/, '');
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
    return \`<a href="\${p.path}" class="cms-page-tab \${isActive ? 'active' : ''}">\${p.name}</a>\`;
  }).join('');

  // 3. Inject Top Admin Navigation Bar
  const adminBar = document.createElement('div');
  adminBar.id = 'cms-admin-bar';
  adminBar.innerHTML = \`
    <div class="cms-bar-left">
      <div class="cms-editor-badge" title="Visual In-line Editing Active">
        <span class="cms-live-dot"></span>
        Visual CMS
      </div>
      <div class="cms-bar-sep"></div>
      <div class="cms-page-tabs" title="Switch page to edit">
        \${pageTabsHtml}
      </div>
    </div>
    <div class="cms-bar-right">
      <div class="cms-mode-switch" title="Toggle between clicking to edit elements vs clicking to navigate">
        <button type="button" id="cms-mode-edit-btn" class="cms-mode-btn active">✏️ Edit Mode</button>
        <button type="button" id="cms-mode-nav-btn" class="cms-mode-btn">🧭 Navigate Site</button>
      </div>
      <button type="button" id="cms-top-save-btn" class="cms-top-save-btn" title="Opslaan naar database en live website">💾 Opslaan</button>
      <div class="cms-bar-sep"></div>
      <a href="/admin" target="_blank" class="cms-admin-link" title="Open Admin CMS Dashboard">📊 Dashboard</a>
      <a href="/admin/media" target="_blank" class="cms-admin-link" title="Open Media Library">🖼️ Media</a>
      <button type="button" id="cms-exit-btn" class="cms-exit-btn" title="Exit visual editor and return to public website">Exit &times;</button>
    </div>
  \`;
  document.body.prepend(adminBar);

  // 4. Inject Right Editing Panel HTML into DOM
  const panel = document.createElement('div');
  panel.id = 'cms-panel';
  panel.innerHTML = \`
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
  \`;
  document.body.appendChild(panel);

  // 5. Inject Confirmation Modal
  const modalBackdrop = document.createElement('div');
  modalBackdrop.id = 'cms-modal-backdrop';
  modalBackdrop.innerHTML = \`
    <div id="cms-modal-box">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
        <div style="width: 38px; height: 38px; border-radius: 9999px; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #0f172a;">Product Verwijderen</h3>
          <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">Weet u zeker dat u dit product wilt verwijderen?</p>
        </div>
      </div>
      <p id="cms-modal-card-name" style="font-size: 13px; font-weight: 600; color: #334155; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 8px; margin: 0 0 18px 0;"></p>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <button type="button" id="cms-modal-cancel" style="padding: 8px 16px; border: 1px solid #cbd5e1; background: white; color: #475569; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Annuleren</button>
        <button type="button" id="cms-modal-confirm" style="padding: 8px 16px; border: none; background: #dc2626; color: white; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">Ja, Verwijderen</button>
      </div>
    </div>
  \`;
  document.body.appendChild(modalBackdrop);

  // 6. State Management
  let activeElement = null;
  let activeType = 'text'; // 'text' | 'image'
  let pendingFile = null;
  let editorMode = 'edit'; // 'edit' | 'navigate'
  const dirtyGrids = new Set();
  let hasPendingChanges = false;

  // DOM Elements mapping
  const closeBtn = document.getElementById('cms-close');
  const emptyState = document.getElementById('cms-empty-state');
  const editorContent = document.getElementById('cms-editor-content');
  const footer = document.getElementById('cms-footer');
  const saveBtn = document.getElementById('cms-save-btn');
  const topSaveBtn = document.getElementById('cms-top-save-btn');
  const editModeBtn = document.getElementById('cms-mode-edit-btn');
  const navModeBtn = document.getElementById('cms-mode-nav-btn');
  const exitBtn = document.getElementById('cms-exit-btn');
  const modalCancel = document.getElementById('cms-modal-cancel');
  const modalConfirm = document.getElementById('cms-modal-confirm');
  const modalCardName = document.getElementById('cms-modal-card-name');
  let pendingDeleteAction = null;

  function markChangesPending(gridId) {
    if (gridId) dirtyGrids.add(gridId);
    hasPendingChanges = true;
    topSaveBtn.classList.add('has-changes');
    topSaveBtn.innerText = '💾 Opslaan (1*)';
  }

  function markChangesClean() {
    dirtyGrids.clear();
    hasPendingChanges = false;
    topSaveBtn.classList.remove('has-changes');
    topSaveBtn.innerText = '✓ Alles Opgeslagen';
    setTimeout(() => {
      topSaveBtn.innerText = '💾 Opslaan';
    }, 2500);
  }

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

  exitBtn.onclick = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('edit_mode');
    window.location.href = url.toString();
  };

  closeBtn.onclick = () => {
    panel.classList.remove('open');
    if (activeElement) activeElement.classList.remove('cms-active-element');
    activeElement = null;
  };

  // Modal Handlers
  modalCancel.onclick = () => {
    modalBackdrop.classList.remove('open');
    pendingDeleteAction = null;
  };
  modalConfirm.onclick = () => {
    if (pendingDeleteAction) {
      pendingDeleteAction();
    }
    modalBackdrop.classList.remove('open');
    pendingDeleteAction = null;
  };

  // 7. Preset Farm Media Library for 1-click photo selection
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

  // 8. Dynamic Product Card Templates
  function generateCardMarkup(gridId, uid) {
    if (gridId === 'kaas-bolletjes') {
      return \`
        <div data-cms-card="true" class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between border border-surface-variant/20 relative">
          <div class="h-48 overflow-hidden relative bg-surface-container">
            <img src="/images/placeholder-cheeseball.svg" alt="Nieuw Kaasbolletje" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-cms-id="\${uid}-img">
            <span class="absolute top-2 right-2 text-[10px] bg-secondary-container/90 text-on-secondary-container px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="\${uid}-badge">Ca. 900g</span>
          </div>
          <div class="p-md text-center flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-headline-md text-headline-md text-heading-green" data-cms-id="\${uid}-title">Nieuw Kaasbolletje</h3>
              <p class="text-xs text-on-surface-variant mt-1.5" data-cms-id="\${uid}-desc">Handzaam boerenkruidenkaasje van ca. 900 gram — heerlijk voor op de borrelplank</p>
            </div>
            <div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="px-sm py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm rounded-full" data-cms-id="\${uid}-tag">900g Bolletje</span>
            </div>
          </div>
        </div>
      \`;
    }

    if (gridId.startsWith('kaas-')) {
      return \`
        <div data-cms-card="true" class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between border border-surface-variant/20 relative">
          <div class="h-48 overflow-hidden relative bg-surface-container">
            <img src="/images/placeholder-cheese.svg" alt="Nieuwe Boerenkaas" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-cms-id="\${uid}-img">
            <span class="absolute top-2 right-2 text-[10px] bg-secondary-container/90 text-on-secondary-container px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="\${uid}-badge">Nieuw</span>
          </div>
          <div class="p-md text-center flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-headline-md text-headline-md text-heading-green" data-cms-id="\${uid}-title">Nieuwe Kaassoort</h3>
              <p class="text-xs text-on-surface-variant mt-1.5" data-cms-id="\${uid}-desc">Ambachtelijk bereid van dagverse rauwe weidemelk — vol en romig van smaak</p>
            </div>
            <div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="px-sm py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm rounded-full" data-cms-id="\${uid}-tag">Boerenkaas</span>
            </div>
          </div>
        </div>
      \`;
    }

    if (gridId.startsWith('zuivel-')) {
      return \`
        <div data-cms-card="true" class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between border border-surface-variant/20 relative">
          <div class="h-48 overflow-hidden relative bg-surface-container">
            <img src="/images/placeholder-dairy.svg" alt="Nieuw Zuivelproduct" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-cms-id="\${uid}-img">
            <span class="absolute top-2 right-2 text-[10px] bg-secondary-container/90 text-on-secondary-container px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="\${uid}-badge">Dagvers</span>
          </div>
          <div class="p-md text-center flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-headline-md text-headline-md text-heading-green" data-cms-id="\${uid}-title">Nieuw Zuivelproduct</h3>
              <p class="text-xs text-on-surface-variant mt-1.5" data-cms-id="\${uid}-desc">Traditioneel bereid van dagverse boerderijmelk (1L fles of beker)</p>
            </div>
            <div class="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="px-sm py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm rounded-full" data-cms-id="\${uid}-tag">Dagvers</span>
            </div>
          </div>
        </div>
      \`;
    }

    if (gridId.startsWith('ijs-')) {
      return \`
        <div data-cms-card="true" class="ice-cream-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between border border-surface-variant/20 relative">
          <div class="h-48 overflow-hidden relative bg-surface-container">
            <img src="./images/img_026.jpg" alt="Nieuwe IJssmaak" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-cms-id="\${uid}-img">
            <span class="absolute top-2 right-2 text-[10px] bg-secondary-container/90 text-on-secondary-container px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="\${uid}-badge">Nieuw</span>
          </div>
          <div class="p-md text-center flex-grow flex flex-col justify-between">
            <div>
              <h3 class="font-headline-md text-headline-md text-heading-green" data-cms-id="\${uid}-title">Nieuwe IJssmaak</h3>
              <p class="text-xs text-on-surface-variant mt-1.5" data-cms-id="\${uid}-desc">Ambachtelijk bereid met verse volle melk, slagroom en natuurlijke ingrediënten</p>
            </div>
            <div class="mt-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="px-sm py-1 bg-secondary-fixed text-on-secondary-fixed text-label-sm rounded-full" data-cms-id="\${uid}-tag">Proef de boerderij</span>
            </div>
          </div>
        </div>
      \`;
    }

    if (gridId === 'vlees-bewerkt') {
      return \`
        <div data-cms-card="true" class="group bg-white rounded-xl overflow-hidden border border-surface-variant hover:border-primary transition-all duration-300 shadow-sm relative">
          <div class="aspect-square bg-surface-container overflow-hidden relative">
            <img src="./images/img_031.jpg" alt="Nieuwe Vleesspecialiteit" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="\${uid}-img">
            <span class="absolute top-2 right-2 text-[10px] bg-primary/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="\${uid}-badge">Nieuw</span>
          </div>
          <div class="p-md text-center">
            <h4 class="font-label-lg text-label-lg uppercase tracking-wider text-heading-green font-bold" data-cms-id="\${uid}-title">Nieuwe Specialiteit</h4>
            <p class="text-xs text-on-surface-variant mt-1" data-cms-id="\${uid}-desc">Ambachtelijk gekruid van eigen rundvlees</p>
          </div>
        </div>
      \`;
    }

    // Default meat cut
    return \`
      <div data-cms-card="true" class="group bg-white rounded-xl overflow-hidden border border-surface-variant hover:border-primary transition-all duration-300 hover:shadow-md flex flex-col justify-between relative">
        <div class="aspect-square bg-surface-container overflow-hidden relative group/img">
          <img src="/images/placeholder-meat.svg" alt="Nieuwe Snede" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-cms-id="\${uid}-img">
          <span class="absolute top-2 right-2 text-[10px] bg-amber-600/90 text-white px-2 py-0.5 rounded font-medium shadow-sm" data-cms-id="\${uid}-badge">Nieuw</span>
        </div>
        <div class="p-sm text-center bg-white border-t border-surface-variant/20 flex-grow flex flex-col justify-between">
          <div>
            <h4 class="font-label-lg text-label-lg text-heading-green uppercase tracking-wider" data-cms-id="\${uid}-title">Nieuwe Snede</h4>
            <p class="text-[11px] text-on-surface-variant mt-0.5" data-cms-id="\${uid}-desc">Puur rundvlees van eigen weiderunderen</p>
          </div>
        </div>
      </div>
    \`;
  }

  // Helper to attach Delete button to a card
  function attachDeleteButtonToCard(card, grid, gridId) {
    if (card.querySelector('.cms-card-delete-btn')) return;

    // Ensure parent is relative
    if (!card.style.position || card.style.position === 'static') {
      card.classList.add('relative');
    }

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'cms-card-delete-btn';
    delBtn.title = 'Verwijder dit product uit de catalogus';
    delBtn.innerHTML = \`
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    \`;

    delBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Find product name
      const titleEl = card.querySelector('h3, h4, [data-cms-id*="title"], [data-cms-id*="h3"], [data-cms-id*="h4"]');
      const titleText = titleEl ? titleEl.innerText.trim() : 'dit product';

      modalCardName.innerText = \`Product: "\${titleText}"\`;
      modalBackdrop.classList.add('open');

      pendingDeleteAction = () => {
        card.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'scale(0.85)';
        card.style.opacity = '0';
        setTimeout(() => {
          card.remove();
          updateCategoryCount(grid);
          markChangesPending(gridId);
        }, 250);
      };
    };

    card.appendChild(delBtn);
  }

  // Update category count badge in section header if present
  function updateCategoryCount(grid) {
    const parentSection = grid.closest('div') ? grid.closest('div').parentElement : null;
    const header = (parentSection ? parentSection.querySelector('.flex.items-center.justify-between') : null) || grid.previousElementSibling;
    if (header) {
      const badge = header.querySelector('span[class*="rounded-full"], span[class*="text-xs"]');
      if (badge) {
        const count = grid.querySelectorAll('[data-cms-card="true"], .product-card, .ice-cream-card').length;
        if (badge.innerText.includes('variëteit') || badge.innerText.includes('product') || badge.innerText.includes('snede')) {
          const suffix = badge.innerText.includes('variëteit') ? 'variëteiten' : (badge.innerText.includes('product') ? 'producten' : 'sneden');
          badge.innerText = \`\${count} \${suffix}\`;
        }
      }
    }
  }

  // 9. Initialize All Product Catalogue Grids
  function initCatalogGrids() {
    const grids = document.querySelectorAll('[data-cms-catalog-grid]');
    grids.forEach(grid => {
      const gridId = grid.getAttribute('data-cms-catalog-grid');

      // 1. Tag existing cards and attach delete buttons
      const cards = Array.from(grid.children).filter(child => !child.classList.contains('cms-add-card-slot'));
      cards.forEach(card => {
        card.setAttribute('data-cms-card', 'true');
        attachDeleteButtonToCard(card, grid, gridId);
      });

      // 2. Append Dashed Add Card Slot if not already present
      if (!grid.querySelector('.cms-add-card-slot')) {
        const addSlot = document.createElement('div');
        addSlot.className = 'cms-add-card-slot';
        addSlot.title = 'Klik om een nieuw product toe te voegen';
        addSlot.innerHTML = \`
          <div class="cms-add-card-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span class="cms-add-card-title">+ Nieuw product toevoegen</span>
          <span class="cms-add-card-sub">Klik om een kaart toe te voegen</span>
        \`;

        addSlot.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          addNewProductToGrid(grid, gridId, addSlot);
        };

        grid.appendChild(addSlot);
      }

      // 3. Add Header Button if section header is found
      const prevEl = grid.previousElementSibling;
      const headerContainer = (prevEl && prevEl.classList.contains('flex') && prevEl.classList.contains('justify-between'))
        ? prevEl
        : (grid.parentElement ? grid.parentElement.querySelector('.flex.items-center.justify-between') : null);

      if (headerContainer && !headerContainer.querySelector('.cms-header-add-btn')) {
        const headerBtn = document.createElement('button');
        headerBtn.type = 'button';
        headerBtn.className = 'cms-header-add-btn';
        headerBtn.title = 'Voeg een product toe aan deze categorie';
        headerBtn.innerHTML = \`
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Product toevoegen
        \`;
        headerBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const slot = grid.querySelector('.cms-add-card-slot');
          addNewProductToGrid(grid, gridId, slot);
        };
        headerContainer.appendChild(headerBtn);
      }
    });
  }

  // Function to create and insert a new card
  function addNewProductToGrid(grid, gridId, addSlot) {
    const uid = 'custom-' + activeSlug + '-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    const cardHtml = generateCardMarkup(gridId, uid);
    
    // Parse to element
    const temp = document.createElement('div');
    temp.innerHTML = cardHtml.trim();
    const newCard = temp.firstElementChild;
    newCard.classList.add('cms-card-spawning');

    // Attach delete button
    attachDeleteButtonToCard(newCard, grid, gridId);

    // Insert before the dashed slot
    if (addSlot && addSlot.parentElement === grid) {
      grid.insertBefore(newCard, addSlot);
    } else {
      grid.appendChild(newCard);
    }

    // Scroll into view gently
    setTimeout(() => {
      newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        newCard.classList.remove('cms-card-spawning');
      }, 1000);
    }, 50);

    updateCategoryCount(grid);
    markChangesPending(gridId);
  }

  // 10. Clean Grid HTML Generator for Saving
  function getCleanGridHtml(grid) {
    const clone = grid.cloneNode(true);
    // Remove CMS editor artifacts
    clone.querySelectorAll('.cms-card-delete-btn').forEach(btn => btn.remove());
    clone.querySelectorAll('.cms-add-card-slot').forEach(slot => slot.remove());
    clone.querySelectorAll('.cms-card-spawning').forEach(c => c.classList.remove('cms-card-spawning'));
    clone.querySelectorAll('.cms-active-element').forEach(c => c.classList.remove('cms-active-element'));
    return clone.innerHTML.trim();
  }

  // 11. Save All Pending Changes (Grids and Elements)
  async function saveAllChanges() {
    topSaveBtn.innerText = 'Opslaan...';
    topSaveBtn.disabled = true;

    const formData = new FormData();
    formData.append('pageSlug', activeSlug);

    // Collect all grids on this page
    const gridsPayload = {};
    const allGrids = document.querySelectorAll('[data-cms-catalog-grid]');
    allGrids.forEach(grid => {
      const gid = grid.getAttribute('data-cms-catalog-grid');
      gridsPayload[gid] = getCleanGridHtml(grid);
    });
    formData.append('grids', JSON.stringify(gridsPayload));

    // Also collect active element edit if pending in sidebar
    if (activeElement) {
      const isImg = activeType === 'image';
      const childImg = activeElement.querySelector ? activeElement.querySelector('img') : null;
      const targetNode = (isImg && activeElement.tagName.toLowerCase() !== 'img' && childImg) ? childImg : activeElement;
      const cmsId = targetNode.getAttribute('data-cms-id') || activeElement.getAttribute('data-cms-id');

      if (cmsId) {
        if (activeType === 'image') {
          if (pendingFile) {
            formData.append(\`image_\${cmsId}\`, pendingFile);
          } else {
            const urlVal = document.getElementById('cms-img-url-input')?.value;
            if (urlVal) {
              formData.append('texts', JSON.stringify({ [cmsId]: urlVal.trim() }));
            }
          }
        } else if (activeType === 'text') {
          const textInput = document.getElementById('cms-textarea-input');
          if (textInput) {
            formData.append('texts', JSON.stringify({ [cmsId]: textInput.value }));
          }
        }
      }
    }

    try {
      const res = await fetch('/api/admin/save-inline', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        markChangesClean();
        if (saveBtn) {
          saveBtn.innerText = 'Saved Successfully!';
          saveBtn.style.background = '#059669';
          setTimeout(() => {
            saveBtn.innerText = 'Save to Database';
            saveBtn.style.background = '';
            saveBtn.disabled = false;
          }, 2000);
        }
      } else {
        alert('Fout bij opslaan: ' + (data.error || 'Server error'));
        topSaveBtn.innerText = '💾 Opslaan (Opnieuw)';
        topSaveBtn.disabled = false;
      }
    } catch {
      alert('Netwerkfout bij opslaan. Controleer de verbinding.');
      topSaveBtn.innerText = '💾 Opslaan (Opnieuw)';
      topSaveBtn.disabled = false;
    }
  }

  topSaveBtn.onclick = saveAllChanges;
  saveBtn.onclick = saveAllChanges;

  // 12. Global Click Interceptor (Capture Phase)
  document.addEventListener('click', (e) => {
    // 1. Ignore clicks inside CMS panels, modals, delete buttons, add cards, or top admin bar
    if (
      e.target.closest('#cms-panel') ||
      e.target.closest('#cms-admin-bar') ||
      e.target.closest('#cms-modal-backdrop') ||
      e.target.closest('.cms-card-delete-btn') ||
      e.target.closest('.cms-add-card-slot') ||
      e.target.closest('.cms-header-add-btn')
    ) {
      return;
    }

    // 2. In NAVIGATE mode: let user browse normally with edit_mode preserved
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
      // Normal links in edit mode
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

  // 13. Populate Editor UI based on element type
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
    const cmsId = targetImg.getAttribute('data-cms-id') || el.getAttribute('data-cms-id');

    if (isImage) {
      const currentSrc = targetImg.getAttribute('src') || targetImg.src || '';
      
      const presetHtml = farmMediaPresets.map((p) => \`
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
        const card = targetImg.closest('.group') || targetImg.closest('[data-cms-card="true"]') || targetImg.parentElement;
        if (card) {
          const badge = card.querySelector('[data-cms-id*="span"], [data-cms-id*="badge"]');
          if (badge && (badge.innerText.toLowerCase().includes('ontbreekt') || badge.innerText.toLowerCase().includes('nieuw'))) {
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
          markChangesPending();
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
          markChangesPending();
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
            markChangesPending();
          }
        };
      });
    } else {
      // Text content
      const content = el.innerText || el.textContent || '';
      editorContent.innerHTML = \`
        <span class="cms-pill">Text ID: \${cmsId}</span>
        <div class="cms-form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="margin: 0;">Content</label>
            <span style="font-size: 11px; color: #64748b;">Supports text & line breaks</span>
          </div>
          <textarea class="cms-textarea" id="cms-textarea-input"></textarea>
        </div>
      \`;
      const textarea = document.getElementById('cms-textarea-input');
      textarea.value = content.trim();

      // Live DOM update on type
      textarea.oninput = (e) => {
        el.innerHTML = e.target.value.replace(/\\n/g, '<br>');
        markChangesPending();
      };
    }
  }

  // 14. Initialize catalog grids now
  initCatalogGrids();

  console.log('Visual CMS Loaded with Dynamic Catalogue Quantity Controls (+ Add & Delete)');
})();
`;

fs.writeFileSync('public/visual-cms.js', visualCmsCode, 'utf8');
console.log('Successfully updated public/visual-cms.js');
