(() => {
  const defaultAuthTranslations = {
    es: {
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      profile: "Mi perfil",
      adminPanel: "Panel admin",
    },
    en: {
      login: "Log in",
      logout: "Log out",
      profile: "My profile",
      adminPanel: "Admin panel",
    },
  };

  function getPublicSession(authKey) {
    try {
      return JSON.parse(safeStorage.getItem(authKey) || "null");
    } catch {
      return null;
    }
  }

  function savePublicSession(authKey, session) {
    if (!session) {
      safeStorage.removeItem(authKey);
      return;
    }

    safeStorage.setItem(authKey, JSON.stringify(session));
  }

  function firstNameFromUser(user) {
    const name = String(user || "").trim();
    if (!name) return "";
    return name.split(/\s+/)[0] || name;
  }

  window.initPublicAuth = function initPublicAuth(options = {}) {
    const authKey = options.authKey || "agrocontrol-auth-v1";
    const loginSelector = options.loginSelector || '[data-i18n="nav.login"]';
    const loginMode = options.loginMode || "page";
    const onLoginRequested = typeof options.onLoginRequested === "function" ? options.onLoginRequested : null;
    const profileRoute = options.profileRoute || "perfil.html";
    const routeSelectors = {
      inventory: options.inventorySelector || '[data-i18n="nav.inventory"]',
      movements: options.movementsSelector || '[data-i18n="nav.movements"]',
      pos: options.posSelector || 'a[href="pos.html"]',
    };
    const translations = options.translations || defaultAuthTranslations;
    const routes = {
      inventory: "inventario.html",
      movements: "movimientos.html",
      pos: "pos.html",
      ...(options.routes || {}),
    };
    const loginRedirect = options.loginRedirect || routes.inventory;
    const logoutRedirect = options.logoutRedirect || "index.html";
    const languageStorageKey = options.languageStorageKey || "agrocontrol-language";
    const appBasePath = window.location.pathname
      .replace(/\/$/, "")
      .replace(/\/(?:index|nosotros|contacto|login|pos|inventario|movimientos|perfil)(?:\.html)?$/, "");

    const loginLink = document.querySelector(loginSelector);
    const routeElements = {
      inventory: document.querySelector(routeSelectors.inventory),
      movements: document.querySelector(routeSelectors.movements),
      pos: document.querySelector(routeSelectors.pos),
    };

    let dropdownRoot = null;
    let profileAction = null;
    let logoutAction = null;
    let triggerWrapper = null;

    function apiUrl(path) {
      return `${window.location.origin}${appBasePath}${path}`;
    }

    function resolveUrl(path) {
      const target = String(path || "").trim();
      if (!target) return "#";
      if (/^https?:\/\//i.test(target)) return target;
      if (target.startsWith("/")) {
        return `${window.location.origin}${appBasePath}${target}`;
      }
      return `${window.location.origin}${appBasePath}/${target.replace(/^\/+/, "")}`;
    }

    function getSession() {
      return getPublicSession(authKey);
    }

    function isAuthenticated() {
      return Boolean(getSession());
    }

    function isAdminSession() {
      return getSession()?.role === "admin";
    }

    function buildRoute(target, authenticated, requiresAdmin = false, requiresAuth = false) {
      if (!requiresAuth) return target;
      if (!authenticated) return `login.html?redirect=${target}`;
      if (requiresAdmin && !isAdminSession()) return "pos.html";
      return target;
    }

    function ensureDropdown() {
      if (!loginLink || dropdownRoot) return;

      if (!triggerWrapper) {
        triggerWrapper = document.createElement("div");
        triggerWrapper.className = "relative inline-flex";
        loginLink.insertAdjacentElement("beforebegin", triggerWrapper);
        triggerWrapper.appendChild(loginLink);
      }

      dropdownRoot = document.createElement("div");
      dropdownRoot.className = "absolute -right-1 top-[calc(100%+0.85rem)] z-50 hidden min-w-[13.25rem] overflow-hidden rounded-[1.1rem] border border-white/14 bg-[radial-gradient(circle_at_top,_rgba(217,164,65,0.16),_rgba(217,164,65,0)_30%),linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(17,24,39,0.96)_54%,_rgba(10,15,28,0.98))] p-1.5 text-white shadow-[0_20px_36px_rgba(15,23,42,0.28)] backdrop-blur-lg";

      profileAction = document.createElement("a");
      profileAction.href = resolveUrl(profileRoute);
      profileAction.className = "group relative flex min-h-[2.55rem] items-center gap-2.5 rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[13px] font-semibold text-slate-100 shadow-[0_10px_18px_rgba(0,0,0,0.14)] transition duration-200 hover:border-sol/35 hover:bg-white/[0.08] hover:text-sol";
      profileAction.innerHTML = '<span class="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full border border-white/10 bg-slate-900/40 text-sol shadow-[0_10px_24px_rgba(217,164,65,0.12)] transition group-hover:border-sol/40 group-hover:bg-slate-900/55"><svg viewBox="0 0 24 24" class="h-3.5 w-3.5 stroke-current stroke-[1.9]" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3"></circle><path stroke-linecap="round" stroke-linejoin="round" d="M5.5 19c1.2-2.7 3.6-4.2 6.5-4.2S17.3 16.3 18.5 19"></path></svg></span><span class="flex flex-col"><span class="text-[9px] font-bold uppercase tracking-[0.16em] text-sol/80">Cuenta</span><span class="leading-none" data-auth-menu-text="profile">Mi perfil</span></span>';

      logoutAction = document.createElement("button");
      logoutAction.type = "button";
      logoutAction.className = "group flex min-h-[2.55rem] w-full items-center gap-2.5 rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-[13px] font-semibold text-slate-100 shadow-[0_10px_18px_rgba(0,0,0,0.14)] transition duration-200 hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100";
      logoutAction.innerHTML = '<span class="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full border border-white/10 bg-white/6 text-rose-100 shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition group-hover:border-rose-300/35 group-hover:bg-rose-400/12"><svg viewBox="0 0 24 24" class="h-3.5 w-3.5 stroke-current stroke-[1.9]" fill="none" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 7.5V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-1.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12H4.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="m8.5 8.5-4 3.5 4 3.5"></path></svg></span><span class="flex flex-col"><span class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Sesion</span><span class="leading-none" data-auth-menu-text="logout">Cerrar sesion</span></span>';

      dropdownRoot.append(profileAction, logoutAction);

      triggerWrapper.appendChild(dropdownRoot);

      profileAction.addEventListener("click", () => hideDropdown());
      logoutAction.addEventListener("click", async () => {
        hideDropdown();
        await logout(safeStorage.getItem(languageStorageKey) || "es");
        window.location.href = logoutRedirect;
      });

      document.addEventListener("click", (event) => {
        if (!dropdownRoot || dropdownRoot.classList.contains("hidden")) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (dropdownRoot.contains(target) || loginLink.contains(target)) return;
        hideDropdown();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          hideDropdown();
        }
      });
    }

    function showDropdown() {
      ensureDropdown();
      if (!dropdownRoot) return;
      dropdownRoot.classList.remove("hidden");
    }

    function hideDropdown() {
      if (!dropdownRoot) return;
      dropdownRoot.classList.add("hidden");
    }

    function toggleDropdown() {
      ensureDropdown();
      if (!dropdownRoot) return;
      dropdownRoot.classList.toggle("hidden");
    }

    function update(lang = "es") {
      if (!loginLink) return;

      const copy = translations[lang] || translations.es || defaultAuthTranslations.es;
      const session = getSession();
      const authenticated = Boolean(session);
      const adminSession = session?.role === "admin";
      const loginText = loginLink.querySelector("[data-i18n-text]");
      const profileLabel = dropdownRoot?.querySelector('[data-auth-menu-text="profile"]');
      const logoutLabel = dropdownRoot?.querySelector('[data-auth-menu-text="logout"]');

      if (authenticated) {
        const firstName = firstNameFromUser(session?.user) || (adminSession ? "Admin" : copy.profile);
        if (loginText) {
          loginText.textContent = firstName;
        } else {
          loginLink.textContent = firstName;
        }
      } else if (loginText) {
        loginText.textContent = copy.login;
      } else {
        loginLink.textContent = copy.login;
      }

      if (profileAction) {
        profileAction.href = resolveUrl(adminSession ? routes.inventory : profileRoute);
      }
      if (profileLabel) {
        profileLabel.textContent = adminSession ? copy.adminPanel : copy.profile;
      }
      if (logoutLabel) {
        logoutLabel.textContent = copy.logout;
      }

      const loginHref = loginMode === "modal" ? "#" : `login.html?redirect=${loginRedirect}`;
      loginLink.setAttribute("href", authenticated ? "#" : loginHref);

      Object.entries(routeElements).forEach(([key, element]) => {
        if (!element || !routes[key]) return;
        const requiresAdmin = key === "inventory" || key === "movements";
        const requiresAuth = key !== "pos";
        if (requiresAdmin) {
          const shouldHide = !authenticated || !adminSession;
          element.classList.toggle("hidden", shouldHide);
          if (shouldHide) return;
        }
        element.setAttribute("href", buildRoute(routes[key], authenticated, requiresAdmin, requiresAuth));
      });
    }

    async function syncSession(lang = "es") {
      try {
        const response = await fetch(apiUrl("/api/session"), {
          headers: { Accept: "application/json" },
        });
        const payload = await response.json();
        savePublicSession(authKey, payload?.data || null);
      } catch {
        // Keep the last known client state if the session check fails.
      }

      update(lang);
    }

    async function logout(lang = "es") {
      try {
        await fetch(apiUrl("/api/logout"), {
          method: "POST",
          headers: { Accept: "application/json" },
        });
      } catch {
        // Clear local state even if the server is temporarily unreachable.
      }

      savePublicSession(authKey, null);
      hideDropdown();
      update(lang);
    }

    if (loginLink && !loginLink.dataset.publicAuthBound) {
      loginLink.addEventListener("click", async (event) => {
        if (!isAuthenticated()) {
          if (loginMode === "modal" && onLoginRequested) {
            event.preventDefault();
            onLoginRequested();
          }
          return;
        }

        event.preventDefault();
        toggleDropdown();
      });
      loginLink.dataset.publicAuthBound = "true";
    }

    ensureDropdown();
    syncSession(safeStorage.getItem(languageStorageKey) || "es");

    return { update, isAuthenticated, syncSession, logout };
  };
})();

