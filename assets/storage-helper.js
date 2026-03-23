const agroMemoryStorage = (() => {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    }
  };
})();

function resolveBrowserStorage(storage) {
  try {
    const testKey = "__agrocontrol_storage_test__";
    storage.setItem(testKey, "ok");
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

function getSafeStorage() {
  return resolveBrowserStorage(window.localStorage)
    || resolveBrowserStorage(window.sessionStorage)
    || agroMemoryStorage;
}

const safeStorage = getSafeStorage();
