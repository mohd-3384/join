/**
 * Initializes event listeners for editing subtasks.
 */
function setupEditSubtaskInput() {
    const inputField = document.getElementById("edit-subtasks");
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");

    if (addSubtaskBtn) addSubtaskBtn.addEventListener("click", handleEditSubtaskClick);

    if (inputField) {
        inputField.addEventListener("keydown", handleEditSubtaskKeydown);
        inputField.addEventListener("input", handleEditSubtaskInput);
    } else {
        throw new Error("Input field not found");
    }
}


/**
 * Shows or hides the "Add Subtask" button based on the input field content.
 */
function handleEditSubtaskInput() {
    const inputField = document.getElementById("edit-subtasks");
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");

    if (!inputField || !addSubtaskBtn) return;

    if (inputField.value.trim()) {
        addSubtaskBtn.style.display = "none";
        showEditSubtaskActions();
    } else {
        removeEditSubtaskActions();
        addSubtaskBtn.style.display = "block";
    }
}


/**
 * Saves a new subtask if the input field is not empty.
 */
function handleEditSubtaskClick() {
    const inputField = document.getElementById("edit-subtasks");
    if (inputField.value.trim()) {
        saveEditSubtask();
    }
}


// Helper function to create a divider
function createDivider() {
    const divider = document.createElement("div");
    divider.classList.add("divider");
    return divider;
}


// Helper function to create the icon container
function createIconContainer() {
    const container = document.createElement("div");
    container.classList.add("subtask-action");
    return container;
}


/**
 * Creates and displays subtask action icons (save/delete) if they do not already exist.
 */
function showEditSubtaskActions() {
    if (document.querySelector("#edit-subtask-wrapper .subtask-action")) return;

    const inputField = document.getElementById("edit-subtasks");
    const iconContainer = createIconContainer();

    iconContainer.append(
        createIcon("/assets/imgs/clear-subtask.png", "Clear Icon", "clear-icon", clearEditSubtask),
        createDivider(),
        createIcon("/assets/imgs/checkmark-black.png", "Checkmark Icon", "checkmark-icon", saveEditSubtask)
    );

    inputField.parentElement.appendChild(iconContainer);
}


/**
 * Removes subtask action icons and restores the "Add Subtask" button.
 */
function removeEditSubtaskActions() {
    const inputField = document.getElementById("edit-subtasks");
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");

    if (!inputField) return;
    inputField.value = "";

    const parentElement = inputField.parentElement;
    const iconContainer = parentElement.querySelector(".subtask-action");

    if (iconContainer) iconContainer.remove();
    addSubtaskBtn && (addSubtaskBtn.style.display = "flex", addSubtaskBtn.src = "/assets/imgs/add-subtask.png");
}



/**
 * Saves the entered subtask to the list and clears the input field.
 */
function saveEditSubtask() {
    const inputField = document.getElementById("edit-subtasks");
    const subtaskList = document.getElementById("edit-subtask-list");

    if (inputField.value.trim()) {
        const li = createSubtaskElement(inputField.value);
        subtaskList.appendChild(li);
    }

    inputField.value = "";
    removeEditSubtaskActions();
}


/**
 * Clears the input field and restores the "Add Subtask" button.
 */
function clearEditSubtask() {
    const inputField = document.getElementById("edit-subtasks");
    const addSubtaskBtn = document.querySelector("#edit-subtask-wrapper .add-subtask-icon");

    inputField.value = "";

    removeEditSubtaskActions();

    addSubtaskBtn.src = "/assets/imgs/add-subtask.png";
    addSubtaskBtn.style.display = "block";
}


/**
 * Saves the subtask when the user presses the Enter key.
 * @param {KeyboardEvent} event - The keydown event.
 */
function handleEditSubtaskKeydown(event) {
    const inputField = document.getElementById("edit-subtasks");

    if (event.key === "Enter") {
        event.preventDefault();

        if (inputField.value.trim()) {
            showEditSubtaskActions();
            saveEditSubtask();
        }
    }
}


/**
 * Initiates the editing process for a subtask item when the edit icon is clicked.
 * Finds the list item (li), extracts the original text, and prepares the editing UI.
 * @param {MouseEvent} event - The click event from the edit icon.
 */
function editSubtask(event) {
    const li = event.target.closest("li");
    if (!li) return;
    const span = li.querySelector(".subtask-text");
    const originalText = span.textContent.replace("• ", "").trim();
    setupSubtaskEditing(li, originalText);
}


/**
 * Replaces the subtask's display text with an input field and edit action icons.
 * Focuses the input and attaches an Enter key handler for quick saving.
 * @param {HTMLLIElement} li - The list item element containing the subtask.
 * @param {string} originalText - The original text of the subtask.
 */
function setupSubtaskEditing(li, originalText) {
    const input = createEditInput(originalText);
    const editActions = createEditActions(input, li);
    li.innerHTML = "";
    li.appendChild(input);
    li.appendChild(editActions);
    input.focus();
    attachEnterHandler(input, li);
}


/**
 * Attaches an Enter key listener to save the subtask immediately when Enter is pressed.
 * If the input is not empty, it replaces the input with the updated subtask HTML.
 * @param {HTMLInputElement} input - The input field for editing the subtask.
 * @param {HTMLLIElement} li - The list item element containing the subtask.
 */
function attachEnterHandler(input, li) {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const newText = input.value.trim();
            if (newText) {
                li.innerHTML = getSubtaskHTML(newText);
            }
        }
    });
}


/**
 * Retrieves all subtasks from the task modal.
 * @returns {Array<Object>} An array of subtasks with their text and checked status.
 */
function getSubtasks() {
    const subtaskElements = document.querySelectorAll("#subtask-list input[type='checkbox']");
    if (!subtaskElements.length) return console.warn("⚠️ No subtasks found. Returning []"), [];
    return Array.from(subtaskElements).map(checkbox => ({
        text: checkbox.nextElementSibling?.innerText.trim() || "Unnamed Subtask",
        checked: checkbox.checked
    }));
}