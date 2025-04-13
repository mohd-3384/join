// @ts-nocheck

/**
 * Handles the change event on the checkbox and updates the contact selection.
 * 
 * @param {HTMLInputElement} checkbox - The checkbox element that was changed.
 * @param {HTMLElement} img - The image associated with the checkbox.
 * @param {string} name - The name of the contact being toggled.
 */
function handleCheckboxChange(checkbox, img, name) {
    checkbox.addEventListener("change", () => {
        toggleContactSelection(name, checkbox.checked);
        toggleCheckboxVisibility(checkbox, img, checkbox.checked);
    });

    img.addEventListener("click", () => {
        uncheckCheckbox(checkbox, img, name);
    });
}


/**
 * Creates the checkbox container with a checkbox and image for a given contact.
 * 
 * @param {string} name - The name of the contact.
 * @param {string} avatar - The avatar to be displayed for the contact.
 * @returns {HTMLElement} - The container element with the checkbox and image.
 */
function createCheckbox(name, avatar) {
    const container = createElement("div", "contact-checkbox-container");
    const checkbox = createCheckboxElement(name, avatar);
    const img = createImageElement();

    container.appendChild(checkbox);
    container.appendChild(img);

    handleCheckboxChange(checkbox, img, name);

    return container;
}


/**
 * Handles the click event on a contact item and toggles its selection state.
 * 
 * @param {HTMLElement} contactItem - The contact element being clicked.
 * @param {boolean} isPreselected - Whether the contact is preselected.
 * @param {MouseEvent} event - The click event.
 */
function handleContactClick(contactItem, isPreselected, event) {
    if (isPreselected) return removePreselectedContact(contactItem);
    if (clickedInsideCheckbox(event)) return;
    const isSelected = toggleContactVisualState(contactItem);
    toggleContactSelection(contactItem.dataset.name, isSelected);
}


/**
 * Checks if the click event happened on a checkbox or its image.
 * 
 * @param {MouseEvent} event - The click event.
 * @returns {boolean} - True if the target was a checkbox or image, false otherwise.
 */
function clickedInsideCheckbox(event) {
    const target = event.target;
    return target.classList.contains("contact-checkbox") ||
           target.classList.contains("checkbox-image");
}


/**
 * Toggles the visual state of the contact item (selected/unselected).
 * Also updates the checkbox and related elements.
 * 
 * @param {HTMLElement} contactItem - The contact DOM element.
 * @returns {boolean} - The new selection state (true if selected).
 */
function toggleContactVisualState(contactItem) {
    const isSelected = contactItem.classList.toggle("selected");
    const avatar = contactItem.querySelector(".avatar");
    const nameSpan = contactItem.querySelector(".contact-name");
    const checkbox = contactItem.querySelector(".contact-checkbox");
    const checkboxImg = contactItem.querySelector(".checkbox-image");

    avatar?.classList.toggle("selected-avatar", isSelected);
    nameSpan?.classList.toggle("selected-name", isSelected);
    checkboxImg?.classList.toggle("selected-checkbox-image", isSelected);
    checkbox.checked = isSelected;
    toggleCheckboxVisibility(checkbox, checkboxImg, isSelected);

    return isSelected;
}


/**
 * Adds the avatar to the selected contacts container when a contact is checked.
 * 
 * @param {HTMLElement} avatar - The avatar element of the selected contact.
 */
function handleCheckboxChecked(avatar) {
    selectedContactsContainer.appendChild(avatar);
}


/**
 * Removes the avatar from the selected contacts container when a contact is unchecked.
 * 
 * @param {HTMLElement} avatar - The avatar element of the unchecked contact.
 */
function handleCheckboxUnchecked(avatar) {
    selectedContactsContainer.removeChild(avatar);
}


/**
 * Handles the checkbox change event for a contact by updating the avatar in the selected container.
 * 
 * @param {string} name - The name of the contact being toggled.
 */
function handleCheckboxChangeAvatar(name) {
    const avatar = createElement("div", "avatar", getInitials(name));
    checkbox.addEventListener("change", () => {
        toggleContactSelection(name, checkbox.checked);

        if (checkbox.checked) {
            handleCheckboxChecked(avatar, name);
        } else {
            handleCheckboxUnchecked(avatar, name);
        }
    });
}
