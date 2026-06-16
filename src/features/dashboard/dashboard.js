/**
 * Sakria Dashboard Module — Clean, no WhatsApp/credits references
 */

const Dashboard = {
  activeTimeframe: "weekly",

  setTimeframe(tf) {
    Dashboard.activeTimeframe = tf;
    
    // Update active styles in DOM without refreshing the entire page
    ['weekly', 'monthly', 'yearly'].forEach(t => {
      const btn = document.getElementById(`tf-${t}`);
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

    Dashboard.renderChart();
  },

  render() {
    const clients = Store.getClients();
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === "Active").length;
    const totalLeads = clients.filter(c => c.status === "Lead").length;
    const conversionRate = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;
    const rawHighRiskCount = clients.filter(c => c.flagged).length;
    const highRiskCount = rawHighRiskCount > 9 ? "9+" : rawHighRiskCount;
    const op = Store.getOperator();

    // 1. Time-of-day greeting & Location address
    const hour = new Date().getHours();
    let timeGreeting = "Namaste";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 17) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    const firstName = op.name ? op.name.split(" ")[0] : "Coach";
    const coachName = `Coach ${firstName}`;
    const address = op.wellnessCenterAddress || "123 Wellness Ave, City Center";

    // 2. Health conditions calculation & fallback
    const issueMap = {};
    clients.forEach(c => {
      (c.healthIssues || []).forEach(issue => {
        issueMap[issue] = (issueMap[issue] || 0) + 1;
      });
    });
    
    let topIssues = Object.entries(issueMap).sort((a, b) => b[1] - a[1]);
    
    if (topIssues.length === 0) {
      topIssues = [
        ["Overweight", 45],
        ["Knee Pain", 22],
        ["Thyroid", 18]
      ];
    } else {
      const totalIssuesCount = Object.values(issueMap).reduce((a, b) => a + b, 0) || 1;
      topIssues = topIssues.map(([issue, count]) => [
        issue, 
        Math.round((count / totalClients) * 100) || Math.round((count / totalIssuesCount) * 100)
      ]).slice(0, 3);
    }
    
    const progressColors = ["#C93B2B", "#E29543", "#707A8A"];
    const topIssueRows = topIssues.slice(0, 3).map(([issue, pct], idx) => {
      const color = progressColors[idx] || "#707A8A";
      return `
        <div class="condition-progress-wrapper">
          <div class="condition-label-row">
            <span>${issue}</span>
            <span>${pct}%</span>
          </div>
          <div class="condition-bar-bg">
            <div class="condition-progress-bar" style="width: ${pct}%; background-color: ${color};"></div>
          </div>
        </div>
      `;
    }).join("");

    // 3. High risk clients list
    const highRiskClients = clients.filter(c => c.flagged);
    const highRiskRows = highRiskClients.length > 0
      ? highRiskClients.slice(0, 8).map(c => {
          const isCritical = c.bmi >= 30 || c.visceralFat >= 12;
          const initials = c.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
          
          let timeStr = "Checkup logged";
          if (c.history && c.history.length > 0) {
            const lastDate = new Date(c.history[c.history.length - 1].date);
            const diffTime = Math.abs(new Date() - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            timeStr = diffDays === 1 ? "Last check-in: 1 day ago" : `Last check-in: ${diffDays} days ago`;
          }

          const mainParamText = c.bmi >= 25 
            ? `BMI: ${c.bmi}` 
            : `Visceral Fat: ${c.visceralFat}`;

          const subText = isCritical 
            ? "Critical BMI / Fat range" 
            : c.healthIssues && c.healthIssues.length > 0 
              ? `Flagged: ${c.healthIssues.slice(0, 2).join(", ")}`
              : "Flagged by diagnostic scan";

          return `
            <div class="high-risk-card ${isCritical ? 'critical' : ''}" onclick="App.loadPage('client-leads?client=${c.id}')" style="cursor: pointer;">
              ${isCritical ? `<span class="critical-badge">Critical</span>` : ''}
              <div class="client-meta-wrap">
                <div class="client-avatar-circle">${initials}</div>
                <div class="client-details">
                  <div class="client-name-text">${c.name}</div>
                  <div class="client-sub-text">${c.gender}, ${c.age}</div>
                </div>
              </div>
              <div class="client-param-highlight">${mainParamText}</div>
              <div style="font-size: 11.5px; color: var(--text-secondary); margin-bottom: 8px;">${subText}</div>
              <div class="client-card-footer">${timeStr}</div>
            </div>
          `;
        }).join("")
      : `<div style="grid-column: 1/-1; background: white; border: 1px solid var(--border-color); border-radius: 12px; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--text-secondary); width: 100%;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F5132" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 10px;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          All clients have normal wellness parameters. No high-risk conditions flagged.
        </div>`;

    return `
      <div class="page-container">
        <!-- Personalized Greeting -->
        <div class="page-header" style="flex-direction: column; align-items: flex-start; gap: 4px; margin-bottom: 24px;">
          <h2 style="font-size: 26px; font-weight: 700; color: var(--text-primary); margin: 0;">${timeGreeting}, ${coachName}</h2>
          <p style="color: var(--text-secondary); font-size: 13.5px; margin: 0; display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; color: var(--primary-color);">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${address}
          </p>
        </div>

        <!-- Stat Cards & Conditions Split Row -->
        <div class="dashboard-top-row">
          <!-- 4 Stat Cards -->
          <div class="dashboard-stats-container">
            <div class="stat-card" style="padding: 16px 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Total Registered</span>
                <div class="stat-value" style="font-size: 28px; margin-top: 4px; font-weight: 700;">${totalClients}</div>
              </div>
              <div class="sparkline-container">
                <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 0 30 L 20 27 L 40 18 L 60 22 L 80 15 L 100 10" fill="none" stroke="#0F5132" stroke-width="2" />
                </svg>
              </div>
            </div>

            <div class="stat-card" style="padding: 16px 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Active Members</span>
                <div class="stat-value" style="font-size: 28px; margin-top: 4px; font-weight: 700;">${activeClients}</div>
              </div>
              <div class="sparkline-container">
                <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 0 32 L 20 28 L 40 22 L 60 18 L 80 14 L 100 8" fill="none" stroke="#0F5132" stroke-width="2" />
                </svg>
              </div>
            </div>

            <div class="stat-card" style="padding: 16px 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Pending Leads</span>
                <div class="stat-value" style="font-size: 28px; margin-top: 4px; font-weight: 700;">${totalLeads}</div>
              </div>
              <div class="sparkline-container">
                <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 0 15 L 20 12 L 40 18 L 60 22 L 80 26 L 100 30" fill="none" stroke="#FD7E14" stroke-width="2" />
                </svg>
              </div>
            </div>

            <div class="stat-card" style="padding: 16px 20px; min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <span style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Conversion Rate</span>
                <div class="stat-value" style="font-size: 28px; margin-top: 4px; font-weight: 700;">${conversionRate}%</div>
              </div>
              <div class="sparkline-container">
                <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 0 32 L 20 29 L 40 22 L 60 24 L 80 17 L 100 12" fill="none" stroke="#0F5132" stroke-width="2" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Top Health Conditions Widget -->
          <div class="dashboard-conditions-container">
            <div class="card-container" style="flex: 1; padding: 20px;">
              <span style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 16px;">Top Health Conditions</span>
              <div>
                ${topIssueRows}
              </div>
            </div>
          </div>
        </div>

        <!-- Growth Chart (Metric Tracker) -->
        <div class="card-container" style="margin-bottom: 24px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">Coaching & Leads Growth Trends</h3>
            
            <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
              <!-- Timeframe Selector -->
              <div style="display: flex; background: #FAF9F6; border: 1px solid var(--border-light); padding: 3px; border-radius: 8px; gap: 2px;">
                <button id="tf-weekly" onclick="Dashboard.setTimeframe('weekly')" style="padding: 4px 10px; border-radius: 6px; border: none; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; ${Dashboard.activeTimeframe === 'weekly' ? 'background: var(--primary-color); color: white;' : 'background: transparent; color: var(--text-secondary);'}">Weekly</button>
                <button id="tf-monthly" onclick="Dashboard.setTimeframe('monthly')" style="padding: 4px 10px; border-radius: 6px; border: none; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; ${Dashboard.activeTimeframe === 'monthly' ? 'background: var(--primary-color); color: white;' : 'background: transparent; color: var(--text-secondary);'}">Monthly</button>
                <button id="tf-yearly" onclick="Dashboard.setTimeframe('yearly')" style="padding: 4px 10px; border-radius: 6px; border: none; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; ${Dashboard.activeTimeframe === 'yearly' ? 'background: var(--primary-color); color: white;' : 'background: transparent; color: var(--text-secondary);'}">Yearly</button>
              </div>
              
              <!-- Legend Indicators -->
              <div style="display: flex; align-items: center; gap: 16px; font-size: 11.5px; font-weight: 600; color: var(--text-secondary);">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #0F5132;"></span>
                  <span>Active Members</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #FD7E14;"></span>
                  <span>Leads Collected</span>
                </div>
              </div>
            </div>
          </div>
          <div class="chart-wrapper" style="height: 250px; position: relative;">
            <canvas id="growthChart"></canvas>
          </div>
        </div>

        <!-- High Risk Horizontal List -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 24px;">
          <h3 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0;">High-Risk Clients</h3>
          <a onclick="App.loadPage('client-leads')" style="font-size: 13.5px; font-weight: 600; color: var(--primary-dark); cursor: pointer; text-decoration: none;">View All</a>
        </div>
        <div class="high-risk-cards-scroll">
          ${highRiskRows}
        </div>
      </div>
    `;
  },

  init() {
    this.renderChart();
  },

  renderChart() {
    const ctx = document.getElementById("growthChart");
    if (!ctx) return;
    const clients = Store.getClients();

    // Destroy existing Chart instance to prevent overlap rendering bugs
    if (Dashboard.chartInstance) {
      Dashboard.chartInstance.destroy();
      Dashboard.chartInstance = null;
    }

    const today = new Date();
    const leadData = [];
    const activeData = [];
    const labels = [];

    const timeframe = Dashboard.activeTimeframe || "weekly";

    if (timeframe === "weekly") {
      const currentDay = today.getDay();
      const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - distanceToMonday);
      monday.setHours(0, 0, 0, 0);

      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDays.push(d);
      }

      weekDays.forEach(day => {
        const startOfTargetDay = new Date(day);
        startOfTargetDay.setHours(0, 0, 0, 0);
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);

        if (startOfTargetDay > startOfToday) {
          leadData.push(null);
          activeData.push(null);
        } else {
          const endOfDay = new Date(day);
          endOfDay.setHours(23, 59, 59, 999);

          const leadsCount = clients.filter(c => {
            const createDate = new Date(c.createdAt || (c.history && c.history[0]?.date) || new Date());
            return createDate <= endOfDay;
          }).length;
          
          const activeCount = clients.filter(c => {
            if (c.status !== "Active") return false;
            const activeDate = new Date(c.convertedAt || c.createdAt || (c.history && c.history[0]?.date) || new Date());
            return activeDate <= endOfDay;
          }).length;

          leadData.push(leadsCount);
          activeData.push(activeCount);
        }
      });

      labels.push('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

    } else if (timeframe === "monthly") {
      const year = today.getFullYear();
      const month = today.getMonth();

      const w1End = new Date(year, month, 7, 23, 59, 59, 999);
      const w2End = new Date(year, month, 14, 23, 59, 59, 999);
      const w3End = new Date(year, month, 21, 23, 59, 59, 999);
      const lastDay = new Date(year, month + 1, 0).getDate();
      const w4End = new Date(year, month, lastDay, 23, 59, 59, 999);

      const intervals = [
        { label: 'W1 (1-7)', startDay: 1, end: w1End },
        { label: 'W2 (8-14)', startDay: 8, end: w2End },
        { label: 'W3 (15-21)', startDay: 15, end: w3End },
        { label: 'W4 (22+)', startDay: 22, end: w4End }
      ];

      intervals.forEach(inv => {
        if (today.getDate() < inv.startDay) {
          leadData.push(null);
          activeData.push(null);
        } else {
          const endOfInterval = inv.end;

          const leadsCount = clients.filter(c => {
            const createDate = new Date(c.createdAt || (c.history && c.history[0]?.date) || new Date());
            return createDate <= endOfInterval;
          }).length;
          
          const activeCount = clients.filter(c => {
            if (c.status !== "Active") return false;
            const activeDate = new Date(c.convertedAt || c.createdAt || (c.history && c.history[0]?.date) || new Date());
            return activeDate <= endOfInterval;
          }).length;

          leadData.push(leadsCount);
          activeData.push(activeCount);
        }
        labels.push(inv.label);
      });

    } else if (timeframe === "yearly") {
      const year = today.getFullYear();
      const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      monthsList.forEach((mLabel, mIdx) => {
        if (mIdx > today.getMonth()) {
          leadData.push(null);
          activeData.push(null);
        } else {
          const endOfMonth = new Date(year, mIdx + 1, 0, 23, 59, 59, 999);

          const leadsCount = clients.filter(c => {
            const createDate = new Date(c.createdAt || (c.history && c.history[0]?.date) || new Date());
            return createDate <= endOfMonth;
          }).length;
          
          const activeCount = clients.filter(c => {
            if (c.status !== "Active") return false;
            const activeDate = new Date(c.convertedAt || c.createdAt || (c.history && c.history[0]?.date) || new Date());
            return activeDate <= endOfMonth;
          }).length;

          leadData.push(leadsCount);
          activeData.push(activeCount);
        }
        labels.push(mLabel);
      });
    }

    Dashboard.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Leads Collected',
            data: leadData,
            borderColor: '#FD7E14',
            backgroundColor: 'rgba(253, 126, 20, 0.05)',
            fill: true, tension: 0.35, borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#FD7E14'
          },
          {
            label: 'Active Members',
            data: activeData,
            borderColor: '#0F5132',
            backgroundColor: 'rgba(15, 81, 50, 0.05)',
            fill: true, tension: 0.35, borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#0F5132'
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6B7364' } },
          y: { grid: { color: '#F2EFE7' }, ticks: { color: '#6B7364' } }
        }
      }
    });
  }
};

window.Dashboard = Dashboard;
