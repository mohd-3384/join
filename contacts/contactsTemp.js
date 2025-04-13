/**
 * Generates an HTML template for a list of contacts grouped by an initial letter.
 *
 * @param {string} initial - The initial letter that groups the contacts.
 * @param {Array<Object>} contacts - An array of contact objects.
 * @param {string} contacts[].id - The unique identifier for the contact.
 * @param {string} contacts[].initials - The initials of the contact.
 * @param {string} contacts[].bgcolor - The background color for the contact's name circle.
 * @param {string} contacts[].name - The full name of the contact.
 * @param {string} contacts[].email - The email address of the contact.
 * @returns {string} The HTML string representing the contacts list template.
 */
function contactsListTemplate(initial, contacts) {
    return `
        <div class="contact-container">
            <h3 class="letter-underline">${initial}</h3>
            ${contacts.map(contact => `
                <div class="contact-content" data-id="${contact.id}" data-initial="${contact.initials}">
                    <div class="name-circle" style="background-color: ${contact.bgcolor};">${contact.initials}</div>
                    <div class="name-email">
                        <h4 class="name-in-list">${contact.name}</h4>
                        <h5>${contact.email}</h5>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Generates an HTML template for a list of contacts grouped by an initial letter.
 *
 * @param {string} initial - The initial letter that groups the contacts.
 * @param {Array<Object>} contacts - An array of contact objects.
 * @param {string} contacts[].id - The unique identifier for the contact.
 * @param {string} contacts[].initials - The initials of the contact.
 * @param {string} contacts[].bgcolor - The background color for the contact's name circle.
 * @param {string} contacts[].name - The full name of the contact.
 * @param {string} contacts[].email - The email address of the contact.
 * @returns {string} The HTML string representing the contacts list template.
 */
function contactDetailsTemplate(contact, initial) {
    return `
        <div class="contact-name">
            <div class="name-circle-sec" style="background-color: ${contact.bgcolor};">${initial}</div>
            <div class="name-container">
                <div class="name">${contact.name}</div>
                <div class="btns-container">
                    <button id="edit" onclick="openEditContact('${contact.id}')">
                        <img src="../assets/imgs/edit.svg" alt="" class="edit-icon">
                        Edit
                    </button>
                    <button id="delete" onclick="deleteContact('${contact.id}')">
                        <img src="../assets/imgs/delete.svg" alt="" class="delete-icon">
                        Delete
                    </button>
                </div>
            </div>
        </div>
        <h2>Contact Information</h2>
        <h3>Email</h3>
        <a href="mailto:${contact.email}">${contact.email}</a>
        <h3>Phone</h3>
        <a href="tel:${contact.tel}">${contact.tel}</a>
        <button class="more-btn btn-dark" id="moreBtn" onclick="toggleEditDeleteMenu()">
            <img src="../assets/imgs/more.png" alt="">
        </button>
        <div class="edit-delete-menu" id="editDeleteMenu">
            <button id="editResp" onclick="openEditContact('${contact.id}')">
                <img src="../assets/imgs/edit.svg" alt="" class="edit-icon-resp">
                Edit
            </button>
            <button id="deleteResp" onclick="deleteContact('${contact.id}')">
                <img src="../assets/imgs/delete.svg" alt="" class="delete-icon-resp">
                Delete
            </button>
        </div>
    `;
}
