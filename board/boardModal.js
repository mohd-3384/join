// @ts-nocheck

/**
 * Opens the task modal. If the screen width is below 670px, redirects to the addTask page.
 * @async
 * @param {string} category - The category for the task (default is "To do").
 */
async function openAddTaskModal(category = "To do") {
    if (window.innerWidth < 670) {
        return redirectToAddTaskPage(category);
    }
    setupModal(category);
}


/**
 * Redirects the user to the addTask page with the specified category.
 * @param {string} category - The selected task category.
 */
function redirectToAddTaskPage(category) {
    window.location.href = `/addTask/addTask.html?category=${encodeURIComponent(category)}`;
}


/**
 * Sets up and displays the task modal, initializing required components.
 * @async
 * @param {string} category - The selected task category.
 */
async function setupModal(category) {
    window.selectedTaskCategory = category;
    showTaskModal();
    await initializeTaskModal();
    initFormValidation();
    toggleModalVisibility(true);
    checkFormValidity();
    dateInput();
    setupFieldValidation();
}


/**
 * Toggles the visibility of the task modal and overlay.
 * @param {boolean} isVisible - Whether to show or hide the modal.
 */
function toggleModalVisibility(isVisible) {
    const modal = document.getElementById("addTaskModal");
    const modalOverlay = document.querySelector(".modal-overlay");
    modal.style.display = isVisible ? "block" : "none";
    modalOverlay.classList.toggle("active", isVisible);
}


/**
 * Displays the task modal with overlay and animations, and prevents event bubbling inside the modal.
 */
function showTaskModal() {
    const overlay = document.getElementById("task-overlay");
    const modal = document.getElementById("addTaskModal");

    overlay.classList.add("active");
    modal.classList.remove("hidden");

    setTimeout(() => modal.classList.add("show"), 10);

    modal.addEventListener("click", (event) => event.stopPropagation());
}


/**
 * Initializes the task modal by setting up contacts, priority settings, dropdowns, validation, and event handlers.
 * This function ensures that the task modal is fully prepared for user interaction.
 *
 * Steps performed:
 * 1. Fetches and renders the contact list.
 * 2. Initializes the default priority for tasks.
 * 3. Sets up outside-click behavior for the modal.
 * 4. Initializes the "Add Task Contacts" functionality.
 * 5. Clears any pre-existing errors for the category field.
 * 6. Configures the contact button and assignment buttons.
 * 7. Updates dropdown icons for visual consistency.
 * 8. Sets up validation for required fields (e.g., task name, due date, category).
 * 9. Clears selected contacts and updates their display.
 *
 * @async
 */
async function initializeTaskModal() {
    const listId = "contacts-list";

    await fetchAndRenderContacts(listId); 
    initialDefaultPriority();
    initOutsideClickModal();
    initAddTaskContacts(listId); 
    clearError("#selected-category");
    setupContactButton();
    setupAssignmentButtons();
    updateDropdownIcon();
    setupFieldValidation();
    selectedContacts.clear(); 
    updateSelectedContactsDisplay("selected-contacts-container"); 
}


/**
 * Closes the task modal with fade-out animation, resets contact selections, and hides overlay.
 */
function closeModal() {
    const modal = document.getElementById("addTaskModal");
    const overlay = document.getElementById("task-overlay");

    modal.classList.remove("show");
    setTimeout(() => {
        modal.classList.add("hidden");
        overlay.classList.remove("active");
    }, 400);

    updateSelectedContactsDisplay("selected-contacts-container");
    document.querySelectorAll(".contact-checkbox").forEach(checkbox => checkbox.checked = false);
    selectedContacts.clear();
}


/**
 * Sets up the contact button and renders the corresponding contacts list based on data-list-id.
 */
function setupContactButton() {
    const button = document.querySelector(".assignment-btn");
    if (button) {
        const listId = button.getAttribute("data-list-id");
        renderContactsList(listId);
    }
}


