/**
 * Returns the initials of a given name. If the name is not provided, returns "??".
 * The initials are derived from the first letter of each part of the name (split by spaces).
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The initials of the name or "??" if no name is provided.
 */
function getInitials(name) {
    if (!name) return "??";  // 
    const parts = name.split(" ");
    return parts.map(part => part[0]).join("").toUpperCase();
}


/**
 * Formats a text string by removing leading numbers, bullet points, and underscores,
 * and capitalizing the first letter of each word.
 * @param {string} text - The text to be formatted.
 * @returns {string} The formatted text with extra spaces removed and each word capitalized.
 */
function formatText(text) {
    return text
        .trim()
        .replace(/^\d+\.\s*|\*|\•|\-/g, "")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}


/**
 * Capitalizes the first letter of each word in a given name.
 * @param {string} name - The name to capitalize.
 * @returns {string} The name with each word capitalized.
 */
function capitalizeName(name) {
    return name
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


/**
 * Creates a new HTML element with an optional class and inner text.
 * @param {string} tag - The type of the HTML element to create (e.g., "div", "span").
 * @param {string} [className=""] - An optional class to add to the element.
 * @param {string} [text=""] - The optional inner text to set for the element.
 * @returns {HTMLElement} The newly created element.
 */
function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (text) element.innerText = text;
    return element;
}


/**
 * Creates an avatar element for a contact with the initials and background color.
 * @param {string} name - The name of the contact, used to generate initials.
 * @param {string} bgcolor - The background color for the avatar.
 * @returns {HTMLElement} The avatar element.
 */
function createAvatar(name, bgcolor, initials = null) {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.style.backgroundColor = bgcolor;
    avatar.textContent = initials || getInitials(name);
    return avatar;
}


/**
 * Creates a checkbox input element for selecting a contact.
 * @param {string} name - The name of the contact, used as a data attribute.
 * @param {string} avatar - The avatar of the contact, used as a data attribute.
 * @returns {HTMLElement} The checkbox input element.
 */
function createCheckboxElement(name, avatar) {
    const checkbox = createElement("input", "contact-checkbox");
    checkbox.type = "checkbox";
    checkbox.dataset.contactName = name;
    checkbox.dataset.contactAvatar = avatar;
    return checkbox;
}


/**
 * Creates an image element representing a checkbox check mark.
 * The image is initially hidden and styled with specific classes.
 * @returns {HTMLImageElement} The created and styled image element.
 */
function createImageElement() {
    const img = createElement("img", "checkbox-image");
    img.src = "/assets/imgs/check-mark.png";
    img.alt = "Checkbox image";
    img.classList.add("checkbox-image-small");
    img.style.display = "none";
    return img;
}


/**
 * Displays an error message next to the input field identified by the selector.
 * Highlights the field and shows the error message.
 * @param {string} selector - The CSS selector identifying the field to display the error for.
 * @param {string} message - The error message to display.
 */
function showError(selector, message) {
    let field = document.querySelector(selector);
    if (!field) return;
    let errorMsg = document.querySelector(`.error-message[data-error-for="${field.id}"]`);
    errorMsg && (errorMsg.textContent = message, errorMsg.style.display = "block");
    const elementToHighlight = selector === "#selected-category" ? document.querySelector(".dropdown-btn") : field;
    elementToHighlight.classList.add("error");
    field.addEventListener("input", () => clearError(selector));
    field.addEventListener("change", () => clearError(selector));
}


/**
 * Clears the error message and removes the error class from the input field identified by the selector.
 * @param {string} selector - The CSS selector identifying the field to clear the error from.
 */
function clearError(selector) {
    let field = document.querySelector(selector);
    if (!field) return;
    let errorMsg = document.querySelector(`.error-message[data-error-for="${field.id}"]`);
    errorMsg?.classList.contains("error-message") && (errorMsg.style.display = "none");
    const elementToHighlight = selector === "#selected-category" ? document.querySelector(".dropdown-btn") : field;
    elementToHighlight.classList.remove("error");
}


/**
 * Attaches a listener to show an error message when the field is interacted with.
 * Highlights the field and shows the error message if it is empty.
 * @param {string} selector - The CSS selector identifying the field.
 * @param {string} message - The error message to display.
 */
function attachErrorOnInteraction(selector, message) {
    const field = document.querySelector(selector);
    if (!field) return;
    field.addEventListener("focus", () => {
        if (field.value.trim() === "") {
            showError(selector, message);
        }
    });
    field.addEventListener("blur", () => {
        clearError(selector); // Clear error when leaving the field
    });
}


/**
 * Sets up validation for required input fields.
 */
function setupFieldValidation() {
    attachErrorOnInteraction("#task-name", "Task name is required");
    attachErrorOnInteraction("#due-date", "Due date is required");
    attachErrorOnInteraction("#selected-category", "Category selection is required");
}


