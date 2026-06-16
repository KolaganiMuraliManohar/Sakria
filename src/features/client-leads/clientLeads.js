/**
 * Sakria Consolidated CRM & Client Leads Module
 * Combines Client management and progress tracking in a unified workspace.
 */

const ClientLeads = {
  selectedClientId: null,
  currentFilter: "All",
  searchQuery: "",
  sortBy: "newest", // newest, oldest
  dateRange: "all", // all, today, week, month
  activeTimeframe: "all",

  setTimeframe(tf) {
    ClientLeads.activeTimeframe = tf;
    
    // Update active styles in DOM without refreshing the page
    ['weekly', 'monthly', 'yearly', 'all'].forEach(t => {
      const btn = document.getElementById(`client-tf-${t}`);
      if (btn) {
        if (t === tf) {
          btn.style.background = 'var(--primary-color)';
          btn.style.color = 'white';
        } else {
          btn.style.background = 'transparent';
          btn.style.color = 'var(--text-secondary)';
        }
      }
    });

    ClientLeads.renderChart();
  },

  render() {
    const clients = Store.getClients() || [];
    
    // Sort and filter logic
    let filtered = clients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          c.phone.includes(this.searchQuery);
      
      // Filter by Status
      let matchStatus = true;
      if (this.currentFilter === "Leads") matchStatus = c.status === "Lead";
      else if (this.currentFilter === "Active") matchStatus = c.status === "Active";
      else if (this.currentFilter === "Flagged") matchStatus = c.flagged;

      // Filter by Date
      let matchDate = true;
      if (this.dateRange !== "all" && c.createdAt) {
        const clientDate = new Date(c.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - clientDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (this.dateRange === "today") matchDate = diffDays <= 1;
        else if (this.dateRange === "week") matchDate = diffDays <= 7;
        else if (this.dateRange === "month") matchDate = diffDays <= 30;
      }
      
      return matchSearch && matchStatus && matchDate;
    });

    // Sort by Date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return this.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Render Detail View if client selected
    if (this.selectedClientId) {
      const client = clients.find(c => c.id === this.selectedClientId);
      if (client) {
        // Ensure history array has at least one entry representing initial status
        if (!client.history || client.history.length === 0) {
          client.history = [{
            date: new Date(client.createdAt || Date.now()).toISOString().split("T")[0],
            weight: Number(client.weight || 0),
            height: Number(client.height || 0),
            bmi: Number(client.bmi || 0),
            bmr: Number(client.bmr || 0),
            biologicalAge: Number(client.biologicalAge || client.age || 0),
            visceralFat: Number(client.visceralFat || 5),
            subcutaneousFat: Number(client.subcutaneousFat || 15.0),
            bodyFat: Number(client.bodyFat || 20.0),
            muscleMass: Number(client.muscleMass || 30.0),
            notes: client.notes || "Initial checkup logs."
          }];
        }

        const bmiCat = Helpers.getBMICategory(client.bmi);
        const visCat = Helpers.getVisceralFatCategory(client.visceralFat);
        const bioCat = Helpers.getBiologicalAgeCategory(client.biologicalAge, client.age);
        const subCat = Helpers.getSubcutaneousFatCategory(client.subcutaneousFat || 0);
        const statusClass = client.status === "Active" ? "status-badge active" : "status-badge lead";
        
        const activeIssues = [...(client.healthIssues || [])];
        if (client.healthIssuesOthers && client.healthIssuesOthers.trim()) {
          activeIssues.push(client.healthIssuesOthers.trim());
        }
        
        const healthTagsHtml = activeIssues.length > 0
          ? activeIssues.map(issue => `
              <span style="background-color: var(--primary-light); color: var(--primary-dark); font-size: 11px; padding: 4px 10px; border-radius: 12px; font-weight: 600; border: 1px solid #DFE7D9; display: inline-flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-dark);"><path d="M4.82 7.26A7.5 7.5 0 0 0 12 15a7.5 7.5 0 0 0 7.18-7.74"></path><path d="M12 15V21"></path><path d="M4 3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V4a1 1 0 0 0-1-1H4z"></path><path d="M20 3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V4a1 1 0 0 0-1-1h-6z"></path><circle cx="12" cy="21" r="2"></circle></svg> ${issue}
              </span>
            `).join("")
          : `<span style="color: var(--text-secondary); font-size: 12px; font-style: italic;">No specific health issues recorded.</span>`;

        // History Table Rows (Observations column removed)
        const historyTableRows = (client.history || []).map(h => `
          <tr style="border-bottom: 1px solid var(--border-light);">
            <td style="padding: 12px 10px; font-size: 12.5px; font-weight: 600; color: var(--text-primary);">${h.date}</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary);">${h.weight} kg</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary); font-weight: 500;">${h.bmi}</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary);">${h.visceralFat}</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary);">${h.subcutaneousFat !== undefined ? h.subcutaneousFat : '-'}%</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary);">${h.bodyFat}%</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary);">${h.muscleMass} kg</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary);">${h.biologicalAge} yrs</td>
            <td style="padding: 12px 10px; font-size: 12.5px; color: var(--text-primary);">${h.bmr} kcal</td>
          </tr>
        `).reverse().join(""); // Show newest checkups first in table

        // Comparative progression text
        const progressComparisonHtml = (() => {
          if (client.history && client.history.length > 1) {
            const init = client.history[0];
            const wDiff = (client.weight - init.weight).toFixed(1);
            const bmiDiff = (client.bmi - init.bmi).toFixed(1);
            const bioDiff = (client.biologicalAge - init.biologicalAge);
            const bmrDiff = (client.bmr - init.bmr);

            const wSign = wDiff > 0 ? `+${wDiff}` : wDiff;
            const bmiSign = bmiDiff > 0 ? `+${bmiDiff}` : bmiDiff;
            const bioSign = bioDiff > 0 ? `+${bioDiff}` : bioDiff;
            const bmrSign = bmrDiff > 0 ? `+${bmrDiff}` : bmrDiff;

            return `
              <div class="card-container" style="background: rgba(107, 124, 94, 0.04); border: 1px dashed rgba(107, 124, 94, 0.3); margin-bottom: 24px; padding: 16px;">
                <span class="card-title" style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px; font-size: 11px; font-weight: 700; color: var(--primary-dark); text-transform: uppercase; letter-spacing: 0.5px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-dark); flex-shrink: 0;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> Progression Index (vs. Initial Diagnostic Session — ${init.date})
                </span>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 12px;">
                  <div style="background: white; border: 1px solid rgba(0,0,0,0.04); padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 9px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 2px;">Weight</div>
                    <div style="font-size: 12.5px; font-weight: 700; color: var(--primary-dark);">${init.weight}kg <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 2px; vertical-align: middle; color: var(--text-secondary); display: inline-block;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> ${client.weight}kg</div>
                    <div style="font-size: 11px; font-weight: 700; color: ${wDiff <= 0 ? '#6B7C5E' : '#D16A5E'}; margin-top: 2px;">${wSign}kg</div>
                  </div>
                  <div style="background: white; border: 1px solid rgba(0,0,0,0.04); padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 9px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 2px;">BMI Value</div>
                    <div style="font-size: 12.5px; font-weight: 700; color: var(--primary-dark);">${init.bmi} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 2px; vertical-align: middle; color: var(--text-secondary); display: inline-block;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> ${client.bmi}</div>
                    <div style="font-size: 11px; font-weight: 700; color: ${bmiDiff <= 0 ? '#6B7C5E' : '#D16A5E'}; margin-top: 2px;">${bmiSign}</div>
                  </div>
                  <div style="background: white; border: 1px solid rgba(0,0,0,0.04); padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 9px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 2px;">Cell Age</div>
                    <div style="font-size: 12.5px; font-weight: 700; color: var(--primary-dark);">${init.biologicalAge}y <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 2px; vertical-align: middle; color: var(--text-secondary); display: inline-block;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> ${client.biologicalAge}y</div>
                    <div style="font-size: 11px; font-weight: 700; color: ${bioDiff <= 0 ? '#6B7C5E' : '#D16A5E'}; margin-top: 2px;">${bioSign} yrs</div>
                  </div>
                  <div style="background: white; border: 1px solid rgba(0,0,0,0.04); padding: 10px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 9px; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 2px;">BMR Metabolism</div>
                    <div style="font-size: 12.5px; font-weight: 700; color: var(--primary-dark);">${init.bmr} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 2px; vertical-align: middle; color: var(--text-secondary); display: inline-block;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> ${client.bmr}</div>
                    <div style="font-size: 11px; font-weight: 700; color: ${bmrDiff >= 0 ? '#6B7C5E' : '#D16A5E'}; margin-top: 2px;">${bmrSign} kcal</div>
                  </div>
                </div>
              </div>
            `;
          }
          return "";
        })();

        const detailPaneHtml = `
          <div class="client-detail-main" style="padding: 4px;">
            <!-- Profile Card -->
            <div class="card-container" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div class="client-sidebar-avatar" style="margin: 0; width: 64px; height: 64px; font-size: 22px;">
                  ${client.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 style="font-family: var(--font-display); font-size:20px; font-weight:700; color: var(--text-primary); display: flex; align-items: center; gap: 8px; margin: 0;">
                    ${client.name}
                    ${client.flagged ? '<span style="color:var(--danger-color); font-size:11px; font-weight:bold; background-color: #FDF3F2; padding: 2px 8px; border-radius: 12px; border: 1px solid #F9D6D3; display:inline-flex; align-items:center; gap:4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> High Risk</span>' : ''}
                  </h3>
                  <p style="color:var(--text-secondary); font-size:12.5px; margin-top: 4px; margin-bottom: 0; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> ${client.phone}</span> | 
                    <span style="display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${client.gender}</span> | 
                    <span style="display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${client.age} yrs</span> | 
                    <span style="display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="9" x2="19" y2="9"></line><line x1="5" y1="15" x2="19" y2="15"></line><line x1="9" y1="9" x2="9" y2="15"></line><line x1="15" y1="9" x2="15" y2="15"></line></svg> ${client.height} cm</span>
                  </p>
                  <div style="margin-top: 6px; display: flex; gap: 6px; align-items: center;">
                    <span class="${statusClass}" style="margin: 0; font-size: 10px;">${client.status}</span>
                    <span class="status-badge" style="margin: 0; font-size: 10px; background-color: ${client.lead_type === 'online' ? '#E1F5FE' : '#ECEFF1'}; color: ${client.lead_type === 'online' ? '#0288D1' : '#37474F'};">${client.lead_type === 'online' ? 'Online Lead' : 'Offline Lead'}</span>
                  </div>
                </div>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                <div style="display: flex; gap: 8px;">
                  <button class="btn-outline" onclick="ClientLeads.changeStatus('${client.id}', 'Active')" style="padding: 6px 12px; font-size:11.5px; border-radius: 4px;">Set Active</button>
                  <button class="btn-outline" onclick="ClientLeads.changeStatus('${client.id}', 'Lead')" style="padding: 6px 12px; font-size:11.5px; border-radius: 4px;">Set Lead</button>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 4px;">
                  <button class="btn-primary" onclick="ClientLeads.downloadReport('${client.id}')" style="padding: 8px 12px; font-size:11.5px; font-weight:600; display:inline-flex; align-items:center; gap:6px; border:none; cursor:pointer; border-radius:4px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Download Report
                  </button>
                  <button class="btn-outline" onclick="ClientLeads.confirmDelete('${client.id}', '${client.name}')" style="border-color: #F5D2CF; color: var(--danger-color); padding: 8px 12px; font-size:11.5px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; justify-content: center;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Health Issues tags -->
            <div style="margin-bottom: 24px;">
              <div class="card-container" style="padding: 18px;">
                <span class="card-title" style="display: block; margin-bottom: 12px; font-size: 13px;">Suffering & Health Issues</span>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${healthTagsHtml}
                </div>
              </div>
            </div>

            <!-- Before & After Photos -->
            <div class="card-container" style="margin-bottom: 24px; padding: 20px;">
              <span class="card-title" style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 13.5px; color: var(--primary-dark);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-dark); flex-shrink: 0;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                Before & After Transformation Photos
              </span>
              <p style="font-size: 11.5px; color: var(--text-secondary); margin-bottom: 18px;">Upload body transformation photos to visually track the client's physical progress over time.</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- BEFORE Photo -->
                <div>
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    Before Photo
                  </div>
                  <div id="before-photo-preview-${client.id}" style="width: 100%; aspect-ratio: 3/4; border: 2px dashed var(--border-color); border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #FAF8F5; overflow: hidden; position: relative; cursor: pointer;" onclick="document.getElementById('before-upload-${client.id}').click()">
                    ${(client.beforePhoto) ? `
                      <img src="${client.beforePhoto}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />
                      <button onclick="event.stopPropagation(); ClientLeads.deletePhoto('${client.id}', 'before')" style="position:absolute; top:8px; right:8px; background:rgba(220,100,90,0.85); color:white; border:none; border-radius:50%; width:24px; height:24px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1;">✕</button>
                    ` : `<div style="text-align:center; color:var(--text-secondary);"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted); display:block; margin:0 auto 8px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><div style="font-size:11.5px; font-weight:600;">Click to Upload</div><div style="font-size:10.5px; color:var(--text-muted); margin-top:2px;">JPEG / PNG / WEBP</div></div>`}
                  </div>
                  <input type="file" id="before-upload-${client.id}" accept="image/*" style="display:none;" onchange="ClientLeads.savePhoto('${client.id}', 'before', this)" />
                  <button class="btn-outline" style="width:100%; margin-top:8px; font-size:11.5px; padding:6px; display:flex; align-items:center; justify-content:center; gap:4px;" onclick="document.getElementById('before-upload-${client.id}').click()">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    ${client.beforePhoto ? 'Replace Before Photo' : 'Upload Before Photo'}
                  </button>
                </div>
                <!-- AFTER Photo -->
                <div>
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.5px; margin-bottom: 10px; display: flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    After Photo
                  </div>
                  <div id="after-photo-preview-${client.id}" style="width: 100%; aspect-ratio: 3/4; border: 2px dashed var(--border-color); border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #FAF8F5; overflow: hidden; position: relative; cursor: pointer;" onclick="document.getElementById('after-upload-${client.id}').click()">
                    ${(client.afterPhoto) ? `
                      <img src="${client.afterPhoto}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />
                      <button onclick="event.stopPropagation(); ClientLeads.deletePhoto('${client.id}', 'after')" style="position:absolute; top:8px; right:8px; background:rgba(220,100,90,0.85); color:white; border:none; border-radius:50%; width:24px; height:24px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1;">✕</button>
                    ` : `<div style="text-align:center; color:var(--text-secondary);"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); display: block; margin: 0 auto 8px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><div style="font-size:11.5px; font-weight:600;">Click to Upload</div><div style="font-size:10.5px; color:var(--text-muted); margin-top:2px;">JPEG / PNG / WEBP</div></div>`}
                  </div>
                  <input type="file" id="after-upload-${client.id}" accept="image/*" style="display:none;" onchange="ClientLeads.savePhoto('${client.id}', 'after', this)" />
                  <button class="btn-outline" style="width:100%; margin-top:8px; font-size:11.5px; padding:6px; display:flex; align-items:center; justify-content:center; gap:4px;" onclick="document.getElementById('after-upload-${client.id}').click()">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    ${client.afterPhoto ? 'Replace After Photo' : 'Upload After Photo'}
                  </button>
                </div>
              </div>
            </div>

            <!-- Body Recomposition Trend Chart -->
            <div class="card-container" style="margin-bottom: 24px; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                <span class="card-title" style="display: flex; align-items: center; margin-bottom: 0; font-size: 13px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-primary); display: inline-block; vertical-align: middle; margin-right: 6px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  Body Recomposition Trends (Weight, Fat & Muscle)
                </span>
                
                <!-- Timeframe Selector -->
                <div style="display: flex; background: #FAF9F6; border: 1px solid var(--border-light); padding: 3px; border-radius: 8px; gap: 2px;">
                  <button id="client-tf-weekly" onclick="ClientLeads.setTimeframe('weekly')" style="padding: 3px 8px; border-radius: 6px; border: none; font-size: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; ${ClientLeads.activeTimeframe === 'weekly' ? 'background: var(--primary-color); color: white;' : 'background: transparent; color: var(--text-secondary);'}">Weekly</button>
                  <button id="client-tf-monthly" onclick="ClientLeads.setTimeframe('monthly')" style="padding: 3px 8px; border-radius: 6px; border: none; font-size: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; ${ClientLeads.activeTimeframe === 'monthly' ? 'background: var(--primary-color); color: white;' : 'background: transparent; color: var(--text-secondary);'}">Monthly</button>
                  <button id="client-tf-yearly" onclick="ClientLeads.setTimeframe('yearly')" style="padding: 3px 8px; border-radius: 6px; border: none; font-size: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; ${ClientLeads.activeTimeframe === 'yearly' ? 'background: var(--primary-color); color: white;' : 'background: transparent; color: var(--text-secondary);'}">Yearly</button>
                  <button id="client-tf-all" onclick="ClientLeads.setTimeframe('all')" style="padding: 3px 8px; border-radius: 6px; border: none; font-size: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; ${ClientLeads.activeTimeframe === 'all' ? 'background: var(--primary-color); color: white;' : 'background: transparent; color: var(--text-secondary);'}">All</button>
                </div>
              </div>
              <div class="chart-wrapper" style="height: 250px; position: relative;">
                <canvas id="weightChart"></canvas>
              </div>
            </div>

            <!-- Parameter History Table (Observations column removed) -->
            <div class="card-container" style="margin-bottom: 24px; padding: 20px; overflow-x: auto;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <span class="card-title" style="display: flex; align-items: center; margin-bottom: 0; font-size: 13px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-primary); display: inline-block; vertical-align: middle; margin-right: 6px;"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                  Parameters Checkup Logs History
                </span>
                <button class="btn-primary" onclick="ClientLeads.openAddParametersModal('${client.id}')" style="display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; font-size: 11.5px; border-radius: 4px; border: none; cursor: pointer;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add Latest Parameters
                </button>
              </div>
              <table style="width: 100%; border-collapse: collapse; min-width: 750px;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--border-color); text-align: left; background: #FAF9F6;">
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Date</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Weight</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">BMI</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Visceral Fat</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Subcutaneous</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Body Fat</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Muscle Mass</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Cell Age</th>
                    <th style="padding: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">BMR</th>
                  </tr>
                </thead>
                <tbody>
                  ${historyTableRows}
                </tbody>
              </table>
            </div>

            <!-- Client Individual Results -->
            <div class="card-container" style="padding: 20px; margin-bottom: 24px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div>
                  <span class="card-title" style="display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; color: var(--primary-dark);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
                      <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"></path>
                    </svg>
                    ${client.name.split(' ')[0]}'s Transformation Results
                  </span>
                  <p style="font-size: 11.5px; color: var(--text-secondary); margin: 4px 0 0;">Individual results logged for this client — photos or video links.</p>
                </div>
                <button class="btn-primary" onclick="ClientLeads.openAddResultModal('${client.id}', '${client.name.replace(/'/g, "\\'")}')"
                  style="padding: 8px 14px; font-size: 12px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; flex-shrink:0;">
                  + Add Result
                </button>
              </div>
              ${(() => {
                const clientResults = Store.getResults().filter(r => r.clientId === client.id);
                if (clientResults.length === 0) return '<p style="font-size:12.5px;color:var(--text-muted);font-style:italic;">No results added yet for this client. Click "+ Add Result" to add one.</p>';
                return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;">' +
                  clientResults.map(r => {
                    const isVideo = r.type === 'video';
                    const ytId = isVideo && r.link ? (r.link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) || [])[1] : null;
                    const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
                    return `<div style="border:1px solid var(--border-color);border-radius:10px;overflow:hidden;cursor:pointer;" onclick="Results.openResult('${r.id}')">
                      <div style="aspect-ratio:4/3;background:#F5F2EE;overflow:hidden;position:relative;">
                        ${thumb ? `<img src="${thumb}" style="width:100%;height:100%;object-fit:cover;"/>` : r.image ? `<img src="${r.image}" style="width:100%;height:100%;object-fit:cover;"/>` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${isVideo ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'}</div>`}
                        <span style="position:absolute;bottom:6px;left:6px;background:rgba(107,124,94,0.9);color:white;padding:2px 7px;border-radius:8px;font-size:9.5px;font-weight:700;">${r.category}</span>
                      </div>
                      <div style="padding:8px 10px;">
                        <div style="font-size:11.5px;font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.title || r.category + ' Result'}</div>
                        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${new Date(r.addedAt).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>`;
                  }).join('') +
                '</div>';
              })()}
            </div>

          </div>
        `;

        return `
          <div class="page-container">
            <div class="back-navigation-bar">
              <button class="btn-back-link" onclick="ClientLeads.selectClient(null)">
                ← Back to Client Accounts
              </button>
            </div>
            
            ${detailPaneHtml}
          </div>
        `;
      }
    }

    // Default: Render Grid View
    const clientCards = filtered.map(c => {
      const initials = c.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
      const isCritical = c.flagged;
      const cardClass = c.status === "Active" ? "client-grid-card active-status-card" : "client-grid-card lead-status-card";
      
      return `
        <div class="${cardClass}">
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            <div class="lead-avatar" style="width: 44px; height: 44px; font-size: 14px; flex-shrink: 0; background-color: var(--primary-light); color: var(--primary-color); display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700; border: 1.5px solid var(--primary-color);">
              ${initials}
            </div>
            <div style="flex: 1; min-width: 0;">
              <h4 style="font-family: var(--font-display); font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; display: flex; align-items: center; gap: 6px;">
                ${c.name}
              </h4>
              <p style="font-size: 11px; color: var(--text-secondary); margin: 2px 0 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                ${c.phone}
              </p>
              <div style="margin-top: 6px; display: flex; gap: 6px; align-items: center;">
                <span class="${c.status === 'Active' ? 'status-badge active' : 'status-badge lead'}" style="margin: 0; padding: 2px 8px; font-size: 9.5px;">${c.status}</span>
                ${isCritical ? '<span class="status-badge" style="margin: 0; padding: 2px 8px; font-size: 9.5px; background-color: #FDF3F2; color: var(--danger-color); border: 1px solid #F9D6D3; font-weight: bold; display: inline-flex; align-items: center; gap: 3px;"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> High Risk</span>' : ''}
              </div>
            </div>
          </div>
          
          <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="display:inline-flex; align-items:center; gap:4px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${c.gender}</span> | 
            <span style="display:inline-flex; align-items:center; gap:4px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> ${c.age} yrs</span> | 
            <span style="display:inline-flex; align-items:center; gap:4px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="9" x2="19" y2="9"></line><line x1="5" y1="15" x2="19" y2="15"></line><line x1="9" y1="9" x2="9" y2="15"></line><line x1="15" y1="9" x2="15" y2="15"></line></svg> ${c.height} cm</span>
          </div>
          
          <div class="client-card-divider"></div>
          
          <div class="client-card-metrics">
            <div class="client-card-metric-col">
              <span class="client-card-metric-label">Weight & BMI</span>
              <span class="client-card-metric-value" style="font-weight: 700; color: ${isCritical && Helpers.getBMICategory(c.bmi).safe === false ? 'var(--danger-color)' : 'var(--text-primary)'};">
                ${c.weight} kg / ${c.bmi}
              </span>
            </div>
            <div class="client-card-metric-col">
              <span class="client-card-metric-label">Fat & Muscle</span>
              <span class="client-card-metric-value">
                Fat: ${c.bodyFat}% / Muscle: ${c.muscleMass} kg
              </span>
            </div>
          </div>
          
          <div class="client-card-actions">
            <div class="status-switch-container">
              <label class="status-switch">
                <input type="checkbox" ${c.status === 'Active' ? 'checked' : ''} onchange="ClientLeads.toggleActiveStatus('${c.id}', this.checked)" />
                <span class="status-slider"></span>
              </label>
              <span style="color: ${c.status === 'Active' ? 'var(--primary-color)' : 'var(--text-secondary)'}; font-weight: 700;">Active</span>
            </div>
            <button class="btn-outline" onclick="ClientLeads.selectClient('${c.id}')" style="padding: 6px 12px; font-size: 11.5px; border-radius: 6px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-dark); flex-shrink: 0;"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> View Workspace
            </button>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="page-container">
        <div class="page-header" style="margin-bottom: 24px;">
          <div class="page-title-wrap">
            <h2>Consolidated Clients Workspace</h2>
            <p>Monitor physiological metrics history, adjust active CRM tags, and analyze health trends</p>
          </div>
          <button class="btn-primary" onclick="window.location.hash = '#body-sheet'">+ Add New Client Record</button>
        </div>

        <!-- Search and Filter Bar -->
        <div class="chat-inbox-header" style="padding: 16px 20px; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: white; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
          <div class="search-wrap" style="flex: 1; min-width: 240px; margin: 0; padding: 0; border: 1px solid var(--border-color); border-radius: 4px; background: white; height: 38px; display: flex; align-items: center; gap: 8px;">
            <span style="margin-left: 12px; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input type="text" id="leads-search" placeholder="Search accounts..." value="${this.searchQuery}" style="border: none; outline: none; width: 100%; font-size: 13px; padding: 0 4px; height: 100%; background: transparent;" />
          </div>
          
          <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <select class="filter-select" id="leads-filter" style="padding: 8px 12px; font-size: 13px; border: 1px solid var(--border-color); border-radius: 4px; height: 38px; min-width: 140px; background: white; color: var(--text-primary); font-weight: 500; outline: none;">
              <option value="All" ${this.currentFilter === "All" ? "selected" : ""}>All Statuses</option>
              <option value="Leads" ${this.currentFilter === "Leads" ? "selected" : ""}>Inactive Leads</option>
              <option value="Active" ${this.currentFilter === "Active" ? "selected" : ""}>Active Members</option>
              <option value="Flagged" ${this.currentFilter === "Flagged" ? "selected" : ""}>High Risk</option>
            </select>
            <select class="filter-select" id="leads-sort" style="padding: 8px 12px; font-size: 13px; border: 1px solid var(--border-color); border-radius: 4px; height: 38px; min-width: 140px; background: white; color: var(--text-primary); font-weight: 500; outline: none;">
              <option value="newest" ${this.sortBy === "newest" ? "selected" : ""}>Newest Reg</option>
              <option value="oldest" ${this.sortBy === "oldest" ? "selected" : ""}>Oldest Reg</option>
            </select>
            
            <button class="btn-outline" style="height: 38px; width: 38px; display: flex; align-items: center; justify-content: center; padding: 0; border: 1px solid var(--border-color); border-radius: 4px; background: white; cursor: pointer; color: var(--text-secondary);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="client-cards-grid">
          ${clientCards.length > 0 ? clientCards : `
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 250px; text-align: center; color: var(--text-secondary); background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 48px;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0;">No matching accounts found</h4>
              <p style="font-size: 12px; margin-top: 4px; max-width: 280px;">Try adjusting your status filter or typing a different search query.</p>
            </div>
          `}
        </div>
      </div>
    `;
  },

  init() {
    this.bindEvents();
    this.renderChart();
  },

  bindEvents() {
    const search = document.getElementById("leads-search");
    if (search) {
      search.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.refreshList();
      });
      // Set cursor to the end of search query for uninterrupted typing
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }

    const filter = document.getElementById("leads-filter");
    if (filter) {
      filter.addEventListener("change", (e) => {
        this.currentFilter = e.target.value;
        this.refreshList();
      });
    }

    const sort = document.getElementById("leads-sort");
    if (sort) {
      sort.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.refreshList();
      });
    }
  },

  selectClient(id) {
    this.selectedClientId = id;
    this.activeTimeframe = "all";
    this.refreshList();
  },

  refreshList() {
    const main = document.getElementById("main-content");
    if (main) {
      main.innerHTML = this.render();
      this.bindEvents();
      this.renderChart();
    }
  },

  changeStatus(id, newStatus) {
    Store.updateClient(id, { status: newStatus });
    Helpers.showToast(`Updated profile status to: ${newStatus}`, "success");
    
    this.refreshList();
  },

  toggleActiveStatus(id, isChecked) {
    const newStatus = isChecked ? 'Active' : 'Lead';
    this.changeStatus(id, newStatus);
  },

  savePhoto(clientId, type, inputEl) {
    const file = inputEl.files[0];
    if (!file) return;

    // Show a loading toast
    Helpers.showToast("Compressing and processing photo...", "info");

    Helpers.compressImage(file, 800, 800, 0.7)
      .then((compressedBase64) => {
        const update = type === "before" ? { beforePhoto: compressedBase64 } : { afterPhoto: compressedBase64 };
        Store.updateClient(clientId, update);
        Helpers.showToast(`${type === 'before' ? 'Before' : 'After'} photo saved and compressed successfully!`, "success");
        this.refreshList();
      })
      .catch((err) => {
        console.error("Image compression error:", err);
        Helpers.showToast("Failed to process image.", "error");
      });
  },

  deletePhoto(clientId, type) {
    const update = type === "before" ? { beforePhoto: null } : { afterPhoto: null };
    Store.updateClient(clientId, update);
    Helpers.showToast(`${type === 'before' ? 'Before' : 'After'} photo removed.`, "warning");
    this.refreshList();
  },

  openAddParametersModal(id) {
    const client = Store.getClients().find(c => c.id === id);
    if (!client) return;

    const modal = document.getElementById("modal-root");
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 620px; border-radius: 16px; overflow: hidden;">
        <div class="modal-header" style="background: var(--primary-color); padding: 16px 24px; color: white; display: flex; align-items: center; justify-content: space-between;">
          <span class="modal-title" style="font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: white; flex-shrink: 0;"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Add Latest Parameters — ${client.name}
          </span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')" style="color: white; font-size: 24px; background: none; border: none; cursor: pointer; line-height: 1;">×</button>
        </div>
        <div class="modal-body" style="padding: 24px; max-height: 75vh; overflow-y: auto;">
          <form id="modal-params-form" onsubmit="ClientLeads.saveModalParameters(event, '${client.id}')">
            <!-- Date Field -->
            <div class="form-group" style="margin-bottom: 20px;">
              <label class="form-label" style="font-size: 12px; margin-bottom: 4px; font-weight: 600;">Checkup Date *</label>
              <div class="input-wrap" style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: 6px; padding: 0 12px; background: white; height: 42px;">
                <span style="display: flex; align-items: center; justify-content: center; margin-right: 8px; color: var(--text-muted);">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </span>
                <input type="date" id="m-date" required value="${new Date().toISOString().split("T")[0]}" style="border: none; outline: none; width: 100%; font-size: 13.5px;" />
              </div>
            </div>

            <!-- Parameters Grid (matching the body sheet styling) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="param-input-card">
                <span class="label">Weight</span>
                <div class="input-wrap">
                  <input type="number" step="0.1" id="m-weight" value="${client.weight || ''}" required placeholder="e.g. 72.5" />
                  <span>kg</span>
                </div>
              </div>
              <div class="param-input-card">
                <span class="label">Height</span>
                <div class="input-wrap">
                  <input type="number" id="m-height" value="${client.height || ''}" placeholder="e.g. 175" />
                  <span>cm</span>
                </div>
              </div>
              <div class="param-input-card">
                <span class="label">BMI Index</span>
                <div class="input-wrap">
                  <input type="number" step="0.1" id="m-bmi" value="${client.bmi || ''}" required placeholder="e.g. 23.5" />
                  <span>index</span>
                </div>
              </div>
              <div class="param-input-card">
                <span class="label">BMR Metabolism</span>
                <div class="input-wrap">
                  <input type="number" id="m-bmr" value="${client.bmr || ''}" required placeholder="e.g. 1650" />
                  <span>kcal</span>
                </div>
              </div>
              <div class="param-input-card">
                <span class="label">Visceral Fat Level</span>
                <div class="input-wrap">
                  <input type="number" id="m-visceral" value="${client.visceralFat || ''}" required placeholder="e.g. 6" />
                  <span>lvl</span>
                </div>
              </div>
              <div class="param-input-card">
                <span class="label">Subcutaneous Fat</span>
                <div class="input-wrap">
                  <input type="number" step="0.1" id="m-subcutaneous" value="${client.subcutaneousFat !== undefined ? client.subcutaneousFat : ''}" required placeholder="e.g. 15.2" />
                  <span>%</span>
                </div>
              </div>
              <div class="param-input-card">
                <span class="label">Body Fat %</span>
                <div class="input-wrap">
                  <input type="number" step="0.1" id="m-fat" value="${client.bodyFat || ''}" required placeholder="e.g. 21.0" />
                  <span>%</span>
                </div>
              </div>
              <div class="param-input-card">
                <span class="label">Muscle Mass</span>
                <div class="input-wrap">
                  <input type="number" step="0.1" id="m-muscle" value="${client.muscleMass || ''}" required placeholder="e.g. 32.4" />
                  <span>kg</span>
                </div>
              </div>
              <div class="param-input-card" style="grid-column: span 2;">
                <span class="label">Biological Age</span>
                <div class="input-wrap">
                  <input type="number" id="m-bioage" value="${client.biologicalAge || ''}" required placeholder="e.g. 28" />
                  <span>yrs</span>
                </div>
              </div>
            </div>
            
            <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn-outline" onclick="document.getElementById('modal-root').classList.add('hidden')">Cancel</button>
              <button type="submit" class="btn-primary" style="background: var(--primary-color); border: none; font-weight: 600; padding: 10px 24px; border-radius: 6px; cursor: pointer;">
                Save Parameters
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  saveModalParameters(event, id) {
    event.preventDefault();
    const client = Store.getClients().find(c => c.id === id);
    if (!client) return;

    const newWeight = Number(document.getElementById("m-weight").value);
    const newHeight = Number(document.getElementById("m-height").value || client.height);
    const newBioAge = Number(document.getElementById("m-bioage").value);
    const newVisceral = Number(document.getElementById("m-visceral").value);
    const newSubcutaneous = Number(document.getElementById("m-subcutaneous").value);
    const newFat = Number(document.getElementById("m-fat").value);
    const newMuscle = Number(document.getElementById("m-muscle").value);
    const newBMI = Number(document.getElementById("m-bmi").value);
    const newBMR = Number(document.getElementById("m-bmr").value);
    const checkupDate = document.getElementById("m-date").value || new Date().toISOString().split("T")[0];

    const bmiCat = Helpers.getBMICategory(newBMI);
    const visCat = Helpers.getVisceralFatCategory(newVisceral);
    const subCat = Helpers.getSubcutaneousFatCategory(newSubcutaneous);
    const bioCat = Helpers.getBiologicalAgeCategory(newBioAge, client.age);
    const isFlagged = !bmiCat.safe || !visCat.safe || !subCat.safe || !bioCat.safe;

    const payload = {
      date: checkupDate,
      weight: newWeight,
      height: newHeight,
      biologicalAge: newBioAge,
      visceralFat: newVisceral,
      subcutaneousFat: newSubcutaneous,
      bodyFat: newFat,
      muscleMass: newMuscle,
      bmi: newBMI,
      bmr: newBMR,
      notes: client.notes || "",
      flagged: isFlagged
    };

    Store.updateClient(id, payload);
    document.getElementById("modal-root").classList.add("hidden");
    Helpers.showToast(`New parameters checkup logged for ${client.name}`, "success");

    this.refreshList();
  },

  openAddResultModal(clientId, clientName) {
    const categories = ["Weight Loss","Thyroid","Knee Pains","Diabetes","Hypertension","Skin Issues","PCOS","Cholesterol","Joint Pain","Indigestion","Muscle Gain","Others"];
    const modal = document.getElementById("modal-root");
    modal.innerHTML = `
      <div class="modal-card" style="max-width:520px;border-radius:16px;overflow:hidden;">
        <div class="modal-header" style="background:var(--primary-color);padding:16px 24px;color:white;display:flex;align-items:center;justify-content:space-between;">
          <span class="modal-title" style="font-weight:700;font-size:15px;display:inline-flex;align-items:center;gap:6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:white;flex-shrink:0;">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
              <path d="M12 2a5 5 0 0 0-5 5v3c0 2.2 1.8 4 4 4h2c2.2 0 4-1.8 4-4V7a5 5 0 0 0-5-5z"></path>
            </svg>
            Add Result — ${clientName}
          </span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')" style="color:white;font-size:24px;">×</button>
        </div>
        <div class="modal-body" style="padding:24px;max-height:75vh;overflow-y:auto;display:flex;flex-direction:column;gap:16px;">
          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:12px;margin-bottom:4px;">Result Title</label>
            <input class="form-input" type="text" id="res-title" placeholder="e.g. Lost 12kg in 3 months" style="padding:10px 14px;font-size:13px;" />
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:12px;margin-bottom:4px;">Health Issue Category *</label>
            <select class="form-input" id="res-category" style="padding:10px 14px;font-size:13px;">
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:12px;margin-bottom:4px;">Media Type *</label>
            <div style="display:flex;gap:12px;">
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;cursor:pointer;">
                <input type="radio" name="res-type" value="photo" checked onchange="ClientLeads.toggleResultMediaType()" style="accent-color:var(--primary-color);" />
                <span style="display:inline-flex;align-items:center;gap:4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  Photo
                </span>
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;cursor:pointer;">
                <input type="radio" name="res-type" value="video" onchange="ClientLeads.toggleResultMediaType()" style="accent-color:var(--primary-color);" />
                <span style="display:inline-flex;align-items:center;gap:4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  Video Link
                </span>
              </label>
            </div>
          </div>
          <!-- Photo upload -->
          <div id="res-photo-wrap" class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:12px;margin-bottom:4px;">Upload Photo *</label>
            <input type="file" class="form-input" id="res-photo" accept="image/*" style="padding:8px 14px;font-size:12.5px;" />
          </div>
          <!-- Video link -->
          <div id="res-video-wrap" class="form-group" style="margin:0;display:none;">
            <label class="form-label" style="font-size:12px;margin-bottom:4px;">YouTube / Video Link *</label>
            <input class="form-input" type="url" id="res-video-link" placeholder="https://youtube.com/watch?v=..." style="padding:10px 14px;font-size:13px;" />
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label" style="font-size:12px;margin-bottom:4px;">Short Description (optional)</label>
            <textarea class="form-input" id="res-desc" rows="2" placeholder="e.g. Client lost visceral fat from level 14 to 7 in 90 days." style="padding:10px 14px;font-size:13px;resize:vertical;"></textarea>
          </div>
        </div>
        <div class="modal-footer" style="padding:12px 24px;display:flex;justify-content:flex-end;gap:10px;background:#F8F5F0;border-top:1px solid #EAE5DB;">
          <button class="btn-outline" onclick="document.getElementById('modal-root').classList.add('hidden')">Cancel</button>
          <button class="btn-primary" onclick="ClientLeads.submitClientResult('${clientId}', '${clientName.replace(/'/g, "\\'")}')" style="background:var(--primary-color);border:none;cursor:pointer;font-weight:600;padding:8px 20px;border-radius:6px;">
            Save Result
          </button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  toggleResultMediaType() {
    const type = document.querySelector('input[name="res-type"]:checked')?.value;
    const photoWrap = document.getElementById("res-photo-wrap");
    const videoWrap = document.getElementById("res-video-wrap");
    if (photoWrap && videoWrap) {
      photoWrap.style.display = type === "photo" ? "block" : "none";
      videoWrap.style.display = type === "video" ? "block" : "none";
    }
  },

  submitClientResult(clientId, clientName) {
    const type = document.querySelector('input[name="res-type"]:checked')?.value || "photo";
    const title = document.getElementById("res-title")?.value.trim();
    const category = document.getElementById("res-category")?.value;
    const desc = document.getElementById("res-desc")?.value.trim();

    if (type === "video") {
      const link = document.getElementById("res-video-link")?.value.trim();
      if (!link) { Helpers.showToast("Please enter a video link.", "error"); return; }
      Store.addResult({ clientId, clientName, title, category, type: "video", link, description: desc });
      document.getElementById("modal-root").classList.add("hidden");
      Helpers.showToast("Video result saved!", "success");
      this.refreshList();
    } else {
      const fileInput = document.getElementById("res-photo");
      if (!fileInput?.files[0]) { Helpers.showToast("Please select a photo.", "error"); return; }
      
      Helpers.showToast("Compressing and processing photo...", "info");
      
      Helpers.compressImage(fileInput.files[0], 800, 800, 0.7)
        .then((compressedBase64) => {
          Store.addResult({ clientId, clientName, title, category, type: "photo", image: compressedBase64, description: desc });
          document.getElementById("modal-root").classList.add("hidden");
          Helpers.showToast("Photo result saved and compressed!", "success");
          this.refreshList();
        })
        .catch((err) => {
          console.error("Image compression error:", err);
          Helpers.showToast("Failed to process image.", "error");
        });
    }
  },

  confirmDelete(id, name) {
    const modal = document.getElementById("modal-root");
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <span class="modal-title">Delete Client Profile</span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')">×</button>
        </div>
        <div class="modal-body">
          <p>Are you absolutely sure you want to permanently delete the profile data for <strong>${name}</strong>? This action is irreversible.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-outline" onclick="document.getElementById('modal-root').classList.add('hidden')">Cancel</button>
          <button class="btn-primary" style="background-color: var(--danger-color);" onclick="ClientLeads.deleteClient('${id}')">Yes, Delete</button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  },

  deleteClient(id) {
    Store.deleteClient(id);
    document.getElementById("modal-root").classList.add("hidden");
    Helpers.showToast("Client profile removed successfully.", "warning");
    
    // Reset selected client
    this.selectedClientId = null;
    this.refreshList();
  },

  downloadReport(id) {
    const client = Store.getClients().find(c => c.id === id);
    if (!client) return;

    const fileName = `Wellness_Report_${client.name.replace(/\s+/g, '_')}.pdf`;
    Helpers.downloadReportPDF(client, fileName)
      .then(() => {
        Helpers.showToast(`PDF Report downloaded successfully!`, "success");
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        Helpers.showToast("Failed to generate PDF report.", "error");
      });
  },

  renderChart() {
    const ctx = document.getElementById("weightChart");
    if (!ctx) return;

    // Destroy existing Chart instance to prevent overlap rendering bugs
    if (ClientLeads.chartInstance) {
      ClientLeads.chartInstance.destroy();
      ClientLeads.chartInstance = null;
    }

    const client = Store.getClients().find(c => c.id === this.selectedClientId);
    if (!client || !client.history || client.history.length === 0) return;

    // Sort history chronologically for correct chart ordering
    const sortedHistory = [...client.history].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filter history based on selected activeTimeframe
    const today = new Date();
    let cutoff = null;
    const timeframe = ClientLeads.activeTimeframe || "all";
    if (timeframe === "weekly") {
      cutoff = new Date();
      cutoff.setDate(today.getDate() - 7);
    } else if (timeframe === "monthly") {
      cutoff = new Date();
      cutoff.setDate(today.getDate() - 30);
    } else if (timeframe === "yearly") {
      cutoff = new Date();
      cutoff.setDate(today.getDate() - 365);
    }

    const filteredHistory = cutoff ? sortedHistory.filter(h => new Date(h.date) >= cutoff) : sortedHistory;

    // Format X-axis labels to a user-friendly format: e.g. "May 28"
    const formatLabelDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[d.getMonth()]} ${d.getDate()}`;
    };

    const labels = filteredHistory.map(h => formatLabelDate(h.date));
    const weights = filteredHistory.map(h => h.weight);
    const bodyFats = filteredHistory.map(h => h.bodyFat !== undefined ? h.bodyFat : 0);
    const muscleMasses = filteredHistory.map(h => h.muscleMass !== undefined ? h.muscleMass : 0);

    ClientLeads.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Weight (kg)',
            data: weights,
            borderColor: '#6B7C5E', // Muted Olive Green
            backgroundColor: 'rgba(107, 124, 94, 0.03)',
            fill: false,
            tension: 0.3,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#6B7C5E',
            yAxisID: 'y'
          },
          {
            label: 'Body Fat (%)',
            data: bodyFats,
            borderColor: '#E28C7E', // Soft Coral/Salmon
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#E28C7E',
            yAxisID: 'yFat'
          },
          {
            label: 'Muscle Mass (kg)',
            data: muscleMasses,
            borderColor: '#D8A05E', // Warm Gold/Amber
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#D8A05E',
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 10,
              padding: 14,
              font: { size: 10.5, weight: '600', family: 'Inter, sans-serif' },
              color: '#4A5043'
            }
          },
          tooltip: {
            padding: 10,
            cornerRadius: 8,
            backgroundColor: 'rgba(40, 45, 35, 0.95)',
            titleFont: { size: 11, weight: '700' },
            bodyFont: { size: 11 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6B7364', font: { size: 9.5 } }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: { color: '#FAF9F6' },
            ticks: { color: '#6B7364', font: { size: 9.5 } },
            title: { display: true, text: 'Weight & Muscle (kg)', color: '#6B7364', font: { size: 9.5, weight: '600' } }
          },
          yFat: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false }, // Only show grid lines for left axis
            ticks: { color: '#E28C7E', font: { size: 9.5 } },
            title: { display: true, text: 'Body Fat (%)', color: '#E28C7E', font: { size: 9.5, weight: '600' } }
          }
        }
      }
    });
  }
};

window.ClientLeads = ClientLeads;
