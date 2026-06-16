/**
 * Sakria Results Gallery Module
 * Stores and displays client transformation results (photos/videos)
 * grouped by health issue category. Add results from the individual
 * client profile in the Client Leads workspace.
 */

const Results = {
  activeFilter: "All",

  ALL_CATEGORIES: [
    "All",
    "Thyroid",
    "Weight Loss",
    "Knee Pains",
    "Diabetes",
    "Hypertension",
    "Skin Issues",
    "PCOS",
    "Cholesterol",
    "Joint Pain",
    "Indigestion",
    "Muscle Gain",
    "Others"
  ],

  render() {
    const results = Store.getResults();
    const clients = Store.getClients();

    // Filter by active category
    const filtered = this.activeFilter === "All"
      ? results
      : results.filter(r => r.category === this.activeFilter);

    // Sort newest first
    filtered.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

    // Build category filter pills
    const categoryTabs = this.ALL_CATEGORIES.map(cat => {
      const count = cat === "All" ? results.length : results.filter(r => r.category === cat).length;
      const isActive = this.activeFilter === cat;
      return `
        <button onclick="Results.setFilter('${cat}')" style="
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid ${isActive ? 'var(--primary-color)' : 'var(--border-color)'};
          background: ${isActive ? 'var(--primary-color)' : 'white'};
          color: ${isActive ? 'white' : 'var(--text-secondary)'};
          font-size: 12px;
          font-weight: ${isActive ? '700' : '500'};
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        ">
          ${cat}
          ${count > 0 ? `<span style="background:${isActive ? 'rgba(255,255,255,0.3)' : 'var(--primary-light)'}; color:${isActive ? 'white' : 'var(--primary-dark)'}; border-radius:10px; padding:1px 6px; font-size:10px; font-weight:700;">${count}</span>` : ''}
        </button>
      `;
    }).join('');

    // Build results grid
    const resultsGrid = filtered.length === 0
      ? `<div style="grid-column: 1/-1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 80px 20px; color: var(--text-secondary);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
            <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"></path>
          </svg>
          <h3 style="font-size: 17px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">No Results Yet${this.activeFilter !== 'All' ? ' for ' + this.activeFilter : ''}</h3>
          <p style="font-size: 13px; max-width: 340px; margin: 0 auto;">Go to a client's profile in <strong>Client Leads</strong> and add their transformation result to see it here.</p>
        </div>`
      : filtered.map(r => {
          const client = clients.find(c => c.id === r.clientId);
          const clientName = client ? client.name : r.clientName || "Unknown Client";
          const isVideo = r.type === "video";
          const ytId = isVideo ? Results.extractYouTubeId(r.link) : null;
          const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

          return `
            <div style="background:white; border:1px solid var(--border-color); border-radius:12px; overflow:hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow-sm)'">
              <!-- Media Preview -->
              <div style="position:relative; aspect-ratio: 4/3; overflow:hidden; background:#F5F2EE; cursor:pointer;" onclick="Results.openResult('${r.id}')">
                ${isVideo && thumbUrl
                  ? `<img src="${thumbUrl}" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=&quot;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-secondary);&quot;><svg width=&quot;32&quot; height=&quot;32&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2.2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; style=&quot;margin-bottom:6px;&quot;><polygon points=&quot;5 3 19 12 5 21 5 3&quot;></polygon></svg><div style=&quot;font-size:11px;&quot;>Video Result</div></div>'" />
                     <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.55);border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:white;margin-left:3px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>`
                  : isVideo
                  ? `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-secondary);"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 6px;"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg><div style="font-size:11px;">Video Result</div></div>`
                  : r.image
                  ? `<img src="${r.image}" style="width:100%;height:100%;object-fit:cover;" />`
                  : `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-secondary);"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>`
                }
                <!-- Category badge -->
                <span style="position:absolute;top:8px;left:8px;background:rgba(107,124,94,0.9);color:white;padding:3px 9px;border-radius:12px;font-size:10px;font-weight:700;">${r.category}</span>
                ${isVideo ? `<span style="position:absolute;top:8px;right:8px;background:rgba(220,50,50,0.85);color:white;padding:3px 9px;border-radius:12px;font-size:10px;font-weight:700;display:inline-flex;align-items:center;gap:4px;"><svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>Video</span>` : ''}
              </div>
              <!-- Card Footer -->
              <div style="padding:12px 14px;">
                <div style="font-weight:700;font-size:13.5px;color:var(--text-primary);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.title || clientName}</div>
                <div style="font-size:11.5px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span style="display:inline-flex;align-items:center;gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${clientName}</span>
                  <span style="color:var(--border-color);">•</span>
                  <span>${new Date(r.addedAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
                </div>
                ${r.description ? `<p style="font-size:11.5px;color:var(--text-secondary);margin:6px 0 0;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${r.description}</p>` : ''}
                <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
                  <button onclick="Results.openResult('${r.id}')" style="background:none;border:1px solid var(--border-color);border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;color:var(--primary-dark);cursor:pointer;">View Full</button>
                  <button onclick="event.stopPropagation();Results.confirmDeleteResult('${r.id}')" style="background:none;border:none;color:var(--text-muted);font-size:12px;cursor:pointer;padding:4px 6px;" title="Delete result">✕</button>
                </div>
              </div>
            </div>
          `;
        }).join('');

    return `
      <div class="page-container">
        <!-- Header -->
        <div class="page-header" style="margin-bottom: 24px;">
          <div class="page-title-wrap">
            <h2 style="font-family: var(--font-display); font-weight: 700; color: var(--text-primary); display:inline-flex; align-items:center; gap:8px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
                <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"></path>
              </svg>
              Client Transformation Results
            </h2>
            <p style="color: var(--text-secondary); font-size: 13px; margin-top:4px;">A gallery of real results from your active clients — photos and video testimonials, sorted by health issue.</p>
          </div>
        </div>

        <!-- Category Filter Bar -->
        <div style="background:white;border:1px solid var(--border-color);border-radius:10px;padding:14px 16px;margin-bottom:24px;box-shadow:var(--shadow-sm);">
          <div style="font-size:10.5px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Filter by Health Issue Category</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${categoryTabs}
          </div>
        </div>

        <!-- Results count -->
        <div style="font-size:12.5px;color:var(--text-secondary);margin-bottom:16px;font-weight:500;">
          Showing <strong>${filtered.length}</strong> result${filtered.length !== 1 ? 's' : ''}${this.activeFilter !== 'All' ? ` for <strong>${this.activeFilter}</strong>` : ''}
        </div>

        <!-- Results Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:20px;">
          ${resultsGrid}
        </div>
      </div>
    `;
  },

  init() {},

  setFilter(cat) {
    this.activeFilter = cat;
    const main = document.getElementById("main-content");
    if (main) {
      main.innerHTML = this.render();
      this.init();
    }
  },

  extractYouTubeId(url) {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  },

  openResult(resultId) {
    const results = Store.getResults();
    const r = results.find(x => x.id === resultId);
    if (!r) return;

    const clients = Store.getClients();
    const client = clients.find(c => c.id === r.clientId);
    const clientName = client ? client.name : r.clientName || "Client";

    const isVideo = r.type === "video";
    const ytId = isVideo ? this.extractYouTubeId(r.link) : null;

    const modal = document.getElementById("modal-root");
    modal.innerHTML = `
      <div class="modal-card" style="max-width:680px;border-radius:16px;overflow:hidden;">
        <div class="modal-header" style="background:var(--primary-color);padding:16px 24px;color:white;display:flex;align-items:center;justify-content:space-between;">
          <span class="modal-title" style="font-weight:700;font-size:15px;display:inline-flex;align-items:center;gap:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:white;flex-shrink:0;">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
              <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"></path>
            </svg>
            ${r.title || clientName + "'s Result"}
          </span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')" style="color:white;font-size:24px;">×</button>
        </div>
        <div class="modal-body" style="padding:24px;max-height:80vh;overflow-y:auto;">
          <!-- Media -->
          <div style="border-radius:10px;overflow:hidden;margin-bottom:20px;background:#F5F2EE;">
            ${ytId
              ? `<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe src="https://www.youtube.com/embed/${ytId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:10px;" allowfullscreen></iframe></div>`
              : isVideo && r.link
              ? `<div style="text-align:center;padding:40px;"><a href="${r.link}" target="_blank" style="color:var(--primary-color);font-weight:700;text-decoration:underline;display:inline-flex;align-items:center;gap:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg> Open Video Link</a></div>`
              : r.image
              ? `<img src="${r.image}" style="width:100%;border-radius:10px;display:block;" />`
              : `<div style="padding:60px;text-align:center;color:var(--text-secondary);">No media available</div>`
            }
          </div>
          <!-- Meta -->
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
            <span style="background:var(--primary-light);color:var(--primary-dark);padding:4px 12px;border-radius:12px;font-size:11.5px;font-weight:700;display:inline-flex;align-items:center;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block;"><path d="M4.82 7.26A7.5 7.5 0 0 0 12 15a7.5 7.5 0 0 0 7.18-7.74"></path><path d="M12 15V21"></path><path d="M4 3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V4a1 1 0 0 0-1-1H4z"></path><path d="M20 3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V4a1 1 0 0 0-1-1h-6z"></path><circle cx="12" cy="21" r="2"></circle></svg>${r.category}</span>
            <span style="background:#F2EFE7;color:var(--text-secondary);padding:4px 12px;border-radius:12px;font-size:11.5px;display:inline-flex;align-items:center;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>${clientName}</span>
            <span style="background:#F2EFE7;color:var(--text-secondary);padding:4px 12px;border-radius:12px;font-size:11.5px;display:inline-flex;align-items:center;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; display: inline-block;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${new Date(r.addedAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span>
          </div>
          ${r.description ? `<p style="font-size:13.5px;line-height:1.6;color:var(--text-secondary);">${r.description}</p>` : ''}
        </div>
        <div class="modal-footer" style="padding:12px 24px;display:flex;justify-content:flex-end;background:#F8F5F0;border-top:1px solid #EAE5DB;gap:10px;">
          ${r.type === 'video' && r.link ? `<a href="${r.link}" target="_blank" class="btn-outline" style="padding:8px 16px;border-radius:6px;font-weight:600;font-size:12.5px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>Open Video</a>` : ''}
          <button class="btn-primary" onclick="document.getElementById('modal-root').classList.add('hidden')" style="background:var(--primary-color);border:none;cursor:pointer;font-weight:600;padding:8px 18px;border-radius:6px;">Close</button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  confirmDeleteResult(resultId) {
    const modal = document.getElementById("modal-root");
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <span class="modal-title">Delete Result</span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')">×</button>
        </div>
        <div class="modal-body">
          <p style="font-size:13.5px;">Are you sure you want to permanently delete this result? This cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" onclick="document.getElementById('modal-root').classList.add('hidden')">Cancel</button>
          <button class="btn-primary" style="background:var(--danger-color);" onclick="Results.deleteResult('${resultId}')">Yes, Delete</button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  deleteResult(resultId) {
    Store.deleteResult(resultId);
    document.getElementById("modal-root").classList.add("hidden");
    Helpers.showToast("Result deleted successfully.", "warning");
    const main = document.getElementById("main-content");
    if (main) { main.innerHTML = this.render(); this.init(); }
  }
};

window.Results = Results;
