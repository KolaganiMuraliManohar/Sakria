/**
 * Sakria Helpers - Upgraded with BMR, Biological Age, Subcutaneous Fat, dynamic Safe/Unsafe color coding, and premium customized PDF layouts.
 */

const Helpers = {
  // BMI = kg / m^2
  calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm) return 0;
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  },

  // Mifflin-St Jeor calculation
  calculateBMR(weightKg, heightCm, age, gender) {
    if (!weightKg || !heightCm || !age) return 0;
    if (gender === "Male") {
      return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
    } else {
      return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    }
  },

  getBMICategory(bmi) {
    if (bmi < 18.5) return { label: "Underweight", color: "#D16A5E", safe: false, risk: "Elevated risk of nutrient deficiency and osteoporosis." };
    if (bmi < 25) return { label: "Normal (Safe)", color: "#6B7C5E", safe: true, risk: "Optimal metabolic load." };
    if (bmi < 30) return { label: "Overweight", color: "#E09C5A", safe: false, risk: "Elevated cardiovascular and physical skeletal load." };
    return { label: "Obese (Danger)", color: "#D16A5E", safe: false, risk: "High metabolic disorder and cardiovascular syndrome risk." };
  },

  getVisceralFatCategory(lvl) {
    if (lvl <= 9) return { label: "Healthy (Safe)", color: "#6B7C5E", safe: true, risk: "Organ fat levels inside healthy margins." };
    if (lvl <= 14) return { label: "High (Unsafe)", color: "#E09C5A", safe: false, risk: "Arterial stress surrounding crucial metabolic organs." };
    return { label: "Dangerously High", color: "#D16A5E", safe: false, risk: "Visceral lipid overload, severe organ compression, high hepatic stress." };
  },

  getBiologicalAgeCategory(bioAge, actualAge) {
    const difference = bioAge - actualAge;
    if (difference > 5) {
      return {
        label: "Sluggish Cellular Aging",
        color: "#D16A5E",
        safe: false,
        risk: `Cells are aging ${difference} years faster than chronological benchmarks. Suggests cellular oxidization and sluggish recovery.`
      };
    }
    if (difference > 0) {
      return {
        label: "Mild Premature Aging",
        color: "#E09C5A",
        safe: false,
        risk: `Cellular profile is ${difference} years older than calendar age. Calibration advised.`
      };
    }
    return {
      label: "Youthful / Safe",
      color: "#6B7C5E",
      safe: true,
      risk: "Cellular renewal index is optimal, matching or beating chronological benchmarks."
    };
  },

  getBodyFatCategory(pct, age, gender = "Male") {
    const isMale = gender === "Male";
    if (isMale) {
      if (pct < 8) return { label: "Underfat (Unsafe)", color: "#D16A5E", safe: false, risk: "Deficient lipid reserve, low energy." };
      if (pct <= 20) return { label: "Optimal (Safe)", color: "#6B7C5E", safe: true, risk: "Optimal ratio." };
      return { label: "Overfat (Unsafe)", color: "#D16A5E", safe: false, risk: "Systemic cellular inflammation load." };
    } else {
      if (pct < 15) return { label: "Underfat (Unsafe)", color: "#D16A5E", safe: false, risk: "Hormonal deficiency threat." };
      if (pct <= 28) return { label: "Optimal (Safe)", color: "#6B7C5E", safe: true, risk: "Stable systemic composition." };
      return { label: "Overfat (Unsafe)", color: "#D16A5E", safe: false, risk: "Cardiovascular and metabolic strain." };
    }
  },

  getSubcutaneousFatCategory(pct) {
    if (!pct) return { label: "Not Recorded", color: "#6B7364", safe: true, risk: "N/A" };
    if (pct < 12) return { label: "Low (Unsafe)", color: "#D16A5E", safe: false, risk: "Deficient subcutaneous insulation and energy buffer." };
    if (pct <= 20) return { label: "Healthy (Safe)", color: "#6B7C5E", safe: true, risk: "Optimal subcutaneous fat thickness." };
    return { label: "High (Unsafe)", color: "#D16A5E", safe: false, risk: "Excessive superficial adipose tissue storage." };
  },

  generateReportPDF(client) {
    const op = Store.getOperator() || {};
    
    const bmiVal = client.bmi ? Number(client.bmi) : 0;
    const bmrVal = client.bmr ? Number(client.bmr) : 0;
    const bodyFatVal = client.bodyFat ? Number(client.bodyFat) : 0;
    const visceralVal = client.visceralFat ? Number(client.visceralFat) : 0;
    const subcutaneousVal = client.subcutaneousFat ? Number(client.subcutaneousFat) : 0;
    const muscleVal = client.muscleMass ? Number(client.muscleMass) : 0;
    const bioAgeVal = (client.biologicalAge || client.bioAge || client.biological_age) ? Number(client.biologicalAge || client.bioAge || client.biological_age) : 0;
    const weightVal = client.weight ? Number(client.weight) : 0;
    const heightVal = client.height ? Number(client.height) : 0;
    const ageVal = client.age ? Number(client.age) : 30;
    const gender = (client.gender || "Male").trim();

    // Color helpers matching the red/green risk guidelines
    const getBmiColor = (val) => {
      if (val <= 0) return "#475569";
      if (val >= 18.5 && val <= 24.9) return "#15803D"; // Green (Healthy)
      return "#B91C1C"; // Red (Alert)
    };

    const getBmrColor = (val, g) => {
      if (val <= 0) return "#475569";
      const optimal = g === "Female" ? 1300 : 1600;
      return val >= optimal ? "#15803D" : "#B91C1C"; // Green (Optimal) vs Red (Low)
    };

    const getBioAgeColor = (val, age) => {
      if (val <= 0) return "#475569";
      return val <= age ? "#15803D" : "#B91C1C"; // Green (Optimal cellular repair) vs Red (Accelerated aging)
    };

    const getVisceralColor = (val) => {
      if (val <= 0) return "#475569";
      return val <= 9 ? "#15803D" : "#B91C1C"; // Green (Safe) vs Red (High/Dangerous organ load)
    };

    const getSubcutaneousColor = (val) => {
      if (val <= 0) return "#475569";
      return (val >= 12 && val <= 20) ? "#15803D" : "#B91C1C"; // Green (Standard reserves) vs Red (Low reserves/High accumulation)
    };

    const getBodyFatColor = (val, g) => {
      if (val <= 0) return "#475569";
      if (g === "Female") {
        return (val >= 15 && val <= 28) ? "#15803D" : "#B91C1C"; // Green (Optimal) vs Red (Alert)
      } else {
        return (val >= 8 && val <= 20) ? "#15803D" : "#B91C1C"; // Green (Optimal) vs Red (Alert)
      }
    };

    const getMuscleColor = (val, g) => {
      if (val <= 0) return "#475569";
      const target = g === "Female" ? 25 : 33;
      return val >= target ? "#15803D" : "#B91C1C"; // Green (Optimal) vs Red (Below target)
    };

    const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    // Date formatting helper that includes the year
    const formatDateWithYear = (dateVal) => {
      if (!dateVal) return "-";
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "-";
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    };

    // Clean checkup object parser helper
    const cleanEntry = (entry, fallbackDate) => {
      const getNum = (v, fallback = 0) => (v !== undefined && v !== "" && v !== null && !isNaN(v)) ? Number(v) : fallback;
      return {
        date: entry.date || fallbackDate || new Date().toISOString(),
        weight: getNum(entry.weight),
        height: getNum(entry.height),
        bmi: getNum(entry.bmi),
        bmr: getNum(entry.bmr),
        biologicalAge: getNum(entry.biologicalAge || entry.bioAge || entry.biological_age),
        visceralFat: getNum(entry.visceralFat || entry.visceral_fat),
        subcutaneousFat: getNum(entry.subcutaneousFat || entry.subcutaneous_fat),
        bodyFat: getNum(entry.bodyFat || entry.body_fat),
        muscleMass: getNum(entry.muscleMass || entry.muscle_mass)
      };
    };

    // Construct current parameters checkup fallback
    const currentCheck = cleanEntry({
      date: client.createdAt || new Date().toISOString(),
      weight: weightVal,
      height: heightVal,
      bmi: bmiVal,
      bmr: bmrVal,
      biologicalAge: bioAgeVal,
      visceralFat: visceralVal,
      subcutaneousFat: subcutaneousVal,
      bodyFat: bodyFatVal,
      muscleMass: muscleVal
    });

    // Extract sorted history checkups
    const sortedHistory = [...(client.history || [])]
      .filter(h => h && h.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let firstCheck = currentCheck;
    let latestCheck = currentCheck;

    if (sortedHistory.length === 1) {
      firstCheck = cleanEntry(sortedHistory[0], client.createdAt);
      latestCheck = currentCheck;
    } else if (sortedHistory.length >= 2) {
      firstCheck = cleanEntry(sortedHistory[0], client.createdAt);
      latestCheck = cleanEntry(sortedHistory[sortedHistory.length - 1]);
    }

    const firstDateStr = formatDateWithYear(firstCheck.date);
    const latestDateStr = formatDateWithYear(latestCheck.date);

    const rows = [
      {
        label: "Weight",
        firstVal: firstCheck.weight > 0 ? `${firstCheck.weight.toFixed(1)} kg` : "-",
        latestVal: latestCheck.weight > 0 ? `${latestCheck.weight.toFixed(1)} kg` : "-",
        firstColor: "#1E293B",
        latestColor: "#1E293B"
      },
      {
        label: "Height",
        firstVal: firstCheck.height > 0 ? `${firstCheck.height.toFixed(0)} cm` : "-",
        latestVal: latestCheck.height > 0 ? `${latestCheck.height.toFixed(0)} cm` : "-",
        firstColor: "#1E293B",
        latestColor: "#1E293B"
      },
      {
        label: "BMI (Body Mass Index)",
        firstVal: firstCheck.bmi > 0 ? firstCheck.bmi.toFixed(1) : "-",
        latestVal: latestCheck.bmi > 0 ? latestCheck.bmi.toFixed(1) : "-",
        firstColor: getBmiColor(firstCheck.bmi),
        latestColor: getBmiColor(latestCheck.bmi)
      },
      {
        label: "BMR (Basal Metabolism)",
        firstVal: firstCheck.bmr > 0 ? `${Math.round(firstCheck.bmr)} kcal` : "-",
        latestVal: latestCheck.bmr > 0 ? `${Math.round(latestCheck.bmr)} kcal` : "-",
        firstColor: getBmrColor(firstCheck.bmr, gender),
        latestColor: getBmrColor(latestCheck.bmr, gender)
      },
      {
        label: "Biological / Cellular Age",
        firstVal: firstCheck.biologicalAge > 0 ? `${firstCheck.biologicalAge} yrs` : "-",
        latestVal: latestCheck.biologicalAge > 0 ? `${latestCheck.biologicalAge} yrs` : "-",
        firstColor: getBioAgeColor(firstCheck.biologicalAge, ageVal),
        latestColor: getBioAgeColor(latestCheck.biologicalAge, ageVal)
      },
      {
        label: "Visceral Fat Level",
        firstVal: firstCheck.visceralFat > 0 ? `${firstCheck.visceralFat} Lvl` : "-",
        latestVal: latestCheck.visceralFat > 0 ? `${latestCheck.visceralFat} Lvl` : "-",
        firstColor: getVisceralColor(firstCheck.visceralFat),
        latestColor: getVisceralColor(latestCheck.visceralFat)
      },
      {
        label: "Subcutaneous Fat %",
        firstVal: firstCheck.subcutaneousFat > 0 ? `${firstCheck.subcutaneousFat.toFixed(1)}%` : "-",
        latestVal: latestCheck.subcutaneousFat > 0 ? `${latestCheck.subcutaneousFat.toFixed(1)}%` : "-",
        firstColor: getSubcutaneousColor(firstCheck.subcutaneousFat),
        latestColor: getSubcutaneousColor(latestCheck.subcutaneousFat)
      },
      {
        label: "Body Fat Percentage",
        firstVal: firstCheck.bodyFat > 0 ? `${firstCheck.bodyFat.toFixed(1)}%` : "-",
        latestVal: latestCheck.bodyFat > 0 ? `${latestCheck.bodyFat.toFixed(1)}%` : "-",
        firstColor: getBodyFatColor(firstCheck.bodyFat, gender),
        latestColor: getBodyFatColor(latestCheck.bodyFat, gender)
      },
      {
        label: "Muscle Mass (Skeletal)",
        firstVal: firstCheck.muscleMass > 0 ? `${firstCheck.muscleMass.toFixed(1)} kg` : "-",
        latestVal: latestCheck.muscleMass > 0 ? `${latestCheck.muscleMass.toFixed(1)} kg` : "-",
        firstColor: getMuscleColor(firstCheck.muscleMass, gender),
        latestColor: getMuscleColor(latestCheck.muscleMass, gender)
      }
    ];

    let tableSvg = "";
    const startY = 251;
    const rowH = 38;
    for (let i = 0; i < rows.length; i++) {
      const rowY = startY + i * rowH;
      const textY = rowY + 24;
      const lineY = rowY + 38;
      
      tableSvg += `
        <!-- Label -->
        <text x="60" y="${textY}" font-family="${fontStack}" font-size="11.5" font-weight="600" fill="#475569">${rows[i].label}</text>
        <!-- Initial Value -->
        <text x="380" y="${textY}" font-family="${fontStack}" font-size="11.5" font-weight="700" fill="${rows[i].firstColor}" text-anchor="end">${rows[i].firstVal}</text>
        <!-- Latest Value -->
        <text x="540" y="${textY}" font-family="${fontStack}" font-size="11.5" font-weight="700" fill="${rows[i].latestColor}" text-anchor="end">${rows[i].latestVal}</text>
      `;
      
      if (i < rows.length - 1) {
        tableSvg += `
          <line x1="40" y1="${lineY}" x2="560" y2="${lineY}" stroke="#E2E8F0" stroke-width="0.75" />
        `;
      }
    }

    const svgHeight = 835;
    const footerY = 784;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${svgHeight}" width="100%" height="100%">
        <!-- Elegant background -->
        <rect width="100%" height="100%" fill="#FBF9F6"/>
        <rect width="100%" height="6" fill="#0F766E"/>
        
        <!-- Minimal Header -->
        <text x="40" y="52" font-family="${fontStack}" font-size="22" font-weight="700" fill="#1E293B">WELLNESS REPORT</text>
        <text x="40" y="72" font-family="${fontStack}" font-size="9.5" font-weight="600" fill="#64748B" letter-spacing="1.5">BODY COMPOSITION &amp; CELLULAR METABOLISM ANALYSIS</text>
        <line x1="40" y1="88" x2="560" y2="88" stroke="#E2E8F0" stroke-width="1.5"/>
        
        <!-- Client Details Card -->
        <g transform="translate(40, 105)">
          <rect x="0" y="0" width="250" height="90" rx="8" ry="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
          <text x="15" y="20" font-family="${fontStack}" font-size="9" font-weight="700" fill="#9C8B72" letter-spacing="0.5">CLIENT INFORMATION</text>
          <text x="15" y="42" font-family="${fontStack}" font-size="15" font-weight="700" fill="#1E293B">${client.name}</text>
          <text x="15" y="60" font-family="${fontStack}" font-size="10.5" fill="#475569">Chronological Age: ${client.age} years | Gender: ${client.gender}</text>
          <text x="15" y="75" font-family="${fontStack}" font-size="10.5" fill="#475569">WhatsApp: ${client.phone} | Date: ${formatDateWithYear(client.createdAt)}</text>
        </g>
        
        <!-- Wellness Center / Coach Details Card -->
        <g transform="translate(310, 105)">
          <rect x="0" y="0" width="250" height="90" rx="8" ry="8" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
          <text x="15" y="20" font-family="${fontStack}" font-size="9" font-weight="700" fill="#9C8B72" letter-spacing="0.5">WELLNESS CENTER &amp; COACH</text>
          <text x="15" y="42" font-family="${fontStack}" font-size="13" font-weight="700" fill="#0F766E">${op.wellnessCenterName || "Wellness Center"}</text>
          <text x="15" y="60" font-family="${fontStack}" font-size="10.5" fill="#475569">Coach: ${op.name} (${op.coachPhoneNumber || "N/A"})</text>
          <text x="15" y="75" font-family="${fontStack}" font-size="9.5" fill="#64748B">${op.wellnessCenterAddress || ""}</text>
        </g>
 
        <!-- Body Metrics Table Card -->
        <g>
          <rect x="40" y="215" width="520" height="378" rx="12" ry="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="60" y="240" font-family="${fontStack}" font-size="10.5" font-weight="700" fill="#475569" letter-spacing="0.5">BODY METRICS PARAMETER</text>
          <text x="380" y="240" font-family="${fontStack}" font-size="10.5" font-weight="700" fill="#475569" text-anchor="end">${firstDateStr}</text>
          <text x="540" y="240" font-family="${fontStack}" font-size="10.5" font-weight="700" fill="#475569" text-anchor="end">${latestDateStr}</text>
          <line x1="40" y1="251" x2="560" y2="251" stroke="#E2E8F0" stroke-width="1.5" />
          ${tableSvg}
        </g>
 
        <!-- Reference Baselines Card -->
        <g>
          <rect x="40" y="598" width="520" height="166" rx="12" ry="12" fill="#F7F5F0" stroke="#E2E8F0" stroke-width="1.5" />
          <text x="60" y="618" font-family="${fontStack}" font-size="9.5" font-weight="700" fill="#475569" letter-spacing="0.5">CLINICAL METABOLISM BASELINES &amp; WHO REFERENCE LIMITS (RED/GREEN KEY)</text>
          <line x1="60" y1="626" x2="540" y2="626" stroke="#DCD9D2" stroke-width="1" />
          
          <text x="60" y="642" font-family="${fontStack}" font-size="9" fill="#64748B">
            <tspan font-weight="700" fill="#15803D">• GREEN: </tspan>Healthy/Optimal ranges indicating safe, normal, or protective body parameters.
          </text>
          <text x="60" y="654" font-family="${fontStack}" font-size="9" fill="#64748B">
            <tspan font-weight="700" fill="#B91C1C">• RED: </tspan>Alert/Risk ranges indicating potential metabolic strain, low reserves, or excess load.
          </text>

          <text x="60" y="670" font-family="${fontStack}" font-size="9" fill="#475569">
            <tspan font-weight="600">• WHO BMI (Body Mass Index): </tspan><tspan fill="#15803D" font-weight="700">18.5 - 24.9 (Green)</tspan> | <tspan fill="#B91C1C" font-weight="700">&lt;18.5 Underweight or &gt;=25 Overweight/Obese (Red)</tspan>
          </text>
          
          <text x="60" y="684" font-family="${fontStack}" font-size="9" fill="#475569">
            <tspan font-weight="600">• Organ Visceral Fat Level: </tspan><tspan fill="#15803D" font-weight="700">1 - 9 Lvl Safe (Green)</tspan> | <tspan fill="#B91C1C" font-weight="700">&gt;=10 High Warning or Dangerous Organ Load (Red)</tspan>
          </text>
          
          <text x="60" y="698" font-family="${fontStack}" font-size="9" fill="#475569">
            <tspan font-weight="600">• Subcutaneous Fat standard: </tspan><tspan fill="#15803D" font-weight="700">12% - 20% Standard (Green)</tspan> | <tspan fill="#B91C1C" font-weight="700">&lt;12% Low Reserves or &gt;20% High Accumulation (Red)</tspan>
          </text>
          
          <text x="60" y="712" font-family="${fontStack}" font-size="9" fill="#475569">
            <tspan font-weight="600">• Biological Cellular Age: </tspan><tspan fill="#15803D" font-weight="700">&lt;= chronological Calendar Age (Green)</tspan> | <tspan fill="#B91C1C" font-weight="700">&gt; Calendar Age: Accelerated aging (Red)</tspan>
          </text>
          
          <text x="60" y="726" font-family="${fontStack}" font-size="9" fill="#475569">
            <tspan font-weight="600">• Body Fat Percentage: </tspan><tspan fill="#15803D" font-weight="700">Men 8%-20% / Women 15%-28% (Green)</tspan> | <tspan fill="#B91C1C" font-weight="700">Outside range (Red)</tspan>
          </text>

          <text x="60" y="740" font-family="${fontStack}" font-size="9" fill="#475569">
            <tspan font-weight="600">• BMR &amp; Muscle Mass Target: </tspan><tspan fill="#15803D" font-weight="700">BMR (M&gt;=1600 / F&gt;=1300 kcal), Muscle (M&gt;=33 / F&gt;=25 kg) (Green)</tspan> | <tspan fill="#B91C1C" font-weight="700">Below target (Red)</tspan>
          </text>
        </g>
  
        <!-- Disclaimer Footer -->
        <line x1="40" y1="${footerY}" x2="560" y2="${footerY}" stroke="#E2E8F0" stroke-width="1"/>
        <text x="300" y="${footerY + 18}" font-family="${fontStack}" font-size="8" font-weight="600" fill="#94A3B8" text-anchor="middle">DISCLAIMER: This Wellness Report is intended for informational and wellness guidance purposes only.</text>
        <text x="300" y="${footerY + 30}" font-family="${fontStack}" font-size="7.5" fill="#94A3B8" text-anchor="middle">Contact the respective coach to know more about this or visit the wellness center once to make your life healthier and happier.</text>
      </svg>
    `;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  },

  downloadReportPDF(client, filename) {
    Helpers.showToast("Generating high-resolution PDF...", "info");
    return new Promise((resolve, reject) => {
      try {
        const svgDataUri = this.generateReportPDF(client);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = 2; // High-resolution printing scale
          canvas.width = 600 * scale;
          canvas.height = 835 * scale;
          const ctx = canvas.getContext("2d");
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, 600, 835);
          
          try {
            const imgData = canvas.toDataURL("image/jpeg", 0.95);
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
              orientation: "portrait",
              unit: "px",
              format: [600, 835]
            });
            pdf.addImage(imgData, "JPEG", 0, 0, 600, 835);
            pdf.save(filename);
            resolve();
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = (e) => reject(new Error("Failed to load SVG into image."));
        img.src = svgDataUri;
      } catch (err) {
        reject(err);
      }
    });
  },

  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;
 
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
 
    let icon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    if (type === "error") {
      icon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else if (type === "warning") {
      icon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (type === "info") {
      icon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
 
    toast.innerHTML = `
      <span class="toast-icon" style="display:flex; align-items:center; justify-content:center; flex-shrink:0;">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  sanitizePhoneNumber(phone) {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      cleaned = "91" + cleaned; // Default Indian country code prefix
    }
    return cleaned;
  },

  async sendRealWhatsApp(toPhone, messageText) {
    const op = Store.getOperator();
    if (!op || !op.whatsappConfigured || !op.whatsappApiToken || !op.whatsappPhoneNumberId) {
      console.warn("WhatsApp Business API credentials not fully configured.");
      return { success: false, error: "Credentials not fully configured in Settings" };
    }

    const sanitizedPhone = this.sanitizePhoneNumber(toPhone);
    const url = `https://graph.facebook.com/v18.0/${op.whatsappPhoneNumberId}/messages`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${op.whatsappApiToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: sanitizedPhone,
          type: "text",
          text: {
            preview_url: false,
            body: messageText
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Real-time WhatsApp dispatch successful:", data);
        return { success: true, data };
      } else {
        console.error("Real-time WhatsApp API error:", data);
        return { success: false, error: data.error?.message || "API authorization/delivery error" };
      }
    } catch (err) {
      console.error("Real-time WhatsApp connection error:", err);
      return { success: false, error: err.message || "Network connection error" };
    }
  },

  compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File is not an image."));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
};

window.Helpers = Helpers;
