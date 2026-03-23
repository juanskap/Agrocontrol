(() => {
  const defaultAuthTranslations = {
    es: { login: "Iniciar sesión", logout: "Cerrar sesión" },
    en: { login: "Log in", logout: "Log out" }
  };

  function getPublicSession(authKey) {
    try {
      return JSON.parse(safeStorage.getItem(authKey) || "null");
    } catch {
      return null;
    }
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

    const loginLink = document.querySelector(loginSelector);
    const routeElements = {
      inventory: document.querySelector(routeSelectors.inventory),
      movements: document.querySelector(routeSelectors.movements),
      pos: document.querySelector(routeSelectors.pos)
    };

    function isAuthenticated() {
      return Boolean(getPublicSession(authKey));
    }

    function buildRoute(target, authenticated) {
      return authenticated ? target : `login.html?redirect=${target}`;
    }

    function update(lang = "es") {
      if (!loginLink) return;

      const copy = translations[lang] || translations.es || defaultAuthTranslations.es;
      const authenticated = isAuthenticated();
      const loginText = loginLink.querySelector("[data-i18n-text]");

      if (loginText) {
        loginText.textContent = authenticated ? copy.logout : copy.login;
      } else {
        loginLink.textContent = authenticated ? copy.logout : copy.login;
      }

      loginLink.setAttribute("href", authenticated ? "#" : `login.html?redirect=${loginRedirect}`);

      Object.entries(routeElements).forEach(([key, element]) => {
        if (!element || !routes[key]) return;
        element.setAttribute("href", buildRoute(routes[key], authenticated));
      });
    }

    if (loginLink && !loginLink.dataset.publicAuthBound) {
      loginLink.addEventListener("click", (event) => {
        if (!isAuthenticated()) return;
        event.preventDefault();
        safeStorage.removeItem(authKey);
        update(safeStorage.getItem(languageStorageKey) || "es");
      });
      loginLink.dataset.publicAuthBound = "true";
    }

    return { update, isAuthenticated };
  };
})();