/**
 * Resets the value of a date input field and removes the 'has-value' class.
 * @param {HTMLInputElement} input - The date input element to reset.
 */
function resetDateInput(input) {
    input.value = '';
    input.classList.remove('has-value');
}


/**
 * Toggles the visibility of a checkbox and an associated image based on the checkbox state.
 * @param {HTMLInputElement} checkbox - The checkbox element to toggle.
 * @param {HTMLImageElement} img - The image element associated with the checkbox.
 * @param {boolean} isChecked - The current checked state of the checkbox.
 */
function toggleCheckboxVisibility(checkbox, img, isChecked) {
    img.style.display = isChecked ? "block" : "none";
    checkbox.style.display = isChecked ? "none" : "block";
}


/**
 * Unchecks a checkbox, hides the associated image, and triggers a change event.
 * @param {HTMLInputElement} checkbox - The checkbox element to uncheck.
 * @param {HTMLImageElement} img - The image element associated with the checkbox.
 * @param {string} name - The name associated with the checkbox for logging purposes.
 */
function uncheckCheckbox(checkbox, img) {
    checkbox.checked = false;
    img.style.display = "none";
    checkbox.style.display = "block";
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(changeEvent);
}


/**
 * Helper function to create an element with optional text content.
 */
function createElement(tag, className, text = "") {
    const element = document.createElement(tag);
    element.classList.add(className);
    if (text) element.textContent = text;
    return element;
}


/**
 * Generates the HTML structure for a subtask list item.
 * @param {string} editedText - The text content of the subtask.
 * @returns {string} The HTML string for the subtask list item.
 */
function getSubtaskHTML(editedText) {
    return `
        <span class="subtask-text">• ${editedText}</span>
        <div class="li-actions">
            <img src="/assets/imgs/edit.svg" class="edit-icon" alt="Edit Icon" onclick="editSubtask(event)">
            <span class="divider1"></span>
            <img src="/assets/imgs/delete-black.png" class="delete-icon" alt="Delete Icon" onclick="deleteSubtask(event)">
        </div>
    `;
}


/**
 * Adds a click event listener to all `.assignment-btn` buttons to toggle the visibility of the contacts list.
 */
function setupAssignmentButtons() {
    document.querySelectorAll(".assignment-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const containerId = button.getAttribute("data-container-id");
            const listId = button.getAttribute("data-list-id");
            const selectedContainerId = button.getAttribute("data-selected-id");
            if (!listId) return;
            toggleContacts(event, containerId, listId, selectedContainerId);
        });
    });
}


/**
 * Updates the dropdown icon to indicate whether the contacts list is open or closed.
 * @param {boolean} isOpen - If true, the icon indicates that the contacts list is open; otherwise, it indicates closed.
 */
function updateDropdownIcon(isOpen, iconElement) {
    if (iconElement) {
        iconElement.src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
    }
}


/**
 * Creates a contact element to be displayed in the contacts list.
 * @param {string} name - The name of the contact.
 * @param {string} bgcolor - The background color associated with the contact.
 * @param {boolean} isPreselected - Whether the contact is preselected.
 * @returns {HTMLElement} The contact element.
 */
function createContactElement(name, isPreselected = false) {
    const contactDiv = createElement("div", "contact-item");
    contactDiv.setAttribute("data-name", name);
    const contact = allContacts.get(name.trim());
    const avatarData = contact?.avatar || {
        initials: getInitials(name),
        bgcolor: getRandomColor()
    };
    const avatar = createAvatar(name, avatarData.bgcolor, avatarData.initials);
    const nameSpan = createElement("span", "contact-name", name);
    const checkbox = createCheckbox(name);
    contactDiv.append(avatar, nameSpan, checkbox);
    return contactDiv;
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
 * Changes visibility depending on class
 * @param {HTMLElement} element - Das DOM-Element, dessen Klassen geändert werden sollen.
 * @param {boolean} visible - Gibt an, ob das Element sichtbar sein soll.
 */
function setVisibility(element, visible) {
    if (!element) return;
    if (visible) {
        element.classList.add("visible");
        element.classList.remove("hidden");
    } else {
        element.classList.add("hidden");
        element.classList.remove("visible");
    }
}


/**
 * Creates a single contact avatar element.
 * 
 * @param {Object} contact - The contact object containing name and bgcolor.
 * @returns {HTMLElement} The avatar element.
 */
function createContactAvatar(contact) {
    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar", "avatar-board-card");
    avatarDiv.style.backgroundColor = contact.bgcolor;
    avatarDiv.textContent = getInitials(contact.name);
    return avatarDiv;
}


/**
 * Creates an avatar element for additional contacts.
 * @param {number} count - Number of additional contacts.
 * @returns {HTMLElement} The additional contacts avatar element.
 */
function createAdditionalContactsAvatar(count) {
    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar", "additional-contacts");
    avatarDiv.style.backgroundColor = "#ccc";
    avatarDiv.textContent = `+${count}`;
    return avatarDiv;
}