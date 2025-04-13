/**
 * Zeigt die Initialen des Benutzers basierend auf dem im localStorage gespeicherten Benutzernamen an.
 * Wenn kein Benutzername vorhanden ist, wird der Buchstabe "G" angezeigt.
 * Die Initialen werden aus den ersten beiden Buchstaben des Benutzernamens extrahiert.
 *
 * @returns {void} Keine Rückgabe.
 */
function displayInitials() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name) {
    const initials = user.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2);

    document.getElementById("render-profile").innerText =
      initials.toUpperCase();
  } else {
    document.getElementById("render-profile").style.display = "none";
    document.getElementById("visible-off").style.display = "none";
  }
}

/**
 * Initialisiert die Navbar, indem die Funktion `displayInitials` aufgerufen wird,
 * um die Benutzer-Initialen anzuzeigen.
 *
 * @returns {void} Keine Rückgabe.
 */
function initNavbar() {}

/**
 * Schaltet das Menü ein oder aus, indem die Klasse `hidden` auf das Menüelement angewendet oder entfernt wird.
 *
 * @returns {void} Keine Rückgabe.
 */
function toggleMenu() {
  const menu = document.getElementById("menu");

  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
  } else {
    menu.classList.add("hidden");
  }
}

/**
 * Loggt den Benutzer aus, indem das `user`-Objekt aus dem localStorage entfernt wird
 * und der Benutzer zur Startseite weitergeleitet wird.
 *
 * @returns {void} Keine Rückgabe.
 */
function logout() {
  localStorage.removeItem("user");

  window.location.href = "../index.html";
}
