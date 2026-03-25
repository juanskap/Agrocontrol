(() => {
  const inventoryStateKey = window.AGRO_APP_KEYS.inventoryState;
  const movementsKey = window.AGRO_APP_KEYS.movements;
  const salesKey = window.AGRO_APP_KEYS.sales;
  const customerAccountsKey = "agrocontrol-customer-accounts-v1";
  const authKey = window.AGRO_APP_KEYS.auth;
  const languageKey = window.AGRO_APP_KEYS.language || "agrocontrol-language";
  const translations = window.posTranslations || {};
  const appBasePath = window.location.pathname
    .replace(/\/$/, "")
    .replace(/\/(?:pos(?:\.html)?)$/, "");

  const logoutButton = document.getElementById("logout-button");
  const inventoryNavLink = document.querySelector('[data-i18n="nav.inventory"]');
  const movementsNavLink = document.querySelector('[data-i18n="nav.movements"]');
  const openCartModalButton = document.getElementById("open-cart-modal");
  const closeCartModalButton = document.getElementById("close-cart-modal");
  const cartModal = document.getElementById("cart-modal");
  const cartCountBadge = document.getElementById("cart-count-badge");
  const productSearch = document.getElementById("product-search");
  const productGrid = document.getElementById("product-grid");
  const productPaginationSummary = document.getElementById("product-pagination-summary");
  const productPagination = document.getElementById("product-pagination");
  const cartItems = document.getElementById("cart-items");
  const cartStatus = document.getElementById("cart-status");
  const subtotalValue = document.getElementById("subtotal-value");
  const discountValue = document.getElementById("discount-value");
  const totalValue = document.getElementById("total-value");
  const discountInput = document.getElementById("sale-discount");
  const customerAccountSelect = document.getElementById("customer-account-select");
  const selectedCustomerSummary = document.getElementById("selected-customer-summary");
  const openCustomerAccountModalButton = document.getElementById("open-customer-account-modal");
  const customerAccountModal = document.getElementById("customer-account-modal");
  const closeCustomerAccountModalButton = document.getElementById("close-customer-account-modal");
  const cancelCustomerAccountModalButton = document.getElementById("cancel-customer-account-modal");
  const customerAccountForm = document.getElementById("customer-account-form");
  const customerAccountName = document.getElementById("customer-account-name");
  const customerAccountEmail = document.getElementById("customer-account-email");
  const customerAccountPhone = document.getElementById("customer-account-phone");
  const customerAccountPassword = document.getElementById("customer-account-password");
  const customerAccountPasswordConfirm = document.getElementById("customer-account-password-confirm");
  const paymentMethod = document.getElementById("payment-method");
  const saleNote = document.getElementById("sale-note");
  const confirmSaleButton = document.getElementById("confirm-sale");
  const saleForm = document.getElementById("sale-form");
  const clearCartButton = document.getElementById("clear-cart");
  const categoryChips = Array.from(document.querySelectorAll(".category-chip"));
  const productDetailModal = document.getElementById("product-detail-modal");
  const closeProductDetailButton = document.getElementById("close-product-detail");
  const productDetailTitle = document.getElementById("product-detail-title");
  const productDetailSubtitle = document.getElementById("product-detail-subtitle");
  const productDetailImage = document.getElementById("product-detail-image");
  const productDetailId = document.getElementById("product-detail-id");
  const productDetailStock = document.getElementById("product-detail-stock");
  const productDetailCategory = document.getElementById("product-detail-category");
  const productDetailPresentation = document.getElementById("product-detail-presentation");
  const productDetailUsage = document.getElementById("product-detail-usage");
  const productDetailPrice = document.getElementById("product-detail-price");
  const productDetailAddButton = document.getElementById("product-detail-add");

  const categoryImages = {
    insumos: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80"
    ],
    abonos: [
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=80"
    ],
    herramientas: [
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80"
    ]
  };

  let inventoryState = loadInventoryState();
  let salesHistory = loadSalesHistory();
  let customerAccounts = loadCustomerAccounts();
  let paymentMethodsCatalog = [];
  let activeCategory = "all";
  let currentProductPage = 1;
  let cart = [];
  const productsPerPage = 36;
  let detailProduct = null;
  let currentLanguage = safeStorage.getItem(languageKey) || "es";

  function getNestedValue(source, path) {
    return path.split(".").reduce((value, segment) => value?.[segment], source);
  }

  function t(key) {
    return getNestedValue(translations[currentLanguage] || translations.es || {}, key)
      || getNestedValue(translations.es || {}, key)
      || key;
  }

  function categoryLabel(category) {
    const keys = {
      all: "filters.all",
      insumos: "filters.inputs",
      abonos: "filters.fertilizers",
      herramientas: "filters.tools"
    };
    return t(keys[category] || "filters.all");
  }

  function paymentLabel(payment) {
    const keys = {
      cash: "checkout.paymentCash",
      transfer: "checkout.paymentTransfer",
      cards: "checkout.paymentCards",
      card: "checkout.paymentCards",
      paypal: "checkout.paymentPayPal",
      Efectivo: "checkout.paymentCash",
      Transferencia: "checkout.paymentTransfer",
      Tarjetas: "checkout.paymentCards",
      Tarjeta: "checkout.paymentCards",
      PayPal: "checkout.paymentPayPal",
      Cash: "checkout.paymentCash",
      Cards: "checkout.paymentCards",
      Card: "checkout.paymentCards"
    };
    return keys[payment] ? t(keys[payment]) : payment;
  }

  function getPublicPosCopy() {
    return currentLanguage === "en"
      ? {
          badge: "Public access",
          title: "POS open for online purchases",
          description: "Anyone can browse products and build a cart. We only ask for a customer account when confirming the purchase.",
          action: "Sign in or create account"
        }
      : {
          badge: "Acceso publico",
          title: "POS abierto para compras en linea",
          description: "Cualquier visitante puede explorar productos y armar su carrito. Solo pedimos una cuenta cliente al momento de confirmar la compra.",
          action: "Entrar o crear cuenta"
        };
  }

  function ensurePublicPosBanner() {
    const host = document.querySelector("main section.space-y-6");
    if (!host) return;

    const copy = getPublicPosCopy();
    let banner = document.getElementById("public-pos-banner");

    if (!banner) {
      banner = document.createElement("section");
      banner.id = "public-pos-banner";
      banner.className = "overflow-hidden rounded-[2rem] border border-hoja/10 bg-[linear-gradient(135deg,_rgba(62,107,72,0.94),_rgba(109,139,78,0.92))] px-5 py-5 text-white shadow-suave sm:px-7";
      banner.innerHTML = `
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-3xl space-y-3">
            <span data-public-pos=\"badge\" class="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"></span>
            <div class="space-y-2">
              <h1 data-public-pos=\"title\" class="text-2xl font-black tracking-tight sm:text-3xl"></h1>
              <p data-public-pos=\"description\" class="max-w-2xl text-sm text-white/85 sm:text-base"></p>
            </div>
          </div>
          <a data-public-pos=\"action\" href="login.html?redirect=pos.html" class="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 bg-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18"></a>
        </div>
      `;
      host.insertBefore(banner, host.firstChild);
    }

    const badge = banner.querySelector('[data-public-pos="badge"]');
    const title = banner.querySelector('[data-public-pos="title"]');
    const description = banner.querySelector('[data-public-pos="description"]');
    const action = banner.querySelector('[data-public-pos="action"]');
    if (badge) badge.textContent = copy.badge;
    if (title) title.textContent = copy.title;
    if (description) description.textContent = copy.description;
    if (action) action.textContent = copy.action;
  }

  function apiUrl(path) {
    return `${window.location.origin}${appBasePath}${path}`;
  }

  function buildNetworkErrorMessage() {
    const expectedBase = `${window.location.origin}${appBasePath || ""}`;
    if (window.location.protocol === "file:") {
      return "No se pudo conectar con el servidor. Abre el sistema desde http://localhost o desde tu proyecto en XAMPP.";
    }
    return `No se pudo conectar con el servidor. Verifica que abras el sistema desde ${expectedBase || window.location.origin}.`;
  }

  async function fetchJson(path, options = {}) {
    let response;
    try {
      response = await fetch(apiUrl(path), {
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        ...options
      });
    } catch (error) {
      throw new Error(buildNetworkErrorMessage());
    }

    const rawText = await response.text();
    const payload = (() => {
      try {
        return JSON.parse(rawText);
      } catch {
        return {
          status: "error",
          message: rawText.trim() || "No se pudo procesar la respuesta del servidor."
        };
      }
    })();

    if (!response.ok || payload.status === "error") {
      throw new Error(payload.message || "No se pudo completar la solicitud.");
    }

    return payload.data;
  }

  function getSession() {
    try {
      return JSON.parse(safeStorage.getItem(authKey) || "null");
    } catch {
      return null;
    }
  }

  function saveSession(session) {
    if (!session) {
      safeStorage.removeItem(authKey);
      return;
    }

    safeStorage.setItem(authKey, JSON.stringify(session));
  }

  function isAuthenticated() {
    return Boolean(getSession());
  }

  function isAdminSession() {
    return getSession()?.role === "admin";
  }

  async function syncServerSession() {
    try {
      const session = await fetchJson("/api/session", {
        headers: { Accept: "application/json" }
      });
      saveSession(session || null);
      return session || null;
    } catch {
      return getSession();
    }
  }

  async function logoutSession() {
    try {
      await fetchJson("/api/logout", {
        method: "POST",
        headers: { Accept: "application/json" }
      });
    } catch {
      // Clear the client state even if the request fails.
    }

    saveSession(null);
  }

  function syncPrivateNav() {
    const adminVisible = isAdminSession();
    inventoryNavLink?.classList.toggle("hidden", !adminVisible);
    movementsNavLink?.classList.toggle("hidden", !adminVisible);
  }

  function updateSessionButton() {
    if (!logoutButton) return;
    const label = logoutButton.querySelector("[data-i18n-text]") || logoutButton.querySelector("span");
    if (label) {
      label.textContent = isAuthenticated() ? t("actions.logout") : t("actions.login");
    }

    syncPrivateNav();
  }

  function openCartModal() {
    cartModal?.classList.remove("hidden");
  }

  function closeCartModal() {
    cartModal?.classList.add("hidden");
  }

  function openProductDetail(product) {
    detailProduct = product;
    if (!product) return;

    productDetailTitle.textContent = product.name;
    productDetailSubtitle.textContent = `${categoryLabel(product.category)} - ${product.subcategory}`;
    productDetailImage.src = product.image;
    productDetailImage.alt = product.name;
    productDetailId.textContent = product.id;
    productDetailStock.textContent = t("dynamic.unitsAvailable").replace("{count}", String(product.stock));
    productDetailCategory.textContent = categoryLabel(product.category);
    productDetailPresentation.textContent = product.presentation;
    productDetailUsage.textContent = product.usage || t("dynamic.productReady");
    productDetailPrice.textContent = formatCurrency(product.price);
    productDetailAddButton.disabled = product.stock <= 0;
    productDetailAddButton.className = product.stock <= 0
      ? "inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-400"
      : "inline-flex w-full items-center justify-center gap-2 rounded-full bg-hoja px-5 py-3 text-sm font-semibold text-white transition hover:bg-hoja/95";
    productDetailModal?.classList.remove("hidden");
  }

  function closeProductDetail() {
    productDetailModal?.classList.add("hidden");
    detailProduct = null;
  }

  function loadInventoryState() {
    try {
      const parsed = JSON.parse(safeStorage.getItem(inventoryStateKey) || "null");
      if (parsed?.insumos && parsed?.abonos && parsed?.herramientas) {
        return normalizeInventoryState(parsed);
      }
    } catch {}

    return {
      insumos: [],
      abonos: [],
      herramientas: []
    };
  }

  function saveInventoryState() {
    safeStorage.setItem(inventoryStateKey, JSON.stringify(inventoryState));
  }

  function normalizeInventoryState(state) {
    if (!state || typeof state !== "object") return state;

    const nextState = {
      insumos: Array.isArray(state.insumos) ? state.insumos.map((row) => [...row]) : [],
      abonos: Array.isArray(state.abonos) ? state.abonos.map((row) => [...row]) : [],
      herramientas: Array.isArray(state.herramientas) ? state.herramientas.map((row) => [...row]) : []
    };

    nextState.herramientas = nextState.herramientas.map((row) => {
      if (row[0] !== "HER-013") return row;

      const updatedRow = [...row];
      updatedRow[1] = "Tractor de arado";
      if (updatedRow[6] === "Motor diésel 90 HP" || updatedRow[6] === "Motor di\u00E9sel 90 HP") {
        updatedRow[6] = "Motor diésel 90 HP para labores de arado";
      }
      return updatedRow;
    });

    return nextState;
  }

  function loadSalesHistory() {
    try {
      const parsed = JSON.parse(safeStorage.getItem(salesKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function loadCustomerAccounts() {
    try {
      const parsed = JSON.parse(safeStorage.getItem(customerAccountsKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCustomerAccounts() {
    safeStorage.setItem(customerAccountsKey, JSON.stringify(customerAccounts));
  }

  function renderPaymentMethods() {
    if (!paymentMethod || paymentMethodsCatalog.length === 0) return;

    paymentMethod.innerHTML = paymentMethodsCatalog.map((method) => `
      <option value="${method.code}" class="bg-slate-900 text-white">${paymentLabel(method.code)}</option>
    `).join("");
  }

  function getSelectedCustomerAccount() {
    const selectedId = customerAccountSelect?.value || "";
    return customerAccounts.find((account) => account.id === selectedId) || null;
  }

  function updateCheckoutAvailability() {
    if (!confirmSaleButton) return;

    const hasCustomer = Boolean(customerAccountSelect?.value);
    const canCheckout = hasCustomer;
    confirmSaleButton.disabled = !canCheckout;
    confirmSaleButton.className = canCheckout
      ? "inline-flex items-center justify-center gap-2 rounded-full bg-sol px-6 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105 sm:min-w-[15rem]"
      : "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-500/40 px-6 py-3 text-sm font-bold text-white/60 sm:min-w-[15rem]";
  }

  function renderCustomerAccounts(selectedId = null) {
    if (!customerAccountSelect) return;

    const nextSelectedId = selectedId ?? customerAccountSelect.value;
    customerAccountSelect.innerHTML = [
      `<option value="" class="bg-slate-900 text-white">${t("checkout.customerSelect")}</option>`,
      ...customerAccounts.map((account) => `<option value="${account.id}" class="bg-slate-900 text-white">${account.fullName} - ${account.email}</option>`)
    ].join("");

    if (nextSelectedId && customerAccountSelect.querySelector(`option[value="${nextSelectedId}"]`)) {
      customerAccountSelect.value = nextSelectedId;
    }

    const selectedAccount = getSelectedCustomerAccount();
    if (selectedCustomerSummary) {
      selectedCustomerSummary.textContent = selectedAccount
        ? `${t("dynamic.selectedAccount").replace("{name}", selectedAccount.fullName)} - ${t("dynamic.accountCode").replace("{code}", selectedAccount.code)}`
        : t("checkout.noAccountSelected");
    }

    updateCheckoutAvailability();
  }

  async function loadRemoteCustomerAccounts() {
    if (!isAuthenticated()) {
      customerAccounts = [];
      saveCustomerAccounts();
      renderCustomerAccounts();
      return;
    }

    const rows = await fetchJson("/api/customers");
    customerAccounts = rows.map((account) => ({
      id: String(account.id),
      code: account.code,
      fullName: account.full_name,
      email: account.email,
      phone: account.phone || ""
    }));
    saveCustomerAccounts();
    renderCustomerAccounts();
  }

  async function loadRemotePaymentMethods() {
    paymentMethodsCatalog = await fetchJson("/api/payment-methods");
    renderPaymentMethods();
  }

  async function syncInventoryStateFromApi() {
    const state = await fetchJson("/api/inventory-state", {
      headers: { Accept: "application/json" }
    });
    inventoryState = state || { insumos: [], abonos: [], herramientas: [] };
  }

  async function syncSalesHistoryFromApi() {
    if (!isAuthenticated()) {
      salesHistory = [];
      return;
    }

    salesHistory = await fetchJson("/api/sales?limit=30", {
      headers: { Accept: "application/json" }
    });
  }

  async function syncPosData() {
    await syncInventoryStateFromApi();
    await syncSalesHistoryFromApi();
    renderProducts();
    renderCart();

    if (detailProduct) {
      const refreshedProduct = findProduct(detailProduct.category, detailProduct.id);
      if (refreshedProduct) {
        openProductDetail(refreshedProduct);
      } else {
        closeProductDetail();
      }
    }
  }
  function openCustomerAccountModal() {
    customerAccountModal?.classList.remove("hidden");
    customerAccountName?.focus();
  }

  function closeCustomerAccountModal() {
    customerAccountModal?.classList.add("hidden");
    customerAccountForm?.reset();
  }

  function buildCustomerAccountCode() {
    return `CLI-${String(customerAccounts.length + 1).padStart(4, "0")}`;
  }

  async function createCustomerAccount() {
    const fullName = customerAccountName?.value.trim() || "";
    const email = customerAccountEmail?.value.trim() || "";
    const phone = customerAccountPhone?.value.trim() || "";
    const password = customerAccountPassword?.value || "";
    const passwordConfirm = customerAccountPasswordConfirm?.value || "";

    if (!fullName) {
      alert(t("alerts.accountNameRequired"));
      return;
    }

    if (!email || !email.includes("@")) {
      alert(t("alerts.accountEmailRequired"));
      return;
    }

    if (password.length < 6) {
      alert(t("alerts.accountPasswordRequired"));
      return;
    }

    if (password !== passwordConfirm) {
      alert(t("alerts.accountPasswordMismatch"));
      return;
    }

    const account = await fetchJson("/api/customers", {
      method: "POST",
      body: JSON.stringify({
        full_name: fullName,
        email,
        phone,
        password
      })
    });

    saveSession(account.session || null);
    updateSessionButton();
    await loadRemoteCustomerAccounts();
    const selectedId = String(account.id);
    renderCustomerAccounts(selectedId);
    customerAccountSelect.value = selectedId;
    updateCheckoutAvailability();
    closeCustomerAccountModal();
    alert(t("alerts.accountCreated").replace("{name}", account.full_name || fullName));
  }

  function saveSalesHistory() {
    safeStorage.setItem(salesKey, JSON.stringify(salesHistory));
  }

  function loadMovementHistory() {
    try {
      const parsed = JSON.parse(safeStorage.getItem(movementsKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveMovementHistory(rows) {
    safeStorage.setItem(movementsKey, JSON.stringify(rows));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat(currentLanguage === "en" ? "en-US" : "es-EC", {
      style: "currency",
      currency: "USD"
    }).format(Number(value) || 0);
  }

  function parsePrice(value) {
    if (typeof value === "number") return value;
    const normalized = String(value || "").replace(/[^0-9.-]/g, "");
    return Number(normalized) || 0;
  }

  function quantityIndexByCategory(category) {
    return category === "herramientas" ? 5 : 4;
  }

  function getCurrentQuantity(category, row) {
    return Number(row[quantityIndexByCategory(category)]) || 0;
  }

  function getImageIndex(category, id) {
    const seed = `${category}-${id}`;
    let total = 0;
    for (let index = 0; index < seed.length; index += 1) total += seed.charCodeAt(index);
    return total % categoryImages[category].length;
  }

  function getProductImage(category, id) {
    return categoryImages[category][getImageIndex(category, id)];
  }

  function getFlatProducts() {
    return Object.entries(inventoryState).flatMap(([category, rows]) => rows.map((row) => ({
      category,
      id: row[0],
      name: row[1],
      subcategory: row[2],
      presentation: row[3],
      stock: getCurrentQuantity(category, row),
      price: parsePrice(row[7]),
      usage: row[8] || "",
      note: row[10] || row[11] || "",
      image: getProductImage(category, row[0]),
      raw: row
    })));
  }

  function getFilteredProducts() {
    const search = productSearch.value.trim().toLowerCase();
    return getFlatProducts().filter((product) => {
      const matchesCategory = activeCategory === "all" ? true : product.category === activeCategory;
      const matchesSearch = !search
        || product.name.toLowerCase().includes(search)
        || product.id.toLowerCase().includes(search)
        || product.subcategory.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }

  function syncCategoryUI() {
    categoryChips.forEach((chip) => {
      const isActive = chip.dataset.category === activeCategory;
      chip.className = isActive
        ? "category-chip inline-flex items-center gap-1.5 rounded-full bg-hoja px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
        : "category-chip inline-flex items-center gap-1.5 rounded-full border border-hoja/20 bg-white px-3 py-1.5 text-xs font-semibold text-hoja";
    });
  }

  function renderProducts() {
    const products = getFilteredProducts();
    const totalProducts = products.length;
    const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));
    currentProductPage = Math.min(Math.max(currentProductPage, 1), totalPages);
    const startIndex = (currentProductPage - 1) * productsPerPage;
    const visibleProducts = products.slice(startIndex, startIndex + productsPerPage);

    if (products.length === 0) {
      productGrid.innerHTML = `
        <div class="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500 sm:col-span-2 md:col-span-3 xl:col-span-4 2xl:col-span-6">
          ${t("dynamic.noMatchingProducts")}
        </div>
      `;
      if (productPaginationSummary) {
        productPaginationSummary.textContent = t("dynamic.showingRangeZero");
      }
      if (productPagination) {
        productPagination.innerHTML = "";
      }
      return;
    }

    productGrid.innerHTML = visibleProducts.map((product) => {
      const isOut = product.stock <= 0;
      return `
        <article class="product-card flex h-full min-h-[14.2rem] cursor-pointer flex-col overflow-hidden rounded-[1.1rem] border border-white/70 bg-white/90 shadow-[0_10px_18px_rgba(62,107,72,0.08)] backdrop-blur transition hover:-translate-y-[1px] hover:border-hoja/20" data-category="${product.category}" data-id="${product.id}">
          <div class="relative bg-[linear-gradient(180deg,_rgba(245,240,230,0.92),_rgba(234,244,236,0.85))] px-2 py-2">
            <div class="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[0.8rem] bg-white/65 ring-1 ring-black/5">
              <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover object-center">
            </div>
            <span class="absolute left-2.5 top-2.5 rounded-full bg-slate-950/70 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">${categoryLabel(product.category)}</span>
            <span class="absolute right-2.5 top-2.5 rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${isOut ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}">${isOut ? t("dynamic.outOfStock") : t("dynamic.unitsShort").replace("{count}", String(product.stock))}</span>
          </div>
          <div class="flex flex-1 flex-col p-2">
            <div class="min-h-[2.9rem]">
              <p class="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">${product.id}</p>
              <h3 class="mt-1 line-clamp-2 text-[13px] font-black leading-[1.05rem] text-slate-900">${product.name}</h3>
            </div>
            <div class="mt-auto flex items-end justify-between gap-1.5 pt-2">
              <div>
                <p class="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">${t("detail.price")}</p>
                <p class="mt-0.5 text-[0.92rem] font-black leading-none text-hoja">${formatCurrency(product.price)}</p>
              </div>
              <button class="add-to-cart inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-semibold leading-none ${isOut ? "cursor-not-allowed bg-slate-200 text-slate-400" : "bg-hoja text-white transition hover:bg-hoja/95"}" data-category="${product.category}" data-id="${product.id}" ${isOut ? "disabled" : ""}>
                <svg viewBox="0 0 24 24" class="h-3 w-3 fill-current" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>
                ${t("dynamic.add")}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    productGrid.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        addToCart(button.dataset.category, button.dataset.id);
      });
    });

    productGrid.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const product = findProduct(card.dataset.category, card.dataset.id);
        if (product) {
          openProductDetail(product);
        }
      });
    });

    if (productPaginationSummary) {
      productPaginationSummary.textContent = t("dynamic.showingRange")
        .replace("{start}", String(startIndex + 1))
        .replace("{end}", String(Math.min(startIndex + productsPerPage, totalProducts)))
        .replace("{total}", String(totalProducts));
    }

    if (productPagination) {
      const createButton = (label, page, disabled = false, active = false) => `
        <button
          type="button"
          data-page="${page}"
          ${disabled ? "disabled" : ""}
          class="inline-flex min-w-[2.25rem] items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition ${
            active
              ? "bg-hoja text-white"
              : disabled
                ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                : "border border-slate-200 bg-white text-slate-700 hover:border-hoja/25 hover:text-hoja"
          }"
        >${label}</button>
      `;

      const pageButtons = [];
      for (let page = 1; page <= totalPages; page += 1) {
        pageButtons.push(createButton(String(page), page, false, page === currentProductPage));
      }

      productPagination.innerHTML = `
        ${createButton(t("dynamic.previous"), currentProductPage - 1, currentProductPage === 1)}
        ${pageButtons.join("")}
        ${createButton(t("dynamic.next"), currentProductPage + 1, currentProductPage === totalPages)}
      `;

      productPagination.querySelectorAll("button[data-page]").forEach((button) => {
        button.addEventListener("click", () => {
          const nextPage = Number(button.dataset.page);
          if (!Number.isFinite(nextPage) || nextPage === currentProductPage) return;
          currentProductPage = nextPage;
          renderProducts();
        });
      });
    }
  }

  function findProduct(category, id) {
    return getFlatProducts().find((product) => product.category === category && product.id === id) || null;
  }

  function addToCart(category, id) {
    const product = findProduct(category, id);
    if (!product || product.stock <= 0) return;

    const existing = cart.find((item) => item.category === category && item.id === id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert(t("alerts.maxStock"));
        return;
      }
      existing.quantity += 1;
    } else {
      cart.push({
        category,
        id,
        quantity: 1
      });
    }

    renderCart();
  }

  function updateCartItem(category, id, nextQuantity) {
    const product = findProduct(category, id);
    if (!product) return;

    if (nextQuantity <= 0) {
      cart = cart.filter((item) => !(item.category === category && item.id === id));
      renderCart();
      return;
    }

    if (nextQuantity > product.stock) {
      alert(t("alerts.quantityExceedsStock"));
      return;
    }

    cart = cart.map((item) => item.category === category && item.id === id
      ? { ...item, quantity: nextQuantity }
      : item);
    renderCart();
  }

  function getCartDetails() {
    return cart.map((item) => {
      const product = findProduct(item.category, item.id);
      if (!product) return null;
      const subtotal = product.price * item.quantity;
      return {
        ...item,
        product,
        subtotal
      };
    }).filter(Boolean);
  }

  function renderCart() {
    const items = getCartDetails();
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountBadge) {
      cartCountBadge.textContent = String(totalUnits);
      cartCountBadge.classList.toggle("hidden", totalUnits === 0);
    }

    if (items.length === 0) {
      cartItems.innerHTML = `
        <div class="rounded-[1.5rem] border border-dashed border-white/12 bg-white/6 px-4 py-8 text-center text-sm text-white/60">
          ${t("dynamic.addProductsToStart")}
        </div>
      `;
      cartStatus.textContent = t("cart.emptyStatus");
    } else {
      cartItems.innerHTML = items.map(({ product, quantity, subtotal }) => `
        <article class="rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.04))] p-3.5">
          <div class="flex gap-3">
            <img src="${product.image}" alt="${product.name}" class="h-20 w-20 rounded-[1rem] border border-white/10 object-cover">
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-bold text-white">${product.name}</p>
                  <p class="mt-1 text-xs text-white/55">${product.id} - ${categoryLabel(product.category)}</p>
                </div>
                <div class="text-right">
                  <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">${t("summary.subtotal")}</p>
                  <p class="mt-1 text-sm font-black text-sol">${formatCurrency(subtotal)}</p>
                </div>
              </div>
              <div class="mt-3 flex items-center justify-between gap-3">
                <div class="inline-flex items-center rounded-full border border-white/10 bg-slate-950/35">
                  <button class="cart-qty px-3 py-1.5 text-sm font-bold text-white/75 transition hover:bg-white/10" data-action="decrease" data-category="${product.category}" data-id="${product.id}">-</button>
                  <span class="min-w-[2rem] text-center text-sm font-semibold text-white">${quantity}</span>
                  <button class="cart-qty px-3 py-1.5 text-sm font-bold text-white/75 transition hover:bg-white/10" data-action="increase" data-category="${product.category}" data-id="${product.id}">+</button>
                </div>
                <div class="rounded-[0.95rem] border border-white/10 bg-white/6 px-3 py-2 text-right">
                  <p class="text-[11px] uppercase tracking-[0.12em] text-white/40">${t("dynamic.unitPrice")}</p>
                  <p class="text-sm font-semibold text-white">${formatCurrency(product.price)}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      `).join("");
      cartStatus.textContent = t("dynamic.cartStatus")
        .replace("{products}", String(items.length))
        .replace("{units}", String(totalUnits));
    }

    cartItems.querySelectorAll(".cart-qty").forEach((button) => {
      button.addEventListener("click", () => {
        const item = cart.find((row) => row.category === button.dataset.category && row.id === button.dataset.id);
        if (!item) return;
        const delta = button.dataset.action === "increase" ? 1 : -1;
        updateCartItem(item.category, item.id, item.quantity + delta);
      });
    });

    updateTotals();
  }

  function updateTotals() {
    const subtotal = getCartDetails().reduce((sum, item) => sum + item.subtotal, 0);
    const discount = Math.min(Math.max(Number(discountInput.value) || 0, 0), subtotal);
    const total = Math.max(subtotal - discount, 0);

    subtotalValue.textContent = formatCurrency(subtotal);
    discountValue.textContent = formatCurrency(discount);
    totalValue.textContent = formatCurrency(total);
  }

  function getNextSaleNumber() {
    return `POS-${String(salesHistory.length + 1).padStart(4, "0")}`;
  }

  async function recordSale() {

    const items = getCartDetails();
    if (items.length === 0) {
      alert(t("alerts.addProductFirst"));
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = Math.min(Math.max(Number(discountInput.value) || 0, 0), subtotal);
    const total = Math.max(subtotal - discount, 0);
    const saleNumber = getNextSaleNumber();
    const saleDate = new Date().toISOString().slice(0, 10);

    for (const item of items) {
      const row = inventoryState[item.category].find((product) => product[0] === item.id);
      if (!row) {
        alert(t("alerts.productUnavailable").replace("{name}", item.product.name));
        return;
      }
      const currentQty = getCurrentQuantity(item.category, row);
      if (item.quantity > currentQty) {
        alert(t("alerts.productQuantityExceeds").replace("{name}", item.product.name));
        return;
      }
    }

    const selectedCustomer = getSelectedCustomerAccount();
    if (!selectedCustomer) {
      alert(t("alerts.selectCustomerAccount"));
      return;
    }

    const salePayload = {
      customer_id: Number(selectedCustomer.id),
      payment_code: paymentMethod.value,
      note: saleNote.value.trim(),
      discount,
      items: items.map((item) => {
        const row = inventoryState[item.category].find((product) => product[0] === item.id);
        const currentQty = row ? getCurrentQuantity(item.category, row) : 0;

        return {
          id: item.id,
          sku: item.id,
          name: item.product.name,
          category: item.category,
          presentation: item.product.presentation,
          quantity: item.quantity,
          unit_price: item.product.price,
          subtotal: item.subtotal,
          stock_after: Math.max(currentQty - item.quantity, 0)
        };
      })
    };

    const saleResponse = await fetchJson("/api/sales", {
      method: "POST",
      body: JSON.stringify(salePayload)
    });

    const savedSaleNumber = saleResponse.sale_number || saleNumber;

    await syncPosData();
    cart = [];
    discountInput.value = "0";
    customerAccountSelect.value = "";
    renderCustomerAccounts();
    saleNote.value = "";
    paymentMethod.value = "cash";
    renderProducts();
    renderCart();
    closeCartModal();
    alert(t("alerts.saleRecorded").replace("{saleNumber}", savedSaleNumber));
  }

  function applyDynamicTranslations() {
    document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const value = t(element.dataset.i18nAlt);
      if (typeof value === "string") {
        element.setAttribute("alt", value);
      }
    });
  }

  function applyLanguage(lang) {
    currentLanguage = translations[lang] ? lang : "es";
    updateSessionButton();
    ensurePublicPosBanner();
    applyDynamicTranslations();
    renderCustomerAccounts();
    renderPaymentMethods();
    syncCategoryUI();
    renderProducts();
    renderCart();
    if (detailProduct) {
      openProductDetail(findProduct(detailProduct.category, detailProduct.id) || detailProduct);
    }
  }

  window.refreshPosLanguage = applyLanguage;

  async function refreshInventoryFromStorage() {
    try {
      await syncPosData();
    } catch {
      renderProducts();
      renderCart();
    }
  }

  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.category;
      currentProductPage = 1;
      syncCategoryUI();
      renderProducts();
    });
  });

  productSearch.addEventListener("input", () => {
    currentProductPage = 1;
    renderProducts();
  });
  discountInput.addEventListener("input", updateTotals);
  customerAccountSelect?.addEventListener("change", () => {
    renderCustomerAccounts(customerAccountSelect.value);
  });
  openCustomerAccountModalButton?.addEventListener("click", openCustomerAccountModal);
  closeCustomerAccountModalButton?.addEventListener("click", closeCustomerAccountModal);
  cancelCustomerAccountModalButton?.addEventListener("click", closeCustomerAccountModal);
  customerAccountModal?.addEventListener("click", (event) => {
    if (event.target === customerAccountModal) {
      closeCustomerAccountModal();
    }
  });
  customerAccountForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await createCustomerAccount();
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo crear la cuenta cliente.");
    }
  });
  openCartModalButton?.addEventListener("click", openCartModal);
  closeCartModalButton?.addEventListener("click", closeCartModal);
  cartModal?.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      closeCartModal();
    }
  });
  clearCartButton.addEventListener("click", () => {
    cart = [];
    renderCart();
  });
  closeProductDetailButton?.addEventListener("click", closeProductDetail);
  productDetailModal?.addEventListener("click", (event) => {
    if (event.target === productDetailModal) {
      closeProductDetail();
    }
  });
  productDetailAddButton?.addEventListener("click", () => {
    if (!detailProduct) return;
    addToCart(detailProduct.category, detailProduct.id);
  });
  saleForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await recordSale();
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo registrar la venta.");
    }
  });
  logoutButton?.addEventListener("click", async () => {
    if (!isAuthenticated()) {
      window.location.href = "login.html?redirect=pos.html";
      return;
    }

    await logoutSession();
    updateSessionButton();
    window.location.href = "pos.html";
  });

  window.addEventListener("storage", (event) => {
    if (event.key === inventoryStateKey) {
      refreshInventoryFromStorage();
    }
    if (event.key === customerAccountsKey) {
      customerAccounts = loadCustomerAccounts();
      renderCustomerAccounts();
    }
  });

  renderCustomerAccounts();
  loadRemotePaymentMethods().catch(() => {});
  (async () => {
    await syncServerSession();
    updateSessionButton();
    renderCustomerAccounts();
    await Promise.all([
      loadRemoteCustomerAccounts().catch(() => {}),
      syncPosData().catch(() => {})
    ]);
    applyLanguage(currentLanguage);
  })();
})();










