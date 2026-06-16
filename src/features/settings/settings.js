/**
 * Sakria Settings — Wellness Center Profile Only
 */

const Settings = {
  render() {
    const op = Store.getOperator();

    return `
      <div class="page-container">
        <div class="page-header" style="margin-bottom: 24px;">
          <div class="page-title-wrap">
            <h2 style="font-family: var(--font-display); font-weight: 700; color: var(--text-primary);">Platform Settings</h2>
            <p style="color: var(--text-secondary); font-size: 13px;">Manage your wellness center profile and operator details.</p>
          </div>
        </div>

        <div style="max-width: 600px;">
          <!-- Wellness Center Profile Card -->
          <div class="card-container" style="padding: 28px;">
            <div style="margin-bottom: 20px;">
              <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: var(--primary-color); letter-spacing: 0.5px; display: block; margin-bottom: 4px;">WELLNESS CENTER PROFILE</span>
              <h3 style="font-family: var(--font-display); font-size:18px; font-weight:700; margin: 0; color: var(--text-primary); display:inline-flex; align-items:center; gap:6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path></svg>
                Center & Coach Details
              </h3>
            </div>

            <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0 0 20px 0; line-height: 1.5; background:#FAF6F0; border:1px solid #E4DFD5; padding:12px; border-radius:8px; display:flex; align-items:flex-start; gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px; color: var(--primary-color);"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span>These center details are securely configured by the platform administrator. To request updates, contact <strong>murali@sakria.in</strong>.</span>
            </p>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; display:block;">Wellness Center Name</label>
              <input type="text" class="form-input" value="${op.wellnessCenterName || ''}" disabled style="padding:10px 14px; font-size:13px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; display:block;">Coach / Operator Name</label>
              <input type="text" class="form-input" value="${op.name || ''}" disabled style="padding:10px 14px; font-size:13px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; display:block;">Coach Phone</label>
                <input type="text" class="form-input" value="${op.coachPhoneNumber || ''}" disabled style="padding:10px 14px; font-size:13px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; display:block;">Coach Role</label>
                <input type="text" class="form-input" value="${op.role || ''}" disabled style="padding:10px 14px; font-size:13px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:6px; display:block;">Center Address</label>
              <textarea class="form-input" rows="2" disabled style="padding:10px 14px; font-size:12.5px; line-height:1.4; resize:none; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);">${op.wellnessCenterAddress || ''}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {},

  // ── PROFILE MODAL POPUP ──
  openProfileModal() {
    const op = Store.getOperator();
    const modal = document.getElementById("modal-root");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 480px; border-radius: 12px; overflow: hidden; box-shadow: var(--shadow-lg);">
        <div class="modal-header" style="background-color: var(--primary-color); padding: 16px 20px; color: white; display: flex; align-items: center; justify-content: space-between;">
          <span class="modal-title" style="font-family: var(--font-display); font-size:16px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:white;flex-shrink:0;"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path></svg>
            Wellness Center & Coach Profile
          </span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')" style="color: white; font-size: 20px;">×</button>
        </div>
        <div class="modal-body" style="padding: 20px; display: flex; flex-direction: column; gap: 16px;">
          <p style="font-size: 12.5px; color: var(--text-secondary); margin: 0; line-height: 1.5; display:flex; align-items:flex-start; gap:8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px; color: var(--primary-color);"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>These official center details are securely configured and locked by the platform administrator. To request updates, please contact murali@sakria.in.</span>
          </p>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px; display:block;">Wellness Center Name</label>
            <input type="text" class="form-input" value="${op.wellnessCenterName || ''}" disabled style="padding-left:12px; font-size:13px; height:auto; padding:8px 12px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px; display:block;">Coach / Operator Name</label>
            <input type="text" class="form-input" value="${op.name || ''}" disabled style="padding-left:12px; font-size:13px; height:auto; padding:8px 12px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px; display:block;">Coach Phone</label>
              <input type="text" class="form-input" value="${op.coachPhoneNumber || ''}" disabled style="padding-left:12px; font-size:13px; height:auto; padding:8px 12px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px; display:block;">Coach Role</label>
              <input type="text" class="form-input" value="${op.role || ''}" disabled style="padding-left:12px; font-size:13px; height:auto; padding:8px 12px; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px; display:block;">Center Address</label>
            <textarea class="form-input" rows="2" disabled style="padding-left:12px; font-size:12.5px; line-height:1.4; resize:none; background-color:#F6F4F0; cursor:not-allowed; border:1px solid var(--border-color);">${op.wellnessCenterAddress || ''}</textarea>
          </div>
        </div>
        <div class="modal-footer" style="padding:12px 20px; display:flex; justify-content:flex-end; background-color:#F8F5F0; border-top:1px solid #EAE5DB;">
          <button class="btn-primary" onclick="document.getElementById('modal-root').classList.add('hidden')" style="background-color:var(--primary-color); border:none; cursor:pointer; font-weight:600; padding:8px 16px; border-radius:6px;">Close</button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  }
};

window.Settings = Settings;
