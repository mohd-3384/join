// @ts-nocheck

/**
 * Map to store all contacts with their names as keys and associated details as values.
 */
const allContacts = new Map();

/**
 * Set to store selected contacts.
 */
const selectedContacts = new Map();


/**
 * Fetches the contacts data from an external source and processes it into a usable format.
 * 
 * @throws {Error} Throws an error if the HTTP request fails or the data is invalid.
 */
async function fetchAndRenderContacts(listId) {
    try {
        const response = await fetch('https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/users.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (!data) throw new Error("Keine Nutzerdaten gefunden.");
        processContactsData(data);
        listId ? renderContactsList(listId) : alert("Fehler: Ungültige ListID. Bitte versuchen Sie es später noch einmal.");
    } catch (error) {
        alert("Es gab einen Fehler beim Laden der Kontaktdaten. Bitte versuchen Sie es später noch einmal.");
        throw error;
    }
}


/**
 * Processes the raw contacts data and stores it in the `allContacts` map.
 * @param {Object} data - The raw contacts data.
 */
function processContactsData(data) {
    allContacts.clear();
    Object.values(data).forEach(user => {
        const name = capitalizeName(user.name);
        const bgcolor = user.bgcolor;
        allContacts.set(name, {
            name,
            avatar: {
                initials: getInitials(name),
                bgcolor: bgcolor || "#ccc"
            }
        });
    });
}


/**
 * Gets the initials of preselected contacts if the edit modal is open.
 * @returns {string[]} List of preselected initials.
 */
function getPreselectedInitials() {
    if (typeof getPreselectedContacts !== "function") return [];
    return getPreselectedContacts();
}


/**
 * Toggles the selection state of a contact and updates the display of selected contacts.
 * @param {string} name - The name of the contact.
 */
function toggleContactSelection(name) {
    const contact = allContacts.get(name);
    if (!contact) return;
    if (selectedContacts.has(name)) {
        selectedContacts.delete(name);
    } else {
        const contact = allContacts.get(name);
        if (contact) selectedContacts.set(name, contact);
    }
    updateSelectedContactsDisplay("selected-contacts-container");
    updateSelectedContactsDisplay("edit-selected-contacts-container");
}