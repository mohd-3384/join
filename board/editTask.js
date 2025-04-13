
/**
 * Sets the priority button in the edit task modal.
 * @param {Object} priority - The priority object.
 * @param {string} priority.priorityText - The priority level ("urgent", "medium", "low").
 */
function setEditPriority(priority) {
    setTimeout(() => {
        if (!isValidPriority(priority)) return;
        const priorityText = priority.priorityText.toLowerCase().trim();
        resetPriorityButtons();
        activatePriorityButton(priorityText);
    }, 10);
}


/**
 * Checks if the provided priority object is valid.
 * @param {Object} priority - The priority object.
 * @returns {boolean} True if valid, otherwise false.
 */
function isValidPriority(priority) {
    if (!priority || !priority.priorityText) {
        return false;
    }
    return true;
}


/**
 * Resets all priority buttons by removing active state and resetting styles.
 */
function resetPriorityButtons() {
    document.querySelectorAll("#editTaskModal .btn-switch").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "#000";
    });
}


/**
 * Activates the selected priority button and applies styles.
 * @param {string} priorityText - The priority level ("urgent", "medium", "low").
 */
function activatePriorityButton(priorityText) {
    const button = document.getElementById(`edit-${priorityText}`);
    if (!button) return;
    button.classList.add("active");
    button.setAttribute("data-active", "true");
    setPriorityStyle(button, priorityText);
}


/**
 * Sets the appropriate background and text color for the priority button.
 * @param {HTMLElement} button - The priority button element.
 * @param {string} priorityText - The priority level ("urgent", "medium", "low").
 */
function setPriorityStyle(button, priorityText) {
    const styles = {
        urgent: { bg: "#ff3b30", color: "#fff" },
        medium: { bg: "#ffcc00", color: "#000" },
        low: { bg: "#34c759", color: "#fff" }
    };
    button.style.backgroundColor = styles[priorityText]?.bg || "";
    button.style.color = styles[priorityText]?.color || "";
}


/**
 * Retrieves the selected priority or returns the default if none is selected.
 * @returns {{ priorityText: string, priorityImage: string }} The selected or default priority.
 */
function getSelectedPriority() {
    const button = document.querySelector(".btn-switch.active");
    const priorityText = button ? button.innerText.trim() : "Medium";
    return {
        priorityText,
        priorityImage: getPriorityImage(priorityText, !button)
    };
}


/**
 * Maps priority levels to their corresponding images.
 * @param {string} priorityText - The priority level ("Low", "Medium", "Urgent").
 * @param {boolean} isDefault - Whether the default priority is being used.
 * @returns {string} The image path for the given priority.
 */
function getPriorityImage(priorityText, isDefault) {
    const images = {
        Low: "/assets/imgs/low.png",
        Medium: "/assets/imgs/medium.png",
        Urgent: "/assets/imgs/urgent.png"
    };
    const formattedPriority = priorityText.charAt(0).toUpperCase() + priorityText.slice(1).toLowerCase();
    return images[formattedPriority] || (isDefault ? "/assets/imgs/medium.png" : "");
}


let subtasksArray = []; // Global variable to store the subtasks
/**
 * Sets the subtask list in the `editTaskModal` with UI updates.
 * @param {Array} subtasks - The list of subtasks.
 */
function setEditSubtasks(subtasks) {
    subtasksArray = subtasks;
    const list = document.getElementById("edit-subtask-list");
    list.innerHTML = subtasks.map((subtask, index) => subtaskTemplate(subtask, index)).join("");
}


/**
 * Retrieves the edited subtasks while preserving their completed status.
 * @returns {Array<Object>} Updated subtask list with correct completion status.
 */
function getEditedSubtasks() {
    return Array.from(document.querySelectorAll("#edit-subtask-list .subtask-item")).map((li) => {
        const textElement = li.querySelector(".subtask-text");
        const text = textElement ? textElement.textContent.replace("• ", "").trim() : "Unnamed Subtask";
        const existingSubtask = subtasksArray.find(sub => sub.text === text);
        return {
            text,
            completed: existingSubtask ? existingSubtask.completed : false
        };
    });
}


