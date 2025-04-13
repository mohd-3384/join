const BASE_URL = 'https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/contacts/';

/**
 * Fetches contacts from the backend, formats them, and returns an array.
 * @param {string} url - The base URL to fetch contacts from (without `.json`).
 */
async function fetchContacts(url) {
    try {
        const response = await fetch(url + '.json');
        const contacts = await response.json();
        return Object.entries(contacts).map(([id, { bgcolor, name, email, tel }]) => ({
            id, bgcolor, name, email, tel, initial: getInitials(name)
        }));
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
    }
}


/**
 * Fetches, groups, sorts, and renders contacts, then attaches event listeners.
 * @returns {Promise<void>} A promise that resolves when contacts are rendered.
 */
async function renderContacts() {
    try {
        const contactsArray = await fetchContacts(BASE_URL) || [];
        const contactList = document.getElementById("contactList");
        contactList.innerHTML = "";
        const sortedGroups = groupAndSortContacts(contactsArray);
        Object.keys(sortedGroups).sort().forEach(initial => {
            contactList.innerHTML += contactsListTemplate(initial, sortedGroups[initial]);
        });
        attachContactEventListeners();
    } catch (error) {
        console.error("Error rendering contacts:", error);
    }
}


/**
 * Groups contacts by first letter and sorts them alphabetically within each group.
 * @param {Array<Object>} contacts - The array of contact objects.
 */
function groupAndSortContacts(contacts) {
    return contacts.reduce((acc, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push({ ...contact, initials: getInitials(contact.name) });
        acc[firstLetter].sort((a, b) => a.name.localeCompare(b.name));
        return acc;
    }, {});
}


/**
 * Attaches event listeners to each contact to fetch and display details.
 */
function attachContactEventListeners() {
    document.querySelectorAll('.contact-content').forEach(contactElement => {
        contactElement.addEventListener('click', () => {
            const contactId = contactElement.dataset.id;
            fetchContactDetails(contactId, getInitials(contactElement.querySelector('.name-in-list').innerText));
            toggleDetailsContact(contactId);
        });
    });
}


/**
 * Fetches and displays detailed information for a specific contact.
 * @param {string} contactId - The unique identifier for the contact whose details are to be fetched.
 * @param {string} initial - The initials of the contact, used for display purposes.
 * @returns {Promise<void>} A promise that resolves when the contact details have been rendered.
 * @throws {Error} Throws an error if the fetch operation fails or if the response is not valid JSON.
 */
