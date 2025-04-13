/**
 * Initializes the subtask input functionality by setting up event listeners
 * for the add subtask button and input field.
 */
function setupAddSubtaskButton() {
    addEventListeners(".add-subtask-icon", "click", handleAddSubtaskClick);
    addEventListeners("#subtasks", "keydown", handleSubtaskInputKeydown);
    addEventListeners("#subtasks", "input", handleSubtaskInput);

    setupGlobalEnterKeyListener();
}


/**
 * Adds an event listener to a given element if it exists.
 * @param {string} selector - The CSS selector of the element.
 * @param {string} eventType - The event type (e.g., "click", "keydown").
 * @param {Function} handler - The event handler function.
 */
function addEventListeners(selector, eventType, handler) {
    const element = document.querySelector(selector);
    if (element) element.addEventListener(eventType, handler);
}


/**
 * Handles the global "Enter" key event for subtask input fields.
 */
function setupGlobalEnterKeyListener() {
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const activeElement = document.activeElement;

        if ((activeElement.matches("#subtasks") || activeElement.classList.contains("edit-input")) && activeElement.value) {
            activeElement.matches("#subtasks") ? (showSubtaskActions(), saveSubtask()) : saveEditedSubtask(activeElement);
        }
    });
}


/**
 * Saves the edited subtask by updating the list item with the new text.
 * 
 * @param {HTMLInputElement} inputElement - The input field containing the edited subtask text.
 */
function saveEditedSubtask(inputElement) {
    const editedText = inputElement.value.trim();
    if (!editedText) return;

    const li = inputElement.closest(".subtask-item");
    li.innerHTML = getSubtaskHTML(editedText);
}


/**
 * Handles the keydown event on the subtask input field.
 * If the "Enter" key is pressed, a subtask is saved if the input field is not empty.
 * @param {KeyboardEvent} event - The keydown event triggered by the user.
 */
function handleSubtaskInputKeydown(event) {
    const inputField = document.getElementById("subtasks");

    if (event.key === "Enter") {
        event.preventDefault();

        if (inputField && inputField.value.trim()) {
            showSubtaskActions();
            saveSubtask();
        }
    }
}


/**
 * Handles the click event of the add subtask button.
 * If the input field is not empty, it triggers the display of subtask actions.
 */
function handleAddSubtaskClick() {
    const inputField = document.getElementById("subtasks");
    if (inputField.value.trim()) {
        showSubtaskActions();
    }
}


/**
 * Handles the input event on the subtask input field.
 * Shows or hides the add subtask button based on whether the input is empty or not.
 */
function handleSubtaskInput() {
    const inputField = document.getElementById("subtasks");
    const addSubtaskBtn = document.querySelector(".add-subtask-icon");

    if (inputField.value.trim()) {
        addSubtaskBtn.style.display = "none";
        showSubtaskActions();
    } else {
        addSubtaskBtn.style.display = "inline";
        clearSubtask();
    }
}


/**
 * Creates the icons for subtask actions: delete, checkmark, and divider.
 * @returns {Array} An array of icons (delete, divider, and checkmark).
 */
function createSubtaskIcons() {
    const deleteIcon = createIcon("/assets/imgs/clear-subtask.png", "Clear Icon", "clear-icon", clearSubtask);
    const divider = document.createElement("div");
    divider.classList.add("divider");
    const checkIcon = createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", saveSubtask);

    return [deleteIcon, divider, checkIcon];
}


/**
 * Displays the subtask action icons (delete, checkmark, etc.) below the input field.
 */
function showSubtaskActions() {
    const inputField = document.getElementById("subtasks");
    let iconContainer = document.querySelector(".subtask-action");

    if (!iconContainer) {
        iconContainer = document.createElement("div");
        iconContainer.classList.add("subtask-action");

        const icons = createSubtaskIcons();
        iconContainer.append(...icons);
        inputField.parentElement.appendChild(iconContainer);
    } 
}



/**
 * Creates an icon element with the specified source, alt text, class, and event handler.
 * @param {string} src - The source URL of the icon image.
 * @param {string} alt - The alt text for the icon image.
 * @param {string} className - The CSS class to apply to the icon.
 * @param {Function} eventHandler - The function to be called when the icon is clicked.
 * @returns {HTMLImageElement} The created icon element.
 */
function createIcon(src, alt, className, eventHandler) {
    const icon = document.createElement("img");
    icon.src = src;
    icon.alt = alt;
    icon.classList.add(className);
    icon.addEventListener("click", eventHandler);
    return icon;
}


/**
 * Clears the input field and removes the subtask action icons.
 */