/**
 * Adds a new subtask to the UI (not yet in the backend!).
 */
function addNewSubtask() {
    const inputField = document.getElementById("edit-subtasks");
    const subtaskText = inputField.value.trim();
    if (!subtaskText) return;
    subtasksArray.push({ text: subtaskText, completed: false });
    renderSubtasks();
    inputField.value = "";
}


/**
 * Updates the UI for the subtask list in the `editTaskModal`.
 */
function renderSubtasks() {
    setEditSubtasks(subtasksArray);
}


/**
 * Edits an existing subtask in the `editTaskModal` by replacing the text with an input field.
 * @param {number} index - Index of the subtask in `subtasksArray`
 */
function editSubtaskInEditModal(index) {
    const subtaskItem = document.querySelector(`#subtask-${index}`);
    if (!subtaskItem) return;
    const inputField = createSubtaskInput(subtaskItem);
    const saveIcon = subtaskItem.querySelector(".save-subtask-icon");
    saveIcon.classList.remove("hidden");
    saveIcon.addEventListener("click", () => saveEditedSubtask(index, inputField.value));
    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const currentValue = event.target.value?.trim();
            if (currentValue) saveEditedSubtask(index, currentValue);
        }
    });
}


/**
 * Creates an input field for editing a subtask and replaces the existing text.
 * @param {HTMLElement} subtaskItem - The subtask element to be edited.
 * @returns {HTMLInputElement} The created input field.
 */
function createSubtaskInput(subtaskItem) {
    const subtaskTextElement = subtaskItem.querySelector(".subtask-text");
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = subtaskTextElement.textContent.replace("• ", "").trim();
    inputField.classList.add("edit-subtask-input");
    subtaskItem.replaceChild(inputField, subtaskTextElement);
    inputField.focus();
    return inputField;
}


/**
 * Saves the changed subtask and shows the point again in the UI.
 * @param {number} index - Index of the Subtask
 * @param {string} newText - The new text of the subtask
 */
function saveEditedSubtask(index, newText) {
    if (typeof newText !== "string" || !newText.trim()) return;
    subtasksArray[index].text = newText.trim();
    renderSubtasks();
}


/**
 * Deletes a subtask from `subtasksArray`.
 * @param {number} index - Index of the Subtask
 */
function deleteSubtaskInEditModal(index) {
    subtasksArray.splice(index, 1);
    setEditSubtasks(subtasksArray);
}


/**
 * Updates the avatar display in the edit task modal with up to 4 contacts and a "+X" avatar if needed.
 * @param {Array<Object>} contacts - The assigned contacts.
 */
function setEditAssignedContacts(contacts) {
    const container = document.getElementById("edit-selected-contacts-container");
    container.innerHTML = generateLimitedAvatarHTML(contacts);
}


/**
 * Retrieves all selected contacts from the edit modal.
 * @returns {Array<{name: string, avatar: {initials: string, bgcolor: string}}>}
 */
let lastAssignedContacts = []; // ganz oben im Scope von editTask.js

function getEditedAssignedContacts() {
    const contacts = Array.from(selectedContacts.values());
    return contacts.length > 0 ? contacts : lastAssignedContacts;
}


/**
 * Generates HTML string for up to 4 contact avatars and optional "+X" avatar.
 * @param {Array<Object>} contacts - The contacts array.
 * @returns {string} HTML string with avatar elements.
 */
function generateLimitedAvatarHTML(contacts) {
    const maxVisible = 4;
    const visibleContacts = contacts.slice(0, maxVisible);
    const extraCount = contacts.length - maxVisible;
    const avatarHTML = visibleContacts.map(createContactAvatarHTML).join("");
    const extraAvatar = extraCount > 0 ? createExtraAvatarHTML(extraCount) : "";
    return avatarHTML + extraAvatar;
}


/**
 * Builds a contact object with name and avatar data from allContacts.
 * @param {string} name - The contact's name.
 * @returns {{name: string, avatar: {initials: string, bgcolor: string}} | null}
 */
