let logStatus;

const dbUrl =
  "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Handles user login process with email and password
 * @returns {void}
 */
function login() {
  if (!validateForm()) {
    return;
  }

  let email = document.getElementById("Email").value.trim().toLowerCase();
  let password = document.getElementById("Password").value;

  const firebaseKey = email.replace(/\./g, "_").replace(/@/g, "-");

  fetch(`${dbUrl}/users/${firebaseKey}.json`)
    .then((response) => response.json())
    .then((user) => {
      if (user && user.password === password) {
        saveUserToLocalStorage(user, email);

        setTimeout(() => {
          window.location.href = "../summary/summary.html";
        }, 500);
      } else {
        document.getElementById("render-alert").innerHTML =
          "The email or password is incorrect.";
      }
    })
    .catch((error) => console.error("Fehler:", error));

  document.getElementById("Password").value = "";
  document.getElementById("Email").value = "";
}

function checkForm() {
  let email = document.getElementById("Email").value.trim();
  let password = document.getElementById("Password").value.trim();
  let loginButton = document.getElementById("login-button");

  const isFormValid = email !== "" && password !== "";

  loginButton.disabled = !isFormValid;
}

document.getElementById("Email").addEventListener("input", checkForm);
document.getElementById("Password").addEventListener("input", checkForm);

/**
 * Saves user data to localStorage
 * @param {Object} user - User object from database
 * @param {string} email - User's email address
 * @returns {void}
 */
function saveUserToLocalStorage(user, email) {
  const userData = {
    name: user.name,
    email: email,
  };

  localStorage.setItem("user", JSON.stringify(userData));
}

/**
 * Handles guest login without credentials
 * @returns {void}
 */
function guestLogin() {
  const guestData = {
    name: "Guest",
    email: "guest@example.com",
  };

  localStorage.setItem("user", JSON.stringify(guestData));

  setTimeout(() => {
    window.location.href = "../summary/summary.html";
  }, 500);
}

/**
 * Checks if user is logged in and redirects if not
 * @returns {void}
 */
function checkUserStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Bitte loggen Sie sich ein.");
    window.location.href = "../index.html";
  } else {
    console.log(`Willkommen zurück, ${user.name}!`);
  }
}

/**
 * Validates login form inputs
 * @returns {boolean} True if form is valid
 */
function validateForm() {
  const email = document.getElementById("Email").value.trim().toLowerCase();
  const password = document.getElementById("Password").value;

  let error = "";

  switch (true) {
    case !email:
      error = "Please enter your email address";
      break;
    case !validateEmail(email):
      error = "Please enter a valid email address";
      break;
    case !password:
      error = "Please enter a password";
      break;
  }

  if (error) {
    document.getElementById("render-alert").innerHTML = error;
    return false;
  }

  return true;
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Überprüft, ob das angegebene Element vorhanden ist.
 * @param {string} elementId - ID des HTML-Elements.
 * @returns {HTMLElement|null} Das gefundene Element oder null, wenn es nicht existiert.
 */
function getElementByIdSafe(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element mit ID '${elementId}' nicht gefunden.`);
  }
  return element;
}

/**
 * Versteckt oder zeigt Icons basierend auf dem Passwortfeldinhalt.
 * @param {HTMLElement} passwordInput - Das Passwort-Eingabefeld.
 * @param {HTMLElement} lockIcon - Das Schlosssymbol.
 * @param {HTMLElement} eyeSlashIcon - Das durchgestrichene Augensymbol.
 * @param {HTMLElement} eyeIcon - Das Augensymbol.
 * @returns {void}
 */
function togglePasswordIcons(passwordInput, lockIcon, eyeSlashIcon, eyeIcon) {
  if (passwordInput.value) {
    lockIcon?.classList.add("d_none");
    eyeSlashIcon?.classList.remove("d_none");
  } else {
    lockIcon?.classList.remove("d_none");
    eyeSlashIcon?.classList.add("d_none");
    eyeIcon?.classList.add("d_none");
    passwordInput.type = "password";
  }
}

/**
 * Zeigt das Passwort als Klartext, wenn das Augensymbol (eyeSlashIcon) geklickt wird.
 * @param {HTMLElement} passwordInput - Das Passwort-Eingabefeld.
 * @param {HTMLElement} eyeSlashIcon - Das durchgestrichene Augensymbol.
 * @param {HTMLElement} eyeIcon - Das Augensymbol.
 * @returns {void}
 */
function showPasswordText(passwordInput, eyeSlashIcon, eyeIcon) {
  passwordInput.type = "text";
  eyeSlashIcon.classList.add("d_none");
  eyeIcon?.classList.remove("d_none");
}

/**
 * Versteckt das Passwort und zeigt das durchgestrichene Augensymbol, wenn das Augensymbol (eyeIcon) geklickt wird.
 * @param {HTMLElement} passwordInput - Das Passwort-Eingabefeld.
 * @param {HTMLElement} eyeIcon - Das Augensymbol.
 * @param {HTMLElement} eyeSlashIcon - Das durchgestrichene Augensymbol.
 * @returns {void}
 */
function hidePasswordText(passwordInput, eyeIcon, eyeSlashIcon) {
  passwordInput.type = "password";
  eyeIcon.classList.add("d_none");
  eyeSlashIcon?.classList.remove("d_none");
}

/**
 * Initialisiert das Umschalten der Passwortsichtbarkeit für das angegebene Eingabefeld.
 * @param {string} inputId - Die ID des Passwort-Eingabefeldes.
 * @returns {void}
 */
function setupPasswordToggle(inputId) {
  const passwordInput = getElementByIdSafe(inputId);
  if (!passwordInput) return;

  const container = passwordInput.parentElement;
  if (!container) return;

  const lockIcon = container.querySelector(".lock-icon");
  const eyeSlashIcon = container.querySelector(".eye-icon");
  const eyeIcon = container.querySelector(".eye-slash-icon");

  passwordInput.addEventListener("input", () => {
    togglePasswordIcons(passwordInput, lockIcon, eyeSlashIcon, eyeIcon);
  });

  eyeSlashIcon?.addEventListener("click", () => {
    showPasswordText(passwordInput, eyeSlashIcon, eyeIcon);
  });

  eyeIcon?.addEventListener("click", () => {
    hidePasswordText(passwordInput, eyeIcon, eyeSlashIcon);
  });
}

document.querySelectorAll("#Password, #PasswordCon").forEach((el) => {
  setupPasswordToggle(el.id);
});

/* Email input validation */

const emailInput = document.getElementById('Email');

const isValidEmail = (email) => {
  // einfache Regex für grundlegende Validierung
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

emailInput.addEventListener('input', () => {
  const value = emailInput.value;

  if (value === "") {
    emailInput.classList.remove('valid', 'invalid');
  } else if (isValidEmail(value)) {
    emailInput.classList.add('valid');
    emailInput.classList.remove('invalid');
  } else {
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
  }
});