/**
 * Sakria Super Admin Control Center Module
 */

const AdminConsole = {
  tenants: [],

  render() {
    return `
      <div class="page-container">
        <!-- ── ADMIN HEADER BANNER ── -->
        <div class="page-header" style="margin-bottom: 20px;">
          <div class="page-title-wrap">
            <h2 style="font-family: var(--font-display); font-weight: 700; color: #2F3E2B; display:inline-flex; align-items:center; gap:8px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Platform Super Admin Control Center
            </h2>
            <p style="color: var(--text-secondary); font-size: 13px; margin-top:4px;">Manage multi-tenant operator activations, system metrics, and register new wellness coaches.</p>
          </div>
          
          <!-- Global Kill Switch -->
          <div style="display: flex; gap: 12px; align-items: center;">
            <button class="btn-primary" style="background-color: #DC645A; font-weight: 700; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" onclick="AdminConsole.triggerGlobalKillSwitch(true)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: white;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
              Global Pause Switch (Kill all)
            </button>
            <button class="btn-outline" style="font-weight: 600; padding: 10px 16px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" onclick="AdminConsole.triggerGlobalKillSwitch(false)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Resume All Tenants
            </button>
          </div>
        </div>

        <!-- ── PLATFORM STATS & SYSTEM HEALTH ── -->
        <div class="stats-grid" id="admin-stats-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="card-container" style="padding: 16px; display:flex; align-items:center; gap:12px; border: 1px solid var(--border-color); border-radius:12px; background-color:#FFFFFF;">
            <div style="background-color: rgba(107, 124, 94, 0.1); color: var(--primary-color); padding: 8px; border-radius: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <span style="font-size:10.5px; color: var(--text-muted); font-weight:700; text-transform:uppercase; display:block; letter-spacing:0.5px;">System Status</span>
              <strong style="font-size:15px; color: #15803D;">Healthy / Online</strong>
            </div>
          </div>
          <div class="card-container" style="padding: 16px; display:flex; align-items:center; gap:12px; border: 1px solid var(--border-color); border-radius:12px; background-color:#FFFFFF;">
            <div style="background-color: rgba(15, 118, 110, 0.1); color: #0F766E; padding: 8px; border-radius: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
            </div>
            <div>
              <span style="font-size:10.5px; color: var(--text-muted); font-weight:700; text-transform:uppercase; display:block; letter-spacing:0.5px;">Database Size</span>
              <strong style="font-size:15px; color: var(--text-primary);" id="stat-db-size">Loading...</strong>
            </div>
          </div>
          <div class="card-container" style="padding: 16px; display:flex; align-items:center; gap:12px; border: 1px solid var(--border-color); border-radius:12px; background-color:#FFFFFF;">
            <div style="background-color: rgba(107, 124, 94, 0.1); color: var(--primary-color); padding: 8px; border-radius: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div>
              <span style="font-size:10.5px; color: var(--text-muted); font-weight:700; text-transform:uppercase; display:block; letter-spacing:0.5px;">Total Coaches</span>
              <strong style="font-size:15px; color: var(--text-primary);" id="stat-coaches">Loading...</strong>
            </div>
          </div>
          <div class="card-container" style="padding: 16px; display:flex; align-items:center; gap:12px; border: 1px solid var(--border-color); border-radius:12px; background-color:#FFFFFF;">
            <div style="background-color: rgba(15, 118, 110, 0.1); color: #0F766E; padding: 8px; border-radius: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
            </div>
            <div>
              <span style="font-size:10.5px; color: var(--text-muted); font-weight:700; text-transform:uppercase; display:block; letter-spacing:0.5px;">Total Clients</span>
              <strong style="font-size:15px; color: var(--text-primary);" id="stat-clients">Loading...</strong>
            </div>
          </div>
        </div>

        <div class="admin-grid" style="display: grid; grid-template-columns: 1fr; gap: 24px;">
          
          <!-- ── REGISTER NEW COACH / TENANT FORM ── -->
          <div class="settings-card" style="background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm);">
            <h3 style="font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-top:0; margin-bottom: 12px; color: var(--primary-dark); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path></svg>
              Register New Wellness Coach Profile
            </h3>
            <p style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 16px;">
              Create a new tenant record in the database. Share the credentials with the coach so they can log in.
            </p>

            <form id="admin-register-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; align-items: end;" onsubmit="AdminConsole.handleRegister(event)">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Tenant ID (unique, e.g. t-2)</label>
                <input type="text" class="form-input" id="reg-id" placeholder="t-2" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Coach Name</label>
                <input type="text" class="form-input" id="reg-name" placeholder="S.K. Shastri" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Wellness Center Name</label>
                <input type="text" class="form-input" id="reg-center" placeholder="SK Wellness Center" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Coach Phone Number</label>
                <input type="text" class="form-input" id="reg-phone" placeholder="+919999999999" style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Coach Role</label>
                <input type="text" class="form-input" id="reg-role" value="Lead Wellness Coach" placeholder="Lead Wellness Coach" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Login Username</label>
                <input type="text" class="form-input" id="reg-username" placeholder="coach_username" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Login Password</label>
                <input type="text" class="form-input" id="reg-password" placeholder="skpasscode123" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0; grid-column: span 2;">
                <label class="form-label" style="font-size: 11px; font-weight: 700;">Center Address</label>
                <input type="text" class="form-input" id="reg-address" placeholder="123 Wellness St, Bangalore, India" style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div style="grid-column: span 1;">
                <button type="submit" class="btn-primary" style="background-color: var(--primary-color); border:none; height: 36px; padding: 0 16px; border-radius: 6px; font-weight:600; width: 100%; cursor: pointer;">
                  + Add Coach Account
                </button>
              </div>
            </form>
          </div>

          <!-- ── ONBOARDED TENANTS MANAGEMENT LEDGER TABLE ── -->
          <div class="settings-card" style="background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm); overflow-x: auto;">
            <h3 style="font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-top:0; margin-bottom: 16px; color: var(--primary-dark); display:flex; align-items:center; gap:8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary-color);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Active Multi-Tenant Management Ledger
            </h3>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 12.5px; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-secondary); font-weight: 700;">
                  <th style="padding: 10px 8px;">Center & Coach</th>
                  <th style="padding: 10px 8px;">Login Credentials</th>
                  <th style="padding: 10px 8px; text-align: center;">Active Status</th>
                  <th style="padding: 10px 8px; text-align: center;">Quick Admin Actions</th>
                </tr>
              </thead>
              <tbody id="admin-tenants-table-body">
                <tr>
                  <td colspan="4" style="padding: 24px; text-align: center; color: var(--text-muted);">Loading tenant registrations...</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    `;
  },

  async init() {
    await Promise.all([
      this.fetchSystemStats(),
      this.fetchTenants()
    ]);
  },

  async fetchSystemStats() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/system-stats");
      if (res.ok) {
        const stats = await res.json();
        const dbSizeEl = document.getElementById("stat-db-size");
        const coachesEl = document.getElementById("stat-coaches");
        const clientsEl = document.getElementById("stat-clients");
        if (dbSizeEl) dbSizeEl.textContent = `${stats.database_size_kb} KB`;
        if (coachesEl) coachesEl.textContent = `${stats.total_tenants} (${stats.active_tenants} Active)`;
        if (clientsEl) clientsEl.textContent = stats.total_clients;
      }
    } catch (e) {
      console.warn("Failed to fetch system metrics:", e);
    }
  },

  async fetchTenants() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/tenants");
      if (res.ok) {
        this.tenants = await res.json();
        this.renderTable();
      } else {
        Helpers.showToast("Failed to fetch tenant list.", "error");
      }
    } catch (e) {
      console.error(e);
      Helpers.showToast("Error connecting to admin REST service.", "error");
    }
  },

  renderTable() {
    const tbody = document.getElementById("admin-tenants-table-body");
    if (!tbody) return;

    if (this.tenants.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding: 24px; text-align: center; color: var(--text-muted);">No tenants registered yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.tenants.map(t => {
      const statusBadge = t.is_active
        ? `<span style="background-color: rgba(107, 124, 94, 0.1); border: 1px solid rgba(107, 124, 94, 0.25); color: #6B7C5E; padding: 4px 8px; border-radius: 12px; font-weight: 700; font-size:11px;">Active</span>`
        : `<span style="background-color: rgba(220, 100, 90, 0.1); border: 1px solid rgba(220, 100, 90, 0.25); color: #DC645A; padding: 4px 8px; border-radius: 12px; font-weight: 700; font-size:11px;">Paused / Blocked</span>`;

      return `
        <tr style="border-bottom: 1px solid var(--border-color); vertical-align: middle;">
          <td style="padding: 12px 8px;">
            <strong style="font-size:13.5px; display:block; color:var(--primary-dark);">${t.wellness_center_name || 'N/A'}</strong>
            <span style="font-size:11.5px; color:var(--text-secondary);">${t.name} • ${t.role || 'Lead Wellness Coach'}</span>
            ${t.wellness_center_address ? `<span style="display:block; font-size:11px; color: var(--text-muted); margin-top:2px;">Address: ${t.wellness_center_address}</span>` : ""}
            ${t.coach_phone_number ? `<span style="display:block; font-size:11px; color: var(--text-muted);">Phone: ${t.coach_phone_number}</span>` : ""}
          </td>
          <td style="padding: 12px 8px; font-family: monospace; font-size:11px;">
            Username: ${t.username || t.email}<br/>
            Pass: ${t.password}
          </td>
          <td style="padding: 12px 8px; text-align: center;">
            ${statusBadge}
          </td>
          <td style="padding: 12px 8px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <!-- Toggle active button -->
              <button class="btn-outline" style="padding: 4px 8px; font-size: 11px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="AdminConsole.toggleTenant('${t.id}')">
                ${t.is_active 
                  ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg> Pause' 
                  : '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Activate'
                }
              </button>
              <!-- Edit profile button -->
              <button class="btn-outline" style="padding: 4px 8px; font-size: 11px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" onclick="AdminConsole.openEditModal('${t.id}')">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Edit
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  async toggleTenant(id) {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/tenants/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: id })
      });
      if (res.ok) {
        const data = await res.json();
        Helpers.showToast(data.is_active ? "Tenant activated successfully!" : "Tenant paused/blocked!", "success");
        await Promise.all([
          this.fetchSystemStats(),
          this.fetchTenants()
        ]);
      } else {
        Helpers.showToast("Failed to toggle status.", "error");
      }
    } catch (e) {
      console.error(e);
      Helpers.showToast("Network error toggling status.", "error");
    }
  },

  async triggerGlobalKillSwitch(deactivate) {
    const actionPhrase = deactivate ? "PAUSE ALL coach accounts" : "RESUME ALL coach accounts";
    if (!confirm(`Are you absolutely sure you want to ${actionPhrase} simultaneously?`)) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/tenants/kill-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deactivate_all: deactivate })
      });
      if (res.ok) {
        Helpers.showToast(deactivate ? "All accounts PAUSED!" : "All accounts RESUMED!", "success");
        await Promise.all([
          this.fetchSystemStats(),
          this.fetchTenants()
        ]);
      } else {
        Helpers.showToast("Failed to trigger master kill switch.", "error");
      }
    } catch (e) {
      console.error(e);
      Helpers.showToast("Network error executing global trigger.", "error");
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const id = document.getElementById("reg-id").value.trim();
    const name = document.getElementById("reg-name").value.trim();
    const center = document.getElementById("reg-center").value.trim();
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const role = document.getElementById("reg-role").value.trim();
    const address = document.getElementById("reg-address").value.trim();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/tenants/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: id,
          name,
          center_name: center,
          username,
          password,
          coach_phone_number: phone,
          role,
          wellness_center_address: address,
          credits: 0
        })
      });
      if (res.ok) {
        Helpers.showToast(`Operator ${name} registered successfully!`, "success");
        document.getElementById("admin-register-form").reset();
        await Promise.all([
          this.fetchSystemStats(),
          this.fetchTenants()
        ]);
      } else {
        const err = await res.json();
        Helpers.showToast(err.detail || "Registration failed.", "error");
      }
    } catch (errReg) {
      console.error(errReg);
      Helpers.showToast("Network connection registration error.", "error");
    }
  },

  openEditModal(tenantId) {
    const t = this.tenants.find(x => x.id === tenantId);
    if (!t) return;

    const modal = document.getElementById("modal-root");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 500px; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-lg);">
        <div class="modal-header" style="background-color: var(--primary-color); padding: 16px 20px; color: white; display: flex; align-items: center; justify-content: space-between;">
          <span class="modal-title" style="font-family: var(--font-display); font-size:16px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:white;"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Edit Coach Profile: ${t.wellness_center_name || 'Coach Profile'}
          </span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')" style="color: white; font-size: 20px;">×</button>
        </div>
        <form onsubmit="AdminConsole.handleUpdate(event, '${t.id}')">
          <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Coach Name</label>
                <input type="text" class="form-input" id="edit-name" value="${t.name || ''}" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Wellness Center Name</label>
                <input type="text" class="form-input" id="edit-center" value="${t.wellness_center_name || ''}" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Coach Phone Number</label>
                <input type="text" class="form-input" id="edit-phone" value="${t.coach_phone_number || ''}" style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Coach Role</label>
                <input type="text" class="form-input" id="edit-role" value="${t.role || 'Lead Wellness Coach'}" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Login Username</label>
                <input type="text" class="form-input" id="edit-username" value="${t.username || t.email || ''}" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Login Password</label>
                <input type="text" class="form-input" id="edit-password" value="${t.password || ''}" required style="padding-left:12px; font-size:12.5px; height:36px;" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px; font-weight:700;">Center Address</label>
              <textarea class="form-input" id="edit-address" rows="2" style="padding-left:12px; font-size:12px; line-height:1.4; resize:none;">${t.wellness_center_address || ''}</textarea>
            </div>
          </div>
          <div class="modal-footer" style="padding:12px 20px; display:flex; justify-content:flex-end; gap:8px; background-color:#F8F5F0; border-top:1px solid #EAE5DB;">
            <button type="button" class="btn-outline" onclick="document.getElementById('modal-root').classList.add('hidden')" style="padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer;">Cancel</button>
            <button type="submit" class="btn-primary" style="background-color:var(--primary-color); border:none; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer; color:white;">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  async handleUpdate(e, tenantId) {
    e.preventDefault();
    const name = document.getElementById("edit-name").value.trim();
    const wellness_center_name = document.getElementById("edit-center").value.trim();
    const coach_phone_number = document.getElementById("edit-phone").value.trim();
    const role = document.getElementById("edit-role").value.trim();
    const username = document.getElementById("edit-username").value.trim();
    const password = document.getElementById("edit-password").value.trim();
    const wellness_center_address = document.getElementById("edit-address").value.trim();

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/tenants/${tenantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          wellness_center_name,
          coach_phone_number,
          role,
          username,
          password,
          wellness_center_address
        })
      });

      if (res.ok) {
        Helpers.showToast("Coach profile updated successfully!", "success");
        document.getElementById("modal-root").classList.add("hidden");
        await Promise.all([
          this.fetchSystemStats(),
          this.fetchTenants()
        ]);
      } else {
        const err = await res.json();
        Helpers.showToast(err.detail || "Failed to update profile.", "error");
      }
    } catch (errUp) {
      console.error(errUp);
      Helpers.showToast("Network connection update error.", "error");
    }
  }
};

window.AdminConsole = AdminConsole;
