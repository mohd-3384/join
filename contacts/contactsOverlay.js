/**
 * Open the new contact overlay.
 *
 * This function adds the "overlay" and "active" classes to the add contact overlay
 * and sets up an event listener to prevent clicks on the add contact button from 
 * closing the overlay.
 */
function openAddContact() {
    addContactOverlay.classList.add("overlay", "active");
    addContactOverlay.classList.remove("closing");
    addContact.addEventListener('click', (e) => {
        e.stopPropagation()
    })
}

/**
 * Close the new contact overlay.
 *
 * This function adds the "closing" class to the add contact overlay and the 
 * "closing-to-right" class to the add contact button. After a timeout, it removes 
 * the overlay classes to hide it.
 */
function closeAddContact() {
    addContactOverlay.classList.add("closing");
    addContact.classList.add("closing-to-right");
    setTimeout(() => {
        addContactOverlay.classList.remove("overlay", "active", "closing");
        addContact.classList.remove("closing-to-right");
    }, 500);
}

/**
 * Open the edit contact overlay.
 *
 * This function fetches the contact data based on the provided contact ID,
 * populates the edit fields with the contact's information, and opens the 
 * edit contact overlay.
 *
 * @param {string} contactId - The unique identifier for the contact to be edited.
 * @returns {Promise<void>} A promise that resolves when the overlay is opened.
 */
async function openEditContact(contactId) { // console.log("Aufgerufene contactId:", contactId);
    try {
        const response = await fetch(`${BASE_URL}${contactId}.json`);
        const contact = await response.json();
        document.getElementById("editContactName").value = contact.name;
        document.getElementById("editContactEmail").value = contact.email;
        document.getElementById("editContactPhone").value = contact.tel;
        document.getElementById("editContactOverlay").classList.add("overlay", "active");
        document.getElementById("editContactOverlay").classList.remove("closing");
        document.getElementById("editContact").addEventListener("click", (e) => e.stopPropagation());
        document.getElementById("editContact").setAttribute("data-contact-id", contactId);
    } catch (error) {
        console.error("Fehler beim Laden der Kontaktdaten:", error);
    }
}

/**
 * Close the edit contact overlay.
 *
 * This function adds the "closing" class to the edit contact overlay and the 
 * "closing-to-right" class to the edit contact button. After a timeout, it removes 
 * the overlay classes to hide it.
 */
function closeEditContact() {
    editContactOverlay.classList.add("closing");
    editContact.classList.add("closing-to-right");
    setTimeout(() => {
        editContactOverlay.classList.remove("overlay", "active", "closing");
        editContact.classList.remove("closing-to-right");
    }, 500);
}

/**
 * Check the window size and adjust the visibility of the contacts list accordingly.
 *
 * If the window width is less than or equal to 1000 pixels, it hides the contacts 
 * list if the details view is active. Otherwise, it shows the contacts list.
 */
function checkWindowSize() {
    if (window.innerWidth <= 1000) {
        if (document.getElementById('contactsDetails').classList.contains('active')) {
            document.getElementById('contacts').classList.add('hidden');
        } else {
            document.getElementById('contacts').classList.remove('hidden');
        }
    } else {
        document.getElementById('contacts').classList.remove('hidden');
    }
}
window.addEventListener('resize', checkWindowSize);
checkWindowSize();

/**
 * Toggle the visibility of the edit/delete menu.
 *
 * If the menu is not currently active, it adds the "active" class and displays the 
 * menu. It also sets up an event listener to close the menu if a click occurs outside 
 * of it. If the menu is already active, it closes the menu.
 */
function toggleEditDeleteMenu() {
    const menu = document.getElementById('editDeleteMenu');
    if (!menu.classList.contains('active')) {
        menu.classList.add('active');
        menu.style.display = 'flex';
        setTimeout(() => {
            document.addEventListener('click', closeMenuOnClickOutside);
        }, 10);
    } else {
        closeMenu();
    }
}

/**
 * Close the edit/delete menu.
 *
 * This function removes the "active" class from the edit/delete menu and hides it 
 * after a timeout.
 */
function closeMenu() {
    const menu = document.getElementById('editDeleteMenu');
    menu.classList.remove('active');
    setTimeout(() => {
        menu.style.display = 'none';
    }, 500);
    document.removeEventListener('click', closeMenuOnClickOutside);
}

/**
 * Close the edit/delete menu if a click occurs outside of it.
 *
 * @param {MouseEvent} event - The click event to check.
 */
function closeMenuOnClickOutside(event) {
    const menu = document.getElementById('editDeleteMenu');
    const moreBtn = document.getElementById('moreBtn');
    if (!menu.contains(event.target) && !moreBtn.contains(event.target)) {
        closeMenu();
    }
}