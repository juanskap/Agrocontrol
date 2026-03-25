(() => {
  const defaultAuthTranslations = {
    es: { login: "Iniciar sesi\u00f3n", logout: "Cerrar sesi\u00f3n" },
    en: { login: "Log in", logout: "Log out" }
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

  window.initPublicAuth = function initPublicAuth(options = {}) {
    const authKey = options.authKey || "agrocontrol-auth-v1";
    const loginSelector = options.loginSelector || '[data-i18n="nav.login"]';
    const routeSelectors = {
      inventory: options.inventorySelector || '[data-i18n="nav.inventory"]',
      movements: options.movementsSelector || '[data-i18n="nav.movements"]',
      pos: options.posSelector || 'a[href="pos.html"]'
    };
    const translations = options.translations || defaultAuthTranslations;
    const routes = {
      inventory: "inventario.html",
      movements: "movimientos.html",
      pos: "pos.html",
      ...(options.routes || {})
    };
    const loginRedirect = options.loginRedirect || routes.inventory;
    const languageStorageKey = options.languageStorageKey || "agrocontrol-language";
    const appBasePath = window.location.pathname.replace(/\/$/, "").replace(/\/(?:index|nosotros|contacto|login|pos|inventario|movimientos)(?:\.html)?$/, "");

    const loginLink = document.querySelector(loginSelector);
    const routeElements = {
      inventory: document.querySelector(routeSelectors.inventory),
      movements: document.querySelector(routeSelectors.movements),
      pos: document.querySelector(routeSelectors.pos)
    };

    function apiUrl(path) {
      return `${window.location.origin}${appBasePath}${path}`;
    }

    function isAuthenticated() {
      return Boolean(getPublicSession(authKey));
    }

    function isAdminSession() {
      return getPublicSession(authKey)?.role === "admin";
    }

    function buildRoute(target, authenticated, requiresAdmin = false) {
      if (!authenticated) {
        return `login.html?redirect=${target}`;
      }

      if (requiresAdmin && !isAdminSession()) {
        return "pos.html";
      }

      return target;
    }

    function update(lang = "es") {
      if (!loginLink) return;

      const copy = translations[lang] || translations.es || defaultAuthTranslations.es;
      const authenticated = isAuthenticated();
      const adminSession = isAdminSession();
      const loginText = loginLink.querySelector("[data-i18n-text]");

      if (loginText) {
        loginText.textContent = authenticated ? copy.logout : copy.login;
      } else {
        loginLink.textContent = authenticated ? copy.logout : copy.login;
      }

      loginLink.setAttribute("href", authenticated ? "#" : `login.html?redirect=${loginRedirect}`);

      Object.entries(routeElements).forEach(([key, element]) => {
        if (!element || !routes[key]) return;
        const requiresAdmin = key === "inventory" || key === "movements";
        if (requiresAdmin) {
          const shouldHide = !authenticated || !adminSession;
          element.classList.toggle("hidden", shouldHide);
          if (shouldHide) {
            return;
          }
        }
        element.setAttribute("href", buildRoute(routes[key], authenticated, requiresAdmin));
      });
    }

    async function syncSession(lang = "es") {
      try {
        const response = await fetch(apiUrl("/api/session"), {
          headers: { Accept: "application/json" }
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
          headers: { Accept: "application/json" }
        });
      } catch {
        // Clear local state even if the server is temporarily unreachable.
      }

      savePublicSession(authKey, null);
      update(lang);
    }

    if (loginLink && !loginLink.dataset.publicAuthBound) {
      loginLink.addEventListener("click", async (event) => {
        if (!isAuthenticated()) return;
        event.preventDefault();
        await logout(safeStorage.getItem(languageStorageKey) || "es");
      });
      loginLink.dataset.publicAuthBound = "true";
    }

    syncSession(safeStorage.getItem(languageStorageKey) || "es");

    return { update, isAuthenticated, syncSession, logout };
  };
})();
