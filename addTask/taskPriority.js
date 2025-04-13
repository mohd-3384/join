/**
 * Stores the currently active button element.
 * If no button is active, the value is `null`.
 * This is used to keep track of which button is selected to ensure only one button is active at a time.
 * 
 * @type {HTMLElement | null}
 */
let activeButton = null; 


/**
 * Handles toggling of active state for buttons.
 * - If a button is already active and clicked again, it will be deactivated.
 * - If a different button is clicked, the previous active button is deactivated and the new one is activated.
 * - Also triggers a form validity check and disables the "create" button afterward.
 *
 * @param {HTMLElement} clickedButton - The button element that was clicked.
 */
function toggleButtons(clickedButton) {
    if (activeButton) deactivateButton(activeButton);

    if (activeButton === clickedButton) {
        activeButton = null;
        return;
    }

    activateButton(clickedButton);
    activeButton = clickedButton;

    setTimeout(checkFormValidity, 1);
    disableCreateButton();
}


/**
 * Activates the provided button by adding the 'active' class and applying the appropriate styles.
 * 
 * @param {HTMLElement} button - The button element to be activated.
 */
function activateButton(button) {
    button.classList.add('active');
    changeButtonStyle(button, 'add');
    changeImageStyle(button, 'add');
}


/**
 * Deactivates the provided button by removing the 'active' class and applying the appropriate styles.
 * Also triggers a form validity check and disables the "create" button afterward.
 * @param {HTMLElement} button - The button element to be deactivated.
 */
function deactivateButton(button) {
    button.classList.remove('active');
    changeButtonStyle(button, 'remove');
    changeImageStyle(button, 'remove');

    setTimeout(checkFormValidity, 1);
    disableCreateButton();
}


/**
 * Changes the background color and text color of the button based on its ID.
 * 
 * @param {HTMLElement} button - The button element whose style will be changed.
 * @param {string} action - The action to perform ('add' or 'remove') that determines whether to apply or remove the styles.
 */
function changeButtonStyle(button, action) {
    const colorMap = {
        'urgent': '#FF3D00',
        'medium': '#FFA800',
        'low': '#7AE229'
    };
  
    const color = colorMap[button.id] || '';
    
    button.style.backgroundColor = action === 'add' ? color : '';
    button.style.color = action === 'add' ? 'white' : '';
}


/**
 * Changes the image filter style for the button's image element.
 * 
 * @param {HTMLElement} button - The button element whose image filter style will be changed.
 * @param {string} action - The action to perform ('add' or 'remove') that determines whether to apply or remove the filter.
 */
function changeImageStyle(button, action) {
    const img = button.querySelector('img');
    
    if (action === 'add') {
        img.style.filter = 'brightness(0) invert(1)'; 
    } else if (action === 'remove') {
        img.style.filter = ''; 
    }
}


/**
 * Sets the default priority to 'medium' and activates its button on page load.
 */
function initialDefaultPriority() {
    const mediumButton = document.getElementById('medium');
  
    if (mediumButton) {
        activateButton(mediumButton);
        activeButton = mediumButton;
    }
}
