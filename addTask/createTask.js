// @ts-nocheck

/** ================================
 *          TASK CREATION
 * ================================ */
/**
 * Creates a new task by gathering form data, validating it, and saving it to Firebase.
 * @param {Event} event - The form submission event.
 */
function createTask(event) {
    event.preventDefault();

    const taskData = getTaskFormData();
    saveTaskToFirebase(taskData);
    showTaskPopup();
}


/**
 * Retrieves and formats assigned contacts for the task.
 * @returns {Array<Object>} - List of assigned users with name, background color, and initials.
 * Assumes selectedContacts is a Set of selected users.
 */
function getSafeAssignedContacts() {
    return Array.from(selectedContacts).map(user => ({
        name: user.name || "Unknown",
        avatar: {
            bgcolor: user.bgcolor || "#ccc",
            initials: getInitials(user.name || "?")
        }
    }));
}


/**
 * Handles the task creation event and provides user feedback.
 * Validates the form and shows a success message if the task is created.
 * @param {Event} event - The form submission event.
 */
function handleTaskCreation(event) {
    event.preventDefault();
    if (validateForm()) {
        alert("Task created!");
    }
}


/**
 * Handles the success state after a task is successfully created.
 * Shows a popup and redirects to the board page.
 */
function handleTaskSuccess() {
    showTaskPopup();
    setTimeout(() => window.location.href = "/board/board.html", 1500);
}


/** ================================
 *        FORM DATA HANDLING
 * ================================ */

/**
 * Retrieves task form data and returns it as an object.
 * @returns {Object} The task data object.
 */
function getTaskFormData() {
    return {
        title: getValue("#task-name"),
        description: getValue("#description"),
        assignedTo: getSelectedContacts(),
        dueDate: getValue("#due-date"),
        priority: getSelectedPriority(),
        category: getSelectedCategory(),
        subtasks: getTaskSubtasks(),
        mainCategory: getMainCategory()
    };
}


/**
 * Returns the main category of the task.
 * @returns {string} The default category "To do".
 */
function getMainCategory() {
    return window.selectedTaskCategory || "To do";
}


/**
 * Retrieves and formats the value of an input field.
 * @param {string} selector - The CSS selector for the input element.
 * @returns {string} The formatted input value.
 */
function getValue(selector) {
    return document.querySelector(selector)?.value.trim() || "";
}


/**
 * Clears the task form fields and resets validation states.
 */
function clearTask() {
    clearFormFields(["task-name", "description", "subtasks"]);
    resetDateInput(document.getElementById("due-date"));
    resetPriorityToMedium();
    resetDropdown();
    clearContacts();
    resetAllContactCheckboxes();
    resetErrors();
    clearSubtasks();
    checkFormValidity();
}


/**
 * Clears form fields by their IDs.
 * @param {Array} fieldIds - Array of element IDs to be cleared.
 */
function clearFormFields(fieldIds) {
    fieldIds.forEach(id => document.getElementById(id).value = "");
}


/**
 * Resets the dropdown to its initial state.
 */
function resetDropdown() {
    document.querySelector(".dropdown-btn").innerHTML = `Select task category <span class="icon-container"><img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon"></span>`;
}


/**
 * Resets the selected contacts container.
 */
function resetSelectedContacts() {
    document.getElementById("selected-contacts-container").innerHTML = "";
}


/**
 * Clears the selected contacts container and resets the state of all checkboxes.
 */
function clearContacts() {
    const container = document.getElementById("selected-contacts-container");
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}


/**
 * Resets all checkboxes in the modal and clears their associated selections.
 */
function resetAllContactCheckboxes() {
    document.querySelectorAll(".contact-checkbox").forEach((checkbox) => {
        const contactItem = checkbox.closest(".contact-item");
        const img = contactItem?.querySelector(".checkbox-image");
        const name = contactItem?.dataset.name;
        if (checkbox.checked) uncheckCheckbox(checkbox, img, name);
        if (contactItem) contactItem.classList.remove("selected");
    });
    clearContacts();
}


/**
 * Clears all error messages and error classes.
 */
function resetErrors() {
    document.querySelectorAll(".error-message").forEach((error) => { error.style.display = "none"; });
    document.querySelectorAll(".error").forEach((el) => { el.classList.remove("error"); });
}


/**
 * Clears all subtasks (removes the subtask list items).
 */
function clearSubtasks() {
    document.querySelectorAll(".subtask-item input").forEach(input => input.value = "");
    const subtaskList = document.getElementById("subtask-list");
    if (subtaskList) {
        subtaskList.innerHTML = "";
    }
}


/**
 * Resets the priority to "medium" and deactivates any other active button.
 */
