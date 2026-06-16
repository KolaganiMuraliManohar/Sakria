/**
 * Sakria Body Sheet Analysis Form Module
 * Configured with manual BMR & BMI inputs, required date, optional parameters, and origin type tags.
 */

const BodySheet = {
  currentInputs: {
    name: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    gender: "Male",
    age: 30,
    height: 170,
    weight: "",
    visceralFat: "",
    subcutaneousFat: "",
    bodyFat: "",
    muscleMass: "",
    bmr: "",
    bmi: "",
    biologicalAge: "",
    notes: "",
    status: "Lead",
    lead_type: "offline",
    healthIssues: [],
    healthIssuesOthers: ""
  },

  render() {
    return `
      <div class="page-container">
        <div class="page-header">
          <div class="page-title-wrap">
            <h2>Body Sheet Analysis</h2>
            <p>Input client details and body composition metrics to produce dynamic wellness reports</p>
          </div>
        </div>

        <div class="split-layout">
          <!-- ── FORM INPUT CARD ── -->
          <div class="form-card">
            <form id="body-sheet-form">
              <div class="section-divider">Basic Information (Compulsory)</div>
              
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <div class="input-wrap">
                  <span class="input-icon" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <input class="form-input" type="text" id="bs-name" required placeholder="e.g. Arjun Rao" />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">WhatsApp Number *</label>
                  <div class="input-wrap">
                    <span class="input-icon" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </span>
                    <input class="form-input" type="tel" id="bs-phone" required placeholder="e.g. 9876543210" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Checkup Date *</label>
                  <div class="input-wrap">
                    <span class="input-icon" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </span>
                    <input class="form-input" type="date" id="bs-date" required />
                  </div>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <select class="form-input" id="bs-gender" style="padding-left: 16px;">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Age (chronological years)</label>
                  <input class="form-input" type="number" id="bs-age" min="1" max="120" value="30" style="padding-left: 16px;" />
                </div>
              </div>


              <div class="section-divider">Body Composition Parameters (Optional)</div>

              <div class="form-grid-2" style="gap: 20px;">
                <div class="param-input-card">
                  <span class="label">Weight</span>
                  <div class="input-wrap">
                    <input type="number" step="0.1" id="bs-weight" placeholder="e.g. 72.5" />
                    <span>kg</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <span class="label">Height</span>
                  <div class="input-wrap">
                    <input type="number" id="bs-height" placeholder="e.g. 175" />
                    <span>cm</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="label" style="margin-bottom: 0;">BMI Index</span>
                    <button type="button" style="background: none; border: none; padding: 0; margin: 0; color: #9C8B72; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; text-decoration: underline;" onclick="Education.openParameterModal('bmi')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9C8B72; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help</button>
                  </div>
                  <div class="input-wrap">
                    <input type="number" step="0.1" id="bs-bmi" placeholder="e.g. 23.5" />
                    <span>index</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="label" style="margin-bottom: 0;">BMR Metabolism</span>
                    <button type="button" style="background: none; border: none; padding: 0; margin: 0; color: #9C8B72; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; text-decoration: underline;" onclick="Education.openParameterModal('bmr')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9C8B72; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help</button>
                  </div>
                  <div class="input-wrap">
                    <input type="number" id="bs-bmr" placeholder="e.g. 1650" />
                    <span style="font-size:10px;">kcal</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="label" style="margin-bottom: 0;">Visceral Fat Level</span>
                    <button type="button" style="background: none; border: none; padding: 0; margin: 0; color: #9C8B72; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; text-decoration: underline;" onclick="Education.openParameterModal('visceral')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9C8B72; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help</button>
                  </div>
                  <div class="input-wrap">
                    <input type="number" id="bs-visceral" placeholder="e.g. 6" />
                    <span>lvl</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="label" style="margin-bottom: 0;">Subcutaneous Fat</span>
                    <button type="button" style="background: none; border: none; padding: 0; margin: 0; color: #9C8B72; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; text-decoration: underline;" onclick="Education.openParameterModal('subcutaneous')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9C8B72; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help</button>
                  </div>
                  <div class="input-wrap">
                    <input type="number" step="0.1" id="bs-subcutaneous" placeholder="e.g. 15.2" />
                    <span>%</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="label" style="margin-bottom: 0;">Body Fat %</span>
                    <button type="button" style="background: none; border: none; padding: 0; margin: 0; color: #9C8B72; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; text-decoration: underline;" onclick="Education.openParameterModal('bodyfat')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9C8B72; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help</button>
                  </div>
                  <div class="input-wrap">
                    <input type="number" step="0.1" id="bs-fat" placeholder="e.g. 21.0" />
                    <span>%</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="label" style="margin-bottom: 0;">Muscle Mass</span>
                    <button type="button" style="background: none; border: none; padding: 0; margin: 0; color: #9C8B72; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; text-decoration: underline;" onclick="Education.openParameterModal('muscle')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9C8B72; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help</button>
                  </div>
                  <div class="input-wrap">
                    <input type="number" step="0.1" id="bs-muscle" placeholder="e.g. 32.4" />
                    <span>kg</span>
                  </div>
                </div>

                <div class="param-input-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="label" style="margin-bottom: 0;">Biological Age</span>
                    <button type="button" style="background: none; border: none; padding: 0; margin: 0; color: #9C8B72; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; text-decoration: underline;" onclick="Education.openParameterModal('bioage')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9C8B72; display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help</button>
                  </div>
                  <div class="input-wrap">
                    <input type="number" id="bs-bioage" placeholder="e.g. 28" />
                    <span>yrs</span>
                  </div>
                </div>
              </div>

              <div class="section-divider">Health Conditions & Wellness Profile</div>
              <div style="margin-bottom: 20px; background: #FFFFFF; border: 1px dashed var(--border-color); padding: 16px; border-radius: 8px;">
                <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; font-weight: 500;">Select active health conditions:</p>
                <div class="form-grid-2" style="gap: 12px; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Thyroid" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Thyroid Issues
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Knee Pains" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Knee Pains
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Skin Issues" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Skin Issues
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="PCOS" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    PCOS / PCOD
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Underweight" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Underweight (No Weight)
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Overweight" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Overweight
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Diabetes" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Diabetes
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Hypertension" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Hypertension (High BP)
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Cholesterol" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    High Cholesterol
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Joint Pain" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Joint Pain / Arthritis
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" value="Indigestion" style="width: 16px; height: 16px; accent-color: var(--primary-color);" />
                    Indigestion & Gas
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-main);">
                    <input type="checkbox" name="health-issue" id="chk-others" value="Others" style="width: 16px; height: 16px; accent-color: var(--primary-color);" onchange="BodySheet.toggleOthersInput()" />
                    Others (Specify)
                  </label>
                </div>
                <div id="others-text-wrap" class="hidden" style="margin-top: 12px;">
                  <input class="form-input" type="text" id="bs-health-others" placeholder="Describe other issues, e.g. Back Pain, Asthma..." style="padding-left: 16px; font-size: 13px;" />
                </div>
              </div>

              <!-- Keep notes textarea for typing logs in background -->
              <div class="form-group" style="display: none;">
                <textarea class="form-input" id="bs-notes" rows="3" placeholder="Add observations..."></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary btn-full" id="btn-save-client">Save Client Profile & Record</button>
              </div>
            </form>
          </div>

          <!-- ── LIVE PREVIEW & ASSESSMENT CARD ── -->
          <div class="preview-card card-container">
            <div class="client-preview-header">
              <div class="preview-avatar" id="prev-avatar">?</div>
              <h3 id="prev-name-display">New Client Assessment</h3>
              <p id="prev-phone-display">No WhatsApp linked</p>
            </div>

            <div class="preview-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
              <div class="preview-item">
                <div class="preview-item-val" id="prev-bmi-val">-</div>
                <div class="preview-item-lbl">BMI Index</div>
                <span class="preview-item-indicator" id="prev-bmi-ind">Healthy</span>
              </div>

              <div class="preview-item">
                <div class="preview-item-val" id="prev-visceral-val">-</div>
                <div class="preview-item-lbl">Visceral Fat</div>
                <span class="preview-item-indicator" id="prev-visceral-ind">Healthy</span>
              </div>

              <div class="preview-item">
                <div class="preview-item-val" id="prev-subcutaneous-val">-</div>
                <div class="preview-item-lbl">Subcutaneous Fat</div>
                <span class="preview-item-indicator" id="prev-subcutaneous-ind">Healthy</span>
              </div>

              <div class="preview-item">
                <div class="preview-item-val" id="prev-bodyfat-val">-</div>
                <div class="preview-item-lbl">Body Fat %</div>
                <span class="preview-item-indicator" id="prev-bodyfat-ind">Healthy</span>
              </div>

              <div class="preview-item">
                <div class="preview-item-val" id="prev-bmr-val">-</div>
                <div class="preview-item-lbl">BMR Metabolism</div>
                <span class="preview-item-indicator" id="prev-bmr-ind" style="color:#6B7C5E; background:#6B7C5E20;">Active</span>
              </div>

              <div class="preview-item">
                <div class="preview-item-val" id="prev-bioage-val">-</div>
                <div class="preview-item-lbl">Biological Age</div>
                <span class="preview-item-indicator" id="prev-bioage-ind">Optimal</span>
              </div>
            </div>

            <!-- Health Conditions Preview Tag Cloud -->
            <div id="preview-health-profile" class="hidden" style="margin-top: 16px; margin-bottom: 16px;">
              <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase;">Wellness Conditions Profile</span>
              <div id="preview-health-tags" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
                 <!-- Danger Board Assessment -->
             <div class="danger-assessment-card" id="danger-board">
               <div class="assessment-title" style="display: flex; align-items: center; gap: 6px;">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);">
                   <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"></path>
                   <path d="M9.8 6.1C13.5 10 15 12 19 12"></path>
                 </svg>
                 Sakria Health Assessment
               </div>
               <div class="assessment-text" id="danger-board-text">
                 All parameters present within normal health boundaries. Cellular indices and internal visceral fat ratios appear steady.
               </div>
             </div>
 
             <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
               <button class="btn-outline btn-full" id="btn-pdf-preview" disabled style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                   <polyline points="14 2 14 8 20 8"></polyline>
                   <line x1="16" y1="13" x2="8" y2="13"></line>
                   <line x1="16" y1="17" x2="8" y2="17"></line>
                   <polyline points="10 9 9 9 8 9"></polyline>
                 </svg>
                 Generate & Download PDF Report
               </button>
             </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.loadInputsIntoDOM();
    this.setLeadType(this.currentInputs.lead_type);
    this.bindInputs();
    this.updatePreview();
  },

  setStatus(status) {
    this.currentInputs.status = status;
    const activeBtn = document.getElementById("btn-status-active");
    const leadBtn = document.getElementById("btn-status-lead");
    if (activeBtn && leadBtn) {
      if (status === "Active") {
        activeBtn.style.backgroundColor = "var(--primary-color)";
        activeBtn.style.color = "white";
        leadBtn.style.backgroundColor = "transparent";
        leadBtn.style.color = "var(--text-primary)";
      } else {
        leadBtn.style.backgroundColor = "var(--primary-color)";
        leadBtn.style.color = "white";
        activeBtn.style.backgroundColor = "transparent";
        activeBtn.style.color = "var(--text-primary)";
      }
    }
  },

  setLeadType(type) {
    this.currentInputs.lead_type = type;
    const onlineBtn = document.getElementById("btn-type-online");
    const offlineBtn = document.getElementById("btn-type-offline");
    if (onlineBtn && offlineBtn) {
      if (type === "online") {
        onlineBtn.style.backgroundColor = "var(--primary-color)";
        onlineBtn.style.color = "white";
        offlineBtn.style.backgroundColor = "transparent";
        offlineBtn.style.color = "var(--text-primary)";
      } else {
        offlineBtn.style.backgroundColor = "var(--primary-color)";
        offlineBtn.style.color = "white";
        onlineBtn.style.backgroundColor = "transparent";
        onlineBtn.style.color = "var(--text-primary)";
      }
    }
  },

  loadInputsIntoDOM() {
    const inputs = [
      { id: "bs-name", value: this.currentInputs.name },
      { id: "bs-phone", value: this.currentInputs.phone },
      { id: "bs-date", value: this.currentInputs.date },
      { id: "bs-age", value: this.currentInputs.age },
      { id: "bs-gender", value: this.currentInputs.gender },
      { id: "bs-weight", value: this.currentInputs.weight },
      { id: "bs-height", value: this.currentInputs.height },
      { id: "bs-visceral", value: this.currentInputs.visceralFat },
      { id: "bs-subcutaneous", value: this.currentInputs.subcutaneousFat },
      { id: "bs-fat", value: this.currentInputs.bodyFat },
      { id: "bs-muscle", value: this.currentInputs.muscleMass },
      { id: "bs-bmr", value: this.currentInputs.bmr },
      { id: "bs-bmi", value: this.currentInputs.bmi },
      { id: "bs-bioage", value: this.currentInputs.biologicalAge },
      { id: "bs-notes", value: this.currentInputs.notes }
    ];

    inputs.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        el.value = item.value !== undefined ? item.value : "";
      }
    });

    // Populate health conditions checkboxes
    const checkboxes = document.querySelectorAll('input[name="health-issue"]');
    checkboxes.forEach(chk => {
      chk.checked = (this.currentInputs.healthIssues || []).includes(chk.value);
    });

    // Handle "Others" text wrap
    const chkOthers = document.getElementById("chk-others");
    const othersWrap = document.getElementById("others-text-wrap");
    const othersInput = document.getElementById("bs-health-others");
    if (chkOthers && othersWrap && othersInput) {
      const isOthersChecked = (this.currentInputs.healthIssues || []).includes("Others");
      chkOthers.checked = isOthersChecked;
      if (isOthersChecked) {
        othersWrap.classList.remove("hidden");
        othersInput.value = this.currentInputs.healthIssuesOthers || "";
      } else {
        othersWrap.classList.add("hidden");
        othersInput.value = "";
      }
    }
  },

  bindInputs() {
    const inputs = [
      { id: "bs-name", key: "name" },
      { id: "bs-phone", key: "phone" },
      { id: "bs-date", key: "date" },
      { id: "bs-age", key: "age" },
      { id: "bs-gender", key: "gender" },
      { id: "bs-weight", key: "weight" },
      { id: "bs-height", key: "height" },
      { id: "bs-visceral", key: "visceralFat" },
      { id: "bs-subcutaneous", key: "subcutaneousFat" },
      { id: "bs-fat", key: "bodyFat" },
      { id: "bs-muscle", key: "muscleMass" },
      { id: "bs-bmr", key: "bmr" },
      { id: "bs-bmi", key: "bmi" },
      { id: "bs-bioage", key: "biologicalAge" },
      { id: "bs-notes", key: "notes" }
    ];

    inputs.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        el.addEventListener("input", (e) => {
          this.currentInputs[item.key] = e.target.value;
          this.updatePreview();
        });
      }
    });

    const form = document.getElementById("body-sheet-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveClient();
      });
    }

    const btnPdf = document.getElementById("btn-pdf-preview");
    if (btnPdf) {
      btnPdf.addEventListener("click", () => this.triggerPdfDownload());
    }

    // Bind health check checkboxes
    const checkboxes = document.querySelectorAll("input[name='health-issue']");
    checkboxes.forEach(chk => {
      chk.addEventListener("change", () => {
        const checkedValues = [];
        checkboxes.forEach(c => {
          if (c.checked && c.value !== "Others") {
            checkedValues.push(c.value);
          }
        });
        this.currentInputs.healthIssues = checkedValues;
        this.updatePreview();
      });
    });

    const othersInput = document.getElementById("bs-health-others");
    if (othersInput) {
      othersInput.addEventListener("input", (e) => {
        this.currentInputs.healthIssuesOthers = e.target.value;
        this.updatePreview();
      });
    }
  },

  toggleOthersInput() {
    const chk = document.getElementById("chk-others");
    const wrap = document.getElementById("others-text-wrap");
    if (chk && wrap) {
      if (chk.checked) {
        wrap.classList.remove("hidden");
      } else {
        wrap.classList.add("hidden");
        const txt = document.getElementById("bs-health-others");
        if (txt) {
          txt.value = "";
          this.currentInputs.healthIssuesOthers = "";
        }
        this.updatePreview();
      }
    }
  },

  updatePreview() {
    const inputs = this.currentInputs;

    const avatarEl = document.getElementById("prev-avatar");
    const nameEl = document.getElementById("prev-name-display");
    const phoneEl = document.getElementById("prev-phone-display");

    // Render health tags in preview
    const healthProfileWrap = document.getElementById("preview-health-profile");
    const healthTagsContainer = document.getElementById("preview-health-tags");
    if (healthProfileWrap && healthTagsContainer) {
      const activeIssues = [...(inputs.healthIssues || [])];
      const chkOthers = document.getElementById("chk-others");
      if (chkOthers && chkOthers.checked && inputs.healthIssuesOthers && inputs.healthIssuesOthers.trim()) {
        activeIssues.push(inputs.healthIssuesOthers.trim());
      }

      if (activeIssues.length > 0) {
        healthProfileWrap.classList.remove("hidden");
        healthTagsContainer.innerHTML = activeIssues.map(issue => `
          <span style="background-color: var(--primary-light); color: var(--primary-dark); font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 600; border: 1px solid #DFE7D9; display: inline-flex; align-items: center; gap: 4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-dark);"><path d="M4.82 7.26A7.5 7.5 0 0 0 12 15a7.5 7.5 0 0 0 7.18-7.74"></path><path d="M12 15V21"></path><path d="M4 3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V4a1 1 0 0 0-1-1H4z"></path><path d="M20 3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V4a1 1 0 0 0-1-1h-6z"></path><circle cx="12" cy="21" r="2"></circle></svg> ${issue}
          </span>
        `).join("");
      } else {
        healthProfileWrap.classList.add("hidden");
        healthTagsContainer.innerHTML = "";
      }
    }

    if (inputs.name.trim()) {
      nameEl.textContent = inputs.name;
      const initials = inputs.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
      avatarEl.textContent = initials || "?";
    } else {
      nameEl.textContent = "New Client Assessment";
      avatarEl.textContent = "?";
    }

    phoneEl.innerHTML = inputs.phone.trim() ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; color: var(--text-secondary); display: inline-block;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>${inputs.phone}` : "No phone linked";

    const isCompleted = inputs.name.trim().length > 0 && inputs.phone.trim().length > 0 && inputs.date.trim().length > 0;
    const btnPdf = document.getElementById("btn-pdf-preview");
    if (btnPdf) btnPdf.disabled = !isCompleted;

    // Manual / Live Metrics preview
    const hasBMI = inputs.bmi !== undefined && inputs.bmi !== "" && inputs.bmi !== null;
    const bmiVal = hasBMI ? Number(inputs.bmi) : null;
    const bmiCat = bmiVal !== null ? Helpers.getBMICategory(bmiVal) : { label: "Not Recorded", color: "#6B7364", safe: true };

    const hasVisceral = inputs.visceralFat !== undefined && inputs.visceralFat !== "" && inputs.visceralFat !== null;
    const visVal = hasVisceral ? Number(inputs.visceralFat) : null;
    const visCat = visVal !== null ? Helpers.getVisceralFatCategory(visVal) : { label: "Not Recorded", color: "#6B7364", safe: true };

    const hasSubcutaneous = inputs.subcutaneousFat !== undefined && inputs.subcutaneousFat !== "" && inputs.subcutaneousFat !== null;
    const subVal = hasSubcutaneous ? Number(inputs.subcutaneousFat) : null;
    const subCat = subVal !== null ? Helpers.getSubcutaneousFatCategory(subVal) : { label: "Not Recorded", color: "#6B7364", safe: true };

    const hasBodyFat = inputs.bodyFat !== undefined && inputs.bodyFat !== "" && inputs.bodyFat !== null;
    const fatVal = hasBodyFat ? Number(inputs.bodyFat) : null;
    const fatCat = fatVal !== null ? Helpers.getBodyFatCategory(fatVal, Number(inputs.age), inputs.gender) : { label: "Not Recorded", color: "#6B7364", safe: true };

    const bmrVal = (inputs.bmr !== undefined && inputs.bmr !== "" && inputs.bmr !== null) ? Number(inputs.bmr) : null;

    const hasBioAge = inputs.biologicalAge !== undefined && inputs.biologicalAge !== "" && inputs.biologicalAge !== null;
    const bioAgeVal = hasBioAge ? Number(inputs.biologicalAge) : null;
    const bioCat = (bioAgeVal !== null && inputs.age) ? Helpers.getBiologicalAgeCategory(bioAgeVal, Number(inputs.age)) : { label: "Not Recorded", color: "#6B7364", safe: true };

    document.getElementById("prev-bmi-val").textContent = bmiVal !== null ? bmiVal.toFixed(1) : "-";
    const bmiInd = document.getElementById("prev-bmi-ind");
    bmiInd.textContent = bmiCat.label;
    bmiInd.style.backgroundColor = bmiCat.color + "20";
    bmiInd.style.color = bmiCat.color;

    document.getElementById("prev-visceral-val").textContent = visVal !== null ? visVal : "-";
    const visInd = document.getElementById("prev-visceral-ind");
    visInd.textContent = visCat.label;
    visInd.style.backgroundColor = visCat.color + "20";
    visInd.style.color = visCat.color;

    document.getElementById("prev-subcutaneous-val").textContent = subVal !== null ? subVal.toFixed(1) + "%" : "-";
    const subInd = document.getElementById("prev-subcutaneous-ind");
    subInd.textContent = subCat.label;
    subInd.style.backgroundColor = subCat.color + "20";
    subInd.style.color = subCat.color;

    document.getElementById("prev-bodyfat-val").textContent = fatVal !== null ? fatVal.toFixed(1) + "%" : "-";
    const fatInd = document.getElementById("prev-bodyfat-ind");
    fatInd.textContent = fatCat.label;
    fatInd.style.backgroundColor = fatCat.color + "20";
    fatInd.style.color = fatCat.color;

    document.getElementById("prev-bmr-val").textContent = bmrVal !== null ? bmrVal : "-";

    document.getElementById("prev-bioage-val").textContent = bioAgeVal !== null ? bioAgeVal + " yrs" : "-";
    const bioAgeInd = document.getElementById("prev-bioage-ind");
    bioAgeInd.textContent = bioCat.label;
    bioAgeInd.style.backgroundColor = bioCat.color + "20";
    bioAgeInd.style.color = bioCat.color;

    // Assess immediate warning items for operator's Danger Board
    let threatText = "";
    let isDangerous = false;

    if (bmiVal !== null && !bmiCat.safe) {
      threatText += `• **BMI Warning**: Value is ${bmiVal}. ${bmiCat.risk} <br/>`;
      isDangerous = true;
    }
    if (visVal !== null && !visCat.safe) {
      threatText += `• **High Visceral Organ Pressure**: Value is ${visVal}. ${visCat.risk} <br/>`;
      isDangerous = true;
    }
    if (bioAgeVal !== null && !bioCat.safe) {
      threatText += `• **Sluggish Biological Aging**: Cells are aging older than actual age. ${bioCat.risk} <br/>`;
      isDangerous = true;
    }

    const db = document.getElementById("danger-board");
    const dbt = document.getElementById("danger-board-text");
    if (isDangerous) {
      db.style.backgroundColor = "var(--danger-light)";
      db.style.border = "1px solid #F5D2CF";
      dbt.style.color = "#5C4543";
      dbt.innerHTML = `
        <span style="display:inline-flex; align-items:center; gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C93B2B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <strong>CRITICAL DANGER INDICATORS:</strong>
        </span>
        <br/>
        <div style="margin-top:8px; line-height: 1.5; font-size:11.5px;">${threatText}</div>
      `;
    } else {
      db.style.backgroundColor = "var(--primary-light)";
      db.style.border = "1px solid #DFE7D9";
      dbt.style.color = "var(--primary-dark)";
      dbt.innerHTML = `
        <span style="display:inline-flex; align-items:center; gap:6px; font-weight:700;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"></path>
            <path d="M9.8 6.1C13.5 10 15 12 19 12"></path>
          </svg>
          All Elements Safe:
        </span>
        Physical metrics and biological aging cycles are highly aligned inside healthy boundaries.
      `;
    }
  },

  saveClient() {
    const inputs = this.currentInputs;
    if (!inputs.name.trim() || !inputs.phone.trim()) {
      Helpers.showToast("Please fill in name and phone number.", "error");
      return;
    }

    // Auto-stamp today's date at the moment of save/update
    const todayDate = new Date().toISOString().split("T")[0];
    inputs.date = todayDate;
    const dateInput = document.getElementById("bs-date");
    if (dateInput) dateInput.value = todayDate;

    const cleanNum = (val, fallback = 0) => (val !== undefined && val !== "" && val !== null && !isNaN(val)) ? Number(val) : fallback;

    const bmiVal = inputs.bmi !== "" ? cleanNum(inputs.bmi) : 0;
    const visVal = inputs.visceralFat !== "" ? cleanNum(inputs.visceralFat) : 0;
    const subVal = inputs.subcutaneousFat !== "" ? cleanNum(inputs.subcutaneousFat) : 0;
    const bioAgeVal = inputs.biologicalAge !== "" ? cleanNum(inputs.biologicalAge) : 0;

    const bmiCat = bmiVal > 0 ? Helpers.getBMICategory(bmiVal) : { safe: true };
    const visCat = visVal > 0 ? Helpers.getVisceralFatCategory(visVal) : { safe: true };
    const subCat = subVal > 0 ? Helpers.getSubcutaneousFatCategory(subVal) : { safe: true };
    const bioCat = bioAgeVal > 0 ? Helpers.getBiologicalAgeCategory(bioAgeVal, cleanNum(inputs.age)) : { safe: true };

    const isFlagged = !bmiCat.safe || !visCat.safe || !subCat.safe || !bioCat.safe;

    const clientData = {
      name: inputs.name,
      phone: inputs.phone,
      date: inputs.date,
      age: cleanNum(inputs.age, 30),
      gender: inputs.gender,
      weight: inputs.weight !== "" ? cleanNum(inputs.weight) : 0,
      height: inputs.height !== "" ? cleanNum(inputs.height) : 0,
      visceralFat: visVal,
      subcutaneousFat: subVal,
      bodyFat: inputs.bodyFat !== "" ? cleanNum(inputs.bodyFat) : 0,
      muscleMass: inputs.muscleMass !== "" ? cleanNum(inputs.muscleMass) : 0,
      bmr: inputs.bmr !== "" ? cleanNum(inputs.bmr) : 0,
      biologicalAge: bioAgeVal,
      notes: inputs.notes || "",
      bmi: bmiVal,
      status: inputs.status || "Lead",
      lead_type: inputs.lead_type || "offline",
      flagged: isFlagged,
      healthIssues: inputs.healthIssues || [],
      healthIssuesOthers: inputs.healthIssuesOthers || ""
    };

    const clients = Store.getClients();
    const existing = clients.find(c => c.phone === inputs.phone);

    if (existing) {
      Store.updateClient(existing.id, clientData);
      Helpers.showToast(`Updated client profile: ${inputs.name}`, "success");
    } else {
      Store.addClient(clientData);
      Helpers.showToast(`Registered new client: ${inputs.name}`, "success");
    }

    window.location.hash = "#client-leads";
  },

  triggerPdfDownload() {
    const inputs = this.currentInputs;
    const cleanNum = (val, fallback = 0) => (val !== undefined && val !== "" && val !== null && !isNaN(val)) ? Number(val) : fallback;
    const mockClient = {
      ...inputs,
      bmi: inputs.bmi !== "" ? cleanNum(inputs.bmi) : 0,
      weight: inputs.weight !== "" ? cleanNum(inputs.weight) : 0,
      height: inputs.height !== "" ? cleanNum(inputs.height) : 0,
      visceralFat: inputs.visceralFat !== "" ? cleanNum(inputs.visceralFat) : 0,
      subcutaneousFat: inputs.subcutaneousFat !== "" ? cleanNum(inputs.subcutaneousFat) : 0,
      bodyFat: inputs.bodyFat !== "" ? cleanNum(inputs.bodyFat) : 0,
      muscleMass: inputs.muscleMass !== "" ? cleanNum(inputs.muscleMass) : 0,
      bmr: inputs.bmr !== "" ? cleanNum(inputs.bmr) : 0,
      biologicalAge: inputs.biologicalAge !== "" ? cleanNum(inputs.biologicalAge) : 0,
      createdAt: new Date().toISOString()
    };
    const fileName = `Wellness_Report_${inputs.name.replace(/\s+/g, '_')}.pdf`;
    Helpers.downloadReportPDF(mockClient, fileName)
      .then(() => {
        Helpers.showToast(`PDF Report downloaded successfully!`, "success");
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        Helpers.showToast("Failed to generate PDF report.", "error");
      });
  }
};

window.BodySheet = BodySheet;
