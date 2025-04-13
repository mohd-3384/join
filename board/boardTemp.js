/**
 * Creates an HTML template for a task card.
 * @param {Object} task - The task object.
 * @param {string} task.category - The category of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {Array} task.subtasks - A list of subtasks.
 * @param {Array} task.assignedTo - A list of assigned users.
 * @param {Object} task.priority - The priority object of the task.
 * @param {string} task.priority.priorityText - The priority text.
 * @param {string} task.priority.priorityImage - The priority image.
 * @returns {string} - The HTML template for the task card.
 */
function taskCardTemplate(task) {
    let categoryColor = task.category === "User Story" ? "#0039fe" : "#1fd7c1";
    let totalSubtasks = task.subtasks ? task.subtasks.length : 0;
    let completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
    let progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const avatarsHTML = getAvatarsHTML(task.assignedTo);

    return `
        <div class="task-category" style="background-color: ${categoryColor};">
            ${task.category || "No Category"}
        </div>
        <h3 class="task-title">${task.title || "No Title"}</h3>
        <p class="task-description">${task.description || "No Description"}</p>
        <div class="subtask-snackbar">
            <div class="subtask-bar-progress">
                <div class="subtask-bar-prog-blue" style="width: ${progressPercent}%;"></div>
            </div>
            <p class="subtask-checked">${completedSubtasks}/${totalSubtasks} Subtasks</p>
        </div>
        <div class="task-card-footer">
            <div class="task-card-avatar">${avatarsHTML}</div>
            <img src="${task.priority?.priorityImage || ''}" alt="${task.priority?.priorityText || ''}" class="prio-icon">
        </div>
    `;
}


/**
 * Generates an HTML template for the subtasks of a task.
 * @param {Object} task - The task object.
 * @param {Array} task.subtasks - A list of subtasks.
 * @returns {string} - The HTML template for the subtasks.
 */
function generateSubtasksTemplate(task) {
    return task.subtasks.map((subtask, index) => `
        <div class="subtasks-content">
            <input type="checkbox" id="subtask-${task.id}-${index}" 
                ${subtask.completed ? "checked" : ""} 
                onchange="toggleSubtask('${task.id}', ${index})">
            <label for="subtask-${task.id}-${index}">${subtask.text}</label>
        </div>
    `).join("");
}


/**
 * Creates an HTML template for the task detail view.
 * @param {Object} task - The task object.
 * @param {string} task.category - The category of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.dueDate - The due date of the task.
 * @param {Object} task.priority - The priority object of the task.
 * @param {string} task.priority.priorityText - The priority text.
 * @param {string} task.priority.priorityImage - The priority image.
 * @param {Array} task.assignedTo - A list of assigned users.
 * @param {Array} task.subtasks - A list of subtasks.
 * @param {string} subtasksHTML - The HTML template for the subtasks.
 * @returns {string} - The HTML template for the task detail view.
 */
function taskDetailTemplate(task, subtasksHTML) {
    let categoryColor = task.category === "User Story" ? "#0039fe" : "#1fd7c1";

    return `
        <div class="task-detail-header">
            <span class="task-detail-category" style="background: ${categoryColor};">
                ${task.category || "No category"}
            </span>
        </div>
        <h2 class="task-detail-title">${task.title || "No title"}</h2>
        <p class="task-detail-content">${task.description || "No description available."}</p>
        <p><strong style="padding-right: 16px;">Due date:</strong> ${formatDate(task.dueDate) || "No date"}</p>
        <p><strong style="padding-right: 16px;">Priority:</strong> ${task.priority?.priorityText || "No priority"} 
            <img src="${task.priority?.priorityImage || ''}" alt="${task.priority?.priorityText || ''}" class="prio-icon">
        </p>

        <p style="padding-bottom: 0;"><strong>Assigned To:</strong></p>
        <ul>
            ${task.assignedTo && Array.isArray(task.assignedTo) && task.assignedTo.length > 0
            ? task.assignedTo.map(user => `
                    <li style="display: flex; align-items: center; gap: 8px;">
                        <div class="avatar-board-card" data-name="${user.name || "Unknown"}" 
                            style="background-color: ${user.avatar?.bgcolor || "#ccc"};">
                            ${user.avatar?.initials || "?"}
                        </div>
                        ${user.name || "Unknown"}
                    </li>
                `).join("")
            : "<p>No one assigned</p>"
        }
        </ul>

        <div class="task-detail-subtasks">
            <p><strong>Subtasks</strong></p>
            ${subtasksHTML || "<p>No subtasks available.</p>"}
        </div>

        <div class="task-detail-footer">
            <button onclick="deleteTask('${task.id}')" class="btn-delete">
                <img src="../assets/imgs/delete.svg" alt="" class="delete-icon">
                Delete
            </button>
            <div class="line"></div>
            <button onclick="openEditTaskModal('${task.id}')" class="btn-edit">
                <img src="../assets/imgs/edit.svg" alt="" class="edit-icon" style="width: 18px; height: 18px;">
                Edit
            </button>
        </div>
    `;
}


/**
 * Creates an HTML template for editing a task.
 * @returns {string} - The HTML template for task editing.
 */