function clearSubtask() {
    const inputField = document.getElementById("subtasks");
    const addSubtaskBtn = document.querySelector(".add-subtask-icon");
    
    inputField.value = "";
    
    const iconContainer = document.querySelector(".subtask-action");
    if (iconContainer) iconContainer.remove();

    addSubtaskBtn.style.display = "inline";
}




/**
 * Creates the icons for the actions of each subtask list item: edit, delete, and divider.
 * @returns {HTMLDivElement} The container with the edit, delete icons and divider.
 */
function createSubtaskListIcons() {
    const liActions = document.createElement("div");
    liActions.classList.add("li-actions");

    const editIcon = createIcon("/assets/imgs/edit.svg", "Edit Icon", "edit-icon", editSubtask);
    const divider = document.createElement("span");
    divider.classList.add("divider1");
    const deleteIcon = createIcon("/assets/imgs/delete-black.png", "Delete Icon", "delete-icon", deleteSubtask);

    liActions.append(editIcon, divider, deleteIcon);
    return liActions;
}


/**
 * Creates a list item element for a subtask, including the subtask text and action icons.
 * @param {string} value - The subtask text.
 * @returns {HTMLLIElement} The created list item element.
 */
function createSubtaskElement(value) {
    const li = document.createElement("li");
    li.classList.add("subtask-item");

    const span = document.createElement("span");
    span.classList.add("subtask-text");
    span.textContent = `• ${value}`;

    const liActions = createSubtaskListIcons();
    li.appendChild(span);
    li.appendChild(liActions);
    return li;
}


/**
 * Saves the subtask by adding it to the subtask list and clearing the input field.
 */
function saveSubtask() {
    const inputField = document.getElementById("subtasks");
    const subtaskList = document.getElementById("subtask-list");

    if (inputField.value.trim()) {
        const li = createSubtaskElement(inputField.value);
        subtaskList.appendChild(li);
    }

    clearSubtask();
}


/**
 * Edits a subtask by replacing the text with an input field and enabling edit actions.
 * @param {Event} event - The click event triggered by the edit icon.
 */
function editSubtask(event) {
    const li = event.target.closest("li");
    if (!li) return;

    const span = li.querySelector(".subtask-text");
    const input = createEditInput(span.textContent.trim());
    const editActions = createEditActions(input, li, span);

    li.innerHTML = "";
    li.appendChild(input);
    li.appendChild(editActions);

    input.focus();
}


/**
 * Creates an input element pre-filled with the text to be edited.
 * @param {string} text - The text to be edited.
 * @returns {HTMLInputElement} The created input element.
 */
function createEditInput(text) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = text.replace(/^•\s*/, "");
    input.classList.add("edit-input");
    return input;
}


/**
 * Creates the action buttons for saving or canceling the subtask edit.
 * @param {HTMLInputElement} input - The input element for editing the subtask.
 * @param {HTMLLIElement} li - The list item containing the subtask.
 * @param {HTMLSpanElement} span - The span containing the subtask text.
 * @returns {HTMLDivElement} The container with the edit actions.
 */
function createEditActions(input, li, span) {
    const saveIcon = createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", () => saveEdit(li, input));
    const divider = document.createElement("span");
    divider.classList.add("divider1");
    const cancelIcon = createIcon("/assets/imgs/delete-black.png", "Clear Icon", "clear-icon", () => cancelEdit(li, span, input));

    const newActions = document.createElement("div");
    newActions.classList.add("subtask-actions");
    newActions.append(cancelIcon, divider, saveIcon);
    return newActions;
}


/**
 * Cancels the subtask edit by clearing the input field and removing the list item.
 * @param {HTMLLIElement} li - The list item being edited.
 * @param {HTMLSpanElement} span - The original subtask text element.
 * @param {HTMLInputElement} input - The input field used for editing.
 */
function cancelEdit(li, span, input) {
    input.value = "";
    li.remove();
    span.remove();
}


/**
 * Saves the changes made to a subtask and updates the list item with the new text.
 * @param {HTMLLIElement} li - The list item containing the subtask.
 * @param {HTMLInputElement} input - The input element with the new subtask text.
 */
function saveEdit(li, input) {
    const span = document.createElement("span");
    span.classList.add("subtask-text");
    span.textContent = `• ${input.value.trim()}`;

    const liActions = createSubtaskListIcons();

    li.innerHTML = "";
    li.appendChild(span);
    li.appendChild(liActions);
}


/**
 * Deletes a subtask from the list.
 * @param {Event} event - The click event triggered by the delete icon.
 */
function deleteSubtask(event) {
    const li = event.target.closest("li");
    if (li) li.remove();
}