/**
 * Initializes outside click detection for modal and dropdown containers.
 */
function initOutsideClickModal() {
    const modal = document.getElementById("addTaskModal");
    const contactsContainer = document.getElementById("contacts-container");
    const dropdownOptions = document.querySelector(".dropdown-options");
    const button = document.querySelector(".assignment-btn");
    const dropdownButton = document.querySelector(".dropdown-btn");
    const dropdownIcon = button?.querySelector("img");

    if (!modal || !contactsContainer || !dropdownContainer || !dropdownOptions || !dropdownBtn || !button) return;
    modal.addEventListener("click", (event) => {
        handleOutsideClickModal(event, contactsContainer, ".assignment-btn", dropdownIcon);
        handleOutsideClickModal(event, dropdownContainer, ".dropdown-btn", dropdownIcon, true, dropdownOptions);
    });
}


/**
 * Closes a container (e.g. dropdown) when clicking outside of it.
 * 
 * @param {Event} event - The click event.
 * @param {HTMLElement} container - The container element to monitor.
 * @param {string} exceptionSelector - Selector for elements that should not trigger closing.
 * @param {HTMLElement} [dropdownIcon] - (Optional) Icon element, if needed.
 * @param {boolean} [isDropdown=false] - Whether the target is a dropdown container.
 * @param {HTMLElement|null} [optionsContainer=null] - Optional container for dropdown options.
 */
function handleOutsideClickModal(event, container, exceptionSelector, dropdownIcon, isDropdown = false, optionsContainer = null) {
    const isOpen = isDropdown
        ? container.classList.contains("open") && optionsContainer?.style.display === "block"
        : container?.classList.contains("visible");

    if (!isOpen) return;

    const clickedOutside = !container.contains(event.target) && !event.target.closest(exceptionSelector);
    if (clickedOutside) closeDropdownContainer(container, isDropdown, optionsContainer);
}


/**
 * Closes a dropdown container.
 * @param {HTMLElement} container - The container to close.
 * @param {boolean} [isDropdown=false] - Whether to use dropdown logic.
 * @param {HTMLElement|null} [optionsContainer=null] - Dropdown options container if applicable.
 */
function closeDropdownContainer(container, isDropdown = false, optionsContainer = null) {
    if (isDropdown) {
        container.classList.remove("open");
        if (optionsContainer) optionsContainer.style.display = "none";
        const dropdownIcon = document.querySelector("#dropdown-icon");
        updateDropdownHTML("Select task category");
    } else {
        const dropdownIcon = document.querySelector("#dropdown-icon");
        container.classList.add("hidden");
        container.classList.remove("visible");
        dropdownIcon.src = `/assets/imgs/dropdown-black.png`;
    }
}


/**
 * Resets the dropdown icon to its default state based on the container context.
 * @param {HTMLElement} container - The dropdown container.
 */
function resetDropdownIcon(container) {
    let dropdownIcon;
    if (dropdownIcon) updateDropdownIcon(false, dropdownIcon);

    if (container.id === "edit-contacts-container") {
        dropdownIcon = document.querySelector("#toggle-contacts-btn img");
    } else {
        const button = document.querySelector(".assignment-btn");
        dropdownIcon = button?.querySelector("img");
    }
}


/**
 * Displays a popup message confirming that the task was added, then redirects to the board.
 */
function showTaskPopup() {
    let popup = document.getElementById("task-added-popup");
    popup.classList.add("show");

    setTimeout(() => window.location.href = "/board/board.html", 1500);
}


/**
 * Resets the selected contacts by clearing the set and updating it with checked contacts.
 */
function resetSelectedContacts() {
    selectedContacts.clear(); 

    document.querySelectorAll(".contact-checkbox:checked").forEach((checkbox) => {
        const name = checkbox.getAttribute("data-contact-name");
        const contact = allContacts.get(name);
        if (contact) selectedContacts.add(contact);
    });

    updateSelectedContactsDisplay("selected-contacts-container"); 
}



