const agroLanguageStorageKey = "agrocontrol-language";

function getNestedTranslation(translations, lang, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], translations[lang]);
}

function updateLanguageSelectorUI(lang) {
  document.querySelectorAll(".language-option").forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle("bg-hoja", active);
    button.classList.toggle("text-white", active);
    button.classList.toggle("shadow-sm", active);
    button.classList.toggle("text-slate-700", !active);
  });
}

function applyPageLanguage(translations, lang) {
  const nextLang = translations[lang] ? lang : "es";
  document.documentElement.lang = nextLang;

  if (translations[nextLang].pageTitle) {
    document.title = translations[nextLang].pageTitle;
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getNestedTranslation(translations, nextLang, element.dataset.i18n);
    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const value = getNestedTranslation(translations, nextLang, element.dataset.i18nPlaceholder);
    if (typeof value === "string") {
      element.setAttribute("placeholder", value);
    }
  });

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    const value = getNestedTranslation(translations, nextLang, element.dataset.i18nTitle);
    if (typeof value === "string") {
      element.setAttribute("title", value);
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const value = getNestedTranslation(translations, nextLang, element.dataset.i18nAriaLabel);
    if (typeof value === "string") {
      element.setAttribute("aria-label", value);
    }
  });

  localStorage.setItem(agroLanguageStorageKey, nextLang);
  updateLanguageSelectorUI(nextLang);
  return nextLang;
}

function initPageI18n(translations, afterChange) {
  const savedLanguage = localStorage.getItem(agroLanguageStorageKey) || "es";
  let currentLang = applyPageLanguage(translations, savedLanguage);

  if (typeof afterChange === "function") {
    afterChange(currentLang);
  }

  document.querySelectorAll(".language-option").forEach((button) => {
    button.addEventListener("click", () => {
      currentLang = applyPageLanguage(translations, button.dataset.lang);
      if (typeof afterChange === "function") {
        afterChange(currentLang);
      }
    });
  });

  return currentLang;
}
