(() => {
  const authStorageKey = "agrocontrol-auth-v1";
  const authModal = document.getElementById("auth-modal");
  const closeAuthModalButton = document.getElementById("close-auth-modal");
  const loginForm = document.getElementById("login-form");
  const loginUser = document.getElementById("login-user");
  const loginPassword = document.getElementById("login-password");
  const loginMessage = document.getElementById("login-message");
  const togglePasswordButton = document.getElementById("toggle-password");
  const togglePasswordIcon = document.getElementById("toggle-password-icon");
  const registerPanel = document.getElementById("register-panel");
  const registerForm = document.getElementById("register-form");
  const registerName = document.getElementById("register-name");
  const registerEmail = document.getElementById("register-email");
  const registerPhone = document.getElementById("register-phone");
  const registerPassword = document.getElementById("register-password");
  const registerPasswordConfirm = document.getElementById("register-password-confirm");
  const registerMessage = document.getElementById("register-message");
  const registerSubmitButton = document.getElementById("register-submit");
  const toggleRegisterPanelButton = document.getElementById("toggle-register-panel");
  const cancelRegisterPanelButton = document.getElementById("cancel-register-panel");
  const closeRegisterPanelButton = document.getElementById("close-register-panel");

  if (!authModal || !loginForm || !registerPanel || !registerForm) return;

  const copy = {
    es: {
      auth: {
        heroLabel: "Acceso directo ✨",
        heroTitle: "Inicia sesion sin salir de la ventana de inicio.",
        heroDescription: "Mantuvimos el acceso dentro de esta misma pantalla para que la experiencia se vea mas limpia, rapida y consistente.",
        formLabel: "Iniciar sesion 🔐",
        formTitle: "Acceso de clientes y administracion",
        userLabel: "Correo o usuario",
        userPlaceholder: "Ingresa tu correo o admin",
        passwordLabel: "Contrasena",
        passwordPlaceholder: "Ingresa tu contrasena",
        submit: "Ingresar",
        createAccount: "Crear cuenta",
        invalid: "Usuario o contrasena incorrectos. Revisa los datos e intentalo de nuevo.",
        networkErrorFile: "No se pudo conectar con el servidor. Abre la pagina desde http://localhost o desde tu proyecto en XAMPP.",
        networkErrorHttp: "No se pudo conectar con el servidor. Verifica que abras el sistema desde localhost.",
        showPassword: "Mostrar contrasena",
        hidePassword: "Ocultar contrasena"
      },
      register: {
        label: "Crear cuenta",
        title: "Registra tu cuenta para comprar",
        description: "Crea tu cuenta cliente para comprar en linea.",
        nameLabel: "Nombre completo",
        namePlaceholder: "Ej: Maria Lopez",
        emailLabel: "Correo",
        emailPlaceholder: "cliente@correo.com",
        phoneLabel: "Telefono",
        phonePlaceholder: "0999999999",
        passwordLabel: "Contrasena",
        passwordPlaceholder: "Minimo 6 caracteres",
        passwordConfirmLabel: "Confirmar contrasena",
        passwordConfirmPlaceholder: "Repite tu contrasena",
        submit: "Crear cuenta",
        cancel: "Cancelar",
        invalid: "No se pudo crear la cuenta.",
        passwordMismatch: "Las contrasenas no coinciden.",
        passwordShort: "La contrasena debe tener al menos 6 caracteres.",
        success: "Cuenta creada exitosamente.",
        creating: "Creando cuenta...",
        missingName: "Ingresa el nombre completo del cliente.",
        invalidEmail: "Ingresa un correo electronico valido."
      }
    },
    en: {
      auth: {
        heroLabel: "Direct access ✨",
        heroTitle: "Sign in without leaving the home screen.",
        heroDescription: "We kept the access flow inside this page so the experience feels cleaner, faster, and more consistent.",
        formLabel: "Log in 🔐",
        formTitle: "Customer and admin access",
        userLabel: "Email or user",
        userPlaceholder: "Enter your email or admin",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        submit: "Sign in",
        createAccount: "Create account",
        invalid: "Incorrect user or password. Check your credentials and try again.",
        networkErrorFile: "The server could not be reached. Open the page from http://localhost or from your XAMPP project.",
        networkErrorHttp: "The server could not be reached. Make sure you open the system from localhost.",
        showPassword: "Show password",
        hidePassword: "Hide password"
      },
      register: {
        label: "Create account",
        title: "Register your account to buy",
        description: "Create your customer account to buy online.",
        nameLabel: "Full name",
        namePlaceholder: "Ex: Maria Lopez",
        emailLabel: "Email",
        emailPlaceholder: "customer@mail.com",
        phoneLabel: "Phone",
        phonePlaceholder: "0999999999",
        passwordLabel: "Password",
        passwordPlaceholder: "At least 6 characters",
        passwordConfirmLabel: "Confirm password",
        passwordConfirmPlaceholder: "Repeat your password",
        submit: "Create account",
        cancel: "Cancel",
        invalid: "The account could not be created.",
        passwordMismatch: "Passwords do not match.",
        passwordShort: "The password must have at least 6 characters.",
        success: "Account created successfully.",
        creating: "Creating account...",
        missingName: "Enter the customer's full name.",
        invalidEmail: "Enter a valid email address."
      }
    }
  };

  function getLang() {
    return document.documentElement.lang === "en" ? "en" : "es";
  }

  function getCopy() {
    return copy[getLang()];
  }

  function apiUrl(path) {
    const appBasePath = window.location.pathname.replace(/\/$/, "").replace(/\/(?:index|nosotros|contacto|login|pos|inventario|movimientos)(?:\.html)?$/, "");
    return `${window.location.origin}${appBasePath}${path}`;
  }

  function resolvePostLoginUrl(session) {
    return session?.role === "admin" ? "inventario.html" : "pos.html";
  }

  function saveSession(session) {
    if (!session) {
      safeStorage.removeItem(authStorageKey);
      return;
    }
    safeStorage.setItem(authStorageKey, JSON.stringify(session));
  }

  function hideMessage(target) {
    target.classList.add("hidden");
    target.textContent = "";
  }

  function showMessage(target, message, type = "error") {
    target.textContent = message;
    target.classList.remove("border-rose-200", "bg-rose-50", "text-rose-700", "border-emerald-200", "bg-emerald-50", "text-emerald-700");
    target.classList.add(type === "success" ? "border-emerald-200" : "border-rose-200");
    target.classList.add(type === "success" ? "bg-emerald-50" : "bg-rose-50");
    target.classList.add(type === "success" ? "text-emerald-700" : "text-rose-700");
    target.classList.remove("hidden");
  }

  function buildNetworkErrorMessage() {
    return window.location.protocol === "file:" ? getCopy().auth.networkErrorFile : getCopy().auth.networkErrorHttp;
  }

  async function requestJson(path, payload) {
    let response;
    try {
      response = await fetch(apiUrl(path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      throw new Error(buildNetworkErrorMessage());
    }

    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { status: "error", message: rawText || "No se pudo completar la solicitud." };
    }

    if (!response.ok || data.status === "error") {
      throw new Error(data.message || "No se pudo completar la solicitud.");
    }

    return data.data;
  }

  function updatePasswordToggleIcon() {
    const showingPassword = loginPassword.type === "text";
    togglePasswordButton.setAttribute("aria-label", showingPassword ? getCopy().auth.hidePassword : getCopy().auth.showPassword);
    togglePasswordIcon.innerHTML = showingPassword
      ? '<path d="m3.3 4.7 16 16-1.4 1.4-3.1-3.1A12.8 12.8 0 0 1 12 17.4c-5.5 0-9.5-5.6-9.7-5.8l-.3-.4.3-.4A22 22 0 0 1 7 6.2L1.9 1.1 3.3-.3Zm6.3 6.3a2.7 2.7 0 0 0 3.4 3.4L9.6 11Zm2.4-6c5.5 0 9.5 5.6 9.7 5.8l.3.4-.3.4a22 22 0 0 1-5.3 4.7l-1.5-1.5c1.8-.9 3.4-2.4 4.7-3.8-1-1.1-4-4.2-7.6-4.2-.9 0-1.8.2-2.6.5L8 6.1A8.6 8.6 0 0 1 12 5Zm-.2 3.5a2.7 2.7 0 0 1 2.7 2.7c0 .4-.1.8-.3 1.1l-3.5-3.5c.3-.2.7-.3 1.1-.3Z"/>'
      : '<path d="M12 5c5.5 0 9.5 5.6 9.7 5.8l.3.4-.3.4C21.5 11.8 17.5 17.4 12 17.4S2.5 11.8 2.3 11.6l-.3-.4.3-.4C2.5 10.6 6.5 5 12 5Zm0 2c-3.6 0-6.6 3.2-7.6 4.2 1 1.1 4 4.2 7.6 4.2s6.6-3.2 7.6-4.2C18.6 10.2 15.6 7 12 7Zm0 1.5a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4Z"/>';
  }

  function setRegisterSubmitting(isSubmitting) {
    registerSubmitButton.disabled = isSubmitting;
    registerSubmitButton.textContent = isSubmitting ? getCopy().register.creating : getCopy().register.submit;
  }

  function applyTranslations() {
    document.querySelectorAll("#auth-modal [data-i18n], #register-panel [data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      const value = key.split(".").reduce((result, part) => result?.[part], getCopy());
      if (typeof value === "string") {
        element.textContent = value;
      }
    });

    document.querySelectorAll("#auth-modal [data-i18n-placeholder], #register-panel [data-i18n-placeholder]").forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      const value = key.split(".").reduce((result, part) => result?.[part], getCopy());
      if (typeof value === "string") {
        element.setAttribute("placeholder", value);
      }
    });

    updatePasswordToggleIcon();
    setRegisterSubmitting(false);
  }

  function openAuthModal() {
    applyTranslations();
    authModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    hideMessage(loginMessage);
    window.setTimeout(() => loginUser.focus(), 30);
  }

  function closeAuthModal() {
    authModal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    loginForm.reset();
    hideMessage(loginMessage);
    loginPassword.type = "password";
    updatePasswordToggleIcon();
  }

  function toggleRegisterPanel(forceVisible = null) {
    const nextVisible = typeof forceVisible === "boolean" ? forceVisible : registerPanel.classList.contains("hidden");
    registerPanel.classList.toggle("hidden", !nextVisible);
    if (nextVisible) {
      applyTranslations();
      hideMessage(registerMessage);
      window.setTimeout(() => registerName.focus(), 30);
      return;
    }
    registerForm.reset();
    hideMessage(registerMessage);
    setRegisterSubmitting(false);
  }

  window.openIndexAuthModal = openAuthModal;
  applyTranslations();

  closeAuthModalButton.addEventListener("click", closeAuthModal);
  authModal.addEventListener("click", (event) => {
    if (event.target === authModal) closeAuthModal();
  });
  togglePasswordButton.addEventListener("click", () => {
    loginPassword.type = loginPassword.type === "password" ? "text" : "password";
    updatePasswordToggleIcon();
  });
  toggleRegisterPanelButton.addEventListener("click", () => toggleRegisterPanel());
  cancelRegisterPanelButton.addEventListener("click", () => toggleRegisterPanel(false));
  closeRegisterPanelButton.addEventListener("click", () => toggleRegisterPanel(false));
  registerPanel.addEventListener("click", (event) => {
    if (event.target === registerPanel) toggleRegisterPanel(false);
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage(loginMessage);
    try {
      const session = await requestJson("/api/login", {
        identifier: loginUser.value.trim(),
        password: loginPassword.value
      });
      saveSession(session);
      closeAuthModal();
      window.location.href = resolvePostLoginUrl(session);
    } catch (error) {
      showMessage(loginMessage, error instanceof Error ? error.message : getCopy().auth.invalid);
    }
  });

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessage(registerMessage);
    const text = getCopy().register;
    const fullName = registerName.value.trim();
    const email = registerEmail.value.trim().toLowerCase();
    const phone = registerPhone.value.trim();
    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value;

    if (fullName.length < 3) {
      showMessage(registerMessage, text.missingName);
      return;
    }
    if (!email || !email.includes("@")) {
      showMessage(registerMessage, text.invalidEmail);
      return;
    }
    if (password.length < 6) {
      showMessage(registerMessage, text.passwordShort);
      return;
    }
    if (password !== passwordConfirm) {
      showMessage(registerMessage, text.passwordMismatch);
      return;
    }

    try {
      setRegisterSubmitting(true);
      await requestJson("/api/customers", {
        full_name: fullName,
        email,
        phone,
        password
      });
      loginUser.value = email;
      registerForm.reset();
      showMessage(registerMessage, text.success, "success");
    } catch (error) {
      showMessage(registerMessage, error instanceof Error ? error.message : text.invalid);
    } finally {
      setRegisterSubmitting(false);
    }
  });

  document.querySelectorAll(".language-option").forEach((button) => {
    button.addEventListener("click", () => {
      window.setTimeout(applyTranslations, 0);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!registerPanel.classList.contains("hidden")) {
      toggleRegisterPanel(false);
      return;
    }
    if (!authModal.classList.contains("hidden")) {
      closeAuthModal();
    }
  });
})();
