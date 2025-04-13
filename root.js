/**
 * Executes a function while disabling all buttons and re-enables them after completion
 * @param {Function} actionFunction - Function to execute (sync or async)
 * @returns {*} Return value of the original actionFunction
 * @example
 * executeWithLoadingState(() => {
 *   // Your action logic here
 * });
 */
function executeWithLoadingState(actionFunction) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  const result = actionFunction();

  if (result instanceof Promise) {
    result.finally(() => {
      buttons.forEach((button) => (button.disabled = false));
    });
  } else {
    buttons.forEach((button) => (button.disabled = false));
  }
}

/**
 * Attaches loading state behavior to all buttons (excluding .no-loading buttons)
 * @description Adds click handlers that disable buttons during execution
 */
function attachLoadingStateToButtons() {
  document.querySelectorAll("button:not(.no-loading)").forEach((button) => {
    const originalOnClick = button.onclick;

    if (originalOnClick) {
      button.onclick = function (event) {
        event.preventDefault();
        executeWithLoadingState(() => originalOnClick.call(button, event));
      };
    }
  });
}

window.addEventListener("DOMContentLoaded", attachLoadingStateToButtons);

/**
 * Checks for user in localStorage and redirects to login/summary as needed
 * @function checkUserSession
 * @example
 * // User storage format:
 * localStorage.setItem('user', 'username123');
 * localStorage.removeItem('user'); // On logout
 */
(function checkUserSession() {
  const USER_STORAGE_KEY = "user";
  const LOGIN_PAGE = "/index.html";
  const SUMMARY_PAGE = "/summary/summary.html";
  const ALLOWED_PAGES = [
    LOGIN_PAGE,
    "/legalNotice/legals.html",
    "/privacyPolicy/privacy.html",
    "/register/register.html",
  ];

  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  const currentPath = window.location.pathname;

  // Redirect logged-in users from public pages to summary
  if (storedUser && ALLOWED_PAGES.includes(currentPath)) {
    if (currentPath !== SUMMARY_PAGE) {
      window.location.href = SUMMARY_PAGE;
    }
    return;
  }

  // Redirect non-logged-in users from protected pages to login
  if (!storedUser && !ALLOWED_PAGES.includes(currentPath)) {
    window.location.href = LOGIN_PAGE;
  }
})();

/**
 * Überprüft den Anmeldestatus des Benutzers und zeigt oder versteckt den Login-Button.
 *
 * Die Funktion holt die Benutzerdaten aus dem `localStorage`.
 * Falls kein Benutzer angemeldet ist, wird der Login-Button angezeigt.
 * Falls ein Benutzer angemeldet ist, wird der Login-Button versteckt.
 */
function checkLoginButton() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginButton = document.getElementById("div-nav-out");

  if (!user) {
    loginButton.style.display = "flex";
  } else {
    loginButton.style.display = "none";
  }
}
