    [
      { id: "product-subcategory" },
      { id: "product-presentation" }
    ].forEach(({ id }) => {
      const field = document.getElementById(id);
      if (field?.tagName === "INPUT") {
        field.outerHTML = `<select id="${id}" class="${field.className}"></select>`;
      }
    });

    const buttons = document.querySelectorAll(".category-btn");
    const panels = document.querySelectorAll(".category-panel");
    const quickActionsToggle = document.getElementById("quick-actions-toggle");
    const quickActionsMenu = document.getElementById("quick-actions-menu");
    const openAddModalButton = document.getElementById("open-add-modal");
    const openEditModalButton = document.getElementById("open-edit-modal");
    const deleteProductButton = document.getElementById("delete-product-button");
    const openEntryModalButton = document.getElementById("open-entry-modal");
    const openExitModalButton = document.getElementById("open-exit-modal");
    const logoutButton = document.getElementById("logout-button");
    const productPanel = document.getElementById("product-panel");
    const productPanelBackdrop = document.getElementById("product-panel-backdrop");
    const closeProductPanelButton = document.getElementById("close-product-panel");
    const productPanelDetailButton = document.getElementById("product-panel-detail");
    const productPanelName = document.getElementById("product-panel-name");
    const productPanelSubtitle = document.getElementById("product-panel-subtitle");
    const productPanelContext = document.getElementById("product-panel-context");
    const closeAddModalButton = document.getElementById("close-add-modal");
    const cancelAddModalButton = document.getElementById("cancel-add-modal");
    const addModal = document.getElementById("add-modal");
    const addProductForm = document.getElementById("add-product-form");
    const formModalTitle = document.getElementById("form-modal-title");
    const formModalSubtitle = document.getElementById("form-modal-subtitle");
    const submitProductFormButton = document.getElementById("submit-product-form");
    const productCategory = document.getElementById("product-category");
    const productId = document.getElementById("product-id");
    const productName = document.getElementById("product-name");
    const productSubcategory = document.getElementById("product-subcategory");
    const productUnit = document.getElementById("product-unit");
    const productPresentation = document.getElementById("product-presentation");
    const productContent = document.getElementById("product-content");
    const productBaseStatus = document.getElementById("product-base-status");
    const productBaseNotes = document.getElementById("product-base-notes");
    const productPrice = document.getElementById("product-price");
    const productUsage = document.getElementById("product-usage");
    const productStatus = document.getElementById("product-status");
    const productNotes = document.getElementById("product-notes");
    const detailModal = document.getElementById("detail-modal");
    const closeDetailModalButton = document.getElementById("close-detail-modal");
    const detailLoading = document.getElementById("detail-loading");
    const detailContent = document.getElementById("detail-content");
    const detailTitle = document.getElementById("detail-title");
    const detailSubtitle = document.getElementById("detail-subtitle");
    const detailImage = document.getElementById("detail-image");
    const detailId = document.getElementById("detail-id");
    const detailCategory = document.getElementById("detail-category");
    const detailUsage = document.getElementById("detail-usage");
    const detailApplications = document.getElementById("detail-applications");
    const detailRecommendation = document.getElementById("detail-recommendation");
    const detailUsageLabel = detailUsage?.previousElementSibling;
    const detailApplicationsLabel = detailApplications?.previousElementSibling;
    const detailRecommendationLabel = detailRecommendation?.previousElementSibling;
    const paginationContainer = document.getElementById("pagination-container");
    const recentMovements = document.getElementById("recent-movements");
    const executiveSearch = document.getElementById("executive-search");
    const categorySearch = document.getElementById("category-search");
    const categoryFilterSelect = document.getElementById("category-filter-select");
    const categoryProductSelect = document.getElementById("category-product-select");
    const metricTotalProducts = document.getElementById("metric-total-products");
    const metricAlertProducts = document.getElementById("metric-alert-products");
    const metricInventoryValue = document.getElementById("metric-inventory-value");
    const metricActiveCategory = document.getElementById("metric-active-category");
    const inventoryLiveStatus = document.getElementById("inventory-live-status");
    const movementModal = document.getElementById("movement-modal");
    const closeMovementModalButton = document.getElementById("close-movement-modal");
    const cancelMovementModalButton = document.getElementById("cancel-movement-modal");
    const movementForm = document.getElementById("movement-form");
    const movementTitle = document.getElementById("movement-title");
    const movementSubtitle = document.getElementById("movement-subtitle");
    const movementProduct = document.getElementById("movement-product");
    const movementType = document.getElementById("movement-type");
    const movementCurrentQty = document.getElementById("movement-current-qty");
    const movementProductRef = document.getElementById("movement-product-ref");
    const movementAmount = document.getElementById("movement-amount");
    const movementDate = document.getElementById("movement-date");
    const movementProvider = document.getElementById("movement-provider");
    const movementCostUnit = document.getElementById("movement-cost-unit");
    const movementCostTotal = document.getElementById("movement-cost-total");
    const movementLot = document.getElementById("movement-lot");
    const movementExpiry = document.getElementById("movement-expiry");
    const movementNote = document.getElementById("movement-note");
    const submitMovementFormButton = document.getElementById("submit-movement-form");
    const filterPanel = document.getElementById("filter-panel");
    const toggleFilterButton = document.getElementById("toggle-filter");
    const applyFilterButton = document.getElementById("apply-filter");
    const clearFilterButton = document.getElementById("clear-filter");
    const filterSearch = document.getElementById("filter-search");
    const filterStatus = document.getElementById("filter-status");
    const previewNotice = document.getElementById("preview-notice");
    const paginationControls = document.getElementById("pagination-controls");
    const paginationSummary = document.getElementById("pagination-summary");
    const rowClass = (index) => index === 0
      ? "bg-white/92 transition hover:bg-crema/35"
      : "bg-white/92 transition hover:bg-crema/35";
    const pageSize = 6;
    const fallbackStockImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240'><rect width='320' height='240' rx='28' fill='%23E7E1D3'/><rect x='26' y='28' width='268' height='184' rx='22' fill='%23F5F0E6'/><path d='M82 170h156' stroke='%233E6B48' stroke-width='10' stroke-linecap='round'/><path d='M110 170v-52h38l12 18h28v34' fill='none' stroke='%233E6B48' stroke-width='10' stroke-linejoin='round' stroke-linecap='round'/><circle cx='122' cy='178' r='18' fill='%23D9A441'/><circle cx='214' cy='178' r='18' fill='%23D9A441'/><path d='M86 102h84' stroke='%236B4F3A' stroke-width='10' stroke-linecap='round'/><path d='M208 84l28 16' stroke='%236B4F3A' stroke-width='10' stroke-linecap='round'/></svg>";
    const stockImages = {
      insumos: [
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=300&q=80"
      ],
      abonos: [
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80"
      ],
      herramientas: [
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=300&q=80"
      ]
    };
    const categoryLabels = {
      insumos: "Insumos",
      abonos: "Abonos",
      herramientas: "Herramientas y Maquinarias"
    };
    const storageKeys = {
      insumos: "agrocontrol-insumos-extra",
      abonos: "agrocontrol-abonos-extra",
      herramientas: "agrocontrol-herramientas-extra"
    };
    const stateStorageKey = "agrocontrol-inventory-state-v3";
    const insumosSeedVersionKey = "agrocontrol-insumos-seed-v3";
    const movementStorageKey = "agrocontrol-movements-v1";
    const posDemoSeedKey = window.AGRO_APP_KEYS?.posDemoSeed || "agrocontrol-pos-demo-seed-v1";

    const insumos = [
      ["INS-001", "Semilla maiz dorado", "Semillas", "Saco", "0", "und", "Saco de 25 kg", "$82", "Siembra extensiva", "Ficha base", "Disponible"],
      ["INS-002", "Semilla arroz cristal", "Semillas", "Saco", "0", "und", "Saco de 20 kg", "$76", "Lotes arroceros", "Ficha base", "Disponible"],
      ["INS-003", "Semilla tomate saladette", "Semillas", "Sobre", "0", "und", "Sobre de 1000 semillas", "$20", "Cultivo protegido", "Ficha base", "Disponible"],
      ["INS-004", "Semilla cebolla roja", "Semillas", "Sobre", "0", "und", "Sobre de 500 semillas", "$16", "Siembra regional", "Ficha base", "Disponible"],
      ["INS-005", "Semilla lechuga romana", "Semillas", "Sobre", "0", "und", "Sobre de 1500 semillas", "$12", "Vivero e hidroponía", "Ficha base", "Disponible"],
      ["INS-006", "Semilla pepino premium", "Semillas", "Sobre", "0", "und", "Sobre de 800 semillas", "$22", "Invernadero", "Ficha base", "Disponible"],
      ["INS-007", "Semilla pimiento amarillo", "Semillas", "Sobre", "0", "und", "Sobre de 700 semillas", "$23", "Cultivo protegido", "Ficha base", "Disponible"],
      ["INS-008", "Semilla sandia dulce", "Semillas", "Sobre", "0", "und", "Sobre de 400 semillas", "$24", "Siembra de verano", "Ficha base", "Disponible"],
      ["INS-009", "Herbicida selectivo H60", "Pesticidas", "Botella", "0", "und", "Botella de 1 litro", "$19", "Control de malezas", "Ficha base", "Disponible"],
      ["INS-010", "Herbicida postemergente P12", "Pesticidas", "Botella", "0", "und", "Botella de 1 litro", "$21", "Limpieza de bordes", "Ficha base", "Disponible"],
      ["INS-011", "Fungicida systemic max", "Pesticidas", "Botella", "0", "und", "Botella de 500 ml", "$18", "Frutales y hortalizas", "Ficha base", "Disponible"],
      ["INS-012", "Fungicida prevent agro", "Pesticidas", "Botella", "0", "und", "Botella de 1 litro", "$17", "Manejo preventivo", "Ficha base", "Disponible"],
      ["INS-013", "Insecticida eco plus", "Pesticidas", "Botella", "0", "und", "Botella de 1 litro", "$15", "Hortalizas", "Ficha base", "Disponible"],
      ["INS-014", "Insecticida contacto C8", "Pesticidas", "Frasco", "0", "und", "Frasco de 250 ml", "$13", "Control puntual", "Ficha base", "Disponible"],
      ["INS-015", "Nematicida suelo activo", "Pesticidas", "Botella", "0", "und", "Botella de 1 litro", "$25", "Tratamiento de suelo", "Ficha base", "Disponible"],
      ["INS-016", "Protector foliar reforzado", "Pesticidas", "Botella", "0", "und", "Botella de 1 litro", "$14", "Refuerzo sanitario", "Ficha base", "Disponible"],
      ["INS-017", "Adherente técnico AD4", "Complementos", "Frasco", "0", "und", "Frasco de 500 ml", "$10", "Mezclas técnicas", "Ficha base", "Disponible"],
      ["INS-018", "Coadyuvante premium", "Complementos", "Botella", "0", "und", "Botella de 1 litro", "$12", "Aplicación foliar", "Ficha base", "Disponible"],
      ["INS-019", "Bioestimulante raiz pro", "Complementos", "Botella", "0", "und", "Botella de 1 litro", "$23", "Etapa inicial", "Ficha base", "Disponible"],
      ["INS-020", "Humectante suelo HS8", "Complementos", "Botella", "0", "und", "Botella de 1 litro", "$15", "Riego y absorción", "Ficha base", "Disponible"],
      ["INS-021", "Bandeja germinación 200", "Accesorios", "Paquete", "0", "und", "Paquete de 10 bandejas", "$26", "Semilleros", "Ficha base", "Disponible"],
      ["INS-022", "Bolsas vivero 10x20", "Accesorios", "Paquete", "0", "und", "Paquete de 100 unidades", "$8", "Producción de plántulas", "Ficha base", "Disponible"],
      ["INS-023", "Malla sombreo 65", "Accesorios", "Rollo", "0", "und", "Rollo de 100 metros", "$62", "Área de vivero", "Ficha base", "Disponible"],
      ["INS-024", "Cinta riego gota fina", "Accesorios", "Rollo", "0", "und", "Rollo de 1000 metros", "$35", "Riego por goteo", "Ficha base", "Disponible"]
    ];
    const defaultInsumos = insumos.map((row) => [...row]);

    const abonos = [
      ["ABO-001", "Compost premium agro", "Orgánico", "Materia orgánica estabilizada", "96", "und", "Lote base 2026", "$14", "Mejora de suelo", "EcoCert", "Disponible"],
      ["ABO-002", "Humus granulado plus", "Orgánico", "Ácidos húmicos y fúlvicos", "84", "und", "Lote base 2026", "$20", "Viveros y hortalizas", "Orgánico validado", "Disponible"],
      ["ABO-003", "Lombricompuesto activo", "Orgánico", "Microorganismos benéficos", "75", "und", "Lote base 2026", "$16", "Producción de plántulas", "EcoCert", "Disponible"],
      ["ABO-004", "Bokashi regional", "Orgánico", "Fermentado orgánico", "68", "und", "Lote base 2026", "$18", "Recuperación de suelo", "Eco manejo", "Disponible"],
      ["ABO-005", "Gallinaza compostada", "Orgánico", "Materia orgánica enriquecida", "72", "und", "Lote base 2026", "$12", "Preparación de camas", "Eco manejo", "Disponible"],
      ["ABO-006", "Compost de cacao", "Orgánico", "Cáscara compostada", "64", "und", "Lote base 2026", "$15", "Recuperación de lotes", "Orgánico validado", "Disponible"],
      ["ABO-007", "Abono verde procesado", "Orgánico", "Residuos vegetales tratados", "80", "und", "Lote base 2026", "$11", "Cobertura y suelo", "Eco manejo", "Disponible"],
      ["ABO-008", "Compost microbiano", "Orgánico", "Consorcio biológico", "59", "und", "Lote base 2026", "$19", "Mejora integral", "EcoCert", "Disponible"],
      ["ABO-009", "Fertimax 20-20-20", "Químico", "NPK balanceado", "54", "und", "Lote base 2026", "$29", "Aplicación foliar", "ISO proveedor", "Disponible"],
      ["ABO-010", "Triple 15", "Químico", "Balance NPK", "60", "und", "Lote base 2026", "$28", "Cultivos mixtos", "Proveedor ISO", "Disponible"],
      ["ABO-011", "Urea técnica", "Químico", "46 por ciento nitrógeno", "66", "und", "Lote base 2026", "$24", "Crecimiento vegetativo", "Proveedor aprobado", "Disponible"],
      ["ABO-012", "Sulfato de amonio", "Químico", "Nitrógeno y azufre", "58", "und", "Lote base 2026", "$21", "Cereales y maíz", "Proveedor aprobado", "Disponible"],
      ["ABO-013", "Nitrato de calcio", "Químico", "Calcio y nitrógeno", "62", "und", "Lote base 2026", "$27", "Fortalecimiento de fruto", "Proveedor técnico", "Disponible"],
      ["ABO-014", "Potasio k plus", "Químico", "Sulfato de potasio", "45", "und", "Lote base 2026", "$26", "Floración y fruto", "ISO proveedor", "Disponible"],
      ["ABO-015", "NPK 12-24-12", "Químico", "Fórmula de arranque", "48", "und", "Lote base 2026", "$30", "Inicio de cultivo", "ISO proveedor", "Disponible"],
      ["ABO-016", "Enmienda cálcica", "Químico", "Calcio estabilizado", "52", "und", "Lote base 2026", "$18", "Ajuste de suelo", "Control interno", "Disponible"],
      ["ABO-017", "Té de compost líquido", "Foliar", "Extractos biológicos", "40", "und", "Botella de 1 litro", "$17", "Refuerzo biológico", "EcoCert", "Disponible"],
      ["ABO-018", "Magnesio foliar", "Foliar", "Magnesio soluble", "36", "und", "Botella de 1 litro", "$22", "Corrección nutricional", "Control interno", "Disponible"],
      ["ABO-019", "Silicio foliar", "Foliar", "Silicio soluble", "32", "und", "Botella de 1 litro", "$24", "Resistencia estructural", "Proveedor técnico", "Disponible"],
      ["ABO-020", "Biofermento mineral", "Foliar", "Minerales quelatados", "30", "und", "Botella de 1 litro", "$23", "Aplicación complementaria", "EcoCert", "Disponible"],
      ["ABO-021", "Fósforo plus", "Enmienda", "Alto contenido de fósforo", "44", "und", "Saco de 25 kg", "$31", "Enraizamiento", "Proveedor ISO", "Disponible"],
      ["ABO-022", "Cal agrícola fina", "Enmienda", "Carbonato de calcio", "56", "und", "Saco de 40 kg", "$14", "Corrección de pH", "Control interno", "Disponible"],
      ["ABO-023", "Harina de roca", "Enmienda", "Minerales naturales", "38", "und", "Saco de 25 kg", "$16", "Suelo agotado", "Orgánico validado", "Disponible"],
      ["ABO-024", "Yeso agrícola", "Enmienda", "Calcio y azufre", "42", "und", "Saco de 40 kg", "$17", "Estructura de suelo", "Control interno", "Disponible"]
    ];

    const herramientas = [
      ["HER-001", "Juego de palas reforzadas", "Manual", "Kit", "Disponible", "0", "Kit de 6 piezas", "$58", "Herramienta base", "und", "Lista para asignación"],
      ["HER-002", "Tijeras de poda pro", "Manual", "Unidad", "Disponible", "0", "Unidad de corte profesional", "$24", "Herramienta base", "und", "Lista para asignación"],
      ["HER-003", "Machete profesional", "Manual", "Unidad", "Disponible", "0", "Hoja de 22 pulgadas", "$19", "Herramienta base", "und", "Lista para asignación"],
      ["HER-004", "Carretilla reforzada", "Manual", "Unidad", "Disponible", "0", "Capacidad de 90 litros", "$78", "Herramienta base", "und", "Lista para asignación"],
      ["HER-005", "Azadón reforzado", "Manual", "Unidad", "Disponible", "0", "Mango de madera larga", "$17", "Herramienta base", "und", "Lista para asignación"],
      ["HER-006", "Escalera de aluminio", "Manual", "Unidad", "Disponible", "0", "Altura de 8 escalones", "$72", "Herramienta base", "und", "Lista para asignación"],
      ["HER-007", "Rastrillo metálico", "Manual", "Unidad", "Disponible", "0", "Cabezal de 16 dientes", "$11", "Herramienta base", "und", "Lista para asignación"],
      ["HER-008", "Llave de impacto", "Manual", "Unidad", "Disponible", "0", "Modelo industrial", "$136", "Herramienta base", "und", "Lista para asignación"],
      ["HER-009", "Taladro industrial", "Manual", "Unidad", "Disponible", "0", "Potencia de 850 W", "$118", "Herramienta base", "und", "Lista para asignación"],
      ["HER-010", "Podadora eléctrica", "Manual", "Unidad", "Disponible", "0", "Espada de 18 pulgadas", "$96", "Herramienta base", "und", "Lista para asignación"],
      ["HER-011", "Pulverizador de mano", "Manual", "Unidad", "Disponible", "0", "Depósito de 5 litros", "$21", "Herramienta base", "und", "Lista para asignación"],
      ["HER-012", "Kit de fumigación", "Manual", "Kit", "Disponible", "0", "Kit de boquillas y mangueras", "$49", "Herramienta base", "und", "Lista para asignación"],
      ["HER-013", "Tractor de arado", "Maquinaria", "Máquina", "Disponible", "0", "Motor diésel 90 HP para labores de arado", "$28500", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-014", "Cultivadora C200", "Maquinaria", "Máquina", "Disponible", "0", "Ancho de trabajo de 2 m", "$8900", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-015", "Desbrozadora D55", "Maquinaria", "Máquina", "Disponible", "0", "Motor de 55 cc", "$620", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-016", "Arado liviano", "Maquinaria", "Equipo", "Disponible", "0", "Ancho de 3 discos", "$1980", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-017", "Sembradora S100", "Maquinaria", "Máquina", "Disponible", "0", "Tolva de 100 kg", "$6300", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-018", "Rastra de discos", "Maquinaria", "Equipo", "Disponible", "0", "Juego de 16 discos", "$9100", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-019", "Bomba de riego BR20", "Riego", "Equipo", "Disponible", "0", "Bomba de 2 pulgadas", "$1480", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-020", "Motobomba MX40", "Riego", "Máquina", "Disponible", "0", "Caudal de 40 m3 por hora", "$1250", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-021", "Fumigadora de mochila", "Riego", "Equipo", "Disponible", "0", "Tanque de 20 litros", "$89", "Equipo base", "und", "Programar mantenimiento"],
      ["HER-022", "Manguera presión alta", "Riego", "Rollo", "Disponible", "0", "Rollo de 30 metros", "$64", "Equipo base", "und", "Lista para asignación"],
      ["HER-023", "Casco de seguridad", "Protección", "Unidad", "Disponible", "0", "Casco con ajuste interno", "$18", "Protección base", "und", "Lista para asignación"],
      ["HER-024", "Arnés de trabajo", "Protección", "Unidad", "Disponible", "0", "Arnés de seguridad completo", "$46", "Protección base", "und", "Lista para asignación"]
    ];
    let activeCategory = "insumos";
    let currentPage = 1;
    let selectedProduct = null;
    let editMode = false;
    let currentMovementType = "Entrada";
    let movementHistory = [];
    let filteredRowsByCategory = {
      insumos,
      abonos,
      herramientas
    };
    const subcategoryOptions = {
      insumos: ["Semillas", "Pesticidas", "Complementos", "Accesorios"],
      abonos: ["Orgánico", "Químico", "Foliar", "Enmienda"],
      herramientas: ["Manual", "Maquinaria", "Riego", "Protección"]
    };
    const presentationOptions = {
      insumos: ["Sobre", "Botella", "Frasco", "Saco", "Caja", "Paquete", "Rollo", "Bidón"],
      abonos: ["Saco", "Bolsa", "Botella", "Bidón", "Caja", "Caneca"],
      herramientas: ["Unidad", "Kit", "Caja", "Equipo", "Máquina", "Rollo"]
    };

    function updateAuthUI() {
      const authenticated = isAuthenticated();

      if (logoutButton) {
        const logoutText = logoutButton.querySelector("[data-i18n-text]");
        const nextCopy = authenticated
          ? getInventoryText("auth.logout", "Cerrar sesión")
          : getInventoryText("auth.login", "Iniciar sesión");
        if (logoutText) {
          logoutText.textContent = nextCopy;
        } else {
          logoutButton.textContent = nextCopy;
        }
      }

      if (previewNotice) {
        previewNotice.classList.toggle("hidden", authenticated);
      }

       if (inventoryLiveStatus) {
        inventoryLiveStatus.textContent = authenticated
          ? "Modo operativo activo"
          : "Vista previa lista para BD/POS";
      }
    }

    function getImageIndex(category, id) {
      const seed = `${category}-${id}`;
      let total = 0;

      for (let index = 0; index < seed.length; index += 1) {
        total += seed.charCodeAt(index);
      }

      return total % stockImages[category].length;
    }

    function getStockImage(category, row) {
      return stockImages[category][getImageIndex(category, row[0])];
    }

    function formatCurrencyValue(value) {
      return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }).format(value);
    }

    function parsePriceValue(value) {
      const cleaned = String(value || "").replace(/[^0-9.,-]/g, "").replace(/,/g, "");
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function isAlertValue(value) {
      const normalized = String(value || "").toLowerCase();
      return normalized.includes("stock bajo")
        || normalized.includes("reponer")
        || normalized.includes("mantenimiento")
        || normalized.includes("revision")
        || normalized.includes("reservado");
    }

    function getInventoryTotals() {
      const allRows = [
        ...insumos.map((row) => ({ category: "insumos", row })),
        ...abonos.map((row) => ({ category: "abonos", row })),
        ...herramientas.map((row) => ({ category: "herramientas", row }))
      ];

      const totalProducts = allRows.length;
      const alertProducts = allRows.filter(({ row }) => row.some(isAlertValue)).length;
      const inventoryValue = allRows.reduce((sum, { category, row }) => {
        const quantity = getCurrentQuantity(category, row);
        return sum + (parsePriceValue(row[7]) * quantity);
      }, 0);

      return { totalProducts, alertProducts, inventoryValue };
    }

    function updateExecutiveSummary() {
      const { totalProducts, alertProducts, inventoryValue } = getInventoryTotals();

      if (metricTotalProducts) {
        metricTotalProducts.textContent = String(totalProducts);
      }

      if (metricAlertProducts) {
        metricAlertProducts.textContent = String(alertProducts);
      }

      if (metricInventoryValue) {
        metricInventoryValue.textContent = formatCurrencyValue(inventoryValue);
      }

      if (metricActiveCategory) {
        metricActiveCategory.textContent = categoryLabels[activeCategory];
      }
    }

    function renderStatusBadge(value) {
      const normalized = String(value || "").toLowerCase();
      let badgeClass = "bg-slate-100 text-slate-700";

      if (normalized.includes("sin stock") || normalized.includes("sin unidades")) {
        badgeClass = "bg-rose-50 text-rose-700";
      } else if (normalized.includes("disponible") || normalized.includes("buen")) {
        badgeClass = "bg-emerald-50 text-emerald-700";
      } else if (normalized.includes("stock bajo") || normalized.includes("reponer") || normalized.includes("mantenimiento") || normalized.includes("revision")) {
        badgeClass = "bg-amber-50 text-amber-700";
      } else if (normalized.includes("reservado")) {
        badgeClass = "bg-rose-50 text-rose-700";
      }

      return `<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}">${value}</span>`;
    }

    function openProductPanel() {
      productPanel?.classList.remove("hidden");
      productPanelBackdrop?.classList.remove("hidden");
    }

    function closeProductPanel() {
      productPanel?.classList.add("hidden");
      productPanelBackdrop?.classList.add("hidden");
    }

    function closeQuickActionsMenu() {
      quickActionsMenu?.classList.add("hidden");
      quickActionsToggle?.setAttribute("aria-expanded", "false");
    }

    function toggleQuickActionsMenu() {
      if (!quickActionsMenu || !quickActionsToggle) {
        return;
      }

      const isHidden = quickActionsMenu.classList.contains("hidden");
      quickActionsMenu.classList.toggle("hidden", !isHidden);
      quickActionsToggle.setAttribute("aria-expanded", String(isHidden));
    }

    function setCategoryButtonState(button, isActive) {
      button.classList.toggle("bg-hoja", isActive);
      button.classList.toggle("text-white", isActive);
      button.classList.toggle("bg-white", !isActive);
      button.classList.toggle("border", !isActive);
      button.classList.toggle("border-hoja/30", !isActive);
      button.classList.toggle("text-hoja", !isActive);

      const iconBadge = button.querySelector(".category-btn-icon");
      if (iconBadge) {
        iconBadge.classList.toggle("bg-white/16", isActive);
        iconBadge.classList.toggle("ring-white/15", isActive);
        iconBadge.classList.toggle("bg-hoja/8", !isActive);
        iconBadge.classList.toggle("ring-hoja/10", !isActive);
      }
    }

    function setActiveCategoryView(category) {
      activeCategory = category;
      buttons.forEach((item) => {
        setCategoryButtonState(item, item.dataset.target === category);
      });
      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== category);
      });
      if (categoryFilterSelect && categoryFilterSelect.value !== category) {
        categoryFilterSelect.value = category;
      }
      populateCategoryProductOptions();
    }

    function populateCategoryProductOptions(selectedId = "") {
      if (!categoryProductSelect) {
        return;
      }

      const category = categoryFilterSelect?.value || activeCategory;
      const rows = getCategoryRows(category);
      const options = ['<option value="">Todos los productos</option>'];

      rows.forEach((row) => {
        options.push(`<option value="${row[0]}">${row[1]} (${row[0]})</option>`);
      });

      categoryProductSelect.innerHTML = options.join("");
      categoryProductSelect.value = rows.some((row) => row[0] === selectedId) ? selectedId : "";
    }

    function updateProductPanel(category, row) {
      if (productPanelName) {
        productPanelName.textContent = row[1];
      }

      if (productPanelSubtitle) {
        productPanelSubtitle.textContent = `${row[2]} · ${categoryLabels[category]} · Usa este panel solo para acciones rápidas.`;
      }

      if (productPanelContext) {
        productPanelContext.textContent = `${row[1]} (${row[0]})`;
      }
    }

    function setupCompactTableHeaders() {
      const headerMap = {
        "insumos-body": ["Imagen", "ID", "Producto", "Stock", "Contenido", "Estado"],
        "abonos-body": ["Imagen", "ID", "Producto", "Stock", "Contenido", "Estado"],
        "herramientas-body": ["Imagen", "ID", "Producto", "Estado", "Cantidad", "Presentación"]
      };

      Object.entries(headerMap).forEach(([tbodyId, labels]) => {
        const tbody = document.getElementById(tbodyId);
        const headerRow = tbody?.closest("table")?.querySelector("thead tr");
        if (!headerRow) return;

        headerRow.innerHTML = labels
          .map((label) => `<th class="sticky top-0 z-10 bg-slate-50/85 px-3 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 backdrop-blur">${label}</th>`)
          .join("");
      });
    }

    function getVisibleCells(category, row, isTools = false) {
      if (isTools) {
        const currentQty = getCurrentQuantity(category, row);
        const statusText = currentQty <= 0 ? "Sin unidades" : row[4];
        return [
          { value: `<span class="font-mono text-xs font-semibold text-slate-500">${row[0]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
          { value: `<div class="min-w-[160px]"><p class="font-semibold text-slate-900">${row[1]}</p><p class="mt-1 text-xs text-slate-500">${row[2]} · ${row[3]}</p></div>`, className: "px-3 py-4 align-top" },
          { value: renderStatusBadge(statusText), className: "px-3 py-4 align-top whitespace-nowrap" },
          { value: `<span class="font-semibold tabular-nums text-slate-900">${currentQty}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
          { value: `<span class="text-slate-700">${row[3]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" }
        ];
      }

      if (category === "abonos") {
        const currentQty = getCurrentQuantity(category, row);
        const statusText = currentQty <= 0 ? "Sin stock" : row[10];
        return [
          { value: `<span class="font-mono text-xs font-semibold text-slate-500">${row[0]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
          { value: `<div class="min-w-[160px]"><p class="font-semibold text-slate-900">${row[1]}</p><p class="mt-1 text-xs text-slate-500">${row[2]}</p></div>`, className: "px-3 py-4 align-top" },
          { value: `<span class="font-semibold tabular-nums text-slate-900">${currentQty} ${row[5]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
          { value: `<span class="text-slate-500">${row[6]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
          { value: renderStatusBadge(statusText), className: "px-3 py-4 align-top whitespace-nowrap" }
        ];
      }

      const currentQty = getCurrentQuantity(category, row);
      const statusText = currentQty <= 0 ? "Sin stock" : row[10];
      return [
        { value: `<span class="font-mono text-xs font-semibold text-slate-500">${row[0]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
        { value: `<div class="min-w-[160px]"><p class="font-semibold text-slate-900">${row[1]}</p><p class="mt-1 text-xs text-slate-500">${row[2]} · ${row[3]}</p></div>`, className: "px-3 py-4 align-top" },
        { value: `<span class="font-semibold tabular-nums text-slate-900">${currentQty} ${row[5]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
        { value: `<span class="text-slate-500">${row[6]}</span>`, className: "px-3 py-4 align-top whitespace-nowrap" },
        { value: renderStatusBadge(statusText), className: "px-3 py-4 align-top whitespace-nowrap" }
      ];
    }

    function renderRows(category, targetId, rows, isTools = false) {
      const tbody = document.getElementById(targetId);
      tbody.innerHTML = rows.map((row, index) => {
        return `
          <tr class="${rowClass(index)} cursor-pointer transition hover:bg-hoja/5" data-category="${category}" data-id="${row[0]}">
            <td class="px-3 py-4 align-top">
              <img
                src="${getStockImage(category, row)}"
                alt="Imagen de ${row[1]}"
                class="h-12 w-12 rounded-xl object-cover shadow-sm ring-1 ring-slate-200/70"
                onerror="this.onerror=null;this.src='${fallbackStockImage}'"
                loading="lazy">
            </td>
            ${getVisibleCells(category, row, isTools).map((cell) => {
              return `<td class="${cell.className}">${cell.value}</td>`;
            }).join("")}
          </tr>
        `;
      }).join("");

      tbody.querySelectorAll("tr[data-category][data-id]").forEach((row) => {
        row.addEventListener("click", () => {
          setSelectedProduct(row.dataset.category, row.dataset.id);
        });
      });
    }

    setupCompactTableHeaders();
    renderRows("insumos", "insumos-body", insumos);
    renderRows("abonos", "abonos-body", abonos);
    renderRows("herramientas", "herramientas-body", herramientas, true);

    function loadStoredRows(category) {
      const raw = safeStorage.getItem(storageKeys[category]);
      if (!raw) return [];

      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function saveStoredRows(category, rows) {
      safeStorage.setItem(storageKeys[category], JSON.stringify(rows));
    }

    function loadInventoryState() {
      const raw = safeStorage.getItem(stateStorageKey);
      if (!raw) return null;

      try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? normalizeInventoryState(parsed) : null;
      } catch {
        return null;
      }
    }

    function saveInventoryState() {
      safeStorage.setItem(stateStorageKey, JSON.stringify({
        insumos,
        abonos,
        herramientas
      }));
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

    function loadMovementHistory() {
      const raw = safeStorage.getItem(movementStorageKey);
      if (!raw) return [];

      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    function saveMovementHistory() {
      safeStorage.setItem(movementStorageKey, JSON.stringify(movementHistory));
    }

    function seedDemoStockForPos() {
      if (safeStorage.getItem(posDemoSeedKey) === "applied") {
        return;
      }

      const demoEntries = [
        { category: "insumos", id: "INS-001", quantity: 24, provider: "Proveedor Semillas del Norte", note: "Ingreso inicial para pruebas del punto de venta." },
        { category: "insumos", id: "INS-009", quantity: 18, provider: "Agroinsumos Rivera", note: "Ingreso de herbicidas para venta mostrador." },
        { category: "insumos", id: "INS-024", quantity: 12, provider: "Riego Campo Verde", note: "Ingreso de accesorios de riego para pruebas." },
        { category: "abonos", id: "ABO-009", quantity: 20, provider: "NutriCampo Distribuciones", note: "Recepcion inicial de abonos para ventas de prueba." },
        { category: "abonos", id: "ABO-017", quantity: 16, provider: "BioFert Ecuador", note: "Ingreso de linea foliar para pruebas de mostrador." },
        { category: "herramientas", id: "HER-002", quantity: 8, provider: "Ferreteria Agro Pro", note: "Ingreso de herramientas livianas para venta inmediata." },
        { category: "herramientas", id: "HER-011", quantity: 10, provider: "Equipos Campo Activo", note: "Ingreso de pulverizadores para pruebas del POS." }
      ];

      const seededMovements = [];

      demoEntries.forEach((entry, index) => {
        const rows = getCategoryRows(entry.category);
        const target = rows.find((row) => row[0] === entry.id);
        if (!target) {
          return;
        }

        const quantityIndex = getQuantityIndex(entry.category);
        const currentQty = Number(target[quantityIndex]) || 0;
        if (currentQty < entry.quantity) {
          target[quantityIndex] = String(entry.quantity);
        }

        const unitPrice = parsePriceValue(target[7]);
        seededMovements.push({
          type: "Entrada",
          category: entry.category,
          id: target[0],
          name: target[1],
          amount: entry.quantity,
          date: `2026-03-${String(10 + index).padStart(2, "0")}`,
          note: entry.note,
          provider: entry.provider,
          costUnit: unitPrice ? String(unitPrice.toFixed(2)) : "",
          costTotal: unitPrice ? String((unitPrice * entry.quantity).toFixed(2)) : "",
          lot: `DEMO-${target[0]}`,
          expiry: "",
          reference: `${entry.provider} - Carga demo POS`
        });
      });

      saveInventoryState();
      movementHistory = [...seededMovements.reverse(), ...movementHistory].slice(0, 30);
      saveMovementHistory();
      safeStorage.setItem(posDemoSeedKey, "applied");
    }

    function getCategoryRows(category) {
      if (category === "abonos") return abonos;
      if (category === "herramientas") return herramientas;
      return insumos;
    }

    function setCategoryRows(category, rows) {
      if (category === "abonos") {
        abonos.length = 0;
        abonos.push(...rows);
        return;
      }

      if (category === "herramientas") {
        herramientas.length = 0;
        herramientas.push(...rows);
        return;
      }

      insumos.length = 0;
      insumos.push(...rows);
    }

    function initializeStoredProducts() {
      const state = loadInventoryState();

      if (state?.insumos && state?.abonos && state?.herramientas) {
        setCategoryRows("insumos", state.insumos);
        setCategoryRows("abonos", state.abonos);
        setCategoryRows("herramientas", state.herramientas);
      } else {
        ["insumos", "abonos", "herramientas"].forEach((category) => {
          const baseRows = getCategoryRows(category).slice();
          const extraRows = loadStoredRows(category);
          setCategoryRows(category, [...baseRows, ...extraRows]);
        });
        saveInventoryState();
      }

      filteredRowsByCategory = {
        insumos,
        abonos,
        herramientas
      };

      if (safeStorage.getItem(insumosSeedVersionKey) !== "applied") {
        setCategoryRows("insumos", defaultInsumos.map((row) => [...row]));
        filteredRowsByCategory.insumos = insumos;
        saveInventoryState();
        safeStorage.setItem(insumosSeedVersionKey, "applied");
      }

      movementHistory = loadMovementHistory();
      seedDemoStockForPos();
    }

    function renderRecentMovements() {
      if (!recentMovements) {
        return;
      }

      const visible = movementHistory.slice(0, 3);

      if (visible.length === 0) {
        recentMovements.innerHTML = "<p class=\"rounded-xl border border-white/10 bg-white/8 px-3 py-3 text-sm leading-6 text-white/70\">No hay movimientos registrados.</p>";
        return;
      }

      recentMovements.innerHTML = visible.map((movement) => `
        <div class="rounded-xl border border-white/10 bg-white/8 px-3 py-3">
          <p class="font-semibold text-white">${movement.type}: ${movement.name}</p>
          <p class="mt-1 text-xs text-slate-500">${movement.date} · ${movement.amount} unidades</p>
          <p class="mt-2 text-sm leading-6 text-slate-700">${movement.note}</p>
        </div>
      `).join("");
    }

    function getQuantityIndex(category) {
      return category === "herramientas" ? 5 : 4;
    }

    function getCurrentQuantity(category, row) {
      return Number(row[getQuantityIndex(category)]) || 0;
    }

    function setSelectedProduct(category, id) {
      const row = findRowById(category, id);
      if (!row) return;

      selectedProduct = { category, id };
      updateProductPanel(category, row);
      openProductPanel();
    }

    function clearSelectedProduct() {
      selectedProduct = null;
      closeProductPanel();
    }

    function getAllInventoryProducts() {
      return [
        ...getCategoryRows("insumos").map((row) => ({ category: "insumos", row })),
        ...getCategoryRows("abonos").map((row) => ({ category: "abonos", row })),
        ...getCategoryRows("herramientas").map((row) => ({ category: "herramientas", row }))
      ];
    }

    function updateMovementProductSnapshot() {
      const selectedValue = movementProduct.value;
      if (!selectedValue) {
        movementCurrentQty.value = "";
        movementProductRef.value = "";
        return null;
      }

      const [category, id] = selectedValue.split("::");
      const row = findRowById(category, id);

      if (!row) {
        movementCurrentQty.value = "";
        movementProductRef.value = "";
        return null;
      }

      movementCurrentQty.value = String(getCurrentQuantity(category, row));
      movementProductRef.value = `${row[1]} · ${row[3]} · ${row[6]}`;
      return { category, id, row };
    }

    function updateMovementTotal() {
      const amount = Number(movementAmount.value) || 0;
      const costUnit = Number(movementCostUnit.value) || 0;
      movementCostTotal.value = amount && costUnit ? String((amount * costUnit).toFixed(2)) : "";
    }

    function toggleMovementFormLayout(type) {
      const isEntry = type === "Entrada";
      document.getElementById("movement-type-field")?.classList.toggle("hidden", isEntry);
      document.getElementById("movement-product-ref-field")?.classList.toggle("hidden", !isEntry);
      document.getElementById("movement-provider-field")?.classList.toggle("hidden", !isEntry);
      document.getElementById("movement-cost-unit-field")?.classList.toggle("hidden", !isEntry);
      document.getElementById("movement-cost-total-field")?.classList.toggle("hidden", !isEntry);
      document.getElementById("movement-lot-field")?.classList.toggle("hidden", !isEntry);
      document.getElementById("movement-expiry-field")?.classList.toggle("hidden", !isEntry);

      const amountLabel = document.querySelector("#movement-amount-field span");
      const dateLabel = document.querySelector("#movement-date-field span");
      const noteLabel = document.querySelector("#movement-note-field span");
      if (amountLabel) amountLabel.textContent = isEntry ? "Cantidad ingresada" : "Cantidad a mover";
      if (dateLabel) dateLabel.textContent = isEntry ? "Fecha de entrada" : "Fecha";
      if (noteLabel) noteLabel.textContent = isEntry ? "Observación" : "Motivo / nota";
      movementNote.placeholder = isEntry
        ? "Compra, recepción de mercadería, ingreso de lote..."
        : "Entrega a campo, ajuste de inventario...";
    }

    function populateMovementProducts(preselected = null, lockSelection = false) {
      const allProducts = getAllInventoryProducts();

      movementProduct.innerHTML = allProducts.map(({ category, row }) => {
        const value = `${category}::${row[0]}`;
        const selected = preselected && preselected.category === category && preselected.id === row[0] ? " selected" : "";
        return `<option value="${value}"${selected}>${row[1]} (${row[0]}) - ${categoryLabels[category]}</option>`;
      }).join("");

      if (!allProducts.length) {
        movementProduct.innerHTML = '<option value="">No hay productos disponibles</option>';
      }

      movementProduct.disabled = lockSelection;
      movementProduct.classList.toggle("bg-slate-100", lockSelection);
      movementProduct.classList.toggle("text-slate-600", lockSelection);
      movementProduct.classList.toggle("bg-crema", !lockSelection);
      updateMovementProductSnapshot();
    }

    function openMovementModal(type) {
      currentMovementType = type;
      movementTitle.textContent = `Registrar ${type.toLowerCase()}`;
      movementSubtitle.textContent = type === "Entrada"
        ? "Selecciona un producto y registra el ingreso con sus datos principales."
        : "Selecciona un producto y descuenta unidades del stock disponible.";
      movementType.value = type;
      toggleMovementFormLayout(type);

      if (type === "Entrada") {
        populateMovementProducts(selectedProduct, false);
      } else {
        if (selectedProduct) {
          const row = findRowById(selectedProduct.category, selectedProduct.id);
          if (!row) {
            alert("El producto seleccionado ya no está disponible.");
            clearSelectedProduct();
            populateMovementProducts(null, false);
          } else {
            populateMovementProducts(selectedProduct, true);
          }
        } else {
          populateMovementProducts(null, false);
        }
      }

      movementAmount.value = "";
      movementDate.value = new Date().toISOString().slice(0, 10);
      movementProvider.value = "";
      movementCostUnit.value = "";
      movementCostTotal.value = "";
      movementLot.value = "";
      movementExpiry.value = "";
      movementNote.value = "";
      submitMovementFormButton.textContent = `Guardar ${type.toLowerCase()}`;
      movementModal.classList.remove("hidden");
    }

    function closeMovementModal() {
      movementModal.classList.add("hidden");
      movementForm.reset();
      movementProduct.disabled = false;
      movementProduct.innerHTML = "";
      movementProductRef.value = "";
      movementCostTotal.value = "";
    }

    function updateDeletePreview() {
      if (!deleteCategorySelect || !deleteProductSelect || !deleteProductPreview) return;

      const category = deleteCategorySelect.value;
      const row = findRowById(category, deleteProductSelect.value);

      if (!row) {
        deleteProductPreview.textContent = "Selecciona un producto para ver lo que vas a eliminar.";
        return;
      }

      deleteProductPreview.textContent = `${row[1]} (${row[0]}) de ${categoryLabels[category]}. Esta acción eliminará el registro del inventario.`;
    }

    function updateDeleteProductOptions() {
      if (!deleteCategorySelect || !deleteProductSelect) return;

      const category = deleteCategorySelect.value;
      const rows = getCategoryRows(category);

      if (!rows.length) {
        deleteProductSelect.innerHTML = '<option value="">No hay productos disponibles</option>';
        updateDeletePreview();
        return;
      }

      deleteProductSelect.innerHTML = rows
        .map((row) => `<option value="${row[0]}">${row[1]} (${row[0]})</option>`)
        .join("");

      updateDeletePreview();
    }

    function openDeleteModal() {
      if (!requireAuth("Eliminar productos")) {
        return;
      }

      if (deleteCategorySelect) {
        deleteCategorySelect.value = selectedProduct?.category || activeCategory;
      }

      updateDeleteProductOptions();

      if (selectedProduct && deleteProductSelect) {
        deleteProductSelect.value = selectedProduct.id;
        updateDeletePreview();
      }

      deleteModal?.classList.remove("hidden");
    }

    function closeDeleteModal() {
      deleteModal?.classList.add("hidden");
    }

    function renderCategory(category, rows) {
      if (category === "abonos") {
        renderRows("abonos", "abonos-body", rows);
        return;
      }

      if (category === "herramientas") {
        renderRows("herramientas", "herramientas-body", rows, true);
        return;
      }

      renderRows("insumos", "insumos-body", rows);
    }

    function movePaginationToActivePanel(category) {
      const panel = document.getElementById(category);
      const host = panel.querySelector(".pagination-host");
      if (host) {
        host.appendChild(paginationContainer);
      }
    }

    function updatePagination(category) {
      movePaginationToActivePanel(category);

      const rows = filteredRowsByCategory[category];
      const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

      if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const visibleRows = rows.slice(start, end);

      renderCategory(category, visibleRows);
      updateExecutiveSummary();

      const from = rows.length === 0 ? 0 : start + 1;
      const to = Math.min(end, rows.length);
      paginationSummary.textContent = `Mostrando ${from}-${to} de ${rows.length} productos. Páginas de ${pageSize} registros.`;

      paginationControls.innerHTML = "";

      const previousButton = document.createElement("button");
      previousButton.type = "button";
      previousButton.innerHTML = '<svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true"><path d="m14.7 6.3-1.4-1.4L6.2 12l7.1 7.1 1.4-1.4L8.9 12l5.8-5.7Z"/></svg><span>Anterior</span>';
      previousButton.className = currentPage === 1
        ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400"
        : "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-hoja hover:text-hoja";
      previousButton.disabled = currentPage === 1;
      previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage -= 1;
          updatePagination(category);
        }
      });
      paginationControls.appendChild(previousButton);

      for (let page = 1; page <= totalPages; page += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = page;
        button.className = page === currentPage
          ? "inline-flex items-center justify-center rounded-full bg-hoja px-4 py-2 text-sm font-semibold text-white shadow-sm"
          : "inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-hoja hover:text-hoja";

        button.addEventListener("click", () => {
          currentPage = page;
          updatePagination(category);
        });

        paginationControls.appendChild(button);
      }

      const nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.innerHTML = '<span>Siguiente</span><svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true"><path d="m9.3 17.7 1.4 1.4 7.1-7.1-7.1-7.1-1.4 1.4 5.8 5.7-5.8 5.7Z"/></svg>';
      nextButton.className = currentPage === totalPages
        ? "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400"
        : "inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-hoja hover:text-hoja";
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage += 1;
          updatePagination(category);
        }
      });
      paginationControls.appendChild(nextButton);
    }

    function applyFilters(resetPage = true) {
      const searchValue = filterSearch.value.trim().toLowerCase();
      const statusValue = filterStatus.value.trim().toLowerCase();
      const productValue = categoryProductSelect?.value.trim() || "";
      const sourceRows = getCategoryRows(activeCategory);

      const filteredRows = sourceRows.filter((row) => {
        const matchesSearch = !searchValue || row.some((cell) => String(cell).toLowerCase().includes(searchValue));
        const matchesStatus = !statusValue || row.some((cell) => String(cell).toLowerCase().includes(statusValue));
        const matchesProduct = !productValue || row[0] === productValue;
        return matchesSearch && matchesStatus && matchesProduct;
      });

      filteredRowsByCategory[activeCategory] = filteredRows;

      if (resetPage) {
        currentPage = 1;
      }

      updatePagination(activeCategory);
    }

    function findRowById(category, id) {
      return getCategoryRows(category).find((row) => row[0] === id);
    }

    function buildProductInfo(category, row) {
      if (category === "abonos") {
        return {
          usage: `${row[1]} se utiliza como apoyo nutricional para mejorar el desarrollo del cultivo, reforzar etapas productivas y mantener un manejo más estable del suelo y la planta.`,
          applications: [
            `Aplicación en ${row[8].toLowerCase()}.`,
            `Programas de fertilización según necesidad del lote y análisis técnico.`,
            `Apoyo en suelos con requerimientos específicos de nutrición o recuperación.`
          ],
          recommendation: `Se recomienda revisar dosis, humedad del suelo y compatibilidad del producto antes de aplicarlo. Certificación registrada: ${row[9]}.`
        };
      }

      if (category === "herramientas") {
        return {
          usage: `${row[1]} se utiliza como equipo de trabajo para tareas operativas en campo, mantenimiento del cultivo o soporte logístico dentro de la finca.`,
          applications: [
            `Uso en la ubicación o frente de trabajo: ${row[8]}.`,
            `Apoyo en labores de preparación, mantenimiento o intervención técnica.`,
            `Asignación por responsable según disponibilidad y estado del equipo.`
          ],
          recommendation: `Antes de utilizarlo, conviene validar estado actual, mantenimiento programado y responsable asignado. Estado registrado: ${row[4]}.`
        };
      }

      return {
        usage: `${row[1]} se utiliza dentro del manejo agrícola para apoyar la producción, protección o establecimiento del cultivo según la necesidad operativa.`,
        applications: [
          `Uso recomendado en ${row[8].toLowerCase()}.`,
          `Aplicación en cultivos o lotes que requieran soporte de tipo ${row[2].toLowerCase()}.`,
          `Integración con planes de compra, distribución y control de inventario.`
        ],
        recommendation: `Conviene revisar fecha clave, almacenamiento y disponibilidad antes de su uso. Proveedor o marca asociada: ${row[3]}.`
      };
    }


    function buildEssentialProductInfo(category, row) {
      if (category === "abonos") {
        const currentQty = getCurrentQuantity(category, row);
        const statusText = currentQty <= 0 ? "Sin stock" : row[10];
        return {
          usage: `${row[2]} · ${currentQty} ${row[5]} disponibles · Estado ${statusText}`,
          applications: [
            `Presentación: ${row[3]}`,
            `Contenido por unidad: ${row[6]}`,
            `Proveedor principal: ${row[8]}`,
            `Costo base: ${row[7]}`
          ],
          recommendation: row[11] || "Sin observaciones relevantes."
        };
      }

      if (category === "herramientas") {
        const currentQty = getCurrentQuantity(category, row);
        const statusText = currentQty <= 0 ? "Sin unidades" : row[4];
        return {
          usage: `${row[2]} · Estado ${statusText} · ${currentQty} und`,
          applications: [
            `Presentación: ${row[3]}`,
            `Contenido o capacidad: ${row[6]}`,
            `Proveedor principal: ${row[8]}`,
            `Costo base: ${row[7]}`
          ],
          recommendation: row[10] || "Sin observaciones relevantes."
        };
      }

      const currentQty = getCurrentQuantity(category, row);
      const statusText = currentQty <= 0 ? "Sin stock" : row[10];
      return {
        usage: `${row[2]} · ${currentQty} ${row[5]} disponibles · Estado ${statusText}`,
        applications: [
          `Presentación: ${row[3]}`,
          `Contenido por unidad: ${row[6]}`,
          `Proveedor principal: ${row[8]}`,
          `Costo base: ${row[7]}`
        ],
        recommendation: row[11] || "Sin observaciones relevantes."
      };
    }

    function getProductInfoFromApi(category, id) {
      return new Promise((resolve, reject) => {
        const row = findRowById(category, id);

        window.setTimeout(() => {
          if (!row) {
            reject(new Error("Producto no encontrado"));
            return;
          }

          resolve({
            id: row[0],
            name: row[1],
            category: categoryLabels[category],
            image: getStockImage(category, row),
            ...buildEssentialProductInfo(category, row)
          });
        }, 450);
      });
    }

    async function openDetailModal(category, id) {
      detailModal.classList.remove("hidden");
      detailLoading.classList.remove("hidden");
      detailContent.classList.add("hidden");
      detailTitle.textContent = "Información del producto";
      detailSubtitle.textContent = "Consultando datos clave...";
      if (detailUsageLabel) detailUsageLabel.textContent = "Resumen rápido";
      if (detailApplicationsLabel) detailApplicationsLabel.textContent = "Datos clave";
      if (detailRecommendationLabel) detailRecommendationLabel.textContent = "Observaciones";

      try {
        const info = await getProductInfoFromApi(category, id);
        detailTitle.textContent = info.name;
        detailSubtitle.textContent = "Resumen con lo más importante del producto.";
        detailImage.src = info.image;
        detailImage.alt = `Imagen de ${info.name}`;
        detailImage.onerror = () => {
          detailImage.onerror = null;
          detailImage.src = fallbackStockImage;
        };
        detailId.textContent = info.id;
        detailCategory.textContent = info.category;
        detailUsage.textContent = info.usage;
        detailRecommendation.textContent = info.recommendation;
        detailApplications.innerHTML = info.applications
          .map((item) => `<li class="rounded-xl bg-crema px-4 py-3">${item}</li>`)
          .join("");

        detailLoading.classList.add("hidden");
        detailContent.classList.remove("hidden");
      } catch (error) {
        detailTitle.textContent = "No se pudo cargar el detalle";
        detailSubtitle.textContent = "La información del producto no estuvo disponible.";
        detailLoading.textContent = "No se encontró información para este producto.";
      }
    }

    function closeDetailModal() {
      detailModal.classList.add("hidden");
      detailLoading.textContent = "Consultando información...";
      detailLoading.classList.remove("hidden");
      detailContent.classList.add("hidden");
    }

    function openAddModal() {
      if (!requireAuth("Crear productos")) {
        return;
      }

      editMode = false;
      formModalTitle.textContent = "Nuevo producto";
      formModalSubtitle.textContent = "Completa los datos clave y guarda el registro en la categoría seleccionada.";
      submitProductFormButton.textContent = "Guardar ficha base";
      formModalSubtitle.textContent = "Crea la ficha base del producto para incorporarlo al inventario.";
      productBaseStatus.value = "Disponible";
      productBaseNotes.value = "";
      productUnit.value = "und";
      productCategory.value = activeCategory;
      updateProductSelectors();
      productCategory.removeAttribute("disabled");
      productCategory.classList.remove("bg-slate-100", "text-slate-500");
      productId.removeAttribute("readonly");
      productId.classList.remove("bg-slate-100", "text-slate-500");
      addModal.classList.remove("hidden");
    }

    function closeAddModal() {
      addModal.classList.add("hidden");
      addProductForm.reset();
      productCategory.value = activeCategory;
      editMode = false;
    }

    function populateSelectOptions(selectElement, options, selectedValue = "") {
      if (!selectElement) return;

      selectElement.innerHTML = options
        .map((option) => `<option value="${option}">${option}</option>`)
        .join("");

      if (selectedValue && options.includes(selectedValue)) {
        selectElement.value = selectedValue;
      } else if (options.length > 0) {
        selectElement.value = options[0];
      }
    }

    function updateProductSelectors(selectedSubcategory = "", selectedPresentation = "") {
      const category = productCategory.value;
      populateSelectOptions(productSubcategory, subcategoryOptions[category] || [], selectedSubcategory);
      populateSelectOptions(productPresentation, presentationOptions[category] || [], selectedPresentation);
    }

    function normalizeInventoryView() {
      const heroTitle = document.querySelector("main section section h1");
      const heroSubtitle = heroTitle?.nextElementSibling;
      if (heroTitle) {
        heroTitle.textContent = "Inventario central para control de stock y movimientos.";
      }
      if (heroSubtitle) {
        heroSubtitle.textContent = "Vista pensada para trabajar rápido hoy y seguir creciendo hacia BD y punto de venta.";
      }

      const supportPill = document.querySelector("#open-exit-modal + span");
      if (supportPill) {
        supportPill.textContent = "Entrada y salida son globales. Selecciona un producto solo para editarlo o ver su detalle.";
      }

      const panelCopy = {
        insumos: "Control de productos base del inventario. La lista muestra resumen, stock actual y acceso rápido al detalle.",
        abonos: "Control de abonos y fertilizantes con una vista resumida para stock, contenido y estado.",
        herramientas: "Control de herramientas y maquinarias con foco en estado, cantidad y presentación."
      };

      Object.entries(panelCopy).forEach(([panelId, copy]) => {
        const panel = document.getElementById(panelId);
        const description = panel?.querySelector("h2 + p");
        const chips = panel?.querySelector("h2")?.closest("div")?.nextElementSibling;
        const legacySection = panel?.querySelector(".hidden.grid");
        if (description) {
          description.textContent = copy;
        }
        if (chips?.classList.contains("flex")) {
          chips.classList.add("hidden");
        }
        legacySection?.remove();
      });

      const labelMap = {
        "product-category": "Categoría",
        "product-subcategory": "Subcategoría",
        "product-presentation": "Presentación",
        "product-usage": "Proveedor principal"
      };

      Object.entries(labelMap).forEach(([fieldId, label]) => {
        const field = document.getElementById(fieldId);
        const span = field?.closest("label")?.querySelector("span");
        if (span) {
          span.textContent = label;
        }
        if (fieldId === "product-usage" && field) {
          field.placeholder = "Proveedor principal del producto";
        }
      });

      const visibleProductFields = [
        "product-category",
        "product-id",
        "product-name",
        "product-subcategory",
        "product-unit",
        "product-presentation",
        "product-content",
        "product-usage"
      ];

      document.querySelectorAll("#add-product-form label").forEach((label) => {
        const field = label.querySelector("input, select");
        if (!field) return;
        label.classList.toggle("hidden", !visibleProductFields.includes(field.id));
      });
    }

    [productBaseStatus, productBaseNotes, productPrice, productUsage, productStatus, productNotes].forEach((field) => {
      field?.closest("label")?.classList.add("hidden");
    });
    updateProductSelectors();
    normalizeInventoryView();

    function composeDateSummary(createdAt, expiryAt, category) {
      const created = createdAt || "";
      const expiry = expiryAt || "";

      if (created && expiry) {
        return `Creado: ${created} | Vence: ${expiry}`;
      }

      if (created) {
        return created;
      }

      if (expiry) {
        return category === "herramientas" ? `Referencia: ${expiry}` : expiry;
      }

      return "Pendiente";
    }

    function parseDateSummary(summary, category) {
      const value = String(summary || "").trim();

      if (!value || value === "Pendiente") {
        return { createdAt: "", expiryAt: "" };
      }

      if (value.includes("Creado:") || value.includes("Vence:")) {
        const parts = value.split("|").map((item) => item.trim());
        const createdAt = parts.find((item) => item.startsWith("Creado:"))?.replace("Creado:", "").trim() || "";
        const expiryAt = parts.find((item) => item.startsWith("Vence:"))?.replace("Vence:", "").trim() || "";
        return { createdAt, expiryAt };
      }

      if (category === "herramientas") {
        return { createdAt: value, expiryAt: "" };
      }

      return { createdAt: "", expiryAt: value };
    }

    function openEditModal() {
      if (!requireAuth("Editar productos")) {
        return;
      }

      if (!selectedProduct) {
        alert("Primero selecciona un producto desde la tabla.");
        return;
      }

      const row = findRowById(selectedProduct.category, selectedProduct.id);
      if (!row) {
        alert("El producto seleccionado ya no está disponible.");
        return;
      }

      editMode = true;
      formModalTitle.textContent = "Editar producto del inventario";
      formModalSubtitle.textContent = "Actualiza la información del producto seleccionado y guarda los cambios.";
      submitProductFormButton.textContent = "Guardar cambios";
      productCategory.value = selectedProduct.category;
      updateProductSelectors(row[2], row[3]);
      productId.value = row[0];
      productName.value = row[1];
      productSubcategory.value = row[2];
      productUnit.value = "uni";
      productPresentation.value = row[3];
      productContent.value = row[6] === "Pendiente" ? "" : row[6];
      productBaseStatus.value = selectedProduct.category === "herramientas" ? row[4] : row[10];
      productBaseNotes.value = selectedProduct.category === "herramientas" ? row[10] : (row[11] || "");
      productPrice.value = row[7];
      productUsage.value = row[8];
      productStatus.value = selectedProduct.category === "herramientas" ? row[4] : row[10];
      productNotes.value = selectedProduct.category === "herramientas" ? row[10] : (row[11] || "");
      productCategory.setAttribute("disabled", "disabled");
      productCategory.classList.add("bg-slate-100", "text-slate-500");
      productId.setAttribute("readonly", "readonly");
      productId.classList.add("bg-slate-100", "text-slate-500");
      addModal.classList.remove("hidden");
    }


    function deleteProductFromPicker() {
      if (!deleteCategorySelect || !deleteProductSelect) {
        return;
      }

      const category = deleteCategorySelect.value;
      const targetId = deleteProductSelect.value;
      const row = findRowById(category, targetId);

      if (!row) {
        alert("El producto elegido ya no está disponible.");
        updateDeleteProductOptions();
        return;
      }

      const confirmed = window.confirm(`¿Deseas eliminar "${row[1]}" (${row[0]}) del inventario?`);
      if (!confirmed) {
        return;
      }

      const updatedRows = getCategoryRows(category).filter((item) => item[0] !== targetId);

      setCategoryRows(category, updatedRows);
      saveInventoryState();
      filteredRowsByCategory[category] = updatedRows;
      activeCategory = category;
      currentPage = 1;
      setActiveCategoryView(category);
      filterSearch.value = "";
      filterStatus.value = "";
      if (categorySearch) {
        categorySearch.value = "";
      }
      if (categoryProductSelect) {
        categoryProductSelect.value = "";
      }
      updatePagination(category);

      if (selectedProduct?.category === category && selectedProduct?.id === targetId) {
        clearSelectedProduct();
      }

      closeDeleteModal();
      updateDeleteProductOptions();
    }

    function deleteSelectedProduct() {
      if (!requireAuth("Eliminar productos")) {
        return;
      }

      if (!selectedProduct) {
        alert("Primero selecciona un producto para eliminar.");
        return;
      }

      const row = findRowById(selectedProduct.category, selectedProduct.id);
      if (!row) {
        alert("El producto seleccionado ya no está disponible.");
        clearSelectedProduct();
        return;
      }

      const confirmed = window.confirm(`¿Deseas eliminar "${row[1]}" (${row[0]}) del inventario?`);
      if (!confirmed) {
        return;
      }

      const category = selectedProduct.category;
      const updatedRows = getCategoryRows(category).filter((item) => item[0] !== selectedProduct.id);

      setCategoryRows(category, updatedRows);
      saveInventoryState();
      filteredRowsByCategory[category] = updatedRows;
      activeCategory = category;
      currentPage = 1;
      setActiveCategoryView(category);
      if (executiveSearch) {
        executiveSearch.value = "";
      }
      filterSearch.value = "";
      filterStatus.value = "";
      if (categorySearch) {
        categorySearch.value = "";
      }
      if (categoryProductSelect) {
        categoryProductSelect.value = "";
      }
      updatePagination(category);
      clearSelectedProduct();
    }

    function buildRowFromForm(category) {
      const id = productId.value.trim();
      const name = productName.value.trim();
      const subcategory = productSubcategory.value.trim();
      const unit = productUnit.value.trim();
      const presentation = productPresentation.value.trim();
      const content = productContent.value.trim();
      const provider = productUsage.value.trim();
      const status = productBaseStatus.value.trim() || "Disponible";
      const notes = productBaseNotes.value.trim();

      if (category === "herramientas") {
        return [
          id,
          name,
          subcategory,
          presentation || "Sin presentación",
          status,
          "0",
          content || "Sin detalle",
          "$0",
          provider || "Sin proveedor principal",
          unit || "und",
          notes || "Registro manual"
        ];
      }

      return [
        id,
        name,
        subcategory,
        presentation || "Sin presentación",
        "0",
        unit,
        content || "Sin detalle",
        "$0",
        provider || "Sin proveedor principal",
        category === "abonos" ? "Ficha base" : "Base general",
        status,
        notes || "Sin observaciones"
      ];
    }

    function validateForm() {
      const requiredValues = [
        productId.value.trim(),
        productName.value.trim(),
        productSubcategory.value.trim(),
        productUnit.value.trim(),
        productPresentation.value.trim(),
        productContent.value.trim(),
        productUsage.value.trim()
      ];

      return requiredValues.every(Boolean);
    }

    window.inventoryTranslations = {
      es: {
        pageTitle: "AgroControl | Inventario",
        nav: { home: "Inicio", about: "Nosotros", inventory: "Inventario", movements: "Movimientos", contact: "Contacto" },
        auth: { login: "Iniciar sesión", logout: "Cerrar sesión" },
        hero: { title: "Inventario central" },
        preview: { notice: "Estás en modo vista previa. Puedes consultar inventario y movimientos recientes, pero para agregar, editar, eliminar o registrar cambios debes iniciar sesión." },
        sidebar: {
          label: "Panel lateral",
          quickActions: "Acciones rápidas",
          selectedProduct: "Producto seleccionado",
          noSelectedProduct: "Ningún producto seleccionado."
        },
        actions: { add: "Nuevo Producto", edit: "Editar", delete: "Eliminar" },
        categories: { inputs: "Insumos", fertilizers: "Abonos", tools: "Herramientas y Maquinarias" },
        filters: { toggle: "Filtrar productos" },
        messages: { previewAuth: "Esta acción requiere iniciar sesión. Estás en modo vista previa." }
      },
      en: {
        pageTitle: "AgroControl | Inventory",
        nav: { home: "Home", about: "About us", inventory: "Inventory", movements: "Movements", contact: "Contact" },
        auth: { login: "Log in", logout: "Log out" },
        hero: { title: "Central inventory" },
        preview: { notice: "You are in preview mode. You can review inventory and recent movements, but you must log in to add, edit, delete, or register changes." },
        sidebar: {
          label: "Side panel",
          quickActions: "Quick actions",
          selectedProduct: "Selected product",
          noSelectedProduct: "No product selected."
        },
        actions: { add: "Add Product", edit: "Edit", delete: "Delete" },
        categories: { inputs: "Supplies", fertilizers: "Fertilizers", tools: "Tools and Machinery" },
        filters: { toggle: "Filter products" },
        messages: { previewAuth: "This action requires signing in. You are in preview mode." }
      }
    };

    currentInventoryLanguage = initPageI18n(window.inventoryTranslations, (lang) => {
      currentInventoryLanguage = lang;
      updateAuthUI();
    });

    initializeStoredProducts();
    updateAuthUI();
    updateExecutiveSummary();
    populateCategoryProductOptions();
    updatePagination(activeCategory);
    renderRecentMovements();

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.target;
        currentPage = 1;
        setActiveCategoryView(target);
        applyFilters();
      });
    });

    toggleFilterButton?.addEventListener("click", () => {
      filterPanel?.classList.toggle("hidden");
    });

    executiveSearch?.addEventListener("input", () => {
      filterSearch.value = executiveSearch.value;
      if (categorySearch && categorySearch.value !== executiveSearch.value) {
        categorySearch.value = executiveSearch.value;
      }
      applyFilters();
    });

    categorySearch?.addEventListener("input", () => {
      filterSearch.value = categorySearch.value;
      if (executiveSearch && executiveSearch.value !== categorySearch.value) {
        executiveSearch.value = categorySearch.value;
      }
      applyFilters();
    });

    categoryFilterSelect?.addEventListener("change", () => {
      currentPage = 1;
      setActiveCategoryView(categoryFilterSelect.value);
      if (executiveSearch) {
        executiveSearch.value = "";
      }
      if (categorySearch) {
        categorySearch.value = "";
      }
      filterSearch.value = "";
      applyFilters();
    });

    categoryProductSelect?.addEventListener("change", () => {
      const selectedId = categoryProductSelect.value;
      const row = selectedId ? findRowById(activeCategory, selectedId) : null;
      const nextSearch = row ? `${row[0]} ${row[1]}` : "";

      filterSearch.value = nextSearch;
      if (executiveSearch) {
        executiveSearch.value = nextSearch;
      }
      if (categorySearch) {
        categorySearch.value = nextSearch;
      }
      applyFilters();
    });

    filterSearch?.addEventListener("input", () => {
      if (executiveSearch && executiveSearch.value !== filterSearch.value) {
        executiveSearch.value = filterSearch.value;
      }
      if (categorySearch && categorySearch.value !== filterSearch.value) {
        categorySearch.value = filterSearch.value;
      }
    });

    applyFilterButton?.addEventListener("click", applyFilters);

    clearFilterButton?.addEventListener("click", () => {
      if (executiveSearch) {
        executiveSearch.value = "";
      }
      if (categorySearch) {
        categorySearch.value = "";
      }
      if (categoryProductSelect) {
        categoryProductSelect.value = "";
      }
      filterSearch.value = "";
      filterStatus.value = "";
      filteredRowsByCategory[activeCategory] = getCategoryRows(activeCategory);
      currentPage = 1;
      updatePagination(activeCategory);
    });

    quickActionsToggle?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleQuickActionsMenu();
    });

    openAddModalButton.addEventListener("click", () => {
      closeQuickActionsMenu();
      openAddModal();
    });
    openEditModalButton.addEventListener("click", openEditModal);
    deleteProductButton.addEventListener("click", deleteSelectedProduct);
    closeProductPanelButton?.addEventListener("click", closeProductPanel);
    productPanelBackdrop?.addEventListener("click", closeProductPanel);
    productPanelDetailButton?.addEventListener("click", () => {
      if (!selectedProduct) return;
      openDetailModal(selectedProduct.category, selectedProduct.id);
    });
    if (openEntryModalButton) {
      openEntryModalButton.addEventListener("click", () => {
        closeQuickActionsMenu();
        if (!requireAuth("Registrar entradas")) {
          return;
        }

        openMovementModal("Entrada");
      });
    }
    if (openExitModalButton) {
      openExitModalButton.addEventListener("click", () => {
        closeQuickActionsMenu();
        if (!requireAuth("Registrar salidas")) {
          return;
        }

        openMovementModal("Salida");
      });
    }
    logoutButton?.addEventListener("click", () => {
      if (!isAuthenticated()) {
        redirectToLogin();
        return;
      }

      safeStorage.removeItem(window.AGRO_APP_KEYS.auth);
      updateAuthUI();
      window.location.href = "login.html";
    });
    closeAddModalButton.addEventListener("click", closeAddModal);
    cancelAddModalButton.addEventListener("click", closeAddModal);
    addModal.addEventListener("click", (event) => {
      if (event.target === addModal) {
        closeAddModal();
      }
    });

    closeDetailModalButton.addEventListener("click", closeDetailModal);
    detailModal.addEventListener("click", (event) => {
      if (event.target === detailModal) {
        closeDetailModal();
      }
    });

    closeMovementModalButton.addEventListener("click", closeMovementModal);
    cancelMovementModalButton.addEventListener("click", closeMovementModal);
    productCategory.addEventListener("change", () => updateProductSelectors());
    movementProduct.addEventListener("change", updateMovementProductSnapshot);
    movementAmount.addEventListener("input", updateMovementTotal);
    movementCostUnit.addEventListener("input", updateMovementTotal);
    movementModal.addEventListener("click", (event) => {
      if (event.target === movementModal) {
        closeMovementModal();
      }
    });

    document.addEventListener("click", (event) => {
      if (!quickActionsMenu || !quickActionsToggle) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!quickActionsMenu.contains(target) && !quickActionsToggle.contains(target)) {
        closeQuickActionsMenu();
      }
    });

    addProductForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!requireAuth(editMode ? "Guardar cambios del producto" : "Crear productos")) {
        return;
      }

      if (!validateForm()) {
        alert("Completa al menos los campos principales del producto.");
        return;
      }

      const category = productCategory.value;
      let updatedRows;

      if (editMode && selectedProduct) {
        const currentRows = getCategoryRows(category);
        const editedRow = buildRowFromForm(category);
        updatedRows = currentRows.map((row) => row[0] === selectedProduct.id ? editedRow : row);
        selectedProduct = { category, id: editedRow[0] };
        updateProductPanel(category, editedRow);
        openProductPanel();
      } else {
        const newRow = buildRowFromForm(category);
        updatedRows = [...getCategoryRows(category), newRow];
        selectedProduct = { category, id: newRow[0] };
        updateProductPanel(category, newRow);
        openProductPanel();
      }

      setCategoryRows(category, updatedRows);
      saveInventoryState();
      filteredRowsByCategory[category] = updatedRows;
      activeCategory = category;
      currentPage = Math.max(1, Math.ceil(updatedRows.length / pageSize));

      buttons.forEach((item) => {
        setCategoryButtonState(item, item.dataset.target === category);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== category);
      });

      if (executiveSearch) {
        executiveSearch.value = "";
      }
      filterSearch.value = "";
      filterStatus.value = "";
      filteredRowsByCategory[category] = getCategoryRows(category);
      updatePagination(category);
      closeAddModal();
    });

    movementForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!requireAuth(`Registrar ${currentMovementType.toLowerCase()}`)) {
        return;
      }

      const movementSelection = updateMovementProductSnapshot();
      if (!movementSelection) {
        alert("Selecciona un producto para registrar el movimiento.");
        return;
      }

      const amount = Number(movementAmount.value);
      if (!amount || amount <= 0) {
        alert("Ingresa una cantidad válida para el movimiento.");
        return;
      }

      const { category, row, id } = movementSelection;
      if (!row) {
        alert("El producto seleccionado ya no está disponible.");
        closeMovementModal();
        return;
      }

      const quantityIndex = getQuantityIndex(category);
      const currentQty = getCurrentQuantity(category, row);
      const nextQty = currentMovementType === "Entrada" ? currentQty + amount : currentQty - amount;

      if (nextQty < 0) {
        alert("La salida no puede dejar el stock en negativo.");
        return;
      }

      const updatedRows = getCategoryRows(category).map((item) => {
        if (item[0] !== id) return item;
        const next = [...item];
        next[quantityIndex] = String(nextQty);
        return next;
      });

      setCategoryRows(category, updatedRows);
      saveInventoryState();
      filteredRowsByCategory[category] = updatedRows;
      movementHistory.unshift({
        type: currentMovementType,
        category,
        id: row[0],
        name: row[1],
        amount,
        date: movementDate.value || new Date().toISOString().slice(0, 10),
        note: movementNote.value.trim() || "Sin detalle",
        provider: movementProvider.value.trim(),
        costUnit: movementCostUnit.value.trim(),
        costTotal: movementCostTotal.value.trim(),
        lot: movementLot.value.trim(),
        expiry: movementExpiry.value.trim(),
        reference: movementProductRef.value.trim()
      });
      movementHistory = movementHistory.slice(0, 30);
      saveMovementHistory();
      renderRecentMovements();
      setSelectedProduct(category, id);
      updatePagination(category);
      closeMovementModal();
    });