async function fetchContactDetails(contactId) {
    try {
        const response = await fetch(`${BASE_URL}${contactId}.json`);
        const contact = await response.json();
        if (contact) {
            const initial = getInitials(contact.name);  // Initialen immer berechnen
            const contactDetails = document.getElementById("contentDetails");
            contactDetails.innerHTML = contactDetailsTemplate(contact, initial);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontaktinformationen:", error);
    }
}


/**
 * Toggles the display of detailed information for a specific contact.
 * Highlights the selected contact and manages the visibility of the details section.
 * @param {string} contactId - The unique identifier for the contact.
 * @param {string} initial - The initials of the contact, used for display purposes.
 */
function toggleDetailsContact(contactId, initial) {
    const contactContent = document.querySelector(`.contact-content[data-id="${contactId}"]`);
    const isActive = contactContent.classList.contains('bgc-darkblue');
    resetAllContacts();
    if (!isActive) {
        highlightSelectedContact(contactContent);
        document.getElementById('contentDetails').classList.add('active');
        fetchContactDetails(contactId, initial);
    } else {
        document.getElementById('contentDetails').classList.remove('active');
    }
    toggleMobileView();
}


/**
 * Removes highlighting from all contacts and resets styles.
 */
function resetAllContacts() {
    document.querySelectorAll('.contact-content').forEach(contact => {
        contact.classList.remove('bgc-darkblue');
        contact.querySelector('.name-in-list').classList.remove('color-white');
        contact.querySelector('.name-circle').classList.remove('border-white');
    });
}


/**
 * Highlights the selected contact by changing its background and text color.
 * @param {Element} contactContent - The selected contact element.
 */
function highlightSelectedContact(contactContent) {
    contactContent.classList.add('bgc-darkblue');
    contactContent.querySelector('.name-in-list').classList.add('color-white');
    contactContent.querySelector('.name-circle').classList.add('border-white');
}


/**
 * Adjusts visibility of contact list and details based on screen size.
 */
function toggleMobileView() {
    if (window.innerWidth <= 1000) {
        document.getElementById("contacts").classList.add('hidden');
        document.getElementById("contactsDetails").classList.add('active');
    } else {
        document.getElementById("contacts").classList.remove('hidden');
    }
}


/**
 * Handles new contact form submission, validates input, and saves contact data.
 * @param {Event} event - The form submission event.
 */
async function saveNewContact(event) {
    event.preventDefault();
    const { name, email, phone } = getTrimmedInputs();
    if (!validateInputs(name, email, phone)) return;
    let newContact = { name, email, tel: phone, bgcolor: getRandomColor(), initials: getInitials(name) };
    try {
        const contactId = await saveContactToDatabase(newContact);
        newContact.id = contactId;
        await updateUIAfterSave(contactId, newContact);
    } catch (error) {
        console.error("Error saving contact:", error);
    }
}


/**
 * Retrieves and trims input values from the form.
 * @returns {Object} The input values (name, email, phone).
 */
function getTrimmedInputs() {
    return {
        name: document.getElementById("newContactName").value.trim(),
        email: document.getElementById("newContactEmail").value.trim(),
        phone: document.getElementById("newContactPhone").value.trim()
    };
}


/**
 * Validates input fields and toggles error messages.
 * @param {string} name - The name input value.
 * @param {string} email - The email input value.
 * @param {string} phone - The phone input value.
 * @returns {boolean} True if valid, otherwise false.
 */
function validateInputs(name, email, phone) {
    const valid = [
        toggleError("nameError", name.length >= 3),
        toggleError("emailError", /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)),
        toggleError("telError", /^\+?[0-9\s-]+$/.test(phone))
    ].every(Boolean);
    if (!valid) console.log("Form contains errors! Contact not saved.");
    return valid;
}


/**
 * Toggles error messages based on validity.
 * @param {string} elementId - The ID of the error message element.
 * @param {boolean} isValid - Whether the input is valid.
 * @returns {boolean} The validity status.
 */
function toggleError(elementId, isValid) {
    document.getElementById(elementId).classList.toggle("d-none", isValid);
    return isValid;
}


/**
 * Saves a new contact to the database and returns the assigned contact ID.
 * @param {Object} contact - The contact object.
 * @returns {Promise<string>} The contact ID assigned by the database.
 */
async function saveContactToDatabase(contact) {
    const response = await fetch(BASE_URL + '.json', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact)
    });
    const data = await response.json();
    return data.name;
}


/**
 * Updates the UI after successfully saving a contact.
 * @param {string} contactId - The contact ID.
 * @param {Object} contact - The updated contact object.
 */
async function updateUIAfterSave(contactId, contact) {
    await fetch(`${BASE_URL}${contactId}.json`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact)
    });
    await renderContacts();
    closeAddContact();
    ["newContactName", "newContactEmail", "newContactPhone"].forEach(id => document.getElementById(id).value = "");
    document.getElementById("successAlert").classList.add("success-animation");
    setTimeout(() => document.getElementById("successAlert").classList.remove("success-animation"), 5000);
}


/**
 * Generates a random hexadecimal color code.
 * @returns {string} A string representing a random color in hexadecimal format (e.g., "#etc").
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 6; i > 0; --i) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/**
 * Handles the editing of a contact, updates it in the database, and refreshes the UI.
 * @param {Event} event - The form submission event.
 */