function resetPriorityToMedium() {
    if (activeButton) deactivateButton(activeButton);
    const mediumButton = document.getElementById('medium');
    if (mediumButton) {
        activateButton(mediumButton);
        activeButton = mediumButton;
    }
}


/** ================================
 *        TASK VALIDATION
 * ================================ */

/**
 * Validates the task data before submission.
 * @param {Object} taskData - The task data object.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateTaskData(taskData) {
    let isValid = true;
    !taskData.title.trim() ? (showError("#task-name", "Title is required."), isValid = false) : clearError("#task-name");
    !taskData.dueDate.trim() ? (showError("#due-date", "Due Date is required."), isValid = false) : clearError("#due-date");
    !taskData.category.trim() ? (showError("#selected-category", "Category is required."), isValid = false) : clearError("#selected-category");
    return isValid;
}


/** ================================
 *        TASK PRIORITY
 * ================================ */

/**
 * Retrieves the selected priority of the task.
 * Defaults to "Medium" priority if no active button is found.
 * @returns {{priorityText: string, priorityImage: string}} The priority object.
 */
function getSelectedPriority() {
    if (!activeButton) return { priorityText: "Medium", priorityImage: "/assets/imgs/medium.png" };
    const priority = {
        priorityText: activeButton.innerText.trim(),
        priorityImage: getPriorityImage(activeButton.id)
    };
    return priority;
}


/**
 * Retrieves the image URL for a given priority level.
 * @param {string} priority - The priority level ("low", "medium", "urgent").
 * @returns {string} The corresponding image URL.
 */
function getPriorityImage(priority) {
    const priorityImages = {
        "low": "/assets/imgs/low.png",
        "medium": "/assets/imgs/medium.png",
        "urgent": "/assets/imgs/urgent.png"
    };
    return priorityImages[priority] || "/assets/imgs/medium.png";
}


/** ================================
 *      CONTACT SELECTION
 * ================================ */

/**
 * Retrieves the selected contacts from the form.
 * @returns {Array<{name: string, avatar: Object}>} An array of selected contacts.
 */
function getSelectedContacts() {
    return Array.from(document.querySelectorAll(".contact-checkbox:checked"))
        .map(checkbox => {
            const name = checkbox.dataset.contactName;
            const contact = allContacts.get(name);
            return contact ? { name, avatar: generateAvatar(name, contact.bgcolor) } : (null);
        })
        .filter(contact => contact);
}


/**
 * Generates an avatar object for a contact.
 * Prioritizes existing contact data from allContacts; falls back to random color if not available.
 * @param {string} name - The contact's name.
 * @param {string} [bgcolor] - Optional background color.
 * @returns {{initials: string, bgcolor: string}} The avatar object.
 */
function generateAvatar(name, bgcolor) {
    const contact = allContacts.get(name?.trim());
    if (contact && contact.avatar) {
        return {
            initials: contact.avatar.initials || getInitials(name),
            bgcolor: contact.avatar.bgcolor || getRandomColor()
        };
    }
    return {
        initials: getInitials(name),
        bgcolor: bgcolor || getRandomColor()
    };
}


/** ================================
 *      CATEGORY SELECTION
 * ================================ */

/**
 * Retrieves the selected category from the form.
 * Uses fallback mechanism to handle cases where no category is selected.
 * @returns {string} The formatted category name.
 */
function getSelectedCategory() {
    const selectedInput = document.getElementById("selected-category");
    if (!selectedInput) return "";
    let category = selectedInput.value?.trim();
    if (!category) return "";
    return category.replace("_", " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}


/** ================================
 *      SUBTASKS HANDLING
 * ================================ */

/**
 * Retrieves the subtasks from the form.
 * @returns {Array<{text: string, completed: boolean}>} An array of subtasks.
 */
function getTaskSubtasks() {
    return Array.from(document.querySelectorAll(".subtask-item")).map(subtask => {
        let text = subtask.textContent.trim();
        text = text.replace(/^[•●▪▸►☑✔☐-]+/g, "").trim();
        return { text, completed: false };
    });
}


/** ================================
 *      FIREBASE INTEGRATION
 * ================================ */

/**
 * Saves the task data to Firebase.
 * @param {Object} taskData - The task data object.
 * @returns {Promise<void>} A promise that resolves when the task is saved.
 */
async function saveTaskToFirebase(taskData) {
    try {
        await firebase.database().ref("tasks").push(taskData);
    } catch (error) {
        throw error;
    }
}


/** ================================
 *      POPUP NOTIFICATION
 * ================================ */

/**
 * Displays a task-added notification popup.
 */
function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");
    setTimeout(() => window.location.href = "/board/board.html", 1500);
}