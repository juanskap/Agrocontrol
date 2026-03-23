(() => {
  const inventoryStateKey = window.AGRO_APP_KEYS.inventoryState;
  const movementsKey = window.AGRO_APP_KEYS.movements;
  const salesKey = window.AGRO_APP_KEYS.sales;
  const authKey = window.AGRO_APP_KEYS.auth;
  const languageKey = window.AGRO_APP_KEYS.language || "agrocontrol-language";
  const translations = window.posTranslations || {};

  const logoutButton = document.getElementById("logout-button");
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
  const customerInput = document.getElementById("sale-customer");
  const paymentMethod = document.getElementById("payment-method");
  const saleNote = document.getElementById("sale-note");
  const confirmSaleButton = document.getElementById("confirm-sale");
  const saleForm = document.getElementById("sale-form");
  const clearCartButton = document.getElementById("clear-cart");
  const recentSales = document.getElementById("recent-sales");
  const salesCounter = document.getElementById("sales-counter");
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
      card: "checkout.paymentCard",
      Efectivo: "checkout.paymentCash",
      Transferencia: "checkout.paymentTransfer",
      Tarjeta: "checkout.paymentCard",
      Cash: "checkout.paymentCash",
      Card: "checkout.paymentCard"
    };
    return keys[payment] ? t(keys[payment]) : payment;
  }

  function getSession() {
    try {
      return JSON.parse(safeStorage.getItem(authKey) || "null");
    } catch {
      return null;
    }
  }

  function isAuthenticated() {
    return Boolean(getSession());
  }

  function updateSessionButton() {
    if (!logoutButton) return;
    const label = logoutButton.querySelector("[data-i18n-text]") || logoutButton.querySelector("span");
    if (label) {
      label.textContent = isAuthenticated() ? t("actions.logout") : t("actions.login");
    }
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
        return parsed;
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

  function loadSalesHistory() {
    try {
      const parsed = JSON.parse(safeStorage.getItem(salesKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
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

  function recordSale() {
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

    items.forEach((item) => {
      inventoryState[item.category] = inventoryState[item.category].map((row) => {
        if (row[0] !== item.id) return row;
        const nextRow = [...row];
        const quantityIndex = quantityIndexByCategory(item.category);
        nextRow[quantityIndex] = String(getCurrentQuantity(item.category, row) - item.quantity);
        return nextRow;
      });
    });

    saveInventoryState();

    const movements = loadMovementHistory();
    const note = saleNote.value.trim() || t("dynamic.saleRecordedNote").replace("{saleNumber}", saleNumber);
    const payment = paymentMethod.value;
    const customer = customerInput.value.trim();

    items.slice().reverse().forEach((item) => {
      const row = inventoryState[item.category].find((product) => product[0] === item.id);
      const nextQty = row ? getCurrentQuantity(item.category, row) : 0;
      movements.unshift({
        type: currentLanguage === "en" ? "Output" : "Salida",
        category: item.category,
        id: item.id,
        name: item.product.name,
        amount: item.quantity,
        date: saleDate,
        responsible: customer,
        supplier: "",
        note,
        price: formatCurrency(item.product.price),
        totalValue: formatCurrency(item.subtotal),
        stockAfter: nextQty,
        provider: "",
        costUnit: String(item.product.price.toFixed(2)),
        costTotal: String(item.subtotal.toFixed(2)),
        lot: "",
        expiry: "",
        reference: `${saleNumber} - ${paymentLabel(payment)}${customer ? ` - ${customer}` : ""}`
      });
    });
    saveMovementHistory(movements.slice(0, 100));

    salesHistory.unshift({
      number: saleNumber,
      date: saleDate,
      customer: customer || t("dynamic.walkInCustomer"),
      payment,
      note,
      subtotal,
      discount,
      total,
      items: items.map((item) => ({
        category: item.category,
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotal: item.subtotal
      }))
    });
    salesHistory = salesHistory.slice(0, 30);
    saveSalesHistory();

    cart = [];
    discountInput.value = "0";
    customerInput.value = "";
    saleNote.value = "";
    paymentMethod.value = "cash";
    inventoryState = loadInventoryState();
    renderProducts();
    renderCart();
    renderRecentSales();
    closeCartModal();
    alert(t("alerts.saleRecorded").replace("{saleNumber}", saleNumber));
  }

  function renderRecentSales() {
    salesCounter.textContent = t("dynamic.salesCount").replace("{count}", String(salesHistory.length));

    if (salesHistory.length === 0) {
      recentSales.innerHTML = `
        <div class="rounded-[1.5rem] border border-dashed border-slate-300 bg-crema/70 px-4 py-6 text-sm text-slate-500">
          ${t("dynamic.noSalesYet")}
        </div>
      `;
      return;
    }

    recentSales.innerHTML = salesHistory.slice(0, 4).map((sale) => `
      <article class="rounded-[1.5rem] border border-slate-200 bg-crema/70 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-black text-slate-900">${sale.number}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-hoja/70">${paymentLabel(sale.payment)}</p>
          </div>
          <p class="text-sm font-bold text-hoja">${formatCurrency(sale.total)}</p>
        </div>
        <p class="mt-3 text-sm text-slate-700">${sale.customer}</p>
        <p class="mt-1 text-xs text-slate-500">${sale.date} - ${t("dynamic.saleItems").replace("{count}", String(sale.items.length))}</p>
        <p class="mt-3 text-sm text-slate-600">${sale.note}</p>
      </article>
    `).join("");
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
    applyDynamicTranslations();
    syncCategoryUI();
    renderProducts();
    renderCart();
    renderRecentSales();
    if (detailProduct) {
      openProductDetail(findProduct(detailProduct.category, detailProduct.id) || detailProduct);
    }
  }

  window.refreshPosLanguage = applyLanguage;

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
  saleForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    recordSale();
  });
  logoutButton?.addEventListener("click", () => {
    if (!isAuthenticated()) {
      window.location.href = "login.html?redirect=pos.html";
      return;
    }

    safeStorage.removeItem(authKey);
    updateSessionButton();
    window.location.href = "pos.html";
  });

  applyLanguage(currentLanguage);
})();