function editTaskTempl(taskId) {
    return `
    <button id="editTask-close-btn" class="editTask-close-btn" onclick="closeEditTaskModal()">
        &times;
    </button>

    <!-- Task-ID als data-Attribut speichern -->
    <form class="edit-modal-container" onsubmit="handleEditTaskSubmit(event)" data-task-id="${taskId}">
        <div class="form-content">
            <label for="edit-task-title">Title</label>
            <input id="edit-task-title" class="edit-input-board" type="text" placeholder="Enter a title" required />
        </div>

        <div class="form-content">
            <label for="edit-task-description">Description</label>
            <textarea id="edit-task-description" placeholder="Enter a Description"></textarea>
        </div>

        <div class="form-content">
            <label for="edit-due-date">Due Date</label>
            <input type="text" class="edit-input-board" id="edit-due-date" placeholder="TT/MM/YYYY" required />
            <img 
                src="/assets/imgs/calendar.png"
                id="edit-calendar-icon"
                alt="Kalender Icon"
            />
        </div>

        <div class="form-content">
            <label>Priority</label>
            <div class="button-container small-button-container" id="edit-button-container">
                <button class="btn-switch" id="edit-urgent" name="urgent" type="button" onclick="toggleEditButtons(this)">
                    Urgent 
                    <img src="/assets/imgs/urgent.png" alt="urgent-icon" />
                </button>
                <button class="btn-switch" id="edit-medium" name="medium" type="button" onclick="toggleEditButtons(this)">
                    Medium 
                    <img src="/assets/imgs/medium.png" alt="medium-icon" />
                </button>
                <button class="btn-switch" id="edit-low" name="low" type="button" onclick="toggleEditButtons(this)">
                    Low 
                    <img src="/assets/imgs/low.png" alt="low-icon" />
                </button>
            </div>
        </div>

        <div class="form-content">
            <label>Assigned to</label>
            <div class="edit-assignment-container">
                <button type="button" class="assignment-btn" id="toggle-contacts-btn" 
                data-container-id="edit-contacts-container" 
                data-list-id="edit-contacts-list" 
                data-selected-id="edit-selected-contacts-container">
                    Select contacts to assign
                <span class="icon-container">
                    <img
                    src="/assets/imgs/dropdown-black.png"
                    alt="Dropdown Icon"
                    id="dropdown-icon"
                    />
                </span>
                </button>
                <div id="edit-selected-contacts-container"></div>
                <div id="edit-contacts-container" class="hidden">
                    <div id="edit-contacts-list"></div>
                </div>
            </div>
        </div>

        <div class="form-content">
            <label>Subtasks</label>
            <div class="subtask-input-wrapper" id="edit-subtask-wrapper">
                <input 
                    type="text" 
                    class="edit-input-board" 
                    id="edit-subtasks" 
                    placeholder="Add new subtask" 
                />
                <img
                    src="/assets/imgs/add-subtask.png"
                    alt="addSubtask-icon"
                    class="add-subtask-icon"
                />
            </div>
            <ul id="edit-subtask-list"></ul>
        </div>

        <div class="edit-modal-footer">
            <button type="submit" class="edit-save-btn btn-dark">
                OK
                <img src="/assets/imgs/check-white.png" alt="">
            </button>
        </div>

    </form>
    `;
}


/**
 * Generates the avatar HTML for assigned users.
 * @param {Array<Object>} assignedTo - The assigned users.
 * @returns {string} The generated avatar HTML.
 */
function getAvatarsHTML(assignedTo) {
    if (!assignedTo || assignedTo.length === 0) return "";
    const maxVisible = 4;
    const visibleUsers = assignedTo.slice(0, maxVisible);
    const extraCount = assignedTo.length - maxVisible;
    const avatarsHTML = visibleUsers.map(user => {
        const avatar = user.avatar || { bgcolor: "#ccc", initials: "?" };
        return `<div class="avatar-board-card" style="background-color: ${avatar.bgcolor};">${avatar.initials}</div>`;
    }).join("");
    const extraHTML = extraCount > 0
        ? `<div class="avatar-board-card" style="background-color: #777;">+${extraCount}</div>`
        : "";
    return avatarsHTML + extraHTML;
}


/**
 * Creates the HTML template for a single subtask.
 * @param {Object} subtask - The subtask data object.
 * @param {number} index - The index of the subtask in the array.
 * @returns {string} HTML string representing the subtask.
 */
function subtaskTemplate(subtask, index) {
    return `
        <li id="subtask-${index}" class="subtask-item flex">
            ${getSubtaskHTML(subtask.text)}
        </li>
    `;
}


/**
 * Creates a single avatar HTML string for a contact.
 * @param {Object} contact - The contact object.
 * @returns {string} HTML string for the contact avatar.
 */
function createContactAvatarHTML(contact) {
    return `<div class="avatar avatar-board-card" 
                style="background-color: ${contact.avatar.bgcolor};" 
                data-name="${contact.name}"> 
                ${contact.avatar.initials}
            </div>`;
}


/**
 * Creates the "+X" avatar HTML for extra contacts.
 * @param {number} count - Number of extra contacts.
 * @returns {string} HTML string for the "+X" avatar.
 */
function createExtraAvatarHTML(count) {
    return `<div class="avatar avatar-board-card" style="background-color: #666;">+${count}</div>`;
}