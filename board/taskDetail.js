/**
 * Initializes the task detail overlay and close button event listeners.
 */
function initTaskDetailOverlay() {
    const overlay = document.getElementById("taskDetailOverlay");
    const closeBtn = document.getElementById("closeTaskDetail");
    closeBtn?.addEventListener("click", closeTaskDetailModal);
    overlay?.addEventListener("click", (e) => e.target === overlay && closeTaskDetailModal());
}


/**
 * Formats a date string to ensure it follows the DD/MM/YYYY format.
 * @param {string} dueDate - The due date string to format.
 */
function formatDate(dueDate) {
    if (!dueDate) return "No date";
    const dateParts = dueDate.split("/"); // Splits the date into [DD, MM, YYYY]
    if (dateParts.length !== 3) return "Invalid date";
    return `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`; // Keeps DD/MM/YYYY format
}


/**
 * Opens the task detail modal and displays task information.
 * @param {Object} task - The task object containing details.
 */
function openTaskDetailModal(task) {
    if (!task) return console.error("No task data available!");
    const overlay = document.getElementById("taskDetailOverlay");
    const taskDetailContent = document.getElementById("taskDetailContent");
    let subtasksHTML = generateSubtasks(task);
    taskDetailContent.innerHTML = taskDetailTemplate(task, subtasksHTML);
    overlay.classList.add("active");
}


/**
 * Closes the task detail modal or the edit task modal if open.
 */
function closeTaskDetailModal() {
    const overlay = document.getElementById("taskDetailOverlay");
    overlay.classList.remove("active");
}


/**
 * Fetches task data from the database.
 * @param {string} taskId - The ID of the task.
 */
async function fetchTaskData(taskId) {
    const response = await fetch(`https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`);
    return response.json();
}


/**
 * Hides the task detail modal.
 */
function hideTaskDetailModal() {
    const taskDetailModal = document.getElementById("taskDetailModal");
    taskDetailModal.classList.add("hidden");
    taskDetailModal.style.display = "none";
}


/**
 * Closes the edit task modal and ensures proper visibility of other modals.
 */
function closeEditTaskModal() {
    const editTaskModal = document.getElementById("editTaskModal");
    if (!editTaskModal.classList.contains("hidden")) {
        editTaskModal.classList.add("hidden");
        restoreTaskDetailModal();
        return;
    }
    updateSelectedContactsDisplay("edit-selected-contacts-container");
    closeOverlayAndDetailModal();
}


/**
 * Restores the visibility of the task detail modal if it was previously open.
 */
function restoreTaskDetailModal() {
    const taskDetailModal = document.getElementById("taskDetailModal");
    const overlay = document.getElementById("taskDetailOverlay");
    if (taskDetailModal.classList.contains("hidden")) {
        taskDetailModal.classList.remove("hidden");
        taskDetailModal.style.display = "block";
    }
    if (!overlay.classList.contains("active")) {
        overlay.classList.add("active");
    }
}


/**
 * Closes the overlay and the task detail modal.
 */
function closeOverlayAndDetailModal() {
    document.getElementById("taskDetailOverlay").classList.remove("active");
    document.getElementById("taskDetailModal").classList.add("hidden");
}


/**
 * Deletes a task from the database and updates the UI.
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTask(taskId) {
    try {
        await fetch(`https://join-ma-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`, { method: "DELETE" });
        document.querySelector(`.task-card[data-id="${taskId}"]`)?.remove();
        closeTaskDetailModal();
        showDeleteConfirmation();
        updateNoTaskVisibility();
    } catch (error) {
        console.error("❌ Error deleting task:", error);
    }
}


/**
 * Displays a delete confirmation message with a fade-out effect.
 */
function showDeleteConfirmation() {
    const confirmationDiv = document.createElement("div");
    confirmationDiv.classList.add("task-delete-confirmation");
    confirmationDiv.innerText = "Task successfully deleted";
    document.body.appendChild(confirmationDiv);
    setTimeout(() => confirmationDiv.classList.add("show"), 10);
    setTimeout(() => {
        confirmationDiv.classList.remove("show");
        setTimeout(() => confirmationDiv.remove(), 500);
    }, 2000);
}


/**
 * Toggles edit buttons in the edit task modal and updates their styles.
 * @param {HTMLElement} clickedButton - The button that was clicked.
 */
