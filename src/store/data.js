/**
 * Sakria Wellness Platform - Local State & Data Store
 */

const DEFAULT_OPERATOR = {
  name: "Aranya Sharma",
  username: "demo",
  role: "Lead Wellness Coach",
  avatar: "AS",
  wellnessCenterName: "Sakria Holistic Health Center",
  coachPhoneNumber: "+91 98765 43210",
  wellnessCenterAddress: "Lotus Towers, Sector 4, Hyderabad, Telangana - 500081"
};

const DEFAULT_CLIENTS = [
  {
    id: "c-1",
    name: "Arjun Rao",
    phone: "9876543210",
    status: "Lead",
    age: 28,
    gender: "Male",
    weight: 84.5,
    height: 175,
    visceralFat: 12,
    subcutaneousFat: 18.5,
    bmi: 27.6,
    bodyFat: 28.5,
    muscleMass: 32.4,
    bmr: 1762,
    biologicalAge: 35,
    notes: "",
    flagged: true,
    createdAt: "2026-05-28T10:30:00Z",
    healthIssues: ["Thyroid", "Knee Pains"],
    healthIssuesOthers: "",
    lead_type: "offline",
    history: [
      { date: "2026-05-28", weight: 84.5, bmi: 27.6, bmr: 1762, biologicalAge: 35, visceralFat: 12, subcutaneousFat: 18.5, bodyFat: 28.5, muscleMass: 32.4, height: 175 }
    ],
    reminders: []
  },
  {
    id: "c-2",
    name: "Sarah Jenkins",
    phone: "9123456789",
    status: "Active",
    age: 34,
    gender: "Female",
    weight: 62.0,
    height: 162,
    visceralFat: 6,
    subcutaneousFat: 15.2,
    bmi: 23.6,
    bodyFat: 24.1,
    muscleMass: 26.8,
    bmr: 1320,
    biologicalAge: 30,
    notes: "",
    flagged: false,
    createdAt: "2026-05-25T14:20:00Z",
    healthIssues: ["Skin Issues"],
    healthIssuesOthers: "",
    lead_type: "online",
    history: [
      { date: "2026-05-25", weight: 62.0, bmi: 23.6, bmr: 1320, biologicalAge: 30, visceralFat: 6, subcutaneousFat: 15.2, bodyFat: 24.1, muscleMass: 26.8, height: 162 }
    ],
    reminders: []
  },
  {
    id: "c-3",
    name: "Rajesh Kumar",
    phone: "8888877777",
    status: "Lead",
    age: 45,
    gender: "Male",
    weight: 96.2,
    height: 180,
    visceralFat: 15,
    subcutaneousFat: 22.1,
    bmi: 29.7,
    bodyFat: 32.1,
    muscleMass: 35.0,
    bmr: 1880,
    biologicalAge: 53,
    notes: "",
    flagged: true,
    createdAt: "2026-05-29T08:15:00Z",
    healthIssues: ["Overweight", "Diabetes"],
    healthIssuesOthers: "",
    lead_type: "offline",
    history: [
      { date: "2026-05-29", weight: 96.2, bmi: 29.7, bmr: 1880, biologicalAge: 53, visceralFat: 15, subcutaneousFat: 22.1, bodyFat: 32.1, muscleMass: 35.0, height: 180 }
    ],
    reminders: []
  }
];

