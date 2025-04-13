/**
 * Überprüft, ob ein Benutzer im lokalen Speicher vorhanden ist, und passt die Sichtbarkeit der Navigations-Elemente an.
 * Wenn kein Benutzer im lokalen Speicher gefunden wird, wird das Navigationselement (div-navigation) ausgeblendet
 * und das Element für die Anmeldung/Registrierung (div-nav-out) angezeigt. Wenn ein Benutzer gefunden wird, wird
 * das Navigationselement eingeblendet und das Element für Anmeldung/Registrierung ausgeblendet.
 *
 * Diese Funktion wird aufgerufen, wenn der DOM vollständig geladen ist.
 *
 * @function checkNavigationVisibility
 * @listens DOMContentLoaded - Wird aufgerufen, sobald der DOM vollständig geladen ist
 * @returns {void} Keine Rückgabe.
 */
function checkNavigationVisibility() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navContainer = document.getElementById("div-navigation");
  const navConOut = document.getElementById("div-nav-out");

  if (!user) {
    navContainer.style.display = "none";
    navConOut.style.display = "flex";
  } else {
    navContainer.style.display = "flex";
    navConOut.style.display = "none";
  }
}