function toggleEditButtons(clickedButton) {
    document.querySelectorAll("#editTaskModal .btn-switch").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "#000";
    });
    clickedButton.classList.add("active");
    const priorityColors = {
        urgent: ["#ff3b30", "#fff"],
        medium: ["#ffcc00", "#000"],
        low: ["#34c759", "#fff"]
    };
    const priority = clickedButton.id.replace("edit-", "");
    if (priorityColors[priority]) [clickedButton.style.backgroundColor, clickedButton.style.color] = priorityColors[priority];
}


/**
 * Handles click events on the task detail overlay. Closes the task edit modal if the overlay itself is clicked.
 */
function handleTaskDetailOverlayClick() {
    const overlay = document.getElementById("taskDetailOverlay");
    if (overlay) {
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                closeEditTaskModal();
            }
        });
    }
}


/**
 * Sets up the edit assignment button to open the contact selection modal.
 */
function setupEditAssignmentButton() {
    const editAssignmentBtn = document.getElementById("toggle-contacts-btn");
    if (!editAssignmentBtn) return console.error("❌ Edit Assignment Button not found!");
    editAssignmentBtn.addEventListener("click", (event) => {
        const containerId = editAssignmentBtn.getAttribute("data-container-id");
        const listId = editAssignmentBtn.getAttribute("data-list-id");
        const selectedContainerId = editAssignmentBtn.getAttribute("data-selected-id");
        if (!listId) return console.error("❌ listId is undefined! Check button data attributes.");
        toggleContacts(event, containerId, listId, selectedContainerId);
    });
}


/**
 * Initializes the edit task contact selection functionality.
 * Retrieves required elements, initializes contacts, and sets up event listeners.
 */
function initEditTaskContacts() {
    const elements = getEditModalElements();
    if (!elements) return;
    const { editAssignmentButton, editContactsContainer, editContactsList } = elements;
    initializeEditContacts();
    setupEditTaskEventListeners(editAssignmentButton, editContactsContainer, editContactsList);
}


/**
 * Initializes the edit task contact event listeners. Delegates the setup of toggle, outside click and contact selection behaviors.
 * @param {HTMLElement} editAssignmentButton - The button used to open the contact selector.
 * @param {HTMLElement} editContactsContainer - The container holding the contact list.
 * @param {HTMLElement} editContactsList - The list of available contact items.
 */
function setupEditTaskEventListeners(editAssignmentButton, editContactsContainer, editContactsList) {
    setupContactToggleClick(editAssignmentButton, editContactsContainer, editContactsList);
    setupOutsideContactClose(editContactsContainer);
    setupContactSelection(editContactsList);
}


/**
 * Sets up the toggle behavior for the contact dropdown when the assignment button is clicked.
 * Also updates the dropdown icon depending on its state.
 * @param {HTMLElement} button - The toggle button element.
 * @param {HTMLElement} container - The dropdown container to toggle.
 * @param {HTMLElement} list - The contact list inside the dropdown.
 */
