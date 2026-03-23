(() => {
  const appKeys = window.AGRO_APP_KEYS;
  const defaultPage = window.location.pathname.split("/").pop() || "inventario.html";

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

  window.isAuthenticated = function isAuthenticated() {
    return Boolean(window.getAgroSession());
  };

  window.redirectToLogin = function redirectToLogin(page = defaultPage) {
    const nextPage = encodeURIComponent(page);
    window.location.href = `login.html?redirect=${nextPage}`;
  };

  window.requireAuth = function requireAuth(actionLabel) {
    if (window.isAuthenticated()) {
      return true;
    }

    alert(window.getInventoryText("messages.previewAuth", `${actionLabel} requiere iniciar sesión. Estás en modo vista previa.`));
    window.redirectToLogin(defaultPage);
    return false;
  };

  if (!window.isAuthenticated()) {
    window.redirectToLogin(defaultPage);
  }
})();