const Store = {
  getClientKey() {
    const tenantId = sessionStorage.getItem("sakria_tenant_id") || "t-1";
    return `sakria_clients_${tenantId}`;
  },
  getOperatorKey() {
    const tenantId = sessionStorage.getItem("sakria_tenant_id") || "t-1";
    return `sakria_operator_${tenantId}`;
  },
  getResultsKey() {
    const tenantId = sessionStorage.getItem("sakria_tenant_id") || "t-1";
    return `sakria_results_${tenantId}`;
  },

  init() {
    const tenantId = sessionStorage.getItem("sakria_tenant_id") || "t-1";
    const opKey = this.getOperatorKey();
    const clKey = this.getClientKey();
    const resKey = this.getResultsKey();

    if (!localStorage.getItem(opKey)) {
      if (tenantId === "t-1") {
        localStorage.setItem(opKey, JSON.stringify(DEFAULT_OPERATOR));
      } else {
        localStorage.setItem(opKey, JSON.stringify({
          name: "Wellness Coach",
          username: "",
          role: "Lead Wellness Coach",
          avatar: "WC",
          wellnessCenterName: "My Wellness Center",
          coachPhoneNumber: "",
          wellnessCenterAddress: ""
        }));
      }
    }
    if (!localStorage.getItem(clKey)) {
      if (tenantId === "t-1") {
        localStorage.setItem(clKey, JSON.stringify(DEFAULT_CLIENTS));
      } else {
        localStorage.setItem(clKey, JSON.stringify([]));
      }
    }
    if (!localStorage.getItem(resKey)) {
      localStorage.setItem(resKey, JSON.stringify([]));
    }

    this.syncWithBackend();
  },

  async syncWithBackend() {
    const isLoggedIn = sessionStorage.getItem("sakria_logged_in") === "true";
    if (!isLoggedIn) return;

    const isAdmin = sessionStorage.getItem("sakria_is_admin") === "true";
    if (isAdmin) return;

    const tenantId = sessionStorage.getItem("sakria_tenant_id") || "t-1";
    
    // Ensure localStorage keys for this specific tenant are initialized
    const opKey = this.getOperatorKey();
    const clKey = this.getClientKey();
    const resKey = this.getResultsKey();

    if (!localStorage.getItem(opKey)) {
      if (tenantId === "t-1") {
        localStorage.setItem(opKey, JSON.stringify(DEFAULT_OPERATOR));
      } else {
        localStorage.setItem(opKey, JSON.stringify({
          name: "Wellness Coach",
          username: "",
          role: "Lead Wellness Coach",
          avatar: "WC",
          wellnessCenterName: "My Wellness Center",
          coachPhoneNumber: "",
          wellnessCenterAddress: ""
        }));
      }
    }
    if (!localStorage.getItem(clKey)) {
      if (tenantId === "t-1") {
        localStorage.setItem(clKey, JSON.stringify(DEFAULT_CLIENTS));
      } else {
        localStorage.setItem(clKey, JSON.stringify([]));
      }
    }
    if (!localStorage.getItem(resKey)) {
      localStorage.setItem(resKey, JSON.stringify([]));
    }

    try {
      // Fetch Operator Profile
      const opRes = await fetch(`http://127.0.0.1:8000/api/dashboard/stats?tenant_id=${tenantId}`);
      if (opRes.ok) {
        const stats = await opRes.json();
        const currentOp = {
          name: stats.coach_name || "Wellness Coach",
          username: stats.coach_username || stats.coach_email || "",
          role: stats.role || "Lead Wellness Coach",
          avatar: (stats.coach_name || "WC").split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase(),
          wellnessCenterName: stats.center_name,
          coachPhoneNumber: stats.whatsapp_business_number || "",
          wellnessCenterAddress: stats.wellness_center_address || ""
        };
        localStorage.setItem(this.getOperatorKey(), JSON.stringify(currentOp));
      }

      // Fetch Clients
      const clRes = await fetch(`http://127.0.0.1:8000/api/inbox?tenant_id=${tenantId}`);
      if (clRes.ok) {
        const inbox = await clRes.json();
        const clientsList = [];

        for (const item of inbox) {
          clientsList.push({
            id: item.client_id,
            name: item.name,
            phone: item.phone,
            status: item.status,
            age: item.age,
            gender: item.gender,
            weight: item.weight,
            height: item.height,
            visceralFat: item.visceral_fat,
            subcutaneousFat: item.subcutaneous_fat || 0,
            bmi: item.bmi,
            bodyFat: item.body_fat,
            muscleMass: item.muscle_mass,
            bmr: item.bmr,
            biologicalAge: item.biological_age,
            notes: item.notes,
            flagged: item.flagged,
            healthIssues: item.health_issues,
            healthIssuesOthers: item.health_issues_others,
            history: item.history || [],
            beforePhoto: item.before_photo || null,
            afterPhoto: item.after_photo || null,
            lead_type: item.lead_type || "offline",
            createdAt: item.created_at || new Date().toISOString(),
            convertedAt: item.converted_at || null
          });
        }

        localStorage.setItem(this.getClientKey(), JSON.stringify(clientsList));
      }
    } catch (err) {
      console.warn("FastAPI backend offline, running in offline localStorage fallback mode:", err);
    }
  },

  getOperator() {
    return JSON.parse(localStorage.getItem(this.getOperatorKey()));
  },

  updateOperator(data) {
    const current = this.getOperator();
    const updated = { ...current, ...data };
    localStorage.setItem(this.getOperatorKey(), JSON.stringify(updated));
    return updated;
  },

  getClients() {
    return JSON.parse(localStorage.getItem(this.getClientKey())) || [];
  },

  saveClients(clients) {
    localStorage.setItem(this.getClientKey(), JSON.stringify(clients));
  },

  addClient(client) {
    const clients = this.getClients();
    const cleanNum = (val, fallback = 0) => (val !== undefined && val !== "" && val !== null && !isNaN(val)) ? Number(val) : fallback;

    const newClient = {
      id: "c-" + Date.now(),
      createdAt: client.date ? new Date(client.date).toISOString() : new Date().toISOString(),
      convertedAt: client.status === "Active" ? (client.date ? new Date(client.date).toISOString() : new Date().toISOString()) : null,
      flagged: client.flagged || false,
      history: [{
        date: client.date || new Date().toISOString().split("T")[0],
        weight: cleanNum(client.weight),
        height: cleanNum(client.height),
        bmi: cleanNum(client.bmi),
        bmr: cleanNum(client.bmr),
        biologicalAge: cleanNum(client.biologicalAge),
        visceralFat: cleanNum(client.visceralFat),
        subcutaneousFat: cleanNum(client.subcutaneousFat),
        bodyFat: cleanNum(client.bodyFat),
        muscleMass: cleanNum(client.muscleMass),
        notes: client.notes || ""
      }],
      reminders: [],
      ...client,
      weight: cleanNum(client.weight),
      height: cleanNum(client.height),
      bmi: cleanNum(client.bmi),
      bmr: cleanNum(client.bmr),
      biologicalAge: cleanNum(client.biologicalAge),
      visceralFat: cleanNum(client.visceralFat),
      subcutaneousFat: cleanNum(client.subcutaneousFat),
      bodyFat: cleanNum(client.bodyFat),
      muscleMass: cleanNum(client.muscleMass),
      lead_type: client.lead_type || "offline"
    };
    clients.unshift(newClient);
    this.saveClients(clients);

    const tenantId = sessionStorage.getItem("sakria_tenant_id") || "t-1";
    fetch("http://127.0.0.1:8000/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newClient, tenant_id: tenantId })
    }).catch(err => console.warn("Backend creation failed, using offline fallback:", err));

    return newClient;
  },

  updateClient(id, updatedData) {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      const prev = clients[idx];
      const cleanNum = (val, prevVal) => (val !== undefined && val !== "" && val !== null && !isNaN(val)) ? Number(val) : prevVal;

      const hasParamUpdate = updatedData.weight !== undefined ||
                             updatedData.height !== undefined ||
                             updatedData.bmi !== undefined ||
                             updatedData.bmr !== undefined ||
                             updatedData.biologicalAge !== undefined ||
                             updatedData.visceralFat !== undefined ||
                             updatedData.subcutaneousFat !== undefined ||
                             updatedData.bodyFat !== undefined ||
                             updatedData.muscleMass !== undefined;

      let newHistory = [...(prev.history || [])];

      if (hasParamUpdate) {
        if (newHistory.length === 0) {
          // Prepend client's initial registration checkup from their pre-update root parameters
          newHistory.push({
            date: prev.createdAt ? prev.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
            weight: prev.weight || 0,
            height: prev.height || 0,
            bmi: prev.bmi || 0,
            bmr: prev.bmr || 0,
            biologicalAge: prev.biologicalAge || prev.age || 0,
            visceralFat: prev.visceralFat || 5,
            subcutaneousFat: prev.subcutaneousFat !== undefined ? prev.subcutaneousFat : 0,
            bodyFat: prev.bodyFat || 0,
            muscleMass: prev.muscleMass || 0,
            notes: prev.notes || "Initial checkup logs."
          });
        }

        // Construct unique ISO timestamp for the checkup date
        const historyEntry = {
          date: updatedData.date ? (updatedData.date.includes("T") ? updatedData.date : `${updatedData.date}T${new Date().toISOString().split("T")[1]}`) : new Date().toISOString(),
          weight: cleanNum(updatedData.weight, prev.weight),
          height: cleanNum(updatedData.height, prev.height),
          bmi: cleanNum(updatedData.bmi, prev.bmi),
          bmr: cleanNum(updatedData.bmr, prev.bmr),
          biologicalAge: cleanNum(updatedData.biologicalAge, prev.biologicalAge),
          visceralFat: cleanNum(updatedData.visceralFat, prev.visceralFat),
          subcutaneousFat: cleanNum(updatedData.subcutaneousFat, prev.subcutaneousFat !== undefined ? prev.subcutaneousFat : 0),
          bodyFat: cleanNum(updatedData.bodyFat, prev.bodyFat),
          muscleMass: cleanNum(updatedData.muscleMass, prev.muscleMass),
          notes: updatedData.notes || ""
        };

        newHistory.push(historyEntry);
      }

      let convertedAt = prev.convertedAt || null;
      if (updatedData.status === "Active") {
        if (!convertedAt) {
          convertedAt = new Date().toISOString();
        }
      } else if (updatedData.status === "Lead") {
        convertedAt = null;
      }

      const merged = {
        ...prev,
        ...updatedData,
        convertedAt,
        weight: cleanNum(updatedData.weight, prev.weight),
        height: cleanNum(updatedData.height, prev.height),
        bmi: cleanNum(updatedData.bmi, prev.bmi),
        bmr: cleanNum(updatedData.bmr, prev.bmr),
        biologicalAge: cleanNum(updatedData.biologicalAge, prev.biologicalAge),
        visceralFat: cleanNum(updatedData.visceralFat, prev.visceralFat),
        subcutaneousFat: cleanNum(updatedData.subcutaneousFat, prev.subcutaneousFat || 0),
        bodyFat: cleanNum(updatedData.bodyFat, prev.bodyFat),
        muscleMass: cleanNum(updatedData.muscleMass, prev.muscleMass),
        history: newHistory
      };
      clients[idx] = merged;
      this.saveClients(clients);

      fetch(`http://127.0.0.1:8000/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged)
      }).catch(err => console.warn("Backend metrics update failed, using offline fallback:", err));

      return merged;
    }
    return null;
  },

  deleteClient(id) {
    let clients = this.getClients();
    clients = clients.filter(c => c.id !== id);
    this.saveClients(clients);

    fetch(`http://127.0.0.1:8000/api/clients/${id}`, {
      method: "DELETE"
    }).catch(err => console.warn("Backend deletion failed:", err));
  },

  getResults() {
    return JSON.parse(localStorage.getItem(this.getResultsKey())) || [];
  },

  addResult(result) {
    const results = this.getResults();
    const newResult = {
      id: "r-" + Date.now(),
      addedAt: new Date().toISOString(),
      ...result
    };
    results.unshift(newResult);
    localStorage.setItem(this.getResultsKey(), JSON.stringify(results));
    return newResult;
  },

  deleteResult(resultId) {
    const results = this.getResults().filter(r => r.id !== resultId);
    localStorage.setItem(this.getResultsKey(), JSON.stringify(results));
  }
};

Store.init();
window.Store = Store;
