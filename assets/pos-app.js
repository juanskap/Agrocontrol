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
  const featuredSlider = document.getElementById("featured-slider");
  const featuredTrack = document.getElementById("featured-track");
  const featuredDots = document.getElementById("featured-dots");
  const featuredPrevButton = document.getElementById("featured-prev");
  const featuredNextButton = document.getElementById("featured-next");
  const cartItems = document.getElementById("cart-items");
  const cartStatus = document.getElementById("cart-status");
  const subtotalValue = document.getElementById("subtotal-value");
  const discountValue = document.getElementById("discount-value");
  const totalValue = document.getElementById("total-value");
  const discountInput = document.getElementById("sale-discount");
  const customerAccountSelect = document.getElementById("customer-account-select");
  const customerAccountField = document.getElementById("customer-account-field");
  const checkoutAccountHint = document.getElementById("checkout-account-hint");
  const selectedCustomerSummary = document.getElementById("selected-customer-summary");
  const shippingAddressSelect = document.getElementById("shipping-address-select");
  const shippingAddressSummary = document.getElementById("shipping-address-summary");
  const openCustomerAccountModalButton = document.getElementById("open-customer-account-modal");
  const customerAccountModal = document.getElementById("customer-account-modal");
  const closeCustomerAccountModalButton = document.getElementById("close-customer-account-modal");
  const cancelCustomerAccountModalButton = document.getElementById("cancel-customer-account-modal");
  const openAddressModalButton = document.getElementById("open-address-modal");
  const addressModal = document.getElementById("address-modal");
  const closeAddressModalButton = document.getElementById("close-address-modal");
  const cancelAddressModalButton = document.getElementById("cancel-address-modal");
  const addressFormModal = document.getElementById("address-form-modal");
  const addressLabelModal = document.getElementById("address-label-modal");
  const addressRecipientModal = document.getElementById("address-recipient-modal");
  const addressPhoneModal = document.getElementById("address-phone-modal");
  const addressLineModal = document.getElementById("address-line-modal");
  const addressCityModal = document.getElementById("address-city-modal");
  const addressProvinceModal = document.getElementById("address-province-modal");
  const addressReferenceModal = document.getElementById("address-reference-modal");
  const addressDefaultModal = document.getElementById("address-default-modal");
  const addressModalMessage = document.getElementById("address-modal-message");
  const submitAddressModalButton = document.getElementById("submit-address-modal");
  const authModal = document.getElementById("auth-modal");
  const closeAuthModalButton = document.getElementById("close-auth-modal");
  const authLoginForm = document.getElementById("auth-login-form");
  const authLoginUser = document.getElementById("auth-login-user");
  const authLoginPassword = document.getElementById("auth-login-password");
  const toggleAuthPasswordButton = document.getElementById("toggle-auth-password");
  const authLoginMessage = document.getElementById("auth-login-message");
  const submitAuthLoginButton = document.getElementById("submit-auth-login");
  const openAuthRegisterButton = document.getElementById("open-auth-register");
  const customerAccountForm = document.getElementById("customer-account-form");
  const customerAccountName = document.getElementById("customer-account-name");
  const customerAccountEmail = document.getElementById("customer-account-email");
  const customerAccountPhone = document.getElementById("customer-account-phone");
  const customerAccountPassword = document.getElementById("customer-account-password");
  const customerAccountPasswordConfirm = document.getElementById("customer-account-password-confirm");
  const customerAccountMessage = document.getElementById("customer-account-message");
  const submitCustomerAccountButton = document.getElementById("submit-customer-account");
  const paymentMethod = document.getElementById("payment-method");
  const saleNoteField = document.getElementById("sale-note-field");
  const saleNote = document.getElementById("sale-note");
  const confirmSaleButton = document.getElementById("confirm-sale");
  const saleForm = document.getElementById("sale-form");
  const saleFormMessage = document.getElementById("sale-form-message");
  const checkoutSessionBanner = document.getElementById("checkout-session-banner");
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
  let favoriteProducts = [];
  let favoriteProductIds = new Set();
  let favoriteRequests = new Set();
  let customerAddresses = [];
  let cartSyncTimer = null;
  let authMenu = null;
  let authMenuWrapper = null;
  let activeCategory = "all";
  let currentProductPage = {
    insumos: 1,
    abonos: 1,
    herramientas: 1
  };
  let cart = [];
  const productsPerPage = 12;
  let detailProduct = null;
  let currentLanguage = safeStorage.getItem(languageKey) || "es";
  let featuredIndex = 0;
  let featuredTimer = null;
  let featuredOffset = 0;
  let featuredTrackHalfWidth = 0;
  let featuredLastFrame = 0;
  const featuredStepSize = 320;
  const featuredSpeed = 38;

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
          action: "Crear cuenta"
        };
  }

  function ensurePublicPosBanner() {
    const host =
      document.getElementById("public-pos-action-host") ||
      document.querySelector("main section.space-y-6");
    if (!host) return;

    const copy = getPublicPosCopy();
    let banner = document.getElementById("public-pos-banner");

    if (!banner) {
      banner = document.createElement("section");
      banner.id = "public-pos-banner";
      banner.className = "flex w-full justify-start lg:justify-end";
      banner.innerHTML = `
        <button type="button" data-public-pos=\"action\" class="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-full border border-hoja/18 bg-[linear-gradient(135deg,rgba(62,107,72,0.96),rgba(109,139,78,0.9))] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(62,107,72,0.22)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-hoja/28 hover:brightness-105 hover:shadow-[0_18px_32px_rgba(62,107,72,0.28)]"><svg viewBox="0 0 24 24" class="h-4 w-4 stroke-current stroke-[1.9]" fill="none" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5.5a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M5.5 18c1.35-2.75 3.7-4.25 6.5-4.25s5.15 1.5 6.5 4.25"/></svg><span data-public-pos=\"label\"></span></button>
      `;
      host.insertBefore(banner, host.firstChild);
    }

    const action = banner.querySelector('[data-public-pos="action"]');
    const label = banner.querySelector('[data-public-pos="label"]');
    if (label) label.textContent = copy.action;
    if (action) action.onclick = () => openCustomerAccountModal();
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

  function isCustomerSession() {
    return getSession()?.role === "customer";
  }

  function getFavoriteCopy() {
    return currentLanguage === "en"
      ? {
          add: "Save favorite",
          remove: "Remove favorite",
          loginRequired: "Sign in as customer to save favorite products.",
          added: "Product added to your favorites.",
          removed: "Product removed from your favorites.",
          loading: "Updating favorite..."
        }
      : {
          add: "Guardar favorito",
          remove: "Quitar favorito",
          loginRequired: "Inicia sesion como cliente para guardar productos favoritos.",
          added: "Producto agregado a tus favoritos.",
          removed: "Producto quitado de tus favoritos.",
          loading: "Actualizando favorito..."
        };
  }

  function setFavoriteProducts(rows) {
    favoriteProducts = Array.isArray(rows) ? rows : [];
    favoriteProductIds = new Set(
      favoriteProducts
        .map((item) => String(item?.sku || item?.id || ""))
        .filter(Boolean)
    );
  }

  function clearFavoriteProducts() {
    setFavoriteProducts([]);
  }

  function normalizeCartItems(items) {
    return (Array.isArray(items) ? items : []).map((item) => ({
      category: String(item?.category || ""),
      id: String(item?.id || item?.sku || ""),
      quantity: Math.max(1, Number(item?.quantity) || 1),
      selected: item?.selected !== false
    })).filter((item) => item.category && item.id);
  }

  function firstNameFromUser(value) {
    return String(value || "").trim().split(/\s+/).filter(Boolean)[0] || "";
  }

  function ensureAuthMenu() {
    if (authMenu || !logoutButton) return authMenu;

    if (!authMenuWrapper) {
      authMenuWrapper = document.createElement("div");
      authMenuWrapper.className = "relative inline-flex";
      logoutButton.insertAdjacentElement("beforebegin", authMenuWrapper);
      authMenuWrapper.appendChild(logoutButton);
    }

    authMenu = document.createElement("div");
    authMenu.id = "pos-auth-menu";
    authMenu.className = "absolute -right-1 top-[calc(100%+0.85rem)] z-50 hidden min-w-[13.25rem] overflow-hidden rounded-[1.1rem] border border-white/14 bg-[radial-gradient(circle_at_top,_rgba(217,164,65,0.16),_rgba(217,164,65,0)_30%),linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(17,24,39,0.96)_54%,_rgba(10,15,28,0.98))] p-1.5 text-white shadow-[0_20px_36px_rgba(15,23,42,0.28)] backdrop-blur-lg";
    authMenu.innerHTML = `
      <a href="perfil.html" data-auth-menu="profile" class="group relative flex min-h-[2.55rem] items-center gap-2.5 rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[13px] font-semibold text-slate-100 shadow-[0_10px_18px_rgba(0,0,0,0.14)] transition duration-200 hover:border-sol/35 hover:bg-white/[0.08] hover:text-sol">
        <span class="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full border border-white/10 bg-slate-900/40 text-sol shadow-[0_10px_24px_rgba(217,164,65,0.12)] transition group-hover:border-sol/40 group-hover:bg-slate-900/55">
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 stroke-current stroke-[1.9]" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="3"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.5 19c1.2-2.7 3.6-4.2 6.5-4.2S17.3 16.3 18.5 19"/>
          </svg>
        </span>
        <span class="flex flex-col">
          <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-sol/80">Cuenta</span>
          <span class="leading-none" data-auth-menu-text="profile">Mi perfil</span>
        </span>
      </a>
      <button type="button" data-auth-menu="logout" class="group flex min-h-[2.55rem] w-full items-center gap-2.5 rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-[13px] font-semibold text-slate-100 shadow-[0_10px_18px_rgba(0,0,0,0.14)] transition duration-200 hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100">
        <span class="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full border border-white/10 bg-white/6 text-rose-100 shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition group-hover:border-rose-300/35 group-hover:bg-rose-400/12">
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 stroke-current stroke-[1.9]" fill="none" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 7.5V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-1.5"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H4.5"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.5 8.5-4 3.5 4 3.5"/>
          </svg>
        </span>
        <span class="flex flex-col">
          <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Sesion</span>
          <span class="leading-none" data-auth-menu-text="logout">Cerrar sesion</span>
        </span>
      </button>
    `;
    authMenuWrapper.appendChild(authMenu);

    const profileLink = authMenu.querySelector('[data-auth-menu="profile"]');
    const logoutAction = authMenu.querySelector('[data-auth-menu="logout"]');

    profileLink?.addEventListener("click", () => {
      closeAuthMenu();
    });

    logoutAction?.addEventListener("click", async () => {
      closeAuthMenu();
      await logoutSession();
      updateSessionButton();
      renderCustomerAccounts();
      renderProducts();
      renderCart();
      updateCheckoutAvailability();
      closeCartModal();
    });

    return authMenu;
  }

  function closeAuthMenu() {
    ensureAuthMenu()?.classList.add("hidden");
  }

  function toggleAuthMenu() {
    const menu = ensureAuthMenu();
    if (!menu || !isAuthenticated()) return;
    menu.classList.toggle("hidden");
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
    clearFavoriteProducts();
    customerAddresses = [];
    cart = [];
  }

  function syncPrivateNav() {
    const adminVisible = isAdminSession();
    inventoryNavLink?.classList.toggle("hidden", !adminVisible);
    movementsNavLink?.classList.toggle("hidden", !adminVisible);
  }

  function updateSessionButton() {
    if (!logoutButton) return;
    const label = logoutButton.querySelector("[data-i18n-text]") || logoutButton.querySelector("span");
    const session = getSession();
    const authenticated = Boolean(session);
    const adminSession = session?.role === "admin";
    const menu = ensureAuthMenu();
    const profileLink = menu?.querySelector('[data-auth-menu="profile"]');
    const logoutAction = menu?.querySelector('[data-auth-menu="logout"]');
    const profileText = profileLink?.querySelector('[data-auth-menu-text="profile"]');
    const logoutText = logoutAction?.querySelector('[data-auth-menu-text="logout"]');

    if (label) {
      label.textContent = authenticated
        ? firstNameFromUser(session?.user) || (adminSession ? "Admin" : "Cliente")
        : t("actions.login");
    }

    logoutButton.dataset.authState = authenticated ? "authenticated" : "guest";
    logoutButton.classList.toggle("bg-hoja/85", !authenticated);
    logoutButton.classList.toggle("bg-slate-950", authenticated);
    logoutButton.classList.toggle("hover:bg-hoja/95", !authenticated);
    logoutButton.classList.toggle("hover:bg-slate-900", authenticated);

    if (profileLink) {
      if (profileText) {
        profileText.textContent = adminSession ? "Panel admin" : "Mi perfil";
      }
      profileLink.setAttribute("href", adminSession ? "inventario.html" : "perfil.html");
    }

    if (logoutAction) {
      if (logoutText) {
        logoutText.textContent = t("actions.logout");
      }
    }

    if (!authenticated) {
      closeAuthMenu();
    }

    syncPrivateNav();
  }

  function openCartModal() {
    cartModal?.classList.remove("hidden");
  }

  function closeCartModal() {
    cartModal?.classList.add("hidden");
  }

  function setAuthSubmitting(isSubmitting) {
    if (!submitAuthLoginButton) return;
    submitAuthLoginButton.disabled = isSubmitting;
    const label = submitAuthLoginButton.querySelector("[data-auth-submit-label]") || submitAuthLoginButton;
    label.textContent = isSubmitting
      ? "Ingresando..."
      : t("actions.login");
  }

  function openAuthModal() {
    hideInlineMessage(authLoginMessage);
    authModal?.classList.remove("hidden");
    authLoginUser?.focus();
  }

  function closeAuthModal() {
    authModal?.classList.add("hidden");
    authLoginForm?.reset();
    hideInlineMessage(authLoginMessage);
    setAuthSubmitting(false);
  }

  async function loginFromModal() {
    const identifier = authLoginUser?.value.trim() || "";
    const password = authLoginPassword?.value || "";

    if (!identifier || !password) {
      showInlineMessage(authLoginMessage, "Ingresa tu correo y contrasena para continuar.", "error");
      return;
    }

    setAuthSubmitting(true);

    try {
      const session = await fetchJson("/api/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password })
      });

      saveSession(session);
      updateSessionButton();
      await loadRemoteCustomerAccounts().catch(() => {});
      renderCustomerAccounts(String(session?.id || ""));
      updateCheckoutAvailability();
      closeAuthModal();

      if (session?.role === "customer") {
        await syncFavoritesFromApi().catch(() => {
          clearFavoriteProducts();
        });
        await loadCartForSession().catch(() => {});
        await loadAddressesForSession().catch(() => {});
        renderProducts();
        renderCart();
        applyCurrentCustomerSession();
      } else {
        clearFavoriteProducts();
        renderProducts();
        renderCart();
        showInlineMessage(saleFormMessage, "Sesion iniciada correctamente.", "success");
      }
    } catch (error) {
      setAuthSubmitting(false);
      showInlineMessage(authLoginMessage, error instanceof Error ? error.message : "No se pudo iniciar sesion.", "error");
    }
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
    return {
      insumos: [],
      abonos: [],
      herramientas: []
    };
  }

  function saveInventoryState() {
    safeStorage.setItem(inventoryStateKey, JSON.stringify(inventoryState));
  }

  function hasInventoryRows(state) {
    if (!state || typeof state !== "object") return false;
    const categories = ["insumos", "abonos", "herramientas"];
    if (!categories.every((category) => Array.isArray(state[category]))) {
      return false;
    }
    return categories.some((category) => state[category].length > 0);
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
      if (updatedRow[6] === "Motor diesel 90 HP" || updatedRow[6] === "Motor di\u00E9sel 90 HP") {
        updatedRow[6] = "Motor diesel 90 HP para labores de arado";
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

  function showInlineMessage(target, message, type = "info") {
    if (!target) return;
    target.textContent = message;
    target.classList.remove(
      "hidden",
      "border-rose-300",
      "bg-rose-50",
      "text-rose-700",
      "border-emerald-300",
      "bg-emerald-50",
      "text-emerald-700",
      "border-amber-300",
      "bg-amber-50",
      "text-amber-800",
      "border-white/10",
      "bg-white/5",
      "text-white/75"
    );

    if (type === "error") {
      target.classList.add("border-rose-300", "bg-rose-50", "text-rose-700");
    } else if (type === "success") {
      target.classList.add("border-emerald-300", "bg-emerald-50", "text-emerald-700");
    } else if (type === "warning") {
      target.classList.add("border-amber-300", "bg-amber-50", "text-amber-800");
    } else {
      target.classList.add("border-white/10", "bg-white/5", "text-white/75");
    }
  }

  function hideInlineMessage(target) {
    if (!target) return;
    target.classList.add("hidden");
    target.textContent = "";
  }

  function setSaleSubmitting(isSubmitting) {
    if (!confirmSaleButton) return;
    if (isSubmitting) {
      confirmSaleButton.disabled = true;
    } else {
      updateCheckoutAvailability();
    }
    confirmSaleButton.dataset.busy = isSubmitting ? "true" : "false";
    const label = confirmSaleButton.querySelector("[data-i18n-text]") || confirmSaleButton.querySelector("span");
    if (label) {
      label.textContent = isSubmitting ? t("checkout.submittingSale") : t("checkout.confirm");
    }
  }

  function setCustomerAccountSubmitting(isSubmitting) {
    if (!submitCustomerAccountButton) return;
    submitCustomerAccountButton.disabled = isSubmitting;
    submitCustomerAccountButton.classList.toggle("opacity-70", isSubmitting);
    submitCustomerAccountButton.classList.toggle("cursor-not-allowed", isSubmitting);
    submitCustomerAccountButton.textContent = isSubmitting ? t("accountModal.creating") : t("accountModal.submit");
  }

  function setAddressSubmitting(isSubmitting) {
    if (!submitAddressModalButton) return;
    submitAddressModalButton.disabled = isSubmitting;
    submitAddressModalButton.classList.toggle("opacity-70", isSubmitting);
    submitAddressModalButton.classList.toggle("cursor-not-allowed", isSubmitting);
    submitAddressModalButton.textContent = isSubmitting ? "Guardando..." : "Guardar direccion";
  }

  function getSessionDisplayName() {
    const session = getSession();
    return session?.user || session?.email || "";
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

  function getPreferredCustomerAccountId(candidateId = "") {
    const preferredId = String(candidateId || "");
    const session = getSession();
    const sessionId = session?.role === "customer" && session?.id ? String(session.id) : "";

    if (preferredId && customerAccounts.some((account) => account.id === preferredId)) {
      return preferredId;
    }

    if (sessionId && customerAccounts.some((account) => account.id === sessionId)) {
      return sessionId;
    }

    if (customerAccounts.length === 1) {
      return customerAccounts[0].id;
    }

    return "";
  }

  function updateCheckoutAvailability() {
    if (!confirmSaleButton) return;

    const hasCustomer = Boolean(customerAccountSelect?.value);
    const requiresAddress = getSession()?.role === "customer" && String(customerAccountSelect?.value || "") === String(getSession()?.id || "") && customerAddresses.length > 0;
    const hasAddress = !requiresAddress || Boolean(shippingAddressSelect?.value);
    const canCheckout = hasCustomer && hasAddress;
    confirmSaleButton.disabled = !canCheckout;
    confirmSaleButton.className = canCheckout
      ? "inline-flex items-center justify-center gap-2 rounded-full bg-sol px-6 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105 sm:min-w-[15rem]"
      : "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-500/40 px-6 py-3 text-sm font-bold text-white/60 sm:min-w-[15rem]";

    if (confirmSaleButton.dataset.busy === "true") {
      confirmSaleButton.disabled = true;
    }

    if (isAuthenticated() && canCheckout && saleFormMessage) {
      hideInlineMessage(saleFormMessage);
      return;
    }

    showInlineMessage(
      saleFormMessage,
      canCheckout ? t("checkout.readyToBuy") : (hasCustomer && !hasAddress ? "Selecciona una direccion de envio para continuar." : t("checkout.selectAccountFirst")),
      canCheckout ? "success" : "warning"
    );
  }

  function renderCustomerAccounts(selectedId = null) {
    if (!customerAccountSelect) return;

    const customerSessionActive = getSession()?.role === "customer";
    const nextSelectedId = getPreferredCustomerAccountId(selectedId ?? customerAccountSelect.value);
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
      selectedCustomerSummary.classList.add("hidden");
    }

    if (checkoutSessionBanner) {
      const sessionName = getSessionDisplayName();
      const isReady = isAuthenticated();
      checkoutSessionBanner.textContent = sessionName
        ? t("checkout.sessionReadyNamed").replace("{name}", sessionName)
        : t("checkout.sessionReady");
      checkoutSessionBanner.classList.toggle("hidden", !isReady);
    }

    if (openCustomerAccountModalButton) {
      openCustomerAccountModalButton.textContent = getSession()?.role === "customer"
        ? t("checkout.useMyAccount")
        : t("checkout.createAccount");
      openCustomerAccountModalButton.classList.toggle("hidden", isAuthenticated());
    }

    customerAccountSelect.disabled = customerSessionActive;
    customerAccountSelect.className = customerSessionActive
      ? "w-full appearance-none rounded-[0.95rem] border border-white/6 bg-white/[0.03] px-4 py-2.5 text-sm text-white/70 shadow-inner backdrop-blur-md outline-none cursor-not-allowed"
      : "w-full appearance-none rounded-[0.95rem] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white shadow-inner backdrop-blur-md transition-all duration-300 ease-out focus:border-sol/60 focus:bg-white/10 focus:ring-[3px] focus:ring-sol/20 focus:outline-none hover:bg-white/10";

    if (customerAccountField) {
      customerAccountField.classList.toggle("opacity-85", customerSessionActive);
    }

    if (checkoutAccountHint) {
      checkoutAccountHint.classList.toggle("hidden", isAuthenticated());
    }

    if (saleNoteField) {
      const shouldHideNote = isAuthenticated();
      saleNoteField.classList.toggle("hidden", shouldHideNote);
      if (shouldHideNote && saleNote) {
        saleNote.value = "";
      }
    }

    renderShippingAddresses();
    updateCheckoutAvailability();
  }

  function getSelectedShippingAddress() {
    const addressId = Number(shippingAddressSelect?.value || 0);
    return customerAddresses.find((address) => Number(address.id) === addressId) || null;
  }

  function renderShippingAddresses() {
    if (!shippingAddressSelect || !shippingAddressSummary) return;

    const customerSession = getSession();
    const selectedAccount = getSelectedCustomerAccount();
    const canUseAddresses = customerSession?.role === "customer" && selectedAccount && String(selectedAccount.id) === String(customerSession.id || "");
    const previousValue = String(shippingAddressSelect.value || "");

    if (!canUseAddresses) {
      customerAddresses = [];
    }

    shippingAddressSelect.innerHTML = [
      `<option value="" class="bg-slate-900 text-white">${canUseAddresses ? "Selecciona una direccion" : "Disponible con tu cuenta"}</option>`,
      ...(canUseAddresses && customerAddresses.length < 3 ? ['<option value="__new__" class="bg-slate-900 text-white">Agregar nueva direccion...</option>'] : []),
      ...customerAddresses.map((address) => `<option value="${address.id}" class="bg-slate-900 text-white">${address.label} - ${address.city}</option>`)
    ].join("");

    shippingAddressSelect.disabled = !canUseAddresses || customerAddresses.length === 0;

    const hasPreviousAddress = previousValue && customerAddresses.some((address) => String(address.id) === previousValue);
    const defaultAddress = customerAddresses.find((address) => address.is_default) || customerAddresses[0] || null;
    if (canUseAddresses) {
      if (hasPreviousAddress) {
        shippingAddressSelect.value = previousValue;
      } else if (defaultAddress) {
        shippingAddressSelect.value = String(defaultAddress.id);
      }
    }

    const selectedAddress = getSelectedShippingAddress();
    shippingAddressSummary.textContent = selectedAddress
      ? `${selectedAddress.label}: ${selectedAddress.address_line}, ${selectedAddress.city}${selectedAddress.province ? `, ${selectedAddress.province}` : ""}`
      : (canUseAddresses ? "No has seleccionado direccion de envio." : "La direccion de envio se habilita con tu propia cuenta cliente.");
  }

  async function loadAddressesForSession() {
    const customerSession = getSession();
    const selectedAccount = getSelectedCustomerAccount();
    const canUseAddresses = customerSession?.role === "customer" && selectedAccount && String(selectedAccount.id) === String(customerSession.id || "");

    if (!canUseAddresses) {
      customerAddresses = [];
      renderShippingAddresses();
      return;
    }

    const rows = await fetchJson("/api/addresses", {
      headers: { Accept: "application/json" }
    });
    customerAddresses = Array.isArray(rows) ? rows : [];
    renderShippingAddresses();
  }

  function applyCurrentCustomerSession() {
    const session = getSession();
    if (session?.role !== "customer") {
      openCustomerAccountModal();
      return;
    }

    const preferredId = getPreferredCustomerAccountId(String(session.id || ""));
    if (!preferredId) {
      openCustomerAccountModal();
      return;
    }

    renderCustomerAccounts(preferredId);
    customerAccountSelect.value = preferredId;
    loadAddressesForSession().catch(() => {});
    updateCheckoutAvailability();

    const sessionName = getSessionDisplayName();
    showInlineMessage(
      saleFormMessage,
      sessionName
        ? t("checkout.sessionReadyNamed").replace("{name}", sessionName)
        : t("checkout.sessionReady"),
      "success"
    );
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
    if (hasInventoryRows(state)) {
      inventoryState = normalizeInventoryState(state);
      saveInventoryState();
      return;
    }

    inventoryState = {
      insumos: [],
      abonos: [],
      herramientas: []
    };
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

  async function syncFavoritesFromApi() {
    if (!isCustomerSession()) {
      clearFavoriteProducts();
      return;
    }

    const rows = await fetchJson("/api/favorites", {
      headers: { Accept: "application/json" }
    });
    setFavoriteProducts(rows);
  }

  async function syncCartToApi() {
    if (!isCustomerSession()) return;

    const payload = {
      items: cart.map((item) => ({
        sku: item.id,
        category: item.category,
        quantity: item.quantity,
        selected: item.selected !== false
      }))
    };

    const response = await fetchJson("/api/cart/sync", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    cart = normalizeCartItems(response?.items || []);
  }

  function queueCartSync() {
    if (!isCustomerSession()) return;
    window.clearTimeout(cartSyncTimer);
    cartSyncTimer = window.setTimeout(() => {
      syncCartToApi()
        .then(() => {
          renderCart();
        })
        .catch((error) => {
          showInlineMessage(saleFormMessage, error instanceof Error ? error.message : "No se pudo guardar el carrito.", "warning");
        });
    }, 180);
  }

  async function loadCartForSession() {
    if (!isCustomerSession()) return;

    const response = await fetchJson("/api/cart", {
      headers: { Accept: "application/json" }
    });
    const remoteItems = normalizeCartItems(response?.items || []);

    if (remoteItems.length > 0) {
      cart = remoteItems;
      return;
    }

    if (cart.length > 0) {
      await syncCartToApi();
      return;
    }

    cart = [];
  }

  async function toggleFavorite(category, id) {
    const product = findProduct(category, id);
    if (!product) return;

    const favoriteKey = `${category}:${id}`;
    if (favoriteRequests.has(favoriteKey)) {
      return;
    }

    const favoriteCopy = getFavoriteCopy();
    if (!isCustomerSession()) {
      openAuthModal();
      showInlineMessage(saleFormMessage, favoriteCopy.loginRequired, "warning");
      return;
    }

    favoriteRequests.add(favoriteKey);
    const isFavorite = favoriteProductIds.has(String(id));

    try {
      if (isFavorite) {
        await fetchJson("/api/favorites/delete", {
          method: "POST",
          body: JSON.stringify({ sku: id })
        });
        favoriteProductIds.delete(String(id));
        favoriteProducts = favoriteProducts.filter((item) => String(item?.sku || item?.id || "") !== String(id));
        showInlineMessage(saleFormMessage, favoriteCopy.removed, "success");
      } else {
        const favorite = await fetchJson("/api/favorites", {
          method: "POST",
          body: JSON.stringify({ sku: id })
        });
        favoriteProductIds.add(String(id));
        favoriteProducts = [favorite, ...favoriteProducts.filter((item) => String(item?.sku || item?.id || "") !== String(id))];
        showInlineMessage(saleFormMessage, favoriteCopy.added, "success");
      }

      renderProducts();
    } catch (error) {
      showInlineMessage(saleFormMessage, error instanceof Error ? error.message : favoriteCopy.loading, "error");
    } finally {
      favoriteRequests.delete(favoriteKey);
    }
  }

  async function syncPosData() {
    await syncInventoryStateFromApi();
    await syncSalesHistoryFromApi();
    await syncFavoritesFromApi().catch(() => {
      clearFavoriteProducts();
    });
    await loadCartForSession().catch(() => {});
    renderFeaturedSlider();
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

    consumePendingAddFromQuery();
  }
  function openCustomerAccountModal() {
    hideInlineMessage(customerAccountMessage);
    customerAccountModal?.classList.remove("hidden");
    customerAccountName?.focus();
  }

  function closeCustomerAccountModal() {
    customerAccountModal?.classList.add("hidden");
    customerAccountForm?.reset();
    hideInlineMessage(customerAccountMessage);
    setCustomerAccountSubmitting(false);
  }

  function openAddressModal() {
    const session = getSession();
    const selectedAccount = getSelectedCustomerAccount();

    if (session?.role !== "customer") {
      showInlineMessage(saleFormMessage, "Inicia sesion como cliente para guardar direcciones.", "warning");
      openAuthModal();
      return;
    }

    if (!selectedAccount || String(selectedAccount.id) !== String(session.id || "")) {
      applyCurrentCustomerSession();
    }

    if (customerAddresses.length >= 3) {
      showInlineMessage(saleFormMessage, "Ya alcanzaste el limite de 3 direcciones. Elimina una para agregar otra.", "warning");
      return;
    }

    hideInlineMessage(addressModalMessage);
    addressModal?.classList.remove("hidden");
    addressLabelModal?.focus();
  }

  function closeAddressModal() {
    addressModal?.classList.add("hidden");
    addressFormModal?.reset();
    hideInlineMessage(addressModalMessage);
    setAddressSubmitting(false);
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
      showInlineMessage(customerAccountMessage, t("alerts.accountNameRequired"), "error");
      return;
    }

    if (!email || !email.includes("@")) {
      showInlineMessage(customerAccountMessage, t("alerts.accountEmailRequired"), "error");
      return;
    }

    if (password.length < 6) {
      showInlineMessage(customerAccountMessage, t("alerts.accountPasswordRequired"), "error");
      return;
    }

    if (password !== passwordConfirm) {
      showInlineMessage(customerAccountMessage, t("alerts.accountPasswordMismatch"), "error");
      return;
    }

    hideInlineMessage(customerAccountMessage);
    setCustomerAccountSubmitting(true);

    try {
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
      await syncFavoritesFromApi().catch(() => {
        clearFavoriteProducts();
      });
      await loadCartForSession().catch(() => {});
      await loadAddressesForSession().catch(() => {});
      renderProducts();
      renderCart();
      await loadRemoteCustomerAccounts();
      const selectedId = String(account.id);
      renderCustomerAccounts(selectedId);
      customerAccountSelect.value = selectedId;
      updateCheckoutAvailability();
      showInlineMessage(customerAccountMessage, t("accountModal.createdInline"), "success");
      showInlineMessage(saleFormMessage, t("alerts.accountCreated").replace("{name}", account.full_name || fullName), "success");
      window.setTimeout(() => {
        closeCustomerAccountModal();
      }, 700);
    } finally {
      setCustomerAccountSubmitting(false);
    }
  }

  async function createAddressFromModal() {
    const session = getSession();
    if (session?.role !== "customer") {
      showInlineMessage(addressModalMessage, "Debes iniciar sesion como cliente para guardar direcciones.", "error");
      return;
    }

    const payload = {
      label: addressLabelModal?.value.trim() || "",
      recipient_name: addressRecipientModal?.value.trim() || "",
      phone: addressPhoneModal?.value.trim() || "",
      address_line: addressLineModal?.value.trim() || "",
      city: addressCityModal?.value.trim() || "",
      province: addressProvinceModal?.value.trim() || "",
      reference: addressReferenceModal?.value.trim() || "",
      is_default: Boolean(addressDefaultModal?.checked)
    };

    if (!payload.label || !payload.recipient_name || !payload.address_line || !payload.city) {
      showInlineMessage(addressModalMessage, "Completa etiqueta, destinatario, direccion y ciudad.", "error");
      return;
    }

    hideInlineMessage(addressModalMessage);
    setAddressSubmitting(true);

    try {
      const rows = await fetchJson("/api/addresses", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      customerAddresses = Array.isArray(rows) ? rows : [];
      renderShippingAddresses();

      const preferredAddress = payload.is_default
        ? customerAddresses.find((address) => address.is_default)
        : customerAddresses.find((address) => (
            String(address.label || "").trim() === payload.label
            && String(address.address_line || "").trim() === payload.address_line
            && String(address.city || "").trim() === payload.city
          ));

      if (preferredAddress && shippingAddressSelect) {
        shippingAddressSelect.value = String(preferredAddress.id);
      }

      renderShippingAddresses();
      updateCheckoutAvailability();
      showInlineMessage(saleFormMessage, "Direccion guardada correctamente.", "success");
      closeAddressModal();
    } catch (error) {
      setAddressSubmitting(false);
      showInlineMessage(addressModalMessage, error instanceof Error ? error.message : "No se pudo guardar la direccion.", "error");
    }
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

  function getFeaturedProducts() {
    return getFlatProducts()
      .filter((product) => product.stock > 0)
      .sort((a, b) => {
        if (b.price !== a.price) return b.price - a.price;
        return b.stock - a.stock;
      })
      .slice(0, 12);
  }

  function applyFeaturedOffset() {
    if (!featuredTrack) return;
    if (featuredTrackHalfWidth > 0) {
      while (featuredOffset >= featuredTrackHalfWidth) {
        featuredOffset -= featuredTrackHalfWidth;
      }
      while (featuredOffset < 0) {
        featuredOffset += featuredTrackHalfWidth;
      }
    }
    featuredTrack.style.transform = `translate3d(-${featuredOffset}px, 0, 0)`;
  }

  function stopFeaturedAutoplay() {
    if (!featuredTimer) return;
    window.cancelAnimationFrame(featuredTimer);
    featuredTimer = null;
    featuredLastFrame = 0;
  }

  function tickFeaturedAutoplay(timestamp) {
    if (!featuredTrackHalfWidth || getFeaturedProducts().length <= 1) {
      featuredTimer = null;
      featuredLastFrame = 0;
      return;
    }

    if (featuredLastFrame) {
      const deltaSeconds = (timestamp - featuredLastFrame) / 1000;
      featuredOffset += featuredSpeed * deltaSeconds;
      applyFeaturedOffset();
    }

    featuredLastFrame = timestamp;
    featuredTimer = window.requestAnimationFrame(tickFeaturedAutoplay);
  }

  function startFeaturedAutoplay() {
    stopFeaturedAutoplay();
    if (!featuredTrackHalfWidth || getFeaturedProducts().length <= 1) return;
    featuredTimer = window.requestAnimationFrame(tickFeaturedAutoplay);
  }

  function renderFeaturedSlider() {
    if (!featuredSlider || !featuredTrack || !featuredDots) return;

    const products = getFeaturedProducts();
    if (products.length === 0) {
      featuredSlider.classList.add("hidden");
      return;
    }

    featuredSlider.classList.remove("hidden");
    const marqueeProducts = products.length > 1 ? [...products, ...products] : products;

    featuredTrack.innerHTML = marqueeProducts.map((product) => `
      <article class="group relative mr-3 min-w-[13.25rem] flex-none overflow-hidden rounded-[1.32rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,202,97,0.05),rgba(62,107,72,0.08))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:min-w-[14.5rem] lg:min-w-[15.5rem]">
        <div class="pointer-events-none absolute inset-y-0 left-[-12%] w-40 rounded-full bg-white/8 blur-3xl"></div>
        <div class="pointer-events-none absolute inset-y-0 right-[-10%] w-40 rounded-full bg-sol/15 blur-3xl"></div>
        <div class="relative">
          <div class="absolute inset-[0.15rem] rounded-[1.12rem] bg-gradient-to-br from-sol/28 via-white/10 to-hoja/28 opacity-85 blur-[5px] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:blur-[7px]"></div>
          <div class="absolute inset-[0.2rem] rounded-[1.08rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,202,97,0.16),rgba(62,107,72,0.20))] opacity-80 transition-all duration-500 ease-out group-hover:opacity-100"></div>
          <div class="absolute inset-[0.32rem] rounded-[0.95rem] bg-white/12 blur-2xl transition duration-300 group-hover:bg-white/16"></div>
          <div class="relative overflow-hidden rounded-[1rem] bg-white/10 shadow-[0_18px_30px_rgba(15,23,42,0.18)] transition-all duration-700 ease-linear group-hover:shadow-[0_24px_36px_rgba(15,23,42,0.24)]">
            <img src="${product.image}" alt="${product.name}" class="h-36 w-full object-cover object-center transition-transform duration-700 ease-linear group-hover:scale-[1.03] sm:h-40 lg:h-42">
            <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.18),rgba(15,23,42,0.88))]"></div>
            <div class="pointer-events-none absolute inset-y-0 left-[-35%] w-[42%] -skew-x-[18deg] bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.12),rgba(255,255,255,0))] opacity-0 transition-all duration-700 ease-out group-hover:left-[115%] group-hover:opacity-100"></div>
            <div class="absolute left-3 top-3 z-10 inline-flex rounded-full border border-white/18 bg-slate-950/28 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/88 backdrop-blur-sm">${categoryLabel(product.category)}</div>
            <div class="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-3">
              <div class="space-y-2 rounded-[0.9rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.06),rgba(15,23,42,0.34))] p-2.5">
                <div class="space-y-1 transition-all duration-300 ease-out group-hover:-translate-y-[1px]">
                  <h3 class="line-clamp-2 text-[0.92rem] font-extrabold leading-5 tracking-[-0.01em] text-white drop-shadow-[0_6px_16px_rgba(15,23,42,0.45)] transition-all duration-300 ease-out group-hover:text-white/95">${product.name}</h3>
                  <p class="text-[1rem] font-black tracking-tight text-[#ffd977] drop-shadow-[0_6px_18px_rgba(255,202,97,0.26)] transition-all duration-300 ease-out group-hover:translate-x-[1px] group-hover:text-[#ffe7a3]">${formatCurrency(product.price)}</p>
                </div>
                <button type="button" class="featured-add inline-flex w-fit items-center justify-center gap-1.5 rounded-full bg-sol px-3 py-1.5 text-[11px] font-bold text-slate-950 shadow-[0_12px_24px_rgba(255,202,97,0.26)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:brightness-105 hover:shadow-[0_16px_28px_rgba(255,202,97,0.32)] group-hover:bg-sol" data-category="${product.category}" data-id="${product.id}">
                  <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-current" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>
                  ${t("detail.addToCart")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `).join("");

    featuredTrackHalfWidth = products.length > 1 ? featuredTrack.scrollWidth / 2 : featuredTrack.scrollWidth;
    applyFeaturedOffset();

    featuredDots.innerHTML = "";
    featuredDots.classList.add("hidden");

    featuredTrack.querySelectorAll(".featured-add").forEach((button) => {
      button.addEventListener("click", () => {
        addToCart(button.dataset.category, button.dataset.id);
      });
    });

    if (featuredPrevButton) featuredPrevButton.disabled = products.length <= 1;
    if (featuredNextButton) featuredNextButton.disabled = products.length <= 1;
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

  function getCategoryPage(category, totalPages = 1) {
    const page = Number(currentProductPage[category] || 1);
    return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  }

  function setCategoryPage(category, page) {
    currentProductPage[category] = Math.max(1, Number(page) || 1);
  }

  function resetCategoryPages(category = "all") {
    if (category === "all") {
      currentProductPage = {
        insumos: 1,
        abonos: 1,
        herramientas: 1
      };
      return;
    }

    setCategoryPage(category, 1);
  }

  function getVisibleCategories() {
    return activeCategory === "all"
      ? ["insumos", "abonos", "herramientas"]
      : [activeCategory];
  }

  function syncCategoryUI() {
    categoryChips.forEach((chip) => {
      const isActive = chip.dataset.category === activeCategory;
      chip.className = isActive
        ? "category-chip inline-flex items-center gap-1.5 rounded-full bg-hoja px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(62,107,72,0.18)] ring-2 ring-hoja/10 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_14px_24px_rgba(62,107,72,0.22)]"
        : "category-chip inline-flex items-center gap-1.5 rounded-full border border-hoja/15 bg-white px-3.5 py-2 text-xs font-semibold text-hoja shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-hoja/35 hover:bg-hoja/5 hover:shadow-[0_12px_22px_rgba(62,107,72,0.12)]";
    });
  }

  function renderProducts() {
    const products = getFilteredProducts();
    const totalProducts = products.length;
    const visibleCategories = getVisibleCategories().filter((category) =>
      products.some((product) => product.category === category)
    );

    if (products.length === 0) {
      productGrid.innerHTML = `
        <div class="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
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

    const renderCard = (product) => {
      const isOut = product.stock <= 0;
      const isFavorite = favoriteProductIds.has(String(product.id));
      const favoriteCopy = getFavoriteCopy();
      return `
        <article class="product-card group flex h-full min-h-[12rem] cursor-pointer flex-col overflow-hidden rounded-[1.2rem] border border-white/75 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(247,243,235,0.94))] shadow-[0_12px_24px_rgba(62,107,72,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-[3px] hover:border-hoja/22 hover:shadow-[0_18px_32px_rgba(62,107,72,0.14)]" data-category="${product.category}" data-id="${product.id}">
          <div class="relative bg-[linear-gradient(180deg,_rgba(245,240,230,0.96),_rgba(234,244,236,0.88))] p-2.5">
            <button type="button" class="favorite-toggle absolute left-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm shadow-[0_10px_22px_rgba(15,23,42,0.12)] transition-all duration-200 ${isFavorite ? "border-amber-300 bg-amber-100 text-amber-600 hover:bg-amber-200" : "border-white/80 bg-white/92 text-slate-500 hover:border-amber-200 hover:text-amber-500"}" data-category="${product.category}" data-id="${product.id}" aria-label="${isFavorite ? favoriteCopy.remove : favoriteCopy.add}" title="${isFavorite ? favoriteCopy.remove : favoriteCopy.add}">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 2.75 14.84 8.5l6.34.92-4.59 4.48 1.08 6.32L12 17.23 6.33 20.22l1.08-6.32-4.59-4.48 6.34-.92L12 2.75Z"/></svg>
            </button>
            <div class="relative flex aspect-[4/2.55] items-center justify-center overflow-hidden rounded-[0.95rem] bg-white/75 ring-1 ring-black/5">
              <img src="${product.image}" alt="${product.name}" class="h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.05]">
              <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.0),rgba(15,23,42,0.08))] opacity-80"></div>
            </div>
            <span class="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.16em] shadow-[0_8px_18px_rgba(15,23,42,0.08)] ${isOut ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}">${isOut ? t("dynamic.outOfStock") : t("dynamic.unitsShort").replace("{count}", String(product.stock))}</span>
          </div>
          <div class="flex flex-1 flex-col p-3.5">
            <div class="min-h-[3.5rem]">
              <p class="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">${product.id}</p>
              <h3 class="mt-1.5 line-clamp-2 text-[0.83rem] font-black leading-[1.1rem] tracking-[-0.01em] text-slate-900">${product.name}</h3>
              <p class="mt-1 line-clamp-1 text-[10px] font-medium text-slate-500">${product.subcategory}</p>
            </div>
            <div class="mt-auto flex items-end justify-between gap-2 pt-3">
              <div>
                <p class="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">${t("detail.price")}</p>
                <p class="mt-1 text-[1rem] font-black leading-none tracking-tight text-hoja">${formatCurrency(product.price)}</p>
              </div>
              <button class="add-to-cart inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-bold leading-none shadow-[0_8px_18px_rgba(62,107,72,0.12)] ${isOut ? "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none" : "bg-hoja text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-hoja/95 hover:shadow-[0_12px_22px_rgba(62,107,72,0.18)]"}" data-category="${product.category}" data-id="${product.id}" ${isOut ? "disabled" : ""}>
                <svg viewBox="0 0 24 24" class="h-3 w-3 fill-current" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>
                ${t("dynamic.add")}
              </button>
            </div>
          </div>
        </article>
      `;
    };

    productGrid.innerHTML = visibleCategories.map((category) => {
      const categoryProducts = products.filter((product) => product.category === category);
      const totalCategoryProducts = categoryProducts.length;
      const totalPages = Math.max(1, Math.ceil(totalCategoryProducts / productsPerPage));
      const page = getCategoryPage(category, totalPages);
      const startIndex = (page - 1) * productsPerPage;
      const visibleProducts = categoryProducts.slice(startIndex, startIndex + productsPerPage);

      const paginationButtons = totalPages > 1
        ? Array.from({ length: totalPages }, (_, index) => {
            const buttonPage = index + 1;
            const active = buttonPage === page;
            return `
              <button
                type="button"
                data-category-page="${category}"
                data-page="${buttonPage}"
                class="inline-flex min-w-[2.25rem] items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-hoja text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-hoja/25 hover:text-hoja"
                }"
              >${buttonPage}</button>
            `;
          }).join("")
        : `
          <button
            type="button"
            data-category-page="${category}"
            data-page="1"
            class="inline-flex min-w-[2.25rem] items-center justify-center rounded-full bg-hoja px-3 py-2 text-sm font-semibold text-white"
          >1</button>
        `;

      return `
        <section class="rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.82),_rgba(247,243,235,0.8))] p-4 shadow-[0_16px_32px_rgba(62,107,72,0.08)] sm:p-5" data-category-section="${category}">
          <div class="flex flex-col gap-3 border-b border-slate-200/70 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 class="text-[1.8rem] font-black tracking-tight text-slate-900">${categoryLabel(category)}</h2>
              <p class="mt-1 text-sm text-slate-600">
                ${t("dynamic.productsInCategory").replace("{count}", String(totalCategoryProducts))}
              </p>
            </div>
            <div class="rounded-full bg-crema px-4 py-2 text-xs font-semibold text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
              ${t("dynamic.showingRange")
                .replace("{start}", String(totalCategoryProducts === 0 ? 0 : startIndex + 1))
                .replace("{end}", String(Math.min(startIndex + productsPerPage, totalCategoryProducts)))
                .replace("{total}", String(totalCategoryProducts))}
            </div>
          </div>
          <div class="mt-4 grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            ${visibleProducts.map(renderCard).join("")}
          </div>
          <div class="mt-4 flex flex-col items-center gap-3 rounded-[1.15rem] border border-slate-200/70 bg-white/88 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <p class="text-center text-sm text-slate-600">
              ${t("dynamic.pageOf").replace("{page}", String(page)).replace("{total}", String(totalPages))}
            </p>
            <div class="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                data-category-page="${category}"
                data-page="${page - 1}"
                ${page === 1 ? "disabled" : ""}
                class="inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  page === 1
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-white text-slate-700 hover:border-hoja/25 hover:text-hoja"
                }"
              >${t("dynamic.previous")}</button>
              ${paginationButtons}
              <button
                type="button"
                data-category-page="${category}"
                data-page="${page + 1}"
                ${page === totalPages ? "disabled" : ""}
                class="inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  page === totalPages
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-white text-slate-700 hover:border-hoja/25 hover:text-hoja"
                }"
              >${t("dynamic.next")}</button>
            </div>
          </div>
        </section>
      `;
    }).join("");

    productGrid.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        addToCart(button.dataset.category, button.dataset.id);
      });
    });

    productGrid.querySelectorAll(".favorite-toggle").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await toggleFavorite(button.dataset.category, button.dataset.id);
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

    productGrid.querySelectorAll("button[data-category-page]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        const category = button.dataset.categoryPage;
        const nextPage = Number(button.dataset.page);
        if (!category || !Number.isFinite(nextPage)) return;
        setCategoryPage(category, nextPage);
        renderProducts();
      });
    });

    if (productPaginationSummary) {
      const categorySummary = activeCategory === "all"
        ? t("dynamic.visibleCategories").replace("{count}", String(visibleCategories.length))
        : `${categoryLabel(activeCategory)} activa`;
      productPaginationSummary.textContent = `${categorySummary} - ${t("dynamic.productsFound").replace("{count}", String(totalProducts))}`;
    }

    if (productPagination) {
      productPagination.innerHTML = `
        <div class="rounded-full bg-crema px-4 py-2 text-xs font-semibold text-slate-700">
          ${t("dynamic.paginationHint")}
        </div>
      `;
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
        quantity: 1,
        selected: true
      });
    }

    renderCart();
    queueCartSync();
  }

  function consumePendingAddFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("add");
    const preferredCategory = params.get("category");

    if (!productId) return;

    const flatProducts = getFlatProducts();
    const product = flatProducts.find((item) => {
      if (preferredCategory && item.category !== preferredCategory) {
        return false;
      }
      return item.id === productId;
    }) || flatProducts.find((item) => item.id === productId);

    if (!product) return;

    activeCategory = product.category || activeCategory;
    resetCategoryPages(activeCategory);
    syncCategoryUI();
    addToCart(product.category, product.id);
    renderProducts();

    params.delete("add");
    params.delete("category");
    const nextQuery = params.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash || ""}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function updateCartItem(category, id, nextQuantity) {
    const product = findProduct(category, id);
    if (!product) return;

    if (nextQuantity <= 0) {
      cart = cart.filter((item) => !(item.category === category && item.id === id));
      renderCart();
      queueCartSync();
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
    queueCartSync();
  }

  function toggleCartItemSelection(category, id, selected) {
    cart = cart.map((item) => item.category === category && item.id === id
      ? { ...item, selected }
      : item);
    renderCart();
    queueCartSync();
  }

  function getCartDetails(selectedOnly = false) {
    return cart.map((item) => {
      const product = findProduct(item.category, item.id);
      if (!product) return null;
      const subtotal = product.price * item.quantity;
      return {
        ...item,
        product,
        subtotal
      };
    }).filter(Boolean).filter((item) => selectedOnly ? item.selected !== false : true);
  }

  function renderCart() {
    const items = getCartDetails();
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    const selectedItems = items.filter((item) => item.selected !== false);
    const selectedUnits = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
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
      cartItems.innerHTML = items.map(({ product, quantity, subtotal, selected }) => `
        <article class="rounded-[1.15rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.04))] p-3">
          <div class="flex gap-3">
            <img src="${product.image}" alt="${product.name}" class="h-[4.4rem] w-[4.4rem] rounded-[0.9rem] border border-white/10 object-cover">
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-bold text-white">${product.name}</p>
                  <p class="mt-0.5 text-[11px] text-white/55">${product.id} - ${categoryLabel(product.category)}</p>
                </div>
                <div class="text-right">
                  <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">${t("summary.subtotal")}</p>
                  <p class="mt-0.5 text-[13px] font-black ${selected ? "text-sol" : "text-white/55"}">${formatCurrency(subtotal)}</p>
                </div>
              </div>
              <div class="mt-2.5 flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <label class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-950/35">
                    <input class="cart-select h-4 w-4 accent-[#D9A441]" type="checkbox" data-category="${product.category}" data-id="${product.id}" ${selected ? "checked" : ""}>
                  </label>
                  <div class="inline-flex items-center rounded-full border border-white/10 bg-slate-950/35">
                  <button class="cart-qty px-3 py-1 text-sm font-bold text-white/75 transition hover:bg-white/10" data-action="decrease" data-category="${product.category}" data-id="${product.id}">-</button>
                  <span class="min-w-[1.85rem] text-center text-sm font-semibold text-white">${quantity}</span>
                  <button class="cart-qty px-3 py-1 text-sm font-bold text-white/75 transition hover:bg-white/10" data-action="increase" data-category="${product.category}" data-id="${product.id}">+</button>
                  </div>
                </div>
                <div class="rounded-[0.9rem] border border-white/10 bg-white/6 px-3 py-1.5 text-right">
                  <p class="text-[11px] uppercase tracking-[0.12em] text-white/40">${t("dynamic.unitPrice")}</p>
                  <p class="text-[13px] font-semibold text-white">${formatCurrency(product.price)}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      `).join("");
      cartStatus.textContent = `${t("dynamic.cartStatus")
        .replace("{products}", String(items.length))
        .replace("{units}", String(totalUnits))} • ${selectedItems.length} seleccionados / ${selectedUnits} unidades`;
    }

    cartItems.querySelectorAll(".cart-qty").forEach((button) => {
      button.addEventListener("click", () => {
        const item = cart.find((row) => row.category === button.dataset.category && row.id === button.dataset.id);
        if (!item) return;
        const delta = button.dataset.action === "increase" ? 1 : -1;
        updateCartItem(item.category, item.id, item.quantity + delta);
      });
    });

    cartItems.querySelectorAll(".cart-select").forEach((input) => {
      input.addEventListener("change", () => {
        toggleCartItemSelection(input.dataset.category, input.dataset.id, input.checked);
      });
    });

    updateTotals();
  }

  function updateTotals() {
    const subtotal = getCartDetails(true).reduce((sum, item) => sum + item.subtotal, 0);
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
    hideInlineMessage(saleFormMessage);
    const items = getCartDetails(true);
    if (items.length === 0) {
      showInlineMessage(saleFormMessage, t("alerts.addProductFirst"), "error");
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
        showInlineMessage(saleFormMessage, t("alerts.productUnavailable").replace("{name}", item.product.name), "error");
        return;
      }
      const currentQty = getCurrentQuantity(item.category, row);
      if (item.quantity > currentQty) {
        showInlineMessage(saleFormMessage, t("alerts.productQuantityExceeds").replace("{name}", item.product.name), "error");
        return;
      }
    }

    const selectedCustomer = getSelectedCustomerAccount();
    if (!selectedCustomer) {
      showInlineMessage(saleFormMessage, t("alerts.selectCustomerAccount"), "error");
      return;
    }

    const salePayload = {
      customer_id: Number(selectedCustomer.id),
      payment_code: paymentMethod.value,
      note: saleNote.value.trim(),
      shipping_address: getSelectedShippingAddress(),
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

    setSaleSubmitting(true);

    const saleResponse = await fetchJson("/api/sales", {
      method: "POST",
      body: JSON.stringify(salePayload)
    });

    const savedSaleNumber = saleResponse.sale_number || saleNumber;
    const preservedCustomerId = selectedCustomer.id;

    await syncPosData();
    cart = [];
    discountInput.value = "0";
    renderCustomerAccounts(preservedCustomerId);
    saleNote.value = "";
    paymentMethod.value = "cash";
    renderProducts();
    renderCart();
    closeCartModal();
    setSaleSubmitting(false);
    showInlineMessage(saleFormMessage, t("alerts.saleRecorded").replace("{saleNumber}", savedSaleNumber), "success");
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
    setCustomerAccountSubmitting(false);
    setSaleSubmitting(false);
    updateSessionButton();
    ensurePublicPosBanner();
    applyDynamicTranslations();
    renderFeaturedSlider();
    renderCustomerAccounts();
    renderPaymentMethods();
    syncCategoryUI();
    renderProducts();
    renderCart();
    if (detailProduct) {
      openProductDetail(findProduct(detailProduct.category, detailProduct.id) || detailProduct);
    }
    updateSessionButton();
  }

  window.refreshPosLanguage = applyLanguage;

  async function refreshInventoryFromStorage() {
    try {
      await syncInventoryStateFromApi();
    } catch {
      inventoryState = {
        insumos: [],
        abonos: [],
        herramientas: []
      };
    }
    renderFeaturedSlider();
    renderProducts();
    renderCart();
  }

  categoryChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeCategory = chip.dataset.category;
      resetCategoryPages(activeCategory);
      syncCategoryUI();
      renderProducts();
    });
  });

  productSearch.addEventListener("input", () => {
    resetCategoryPages();
    renderProducts();
  });
  featuredPrevButton?.addEventListener("click", () => {
    const products = getFeaturedProducts();
    if (products.length <= 1) return;
    stopFeaturedAutoplay();
    featuredOffset -= featuredStepSize;
    applyFeaturedOffset();
    startFeaturedAutoplay();
  });
  featuredNextButton?.addEventListener("click", () => {
    const products = getFeaturedProducts();
    if (products.length <= 1) return;
    stopFeaturedAutoplay();
    featuredOffset += featuredStepSize;
    applyFeaturedOffset();
    startFeaturedAutoplay();
  });
  featuredSlider?.addEventListener("mouseenter", stopFeaturedAutoplay);
  featuredSlider?.addEventListener("mouseleave", startFeaturedAutoplay);
  discountInput.addEventListener("input", updateTotals);
  customerAccountSelect?.addEventListener("change", () => {
    renderCustomerAccounts(customerAccountSelect.value);
    loadAddressesForSession().catch(() => {});
  });
  shippingAddressSelect?.addEventListener("change", () => {
    if (shippingAddressSelect.value === "__new__") {
      shippingAddressSelect.value = "";
      openAddressModal();
      return;
    }
    renderShippingAddresses();
    updateCheckoutAvailability();
  });
  openCustomerAccountModalButton?.addEventListener("click", applyCurrentCustomerSession);
  closeCustomerAccountModalButton?.addEventListener("click", closeCustomerAccountModal);
  cancelCustomerAccountModalButton?.addEventListener("click", closeCustomerAccountModal);
  customerAccountModal?.addEventListener("click", (event) => {
    if (event.target === customerAccountModal) {
      closeCustomerAccountModal();
    }
  });
  openAddressModalButton?.addEventListener("click", openAddressModal);
  closeAddressModalButton?.addEventListener("click", closeAddressModal);
  cancelAddressModalButton?.addEventListener("click", closeAddressModal);
  addressModal?.addEventListener("click", (event) => {
    if (event.target === addressModal) {
      closeAddressModal();
    }
  });
  customerAccountForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await createCustomerAccount();
    } catch (error) {
      setCustomerAccountSubmitting(false);
      showInlineMessage(customerAccountMessage, error instanceof Error ? error.message : "No se pudo crear la cuenta cliente.", "error");
    }
  });
  addressFormModal?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await createAddressFromModal();
  });
  openCartModalButton?.addEventListener("click", openCartModal);
  closeCartModalButton?.addEventListener("click", closeCartModal);
  cartModal?.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      closeCartModal();
    }
  });
  clearCartButton.addEventListener("click", async () => {
    cart = [];
    renderCart();
    if (isCustomerSession()) {
      try {
        await fetchJson("/api/cart/clear", {
          method: "POST",
          headers: { Accept: "application/json" }
        });
      } catch (error) {
        showInlineMessage(saleFormMessage, error instanceof Error ? error.message : "No se pudo limpiar el carrito.", "warning");
      }
    }
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
      setSaleSubmitting(false);
      showInlineMessage(saleFormMessage, error instanceof Error ? error.message : "No se pudo registrar la venta.", "error");
    }
  });
  logoutButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!isAuthenticated()) {
      openAuthModal();
      return;
    }

    toggleAuthMenu();
  });
  closeAuthModalButton?.addEventListener("click", closeAuthModal);
  authModal?.addEventListener("click", (event) => {
    if (event.target === authModal) {
      closeAuthModal();
    }
  });
  authLoginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loginFromModal();
  });
  toggleAuthPasswordButton?.addEventListener("click", () => {
    if (!authLoginPassword) return;
    const isPassword = authLoginPassword.type === "password";
    authLoginPassword.type = isPassword ? "text" : "password";
    toggleAuthPasswordButton.textContent = isPassword ? "Ocultar" : "Ver";
  });
  openAuthRegisterButton?.addEventListener("click", () => {
    closeAuthModal();
    openCustomerAccountModal();
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

  document.addEventListener("click", (event) => {
    if (!authMenu || authMenu.classList.contains("hidden")) return;
    if (authMenu.contains(event.target) || logoutButton?.contains(event.target)) return;
    closeAuthMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAuthMenu();
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
    startFeaturedAutoplay();
  })();
})();


