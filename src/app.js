/**
 * Sakria Wellness Platform - Core Application Bootstrapper
 */

// Global fetch override to inject session tokens and handle single device session termination
(function() {
  const originalFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    let urlString = typeof url === "string" ? url : (url.url || "");
    
    // Automatically rewrite hardcoded local API base URLs to relative in production
    const isLocal = ["127.0.0.1", "localhost", "0.0.0.0", "::1"].includes(window.location.hostname);
    if (!isLocal && urlString.startsWith("http://127.0.0.1:8000")) {
      urlString = urlString.replace("http://127.0.0.1:8000", "");
      url = typeof url === "string" ? urlString : { ...url, url: urlString };
    }

    if (urlString.includes("/api/")) {
      const sessionId = sessionStorage.getItem("sakria_session_id");
      if (sessionId) {
        options.headers = options.headers || {};
        options.headers["X-Session-Token"] = sessionId;
      }
    }
    
    try {
      const response = await originalFetch(url, options);
      const urlString = typeof url === "string" ? url : (url.url || "");
      
      if ((response.status === 401 || response.status === 403) && urlString.includes("/api/")) {
        console.log("[Fetch Interceptor] Intercepted error status:", response.status, "for URL:", urlString);
        const clone = response.clone();
        const data = await clone.json().catch((e) => {
          console.error("[Fetch Interceptor] Failed to parse response JSON:", e);
          return {};
        });
        console.log("[Fetch Interceptor] Parsed response body:", data);
        
        if (data.detail && (data.detail.includes("Session expired") || data.detail.includes("deactivated/paused"))) {
          const wasLoggedIn = sessionStorage.getItem("sakria_logged_in") === "true";
          console.log("[Fetch Interceptor] wasLoggedIn:", wasLoggedIn);
          
          sessionStorage.removeItem("sakria_logged_in");
          sessionStorage.removeItem("sakria_is_admin");
          sessionStorage.removeItem("sakria_tenant_id");
          sessionStorage.removeItem("sakria_session_id");
          
          if (wasLoggedIn) {
            const isDeactivated = data.detail.includes("deactivated/paused");
            const msg = isDeactivated 
              ? "Your coach account has been deactivated/paused by the administrator. Contact support@sakria.in."
              : "Session terminated! Logged in on another device.";
            
            if (window.Helpers && typeof window.Helpers.showToast === "function") {
              window.Helpers.showToast(msg, "error");
            } else {
              alert(msg);
            }
            
            setTimeout(() => {
              window.location.reload();
            }, 2500);
          }
        }
      }
      return response;
    } catch (err) {
      throw err;
    }
  };
})();

