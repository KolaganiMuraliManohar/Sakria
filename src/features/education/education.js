/**
 * Sakria Wellness Guide & Parameter Education Module
 */

const Education = {
  activeTab: "bmi",

  parameters: {
    bmi: {
      title: "Body Mass Index (BMI)",
      image: "src/assets/education/bmi_guide.webp",
      desc: "Body Mass Index (BMI) is a medical calculation of your weight relative to your height. It serves as an initial diagnostic screening tool to classify body weight categories into underweight, normal, overweight, or obese.",
      lowTitle: "Under Range (BMI < 18.5) Risks",
      lowDesc: "Malnutrition, compromised immune function, osteoporosis (weak bones), hair loss, chronic fatigue, and elevated risk of vitamin deficiencies or muscle wasting.",
      highTitle: "Over Range (BMI > 25) Risks",
      highDesc: "Increased cardiac load, high blood pressure, elevated risk of type 2 diabetes, joint stress (especially knees and hips), cardiovascular disease, and sleep apnea.",
      precautions: [
        "Maintain a balanced diet rich in leafy greens, whole grains, and clean proteins.",
        "Perform at least 150 minutes of moderate cardiovascular exercises per week.",
        "Track food intake and ensure portion control rather than crash dieting."
      ]
    },
    visceral: {
      title: "Visceral Fat Level",
      image: "src/assets/education/visceral_fat_guide.webp",
      desc: "Visceral fat is the internal fat stored deep within the abdominal cavity. Unlike subcutaneous fat, it wraps around major internal organs such as the liver, stomach, and kidneys, making it biologically active and highly hazardous.",
      lowTitle: "Under Range (Level < 1) Risks",
      lowDesc: "Extremely rare; however, a lack of visceral fat can leave internal organs vulnerable to physical shock, structural bruising, and disrupt endocrine signaling.",
      highTitle: "Over Range (Level > 9) Risks",
      highDesc: "Highly active inflammatory cytokines release, severe risk of fatty liver disease, type 2 diabetes, arterial clogging, cardiovascular strokes, and metabolic syndrome.",
      precautions: [
        "Drastically cut processed sugars, refined carbohydrates, and hydrogenated oils.",
        "Incorporate daily active brisk walking or High-Intensity Interval Training (HIIT).",
        "Maintain regular sleep hygiene (7-8 hours) to reduce cortisol stress levels."
      ]
    },
    subcutaneous: {
      title: "Subcutaneous Fat Level",
      image: "src/assets/education/subcutaneous_fat_guide.webp",
      desc: "Subcutaneous fat is the soft fat layer located directly beneath the skin. It acts as the body's primary energy storehouse, temperature insulator, and protective cushion against physical trauma.",
      lowTitle: "Under Range (Low Fat) Risks",
      lowDesc: "Poor temperature regulation (constantly feeling cold), lack of energy reserves, skin dryness, joint discomfort due to reduced cushioning, and potential hormone imbalances.",
      highTitle: "Over Range (High Fat) Risks",
      highDesc: "Contributes to overall systemic obesity, excessive aesthetic/physical body weight burden, increased physical mobility strain, and general lethargy.",
      precautions: [
        "Focus on calorie-deficit nutrition by loading up on high-fiber vegetables.",
        "Incorporate strength training and muscle toning exercises twice a week.",
        "Stay fully hydrated with at least 3 liters of pure water daily."
      ]
    },
    bodyfat: {
      title: "Body Fat Percentage (%)",
      image: "src/assets/education/body_fat_guide.webp",
      desc: "Body Fat Percentage measures the total mass of fat divided by total body mass. It is a more accurate indicator of fitness than weight alone because it distinguishes between fat tissue and lean muscle tissue.",
      lowTitle: "Under Range (Low Fat %) Risks",
      lowDesc: "Essential fat levels are critical for survival (3-5% in men, 10-13% in women). Dropping below this causes hormone shutdown, chronic fatigue, and hair/skin degradation.",
      highTitle: "Over Range (High Fat %) Risks",
      highDesc: "Higher workload on your heart, sluggish cellular metabolic processes, joint pain, systemic inflammation, and lowered overall endurance.",
      precautions: [
        "Incorporate progressive resistance training to shift body composition towards lean tissue.",
        "Eat healthy fats (almonds, walnuts, avocados) while reducing simple carbs.",
        "Avoid sedentary routines; aim for 8,000 to 10,000 steps daily."
      ]
    },
    muscle: {
      title: "Muscle Mass",
      image: "src/assets/education/muscle_mass_guide.webp",
      desc: "Muscle Mass represents the total weight of skeletal, smooth, and cardiac muscles in your body. Maintaining high muscle mass is vital for posture, joint stability, and keeping your metabolic furnace burning.",
      lowTitle: "Under Range (Sarcopenia / Weakness) Risks",
      lowDesc: "Slower metabolic rate, physical weakness, increased risk of bone fractures, poor balance, joint instability, and rapid fat gain due to lower BMR.",
      highTitle: "Over Range (Extreme Mass) Risks",
      highDesc: "Usually healthy and harmless; however, bodybuilders with excessive mass can place a minor additional workload on their cardiovascular system.",
      precautions: [
        "Ensure protein intake matches your activity levels (1.2 - 2g per kg body weight).",
        "Do resistance training (bodyweight exercises, weights, resistance bands).",
        "Get adequate muscle recovery rest; avoid overtraining to prevent muscle breakdown."
      ]
    },
    bmr: {
      title: "Basal Metabolic Rate (BMR)",
      image: "src/assets/education/bmr_guide.webp",
      desc: "Basal Metabolic Rate is the minimum energy (expressed in calories) your body needs to survive and keep vital life-support systems (breathing, organs, circulation) operating at absolute rest.",
      lowTitle: "Under Range (Low Metabolism) Risks",
      lowDesc: "Extremely slow calorie burn, constant fatigue, feeling cold, immediate weight gain from small meals, sluggish thyroid function, and low stamina.",
      highTitle: "Over Range (High Metabolism) Risks",
      highDesc: "Difficult to maintain weight or build mass without consuming large quantities of calories. Can sometimes indicate thyroid hyper-activity.",
      precautions: [
        "Increase muscle mass to permanently raise your resting BMR.",
        "Eat smaller, frequent meals containing protein to trigger the thermic effect of food.",
        "Avoid prolonged crash-dieting, which tricks the body into slowing down its metabolism."
      ]
    },
    bioage: {
      title: "Biological Age",
      image: "src/assets/education/biological_age_guide.webp",
      desc: "Biological Age measures how old your body's cells and tissues actually are compared to your calendar (chronological) age. It is a marker of your cellular health and internal decay rate.",
      lowTitle: "Under Range (Younger Cells) Risks",
      lowDesc: "This is the optimal state! A biological age younger than your calendar age means your organs are functioning efficiently and cell regeneration is healthy.",
      highTitle: "Over Range (Accelerated Aging) Risks",
      highDesc: "Indicates rapid cellular decay, potential telomere shortening, high risk of early onset chronic diseases, lowered cellular energy levels, and faster cognitive/physical decline.",
      precautions: [
        "Prioritize antioxidant-rich foods (berries, green tea, dark chocolate) to fight cellular stress.",
        "Perform regular physical activity and reduce inflammatory foods (fast food, soda).",
        "Manage psychological stress through mindfulness, hobbies, and healthy social circles."
      ]
    }
  },

  render() {
    const isSpecialTab = ["calculator", "bia_tips", "habit_prescriber"].includes(this.activeTab);
    const active = isSpecialTab ? null : this.parameters[this.activeTab];

    const metricTabButtons = Object.entries(this.parameters).map(([key, value]) => `
      <button class="edu-tab-btn ${this.activeTab === key ? 'active' : ''}" onclick="Education.switchTab('${key}')" style="width: 100%; text-align: left; padding: 10px 12px; border: none; background: none; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 6px; color: ${this.activeTab === key ? 'var(--primary-dark)' : 'var(--text-secondary)'}; display: flex; align-items: center; gap: 8px; transition: all 0.2s; background-color: ${this.activeTab === key ? 'var(--primary-light)' : 'transparent'}; font-family:inherit;">
        ${this.activeTab === key 
          ? '<span style="width: 6px; height: 6px; border-radius: 50%; background-color: var(--primary-color); display: inline-block; flex-shrink: 0;"></span>' 
          : '<span style="width: 6px; height: 6px; border-radius: 50%; border: 1.5px solid #C4C4C4; display: inline-block; flex-shrink: 0;"></span>'}
        ${value.title}
      </button>
    `).join("");

    return `
      <div class="page-container">
        <div class="page-header" style="margin-bottom: 24px;">
          <div class="page-title-wrap">
            <h2 style="font-family: var(--font-display); font-weight: 700; color: var(--text-primary); display:inline-flex; align-items:center; gap:8px;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Interactive Coach & Wellness Guide
            </h2>
            <p style="color: var(--text-secondary); font-size: 13px;">Educate clients on metabolic health, calculate targets, and learn bio-impedance best practices.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start;">
          <!-- Left Tab Sidebar -->
          <div class="card-container" style="padding: 16px; display: flex; flex-direction: column; gap: 14px; background-color: #FFFFFF; border: 1px solid var(--border-color); border-radius: 12px;">
            
            <div>
              <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; padding-left: 8px; display:block; letter-spacing:0.5px;">Interactive Tools</span>
              <div style="display:flex; flex-direction:column; gap:4px;">
                <button class="edu-tab-btn ${this.activeTab === 'calculator' ? 'active' : ''}" onclick="Education.switchTab('calculator')" style="width: 100%; text-align: left; padding: 10px 12px; border: none; background: none; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 6px; color: ${this.activeTab === 'calculator' ? 'var(--primary-dark)' : 'var(--text-secondary)'}; display: flex; align-items: center; gap: 8px; transition: all 0.2s; background-color: ${this.activeTab === 'calculator' ? 'var(--primary-light)' : 'transparent'}; font-family:inherit;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Calorie & Macro Calculator
                </button>
                <button class="edu-tab-btn ${this.activeTab === 'habit_prescriber' ? 'active' : ''}" onclick="Education.switchTab('habit_prescriber')" style="width: 100%; text-align: left; padding: 10px 12px; border: none; background: none; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 6px; color: ${this.activeTab === 'habit_prescriber' ? 'var(--primary-dark)' : 'var(--text-secondary)'}; display: flex; align-items: center; gap: 8px; transition: all 0.2s; background-color: ${this.activeTab === 'habit_prescriber' ? 'var(--primary-light)' : 'transparent'}; font-family:inherit;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  Lifestyle Habit Prescriber
                </button>
              </div>
            </div>

            <div>
              <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; padding-left: 8px; display:block; letter-spacing:0.5px;">Coaching Resources</span>
              <div style="display:flex; flex-direction:column; gap:4px;">
                <button class="edu-tab-btn ${this.activeTab === 'bia_tips' ? 'active' : ''}" onclick="Education.switchTab('bia_tips')" style="width: 100%; text-align: left; padding: 10px 12px; border: none; background: none; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 6px; color: ${this.activeTab === 'bia_tips' ? 'var(--primary-dark)' : 'var(--text-secondary)'}; display: flex; align-items: center; gap: 8px; transition: all 0.2s; background-color: ${this.activeTab === 'bia_tips' ? 'var(--primary-light)' : 'transparent'}; font-family:inherit;">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
                  BIA Scale Best Practices
                </button>
              </div>
            </div>

            <div>
              <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; padding-left: 8px; display:block; letter-spacing:0.5px;">Metric Reference Limits</span>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${metricTabButtons}
              </div>
            </div>

          </div>

          <!-- Right Content Panel -->
          <div class="card-container" style="padding: 28px; background-color: #FFFFFF; border: 1px solid var(--border-color); border-radius: 12px; min-height: 480px;">
            ${isSpecialTab ? this.renderSpecialTab() : this.renderMetricTab(active)}
          </div>
        </div>
      </div>
    `;
  },

  renderMetricTab(active) {
    return `
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: start;">
        <!-- Parameter text details -->
        <div>
          <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0 0 10px 0;">${active.title}</h3>
          <p style="font-size: 13.5px; line-height: 1.6; color: var(--text-secondary); margin: 0 0 20px 0;">${active.desc}</p>

          <!-- Low and High Ranges -->
          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
            <div style="border-left: 3px solid #6B7C5E; padding-left: 14px;">
              <h4 style="font-size: 12.5px; font-weight: 700; color: #5C6E4F; margin: 0 0 4px 0;">${active.lowTitle}</h4>
              <p style="font-size: 12.5px; line-height: 1.5; color: var(--text-secondary); margin: 0;">${active.lowDesc}</p>
            </div>
            <div style="border-left: 3px solid var(--danger-color); padding-left: 14px;">
              <h4 style="font-size: 12.5px; font-weight: 700; color: var(--danger-color); margin: 0 0 4px 0;">${active.highTitle}</h4>
              <p style="font-size: 12.5px; line-height: 1.5; color: var(--text-secondary); margin: 0;">${active.highDesc}</p>
            </div>
          </div>

          <!-- Precautions -->
          <div>
            <h4 style="font-size: 12.5px; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color); flex-shrink: 0;"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"></path><path d="M9.8 6.1C13.5 10 15 12 19 12"></path></svg>
              Suggested Precautions & Cures
            </h4>
            <ul style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px;">
              ${active.precautions.map(p => `<li style="font-size: 12.5px; line-height: 1.5; color: var(--text-secondary);">${p}</li>`).join("")}
            </ul>
          </div>
        </div>

        <!-- Parameter Visualization -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="background-color: #FAF8F5; border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; overflow: hidden; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center;">
            <img src="${active.image}?v=${new Date().getTime()}" style="max-width: 100%; border-radius: 8px; display: block;" alt="${active.title} visual illustration" />
          </div>
          <span style="font-size: 11px; color: var(--text-muted); text-align: center; font-style: italic;">Visual composition matching wellness parameters guide.</span>
        </div>
      </div>
    `;
  },

  renderSpecialTab() {
    if (this.activeTab === "calculator") {
      return `
        <div class="calculator-container" style="display:flex; flex-direction:column; gap:20px;">
          <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-primary); margin:0;">Interactive Calorie & Macro Calculator</h3>
          <p style="font-size:13px; color:var(--text-secondary); margin:0 0 10px 0;">Estimate the client's energy expenditure (TDEE) and configure personalized nutritional target distributions.</p>
          
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:32px; align-items:start;">
            <!-- Form Card -->
            <div style="background-color: #FAF8F5; border: 1px solid var(--border-color); border-radius:12px; padding:20px; display:flex; flex-direction:column; gap:16px;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11px; font-weight:700;">Client Gender</label>
                  <select class="form-input" id="calc-gender" style="height:36px; padding:0 8px; font-size:12.5px; width:100%;">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11px; font-weight:700;">Client Age (years)</label>
                  <input type="number" class="form-input" id="calc-age" placeholder="30" value="30" required style="height:36px; padding-left:8px; font-size:12.5px; width:100%;" />
                </div>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11px; font-weight:700;">Weight (kg)</label>
                  <input type="number" step="0.1" class="form-input" id="calc-weight" placeholder="70" value="70" required style="height:36px; padding-left:8px; font-size:12.5px; width:100%;" />
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label" style="font-size:11px; font-weight:700;">Height (cm)</label>
                  <input type="number" class="form-input" id="calc-height" placeholder="170" value="170" required style="height:36px; padding-left:8px; font-size:12.5px; width:100%;" />
                </div>
              </div>

              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Daily Activity Level</label>
                <select class="form-input" id="calc-activity" style="height:36px; padding:0 8px; font-size:12.5px; width:100%;">
                  <option value="1.2">Sedentary (Little or no exercise)</option>
                  <option value="1.375">Lightly Active (Exercise 1-3 days/wk)</option>
                  <option value="1.55" selected>Moderately Active (Exercise 3-5 days/wk)</option>
                  <option value="1.725">Very Active (Heavy exercise 6-7 days/wk)</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:11px; font-weight:700;">Primary Fitness Goal</label>
                <select class="form-input" id="calc-goal" style="height:36px; padding:0 8px; font-size:12.5px; width:100%;">
                  <option value="lose" selected>Fat Loss (-500 kcal deficit)</option>
                  <option value="maintain">Maintenance (TDEE)</option>
                  <option value="gain">Muscle Gain (+300 kcal surplus)</option>
                </select>
              </div>

              <button type="button" class="btn-primary" onclick="Education.calculateMetabolics()" style="background-color: var(--primary-color); border:none; height:38px; border-radius:6px; font-weight:600; cursor:pointer; margin-top:8px; color:white;">
                Calculate Target Metrics
              </button>
            </div>

            <!-- Results Display -->
            <div id="calc-results-card" style="border: 1px solid var(--border-color); border-radius:12px; padding:20px; background-color:#FFFFFF; display:flex; flex-direction:column; gap:16px; min-height:320px; justify-content:center; align-items:center;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B7C5E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path></svg>
              <span style="color:var(--text-secondary); font-size:13.5px; text-align:center;">Enter the client's physical metrics and click Calculate to view targets.</span>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === "habit_prescriber") {
      return `
        <div class="prescriber-container" style="display:flex; flex-direction:column; gap:20px;">
          <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-primary); margin:0;">Lifestyle & Habit Prescriber</h3>
          <p style="font-size:13px; color:var(--text-secondary); margin:0 0 10px 0;">Select the client's metabolic challenges to instantly build a personalized daily lifestyle prescription that you can copy and share.</p>
          
          <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:28px; align-items:start;">
            <!-- Checklist -->
            <div style="background-color: #FAF8F5; border: 1px solid var(--border-color); border-radius:12px; padding:20px; display:flex; flex-direction:column; gap:12px;">
              <h4 style="font-size:12.5px; font-weight:700; color:var(--primary-dark); margin:0 0 8px 0; text-transform:uppercase;">Flagged Challenges</h4>
              
              <label style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-primary); cursor:pointer;">
                <input type="checkbox" id="flag-visceral" onchange="Education.generateHabits()" style="accent-color:var(--primary-color); width:16px; height:16px;" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                High Visceral Fat (Level > 9)
              </label>
              <label style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-primary); cursor:pointer;">
                <input type="checkbox" id="flag-muscle" onchange="Education.generateHabits()" style="accent-color:var(--primary-color); width:16px; height:16px;" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Low Muscle Mass
              </label>
              <label style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-primary); cursor:pointer;">
                <input type="checkbox" id="flag-bioage" onchange="Education.generateHabits()" style="accent-color:var(--primary-color); width:16px; height:16px;" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Accelerated Cell Aging (High Bio-Age)
              </label>
              <label style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-primary); cursor:pointer;">
                <input type="checkbox" id="flag-bodyfat" onchange="Education.generateHabits()" style="accent-color:var(--primary-color); width:16px; height:16px;" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                High Body Fat Percentage (%)
              </label>
              <label style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-primary); cursor:pointer;">
                <input type="checkbox" id="flag-bmr" onchange="Education.generateHabits()" style="accent-color:var(--primary-color); width:16px; height:16px;" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
                Slow Metabolism (Low BMR)
              </label>
              <label style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-primary); cursor:pointer;">
                <input type="checkbox" id="flag-bmi" onchange="Education.generateHabits()" style="accent-color:var(--primary-color); width:16px; height:16px;" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                Elevated BMI / Weight
              </label>
              <label style="display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-primary); cursor:pointer;">
                <input type="checkbox" id="flag-hydration" onchange="Education.generateHabits()" style="accent-color:var(--primary-color); width:16px; height:16px;" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                Low Hydration Levels
              </label>
            </div>

            <!-- Generated Plan Output -->
            <div id="habit-results-card" style="border: 1px solid var(--border-color); border-radius:12px; padding:20px; background-color:#FFFFFF; display:flex; flex-direction:column; gap:16px; min-height:360px; justify-content:center; align-items:center;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B7C5E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span style="color:var(--text-secondary); font-size:13.5px; text-align:center;">Select one or more flagged challenges on the left to build the customized action plan card.</span>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === "bia_tips") {
      return `
        <div class="tips-container" style="display:flex; flex-direction:column; gap:20px;">
          <h3 style="font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-primary); margin:0;">BIA Scale Measurement Best Practices</h3>
          <p style="font-size:13px; color:var(--text-secondary); margin:0 0 10px 0;">Scientific tips for getting accurate body composition metrics from Tanita, Omron, or InBody scales.</p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            <div style="border: 1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; gap:16px; background-color:#FAF8F5; align-items: flex-start;">
              <div style="color: var(--primary-color); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background-color: var(--primary-light); flex-shrink: 0; margin-top: 2px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <h4 style="font-size:13.5px; font-weight:700; color:var(--primary-dark); margin:0 0 6px 0;">Consistent Testing Time</h4>
                <p style="font-size:12.5px; line-height:1.5; color:var(--text-secondary); margin:0;">Measure at the same time of day. The ideal time is immediately upon waking up, after using the restroom, and before consuming food or liquids.</p>
              </div>
            </div>

            <div style="border: 1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; gap:16px; background-color:#FAF8F5; align-items: flex-start;">
              <div style="color: var(--primary-color); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background-color: var(--primary-light); flex-shrink: 0; margin-top: 2px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              </div>
              <div>
                <h4 style="font-size:13.5px; font-weight:700; color:var(--primary-dark); margin:0 0 6px 0;">Hydration State Consistency</h4>
                <p style="font-size:12.5px; line-height:1.5; color:var(--text-secondary); margin:0;">Dehydration decreases conductivity, falsely inflating body fat percentages. Avoid heavy caffeine/alcohol intake 12 hours before measuring.</p>
              </div>
            </div>

            <div style="border: 1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; gap:16px; background-color:#FAF8F5; align-items: flex-start;">
              <div style="color: var(--primary-color); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background-color: var(--primary-light); flex-shrink: 0; margin-top: 2px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <div>
                <h4 style="font-size:13.5px; font-weight:700; color:var(--primary-dark); margin:0 0 6px 0;">Avoid Exercise Before Test</h4>
                <p style="font-size:12.5px; line-height:1.5; color:var(--text-secondary); margin:0;">Do not test within 3 hours of strenuous workouts. Hydration shifts to active muscles change localized electrical impedance dynamics.</p>
              </div>
            </div>

            <div style="border: 1px solid var(--border-color); border-radius:12px; padding:16px; display:flex; gap:16px; background-color:#FAF8F5; align-items: flex-start;">
              <div style="color: var(--primary-color); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background-color: var(--primary-light); flex-shrink: 0; margin-top: 2px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              </div>
              <div>
                <h4 style="font-size:13.5px; font-weight:700; color:var(--primary-dark); margin:0 0 6px 0;">Correct Electrode Posture</h4>
                <p style="font-size:12.5px; line-height:1.5; color:var(--text-secondary); margin:0;">Ensure bare feet are clean and centered on electrodes. Keep arms extended at 90 degrees away from the torso to avoid cross-conduction.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  calculateMetabolics() {
    const gender = document.getElementById("calc-gender").value;
    const age = parseInt(document.getElementById("calc-age").value) || 30;
    const weight = parseFloat(document.getElementById("calc-weight").value) || 70;
    const height = parseFloat(document.getElementById("calc-height").value) || 170;
    const activity = parseFloat(document.getElementById("calc-activity").value) || 1.55;
    const goal = document.getElementById("calc-goal").value;

    // BMR using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    bmr = Math.round(bmr);

    // TDEE
    const tdee = Math.round(bmr * activity);

    // Target Calories
    let targetCalories = tdee;
    if (goal === "lose") {
      targetCalories = tdee - 500;
    } else if (goal === "gain") {
      targetCalories = tdee + 300;
    }
    // Safety check: don't let target go below BMR * 0.85
    if (targetCalories < bmr * 0.85) {
      targetCalories = Math.round(bmr * 0.85);
    }

    // Macro Calculation
    let proteinGrams = 0;
    if (goal === "lose") {
      proteinGrams = Math.round(weight * 2.0);
    } else if (goal === "gain") {
      proteinGrams = Math.round(weight * 2.2);
    } else {
      proteinGrams = Math.round(weight * 1.6);
    }
    const proteinCalories = proteinGrams * 4;

    // Fats: 25% of target calories
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: remaining calories
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.max(0, Math.round(carbCalories / 4));

    // Percentages
    const proteinPct = Math.round((proteinCalories / targetCalories) * 100);
    const fatPct = Math.round((fatCalories / targetCalories) * 100);
    const carbPct = Math.round((carbCalories / targetCalories) * 100);

    const resultsCard = document.getElementById("calc-results-card");
    if (resultsCard) {
      resultsCard.style.alignItems = "stretch";
      resultsCard.style.justifyContent = "flex-start";
      resultsCard.innerHTML = `
        <h4 style="font-family: var(--font-display); font-size:14px; font-weight:700; color:var(--primary-dark); margin:0 0 10px 0; border-bottom: 1px solid var(--border-color); padding-bottom:8px; display:flex; align-items:center; gap:8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Calculated Targets Summary
        </h4>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="background:#FAF8F5; padding:10px; border-radius:8px; border: 1px solid var(--border-color);">
            <span style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; display:block;">Basal Metabolic Rate</span>
            <strong style="font-size:16px; color:var(--text-primary);">${bmr} <span style="font-size:10px; font-weight:normal;">kcal/day</span></strong>
          </div>
          <div style="background:#FAF8F5; padding:10px; border-radius:8px; border: 1px solid var(--border-color);">
            <span style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; display:block;">Total Daily Expenditure</span>
            <strong style="font-size:16px; color:var(--text-primary);">${tdee} <span style="font-size:10px; font-weight:normal;">kcal/day</span></strong>
          </div>
        </div>

        <div style="background:#6B7C5E; color:white; padding:14px; border-radius:8px; text-align:center; box-shadow: var(--shadow-sm);">
          <span style="font-size:10px; font-weight:700; text-transform:uppercase; display:block; opacity:0.85;">Daily Target Intake Goal</span>
          <strong style="font-size:22px; display:block; margin:4px 0;">${targetCalories} kcal</strong>
          <span style="font-size:11px; opacity:0.9;">Recommended energy intake for ${goal === 'lose' ? 'fat loss' : goal === 'gain' ? 'muscle gain' : 'weight maintenance'}.</span>
        </div>

        <div>
          <span style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px;">Macronutrient Breakdown</span>
          
          <div style="display:flex; flex-direction:column; gap:8px;">
            <!-- Protein -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:600; margin-bottom:4px;">
                <span style="color:#2F3E2B; display:flex; align-items:center; gap:6px;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #6B7C5E; display: inline-block;"></span>
                  Protein (${proteinPct}%)
                </span>
                <span style="color:var(--text-primary);">${proteinGrams}g <span style="font-size:10.5px; color:var(--text-muted); font-weight:normal;">(${proteinCalories} kcal)</span></span>
              </div>
              <div style="background:#EAE5DB; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#6B7C5E; width:${proteinPct}%; height:100%;"></div>
              </div>
            </div>
            <!-- Fats -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:600; margin-bottom:4px;">
                <span style="color:#A16207; display:flex; align-items:center; gap:6px;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #D97706; display: inline-block;"></span>
                  Fats (${fatPct}%)
                </span>
                <span style="color:var(--text-primary);">${fatGrams}g <span style="font-size:10.5px; color:var(--text-muted); font-weight:normal;">(${fatCalories} kcal)</span></span>
              </div>
              <div style="background:#EAE5DB; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#D97706; width:${fatPct}%; height:100%;"></div>
              </div>
            </div>
            <!-- Carbs -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:600; margin-bottom:4px;">
                <span style="color:#0F766E; display:flex; align-items:center; gap:6px;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #0F766E; display: inline-block;"></span>
                  Carbohydrates (${carbPct}%)
                </span>
                <span style="color:var(--text-primary);">${carbGrams}g <span style="font-size:10.5px; color:var(--text-muted); font-weight:normal;">(${carbCalories} kcal)</span></span>
              </div>
              <div style="background:#EAE5DB; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#0F766E; width:${carbPct}%; height:100%;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  generateHabits() {
    const flags = {
      visceral: document.getElementById("flag-visceral").checked,
      muscle: document.getElementById("flag-muscle").checked,
      bioage: document.getElementById("flag-bioage").checked,
      bodyfat: document.getElementById("flag-bodyfat").checked,
      bmr: document.getElementById("flag-bmr").checked,
      bmi: document.getElementById("flag-bmi").checked,
      hydration: document.getElementById("flag-hydration").checked
    };

    const hasSelection = Object.values(flags).some(v => v);
    const resultsCard = document.getElementById("habit-results-card");
    if (!resultsCard) return;

    if (!hasSelection) {
      resultsCard.style.alignItems = "center";
      resultsCard.style.justifyContent = "center";
      resultsCard.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B7C5E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span style="color:var(--text-secondary); font-size:13.5px; text-align:center;">Select one or more flagged challenges on the left to build the customized action plan card.</span>
      `;
      return;
    }

    const diet = [];
    const exercise = [];
    const lifestyle = [];

    if (flags.visceral) {
      diet.push("Eliminate sugars and refined grains (white rice, bakery items) to curb fat accumulation around internal organs.");
      exercise.push("Perform High-Intensity Interval Training (HIIT) or short brisk runs (20 mins, 3x/week) to target visceral stores.");
      lifestyle.push("Ensure 7.5+ hours of solid sleep nightly to regulate cortisol (stress hormone) levels.");
    }
    if (flags.muscle) {
      diet.push("Consume at least 1.6g to 2g of high-quality protein per kg of body weight daily (clean whey, lean meat, panel/legumes).");
      exercise.push("Conduct resistance workouts (bodyweight circuits, dumbbells, or resistance bands) 3 times a week.");
      lifestyle.push("Avoid extreme calorie starvation or crash diets which break down muscle tissue.");
    }
    if (flags.bioage) {
      diet.push("Boost antioxidant intake by consuming berries, spinach, green tea, and healthy fats (walnuts, olive oil).");
      exercise.push("Maintain a baseline of 30 minutes of low-impact cardiovascular activity (brisk walking) daily.");
      lifestyle.push("Adopt a 5-minute daily breathing or mindfulness exercise to counter oxidative cellular stress.");
    }
    if (flags.bodyfat) {
      diet.push("Adopt a structured caloric deficit with fiber-rich whole foods, filling half your plate with non-starchy vegetables.");
      exercise.push("Combine muscle-building resistance training (3 days) with low-intensity active walking (3 days).");
      lifestyle.push("Track your daily steps and target a consistent minimum of 8,000 steps daily.");
    }
    if (flags.bmr) {
      diet.push("Distribute protein intake across 4 structured smaller meals to increase the Thermic Effect of Food (TEF).");
      exercise.push("Focus heavily on building muscle tissue to naturally increase your resting energy expenditure (BMR).");
      lifestyle.push("Incorporate daily non-exercise movement: stand up every hour, take the stairs instead of lift.");
    }
    if (flags.bmi) {
      diet.push("Adopt portion control strategies and swap liquid calories (sodas, juices) for water or calorie-free herbal teas.");
      exercise.push("Begin low-impact workouts (swimming, cycling, walking) to avoid knee joint strain.");
      lifestyle.push("Keep a food photo journal for 7 days to identify unconscious calorie traps.");
    }
    if (flags.hydration) {
      diet.push("Drink 2 glasses of pure water immediately upon waking, and 1 glass 30 minutes before every meal.");
      exercise.push("Add 500ml of water with electrolytes for every 30 minutes of sweat-inducing exercise.");
      lifestyle.push("Carry a reusable 1L flask, targeting 3.5 liters daily, and track completion.");
    }

    let textPrescription = `*SAKRIA WELLNESS ROADMAP*\n\n`;
    textPrescription += `Here is your daily lifestyle action plan:\n\n`;
    textPrescription += `🥗 DIETARY RECOMMENDATIONS:\n`;
    diet.forEach((item, idx) => { textPrescription += `${idx + 1}. ${item}\n`; });
    textPrescription += `\n🏃 PHYSICAL MOVEMENT:\n`;
    exercise.forEach((item, idx) => { textPrescription += `${idx + 1}. ${item}\n`; });
    textPrescription += `\n✨ DAILY WELLNESS HABITS:\n`;
    lifestyle.forEach((item, idx) => { textPrescription += `${idx + 1}. ${item}\n`; });

    resultsCard.style.alignItems = "stretch";
    resultsCard.style.justifyContent = "flex-start";
    resultsCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid var(--border-color); padding-bottom:8px; margin-bottom:12px;">
        <h4 style="font-family: var(--font-display); font-size:14px; font-weight:700; color:var(--primary-dark); margin:0; display:flex; align-items:center; gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M22 12H2"></path></svg>
          Prescribed Habit Roadmap
        </h4>
        <button class="btn-primary" onclick="Education.copyPrescription()" style="background-color: var(--primary-color); border:none; height:28px; font-size:11px; padding:0 12px; border-radius:4px; cursor:pointer; color:white; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy Prescription
        </button>
      </div>

      <textarea id="habit-text-holder" style="display:none;">${textPrescription}</textarea>

      <div style="display:flex; flex-direction:column; gap:14px; max-height:420px; overflow-y:auto; padding-right:4px;">
        <div>
          <span style="font-size:10.5px; color:#5C6E4F; font-weight:700; text-transform:uppercase; display:inline-flex; align-items:center; gap:6px; margin-bottom:6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 6v6l4 2"></path></svg>
            Dietary Adjustments
          </span>
          <ul style="margin:0; padding-left:16px; font-size:12px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
            ${diet.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
 
        <div>
          <span style="font-size:10.5px; color:#A16207; font-weight:700; text-transform:uppercase; display:inline-flex; align-items:center; gap:6px; margin-bottom:6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Physical Movement
          </span>
          <ul style="margin:0; padding-left:16px; font-size:12px; color:var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
            ${exercise.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
 
        <div>
          <span style="font-size:10.5px; color:#0F766E; font-weight:700; text-transform:uppercase; display:inline-flex; align-items:center; gap:6px; margin-bottom:6px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Daily Habits
          </span>
          <ul style="margin:0; padding-left:16px; font-size:12px; color:var(--text-secondary); display:flex; flex-direction:column; gap:4px;">
            ${lifestyle.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  },

  copyPrescription() {
    const textHolder = document.getElementById("habit-text-holder");
    if (textHolder) {
      textHolder.select();
      textHolder.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(textHolder.value);
      alert("Lifestyle habit prescription copied to clipboard!");
    }
  },

  init() {},

  switchTab(tabKey) {
    this.activeTab = tabKey;
    const main = document.getElementById("main-content");
    if (main) {
      main.innerHTML = this.render();
      this.init();
    }
  },

  openParameterModal(paramId) {
    const param = this.parameters[paramId];
    if (!param) return;

    const modal = document.getElementById("modal-root");
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 800px; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-lg);">
        <div class="modal-header" style="background-color: var(--primary-color); padding: 16px 24px; color: white; display: flex; align-items: center; justify-content: space-between;">
          <span class="modal-title" style="font-family: var(--font-display); font-size:16px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:white; flex-shrink:0;">
              <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"></path>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
            </svg>
            Wellness Guide: ${param.title}
          </span>
          <button class="btn-close" onclick="document.getElementById('modal-root').classList.add('hidden')" style="color: white; font-size: 24px;">×</button>
        </div>
        <div class="modal-body" style="padding: 28px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; max-height: 80vh; overflow-y: auto;">
          <div>
            <h3 style="font-family: var(--font-display); font-size: 19px; font-weight: 700; color: var(--text-primary); margin: 0 0 10px 0;">${param.title}</h3>
            <p style="font-size: 13.5px; line-height: 1.55; color: var(--text-secondary); margin: 0 0 20px 0;">${param.desc}</p>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
              <div style="border-left: 3px solid #6B7C5E; padding-left: 12px;">
                <h4 style="font-size: 12.5px; font-weight: 700; color: #5C6E4F; margin: 0 0 2px 0;">${param.lowTitle}</h4>
                <p style="font-size: 12px; line-height: 1.45; color: var(--text-secondary); margin: 0;">${param.lowDesc}</p>
              </div>
              <div style="border-left: 3px solid var(--danger-color); padding-left: 12px;">
                <h4 style="font-size: 12.5px; font-weight: 700; color: var(--danger-color); margin: 0 0 2px 0;">${param.highTitle}</h4>
                <p style="font-size: 12px; line-height: 1.45; color: var(--text-secondary); margin: 0;">${param.highDesc}</p>
              </div>
            </div>

            <div>
              <h4 style="font-size: 12.5px; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color); flex-shrink: 0;"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"></path><path d="M9.8 6.1C13.5 10 15 12 19 12"></path></svg>
                Suggested Precautions & Cures
              </h4>
              <ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
                ${param.precautions.map(p => `<li style="font-size: 12.5px; line-height: 1.45; color: var(--text-secondary);">${p}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="background-color: #FAF8F5; border: 1px solid var(--border-color); border-radius: 12px; padding: 8px; overflow: hidden;">
              <img src="${param.image}?v=${new Date().getTime()}" style="width: 100%; border-radius: 8px; display: block;" alt="${param.title} visual" />
            </div>
          </div>
        </div>
        <div class="modal-footer" style="padding:12px 24px; display:flex; justify-content:flex-end; background-color:#F8F5F0; border-top:1px solid #EAE5DB;">
          <button class="btn-primary" onclick="document.getElementById('modal-root').classList.add('hidden')" style="background-color:var(--primary-color); border:none; cursor:pointer; font-weight:600; padding:8px 18px; border-radius:6px; color:white;">Got It</button>
        </div>
      </div>
    `;
    modal.classList.remove("hidden");
  }
};

window.Education = Education;
