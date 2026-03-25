(() => {
  const appKeys = window.AGRO_APP_KEYS;
  const defaultPage = window.location.pathname.split("/").pop() || "inventario.html";
  const appBasePath = window.location.pathname
    .replace(/\/$/, "")
    .replace(/\/(?:inventario|movimientos)(?:\.html)?$/, "");

  window.currentInventoryLanguage = safeStorage.getItem(appKeys.language) || "es";

  window.getInventoryText = function getInventoryText(key, fallback) {
    if (!window.inventoryTranslations) {
      return fallback;
    }

    return getNestedTranslation(window.inventoryTranslations, window.currentInventoryLanguage, key) || fallback;
  };

  window.getAgroSession = function getAgroSession() {
    try {
      return JSON.parse(safeStorage.getItem(appKeys.auth) || "null");
    } catch {
      return null;
    }
  };

  window.saveAgroSession = function saveAgroSession(session) {
    if (!session) {
      safeStorage.removeItem(appKeys.auth);
      return;
    }

    safeStorage.setItem(appKeys.auth, JSON.stringify(session));
  };

  window.isAuthenticated = function isAuthenticated() {
    return Boolean(window.getAgroSession());
  };

  window.isAdminSession = function isAdminSession() {
    return window.getAgroSession()?.role === "admin";
  };

  function apiUrl(path) {
    return `${window.location.origin}${appBasePath}${path}`;
  }

  window.redirectToLogin = function redirectToLogin(page = defaultPage) {
    const nextPage = encodeURIComponent(page);
    window.location.href = `login.html?redirect=${nextPage}`;
  };

  window.redirectToPublicArea = function redirectToPublicArea() {
    window.location.href = "pos.html";
  };

  window.requireAuth = function requireAuth(actionLabel) {
    if (window.isAuthenticated()) {
      return true;
    }

    alert(window.getInventoryText("messages.previewAuth", `${actionLabel} requiere iniciar sesi\u00f3n. Est\u00e1s en modo vista previa.`));
    window.redirectToLogin(defaultPage);
    return false;
  };

  window.requireAdmin = function requireAdmin() {
    if (!window.isAuthenticated()) {
      window.redirectToLogin(defaultPage);
      return false;
    }

    if (window.isAdminSession()) {
      return true;
    }

    alert(window.getInventoryText("messages.adminOnly", "Solo los administradores pueden acceder a este panel."));
    window.redirectToPublicArea();
    return false;
  };

  window.syncAgroSession = async function syncAgroSession() {
    try {
      const response = await fetch(apiUrl("/api/session"), {
        headers: { Accept: "application/json" }
      });
      const payload = await response.json();
      window.saveAgroSession(payload?.data || null);
    } catch {
      // If the sync fails, keep the last local state.
    }

    return window.getAgroSession();
  };

  window.logoutAgroSession = async function logoutAgroSession() {
    try {
      await fetch(apiUrl("/api/logout"), {
        method: "POST",
        headers: { Accept: "application/json" }
      });
    } catch {
      // Clear the local session even if the request fails.
    }

    window.saveAgroSession(null);
  };

  (async () => {
    await window.syncAgroSession();

    if (!window.requireAdmin()) {
      return;
    }

    if (!window.isAuthenticated()) {
      window.redirectToLogin(defaultPage);
    }
  })();
})();