const App = {
  activePage: "dashboard",

  init() {
    this.bindAuthEvents();
    this.bindNavigationEvents();
    this.checkSession();
    this.route();
  },

  checkSession() {
    const isLoggedIn = sessionStorage.getItem("sakria_logged_in") === "true";
    const loginScreen = document.getElementById("login-screen");
    const appShell = document.getElementById("app-shell");

    if (isLoggedIn) {
      loginScreen.classList.add("hidden");
      appShell.classList.remove("hidden");
      
      // Dynamic sidebar items override depending on whether logged in as Super Admin
      const sideNav = document.querySelector(".sidebar-nav");
      const bottomNav = document.querySelector(".bottom-nav");
      const isAdmin = sessionStorage.getItem("sakria_is_admin") === "true";

      if (isAdmin) {
        if (sideNav) {
          sideNav.innerHTML = `
            <a class="nav-item active" data-page="admin-console" id="nav-admin-console">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </span>
              <span class="nav-label">Admin Console</span>
            </a>
          `;
        }
        if (bottomNav) {
          bottomNav.innerHTML = `
            <a class="bnav-item active" data-page="admin-console" id="bnav-admin-console">
              <span class="bnav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </span>
              <span class="bnav-label">Admin</span>
            </a>
          `;
        }
      } else {
        if (sideNav) {
          sideNav.innerHTML = `
            <a class="nav-item active" data-page="dashboard" id="nav-dashboard">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                  <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                  <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                </svg>
              </span>
              <span class="nav-label">Dashboard</span>
            </a>
            <a class="nav-item" data-page="body-sheet" id="nav-body-sheet">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <line x1="9" y1="9" x2="15" y2="9"></line>
                  <line x1="9" y1="13" x2="15" y2="13"></line>
                  <line x1="9" y1="17" x2="15" y2="17"></line>
                </svg>
              </span>
              <span class="nav-label">Body Sheet</span>
            </a>
            <a class="nav-item" data-page="client-leads" id="nav-client-leads">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <span class="nav-label">Client Leads</span>
            </a>
            <a class="nav-item" data-page="results" id="nav-results">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="17" x2="9" y2="10"></line>
                  <line x1="12" y1="17" x2="12" y2="12"></line>
                  <line x1="15" y1="17" x2="15" y2="8"></line>
                  <line x1="9" y1="7" x2="15" y2="7"></line>
                </svg>
              </span>
              <span class="nav-label">Results</span>
            </a>
            <a class="nav-item" data-page="education" id="nav-education">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </span>
              <span class="nav-label">Wellness Guide</span>
            </a>
          `;
        }
        if (bottomNav) {
          bottomNav.innerHTML = `
            <a class="bnav-item active" data-page="dashboard" id="bnav-dashboard">
              <span class="bnav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                  <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                  <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                </svg>
              </span>
              <span class="bnav-label">Home</span>
            </a>
            <a class="bnav-item" data-page="body-sheet" id="bnav-body-sheet">
              <span class="bnav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <line x1="9" y1="9" x2="15" y2="9"></line>
                  <line x1="9" y1="13" x2="15" y2="13"></line>
                  <line x1="9" y1="17" x2="15" y2="17"></line>
                </svg>
              </span>
              <span class="bnav-label">Body</span>
            </a>
            <a class="bnav-item" data-page="client-leads" id="bnav-client-leads">
              <span class="bnav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <span class="bnav-label">Leads</span>
            </a>
            <a class="bnav-item" data-page="results" id="bnav-results">
              <span class="bnav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="17" x2="9" y2="10"></line>
                  <line x1="12" y1="17" x2="12" y2="12"></line>
                  <line x1="15" y1="17" x2="15" y2="8"></line>
                  <line x1="9" y1="7" x2="15" y2="7"></line>
                </svg>
              </span>
              <span class="bnav-label">Results</span>
            </a>
            <a class="bnav-item" data-page="education" id="bnav-education">
              <span class="bnav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </span>
              <span class="bnav-label">Guide</span>
            </a>
          `;
        }
      }
      
      this.bindNavigationEvents();
      this.syncOperatorDetails();
    } else {
      loginScreen.classList.remove("hidden");
      appShell.classList.add("hidden");
    }
  },

  bindAuthEvents() {
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value.trim();
        const pass = document.getElementById("login-password").value.trim();
        const err = document.getElementById("login-error");

        try {
          const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password: pass })
          });
          if (res.ok) {
            const data = await res.json();
            sessionStorage.setItem("sakria_logged_in", "true");
            sessionStorage.setItem("sakria_is_admin", data.is_admin ? "true" : "false");
            sessionStorage.setItem("sakria_tenant_id", data.tenant_id);
            sessionStorage.setItem("sakria_session_id", data.session_id);

            // Populate fresh operator details in localStorage immediately
            if (!data.is_admin) {
              const initialOp = {
                name: data.name,
                username: username,
                role: "Lead Wellness Coach",
                avatar: data.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase(),
                wellnessCenterName: data.center_name,
                coachPhoneNumber: "",
                wellnessCenterAddress: ""
              };
              localStorage.setItem(Store.getOperatorKey(), JSON.stringify(initialOp));
              localStorage.removeItem(Store.getClientKey());
            } else {
              localStorage.removeItem(Store.getOperatorKey());
              localStorage.removeItem(Store.getClientKey());
            }

            err.classList.add("hidden");
            Helpers.showToast(`Namaste ${data.name}! Signed in successfully.`, "success");
            
            this.checkSession();
            
            if (data.is_admin) {
              window.location.hash = "#admin-console";
            } else {
              window.location.hash = "#dashboard";
            }
          } else {
            const errData = await res.json();
            err.textContent = errData.detail || "Invalid email or password parameters.";
            err.classList.remove("hidden");
            Helpers.showToast(errData.detail || "Invalid credentials.", "error");
          }
        } catch (errConnection) {
          console.error(errConnection);
          err.textContent = "Error connecting to Sakria SaaS Auth service.";
          err.classList.remove("hidden");
          Helpers.showToast("Connection to backend lost.", "error");
        }
      });
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        sessionStorage.removeItem("sakria_logged_in");
        sessionStorage.removeItem("sakria_is_admin");
        sessionStorage.removeItem("sakria_tenant_id");
        sessionStorage.removeItem("sakria_session_id");
        Helpers.showToast("Logged out of workspace.", "warning");
        this.checkSession();
      });
    }
  },

  syncOperatorDetails() {
    const isAdmin = sessionStorage.getItem("sakria_is_admin") === "true";
    const sideName = document.getElementById("sidebar-name");
    const sideAvatar = document.getElementById("sidebar-avatar");
    const topAvatar = document.getElementById("topbar-avatar");

    if (isAdmin) {
      if (sideName) sideName.textContent = "Platform Owner";
      if (sideAvatar) sideAvatar.textContent = "AD";
      if (topAvatar) topAvatar.textContent = "AD";
    } else {
      const op = Store.getOperator();
      if (op) {
        const initials = op.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
        if (sideName) sideName.textContent = op.name;
        if (sideAvatar) sideAvatar.textContent = initials;
        if (topAvatar) topAvatar.textContent = initials;
      }
    }
  },

  bindNavigationEvents() {
    // Nav links
    const navItems = document.querySelectorAll(".nav-item, .bnav-item, .bottom-nav-item");
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        const page = item.getAttribute("data-page");
        window.location.hash = `#${page}`;
        
        // Hide sidebar on mobile click
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("mob-overlay");
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.add("hidden");
      });
    });

    // Mobile hamburger menu toggle
    const toggle = document.getElementById("btn-menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("mob-overlay");

    if (toggle && sidebar && overlay) {
      toggle.addEventListener("click", () => {
        sidebar.classList.add("open");
        overlay.classList.remove("hidden");
      });

      overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.add("hidden");
      });
    }

    // Window routing
    window.addEventListener("hashchange", () => this.route());
  },

  async route() {
    const isLoggedIn = sessionStorage.getItem("sakria_logged_in") === "true";
    if (!isLoggedIn) return;

    const hash = window.location.hash || (sessionStorage.getItem("sakria_is_admin") === "true" ? "#admin-console" : "#dashboard");
    const cleanHash = hash.split("?")[0];
    const page = cleanHash.replace("#", "");

    // Extract search query parameters if any
    const query = {};
    if (hash.includes("?")) {
      const qStr = hash.split("?")[1];
      qStr.split("&").forEach(p => {
        const parts = p.split("=");
        query[parts[0]] = parts[1];
      });
    }

    const main = document.getElementById("main-content");
    if (!main) return;

    this.activePage = page;

    // Asynchronously update local store state from PostgreSQL server before page rendering
    await Store.syncWithBackend();

    if (window.Dashboard && typeof window.Dashboard.updateNotificationBadge === "function") {
      window.Dashboard.updateNotificationBadge();
    }

    // Render corresponding screen module
    if (page === "admin-console") {
      main.innerHTML = AdminConsole.render();
      AdminConsole.init();
    } else if (page === "dashboard") {
      main.innerHTML = Dashboard.render();
      Dashboard.init();
    } else if (page === "body-sheet") {
      if (query.name) {
        BodySheet.currentInputs.name = decodeURIComponent(query.name);
        BodySheet.currentInputs.phone = query.phone || "";
        if (query.symptom) {
          const symptom = decodeURIComponent(query.symptom);
          BodySheet.currentInputs.healthIssues = [symptom];
        }
      } else {
        BodySheet.currentInputs.name = "";
        BodySheet.currentInputs.phone = "";
        BodySheet.currentInputs.healthIssues = [];
      }
      main.innerHTML = BodySheet.render();
      BodySheet.init();
    } else if (page === "client-leads") {
      if (query.client) {
        ClientLeads.selectedClientId = query.client;
      } else {
        ClientLeads.selectedClientId = null;
      }
      main.innerHTML = ClientLeads.render();
      ClientLeads.init();
    } else if (page === "chat") {
      // Chat feature removed
      main.innerHTML = Dashboard.render();
      Dashboard.init();
    } else if (page === "results") {
      main.innerHTML = Results.render();
      Results.init();
    } else if (page === "education") {
      main.innerHTML = Education.render();
      Education.init();
    } else if (page === "settings") {
      main.innerHTML = Settings.render();
      Settings.init();
    } else {
      if (sessionStorage.getItem("sakria_is_admin") === "true") {
        main.innerHTML = AdminConsole.render();
        AdminConsole.init();
      } else {
        main.innerHTML = Dashboard.render();
        Dashboard.init();
      }
    }

    // Update active nav highlights
    this.updateActiveNavHighlights(page);
  },

  updateActiveNavHighlights(page) {
    const items = document.querySelectorAll(".nav-item, .bnav-item");
    items.forEach(item => {
      const p = item.getAttribute("data-page");
      if (p === page) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