function setupContactToggleClick(button, container, list) {
    button.addEventListener("click", (event) => {
        toggleContacts(event, container.id, list.id, "edit-selected-contacts-container");
        const icon = button.querySelector(".icon-container img");
        if (icon) {
            const isOpen = container.classList.contains("visible");
            icon.src = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png`;
        }
    });
}


/**
 * Registers a document-wide click listener to close the dropdown when clicking outside.
 * @param {HTMLElement} container - The contact dropdown container.
 */
function setupOutsideContactClose(container) {
    document.addEventListener("click", (event) => {
        handleOutsideClick(event, container, ".assignment-btn");
    });
}


/**
 * Attaches checkbox change listeners to all contact items in the given list.
 * @param {HTMLElement} contactList - The container element holding contact items.
 */
function setupContactSelection(contactList) {
    contactList.querySelectorAll(".contact-item").forEach(contactItem => {
        const checkbox = contactItem.querySelector(".contact-checkbox");
        if (!checkbox) return;
        handleContactCheckboxChange(checkbox);
    });
}


/**
 * Handles the checkbox change event for a single contact. Adds or removes the contact from selectedContacts and updates the UI.
 * @param {HTMLInputElement} checkbox - The checkbox element for the contact.
 */
function handleContactCheckboxChange(checkbox) {
    checkbox.addEventListener("change", () => {
        const name = checkbox.dataset.contactName?.trim();
        if (!name) return;
        const contactObj = buildContactObject(name);
        if (!contactObj) return;
        if (checkbox.checked) {
            selectedContacts.set(name, contactObj);
        } else {
            selectedContacts.delete(name);
        }
        updateSelectedContactsDisplay("edit-selected-contacts-container");
    });
}


/**
 * Initializes the edit task contacts by fetching and rendering the contact list.
 * Also resets the selected contacts in the edit task modal.
 */
function initializeEditContacts() {
    fetchAndRenderContacts("edit-contacts-list");
}


/**
 * Synchronizes the checkboxes in the edit modal with the selected contacts.
 * Marks already selected contacts as checked and styles them accordingly.
 */
function checkPreselectedContactsInEditModal() {
    const preselectedNames = getPreselectedContactNames();
    document.querySelectorAll("#edit-contacts-list .contact-checkbox").forEach(cb => {
        const contactName = cb.dataset.contactName?.trim().toLowerCase();
        if (!contactName) return;
        if (preselectedNames.includes(contactName)) {
            applyPreselectionStyles(cb, contactName);
        }
    });
}


/**
 * Returns a list of lowercased, trimmed contact names from selectedContacts.
 * @returns {Array<string>} List of normalized contact names.
 */
function getPreselectedContactNames() {
    return Array.from(selectedContacts.keys()).map(n =>
        n.trim().toLowerCase()
    );
}


/**
 * Marks a checkbox as checked and applies all visual styles for a selected contact.
 * @param {HTMLInputElement} cb - The checkbox element.
 * @param {string} contactName - The normalized name of the contact.
 */
function applyPreselectionStyles(cb, contactName) {
    cb.checked = true;
    const contactItem = cb.closest(".contact-item");
    if (!contactItem) return;
    contactItem.classList.add("selected");
    contactItem.querySelector(".avatar")?.classList.add("selected-avatar");
    contactItem.querySelector(".contact-name")?.classList.add("selected-name");
    const img = contactItem.querySelector(".checkbox-image");
    if (img) {
        img.classList.add("selected-checkbox-image");
        img.style.display = "block";
    }
    cb.style.display = "none";
}


/**
 * Retrieves essential elements from the edit task modal for contact management.
 * @returns {Object|null} An object containing the required elements, or null if any element is missing.
 * @property {HTMLElement} editAssignmentButton - The button to open the contact selection.
 * @property {HTMLElement} editContactsContainer - The container holding the contact list.
 * @property {HTMLElement} editContactsList - The list of selectable contacts.
 * @property {HTMLElement} editSelectedContainer - The container displaying selected contacts.
 */
function getEditModalElements() {
    const editAssignmentButton = document.getElementById("toggle-contacts-btn");
    const editContactsContainer = document.getElementById("edit-contacts-container");
    const editContactsList = document.getElementById("edit-contacts-list");
    const editSelectedContainer = document.getElementById("edit-selected-contacts-container");
    if (!editAssignmentButton || !editContactsContainer || !editContactsList || !editSelectedContainer) {
        console.error("❌ Missing elements in Edit Modal contact section.");
        return null;
    }
    return { editAssignmentButton, editContactsContainer, editContactsList, editSelectedContainer };
}


/**
 * Retrieves the initials of preselected contacts from the edit task modal.
 * @returns {Array<string>} An array of initials representing the preselected contacts.
 */
function getPreselectedContacts() {
    const container = document.getElementById("edit-selected-contacts-container");
    if (!container) return [];
    const avatars = container.querySelectorAll(".avatar-board-card");
    const initialsList = Array.from(avatars).map(avatar => avatar.textContent.trim());
    return initialsList;
}


/**
 * Removes a preselected contact from the edit task modal.
 * @param {HTMLElement} contactItem - The contact element to be removed.
 */
function removePreselectedContact(contactItem) {
    const name = contactItem.getAttribute("data-name");
    if (!name) return console.warn("data-name attribute not found for contact item. Skipping.");
    const trimmedName = name.trim();
    selectedContacts.delete(trimmedName);
    const container = document.getElementById("edit-selected-contacts-container");
    if (container) {
        const contactElements = container.querySelectorAll(`[data-name="${trimmedName}"]`);
        contactElements.forEach(element => {
            element.remove();
        });
    }
}


/**
 * Closes the edit task modal when clicking outside of it and restores the task detail modal.
 * Ensures that the task detail modal remains visible after closing the edit modal.
 */
document.getElementById("taskDetailOverlay").addEventListener("click", function (event) {
    if (event.target === this) {
        closeEditTaskModal();
        restoreTaskDetailModal();
    }
});