function buildContactObject(name) {
    return allContacts.get(name.trim()) || null;
}


/**
 * Extracts contact details from a contact element.
 * @param {HTMLElement} contactElement - The contact element in the UI.
 * @returns {Object} Contact details including name and avatar.
 */
function parseContactElement(contactElement) {
    const initials = contactElement.textContent.trim();
    const bgcolor = contactElement.style.backgroundColor.startsWith("rgb")
        ? rgbToHex(contactElement.style.backgroundColor)
        : contactElement.style.backgroundColor;
    const name = contactElement.getAttribute("data-name") || findContactName(initials);
    return { avatar: { bgcolor, initials }, name };
}


/**
 * Finds a contact name in allContacts by matching initials.
 * @param {string} initials - The initials to match.
 * @returns {string} The full name or "Unknown User" if not found.
 */
function findContactName(initials) {
    if (!allContacts || allContacts.size === 0) return "Unknown User";
    const contact = [...allContacts.values()].find(c => getInitials(c.name) === initials);
    return contact ? contact.name : "Unknown User";
}


/**
 * Converts an RGB color to HEX.
 * @param {string} rgb -The RGB color in the format "rgb(r, g, b)".
 * @returns {string} The HEX color in the format "#RRGGBB".
 */
function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return "#CCCCCC";
    return `#${match.slice(0, 3).map(x => Number(x).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}


/**
 * Displays a confirmation message when a task is successfully updated.
 * The message appears temporarily and fades out after a short duration.
 */
function showEditConfirmation() {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.classList.add("task-edit-confirmation");
    confirmationDiv.innerText = "Task successfully updated";
    document.body.appendChild(confirmationDiv);
    setTimeout(() => {
        confirmationDiv.classList.add("show");
    }, 10);
    setTimeout(() => {
        confirmationDiv.classList.remove("show");
        setTimeout(() => {
            confirmationDiv.remove();
        }, 500);
    }, 2000);
}


/**
 * Formats a given date string into the "DD/MM/YYYY" format.
 * If the input is already in "DD/MM/YYYY", it is returned as is.
 * If the input is an invalid date, an empty string is returned.
 * @param {string} dueDate - The date string to be formatted.
 * @returns {string} The formatted date in "DD/MM/YYYY" format or an empty string if invalid.
 */
function formatDateForInput(dueDate) {
    if (!dueDate) return ""; // Falls kein Datum vorhanden ist
    const dateParts = dueDate.split("/"); // Falls TT/MM/YYYY aus Backend kommt
    if (dateParts.length === 3) {
        return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`; // Falls bereits TT/MM/YYYY ist
    }
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) return ""; // Falls ungültiges Datum
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


/**
 * Sets up the reset functionality for the edit due date input.
 * When the calendar icon is clicked, the selected date is cleared.
 */
function setupEditDateReset() {
    const dateInput = document.getElementById("edit-due-date");
    const calendarIcon = document.getElementById("edit-calendar-icon");
    if (!dateInput || !dateInput._flatpickr) return;
    calendarIcon.addEventListener("click", function () {
        dateInput._flatpickr.clear();
    });
}


/**
 * Sets up the reset functionality for the edit due date input.
 * When the calendar icon is clicked, the selected date is cleared.
 */
function handleEditCalendarClick() {
    const calendarIcon = document.getElementById("edit-calendar-icon");
    const dateInput = document.getElementById("edit-due-date");
    if (!calendarIcon || !dateInput || !dateInput._flatpickr) return;
    calendarIcon.addEventListener("click", () => {
        dateInput._flatpickr.isOpen ? dateInput._flatpickr.close() : dateInput._flatpickr.open();
    });
}


/**
 * Initializes the Flatpickr date picker for the edit task modal.
 * Configures the date format, enables manual input, and sets up event listeners.
 */
function initEditTaskFlatpickr() {
    flatpickr("#edit-due-date", {
        dateFormat: "d/m/Y",
        allowInput: true,
        placeholder: "dd/mm/yyyy"
    });
    handleEditCalendarClick();
    setupEditDateReset();
}