async function saveEditedContact(event) {
    event.preventDefault();
    const contactId = document.getElementById("editContact").getAttribute("data-contact-id");
    const updatedContact = await getUpdatedContactData(contactId);
    if (!updatedContact) return;
    try {
        await updateContactInDatabase(contactId, updatedContact);
        await finalizeEditedContact(contactId, updatedContact.name);
    } catch (error) {
        console.error("Error saving contact:", error);
    }
}


/**
 * Retrieves updated contact data from the form and merges it with existing data.
 * @param {string} contactId - The unique identifier of the contact.
 * @returns {Promise<Object|null>} The updated contact object or null if fetch fails.
 */
async function getUpdatedContactData(contactId) {
    try {
        const response = await fetch(`${BASE_URL}${contactId}.json`);
        const existingContact = await response.json();
        return {
            ...existingContact,
            name: document.getElementById("editContactName").value.trim(),
            email: document.getElementById("editContactEmail").value.trim(),
            tel: document.getElementById("editContactPhone").value.trim()
        };
    } catch (error) {
        console.error("Error fetching contact data:", error);
        return null;
    }
}


/**
 * Updates the contact entry in the database.
 * @param {string} contactId - The contact ID.
 * @param {Object} updatedContact - The updated contact object.
 */
async function updateContactInDatabase(contactId, updatedContact) {
    await fetch(`${BASE_URL}${contactId}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContact),
    });
}


/**
 * Finalizes the editing process by refreshing the UI and showing a success message.
 * @param {string} contactId - The contact ID.
 * @param {string} updatedName - The updated contact name.
 */
async function finalizeEditedContact(contactId, updatedName) {
    await renderContacts();
    closeEditContact();
    fetchContactDetails(contactId, getInitials(updatedName));
    const successAlert = document.getElementById("successEditAlert");
    successAlert.classList.add("success-animation");
    setTimeout(() => successAlert.classList.remove("success-animation"), 5000);
}


/**
 * Deletes a contact from the database and updates the UI.
 * @param {string} contactId - The unique identifier of the contact.
 */
async function deleteContact(contactId) {
    try {
        await deleteContactFromDatabase(contactId);
        await updateUIAfterDeletion();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}


/**
 * Deletes a contact from the database.
 * @param {string} contactId - The unique identifier of the contact.
 */
async function deleteContactFromDatabase(contactId) {
    await fetch(`${BASE_URL}${contactId}.json`, { method: "DELETE" });
    console.log(`Kontakt ${contactId} erfolgreich gelöscht`);
}


/**
 * Updates the UI after a contact is deleted.
 * @returns {Promise<void>}
 */
async function updateUIAfterDeletion() {
    await renderContacts();
    document.getElementById("contactsDetails").classList.remove("active");
    document.getElementById("contentDetails").innerHTML = "";
    if (window.innerWidth <= 1000) {
        document.getElementById("contacts").classList.remove("hidden");
    }
    const successAlert = document.getElementById("successDeleteAlert");
    successAlert.classList.add("success-animation");
    setTimeout(() => successAlert.classList.remove("success-animation"), 5000);
}


/**
 * Toggles the visibility of the contact list and details on smaller screens. On screens with a width of 1000px or less, this function hides the contact list and shows the details when the back button is clicked.
 * @function toggleBack
 * @description Toggles the visibility of the contact list and details on smaller screens.
 */
function toggleBack() {
    if (window.innerWidth <= 1000) {
        contacts.classList.remove('hidden');
        contactsDetails.classList.remove('active');
    }
}


/**
 * Generates initials from a given name.
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials in uppercase (e.g., "JD" for "John Doe").
 */
function getInitials(name) {
    if (!name || typeof name !== "string") {
        return "??";
    }
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
        return nameParts[0][0].toUpperCase();
    }
}