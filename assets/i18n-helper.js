const agroLanguageStorageKey = "agrocontrol-language";

function getNestedTranslation(translations, lang, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], translations[lang]);
}

function updateLanguageSelectorUI(lang) {
  document.querySelectorAll(".language-option").forEach((button) => {
    const active = button.dataset.lang === lang;
    const isDarkTheme = button.dataset.languageTheme === "dark";

    button.classList.toggle("bg-hoja", active && !isDarkTheme);
    button.classList.toggle("text-white", active && !isDarkTheme);
    button.classList.toggle("bg-sol", active && isDarkTheme);
    button.classList.toggle("text-slate-950", active && isDarkTheme);
    button.classList.toggle("shadow-md", active);
    button.classList.toggle("bg-transparent", !active);
    button.classList.toggle("text-hoja", !active && !isDarkTheme);
    button.classList.toggle("text-white/80", !active && isDarkTheme);
    button.classList.toggle("text-slate-700", false);
    button.classList.toggle("shadow-sm", false);
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
      const textTarget = element.querySelector("[data-i18n-text]");
      if (textTarget) {
        textTarget.textContent = value;
      } else {
        element.textContent = value;
      }
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

  safeStorage.setItem(agroLanguageStorageKey, nextLang);
  updateLanguageSelectorUI(nextLang);
  return nextLang;
}

function initPageI18n(translations, afterChange) {
  const savedLanguage = safeStorage.getItem(agroLanguageStorageKey) || "es";
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
