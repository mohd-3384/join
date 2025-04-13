/**
 * The selectedCategory element that holds the current selected category value.
 * @type {HTMLInputElement}
 */
const selectedCategory = document.getElementById('selected-category');

/**
 * The dropdown button element that toggles the dropdown visibility.
 * @type {HTMLElement}
 */
const dropdownBtn = document.querySelector('.dropdown-btn');

/**
 * The dropdown list element containing all available options.
 * @type {HTMLUListElement}
 */
const dropdownList = document.getElementById('dropdown-list');

/**
 * The container that wraps the dropdown and controls its visibility.
 * @type {HTMLElement}
 */
const dropdownContainer = document.querySelector('.dropdown-container');

/**
 * The default placeholder text shown when no category is selected.
 * @type {string}
 */
const defaultText = "Select task category";


/**
 * Validates if a category has been selected from the dropdown.
 * Shows or hides the corresponding error message.
 */
function validateSelectedCategory() {
  const isValid = isCategorySelected();
  const errorElement = getCategoryErrorElement();

  if (!isValid) {
    showCategoryError(errorElement);
  } else {
    hideCategoryError(errorElement);
  }
}


/**
 * Checks whether a valid category has been selected.
 * 
 * @returns {boolean} True if a category is selected, false otherwise.
 */
function isCategorySelected() {
  const selectedValue = document.getElementById("selected-category").value.trim();
  const labelText = dropdownBtn.textContent.trim();
  return selectedValue !== "" && labelText !== defaultText;
}


/**
 * Retrieves the error message element related to the category selection.
 * 
 * @returns {HTMLElement|null} The error message element, or null if not found.
 */
function getCategoryErrorElement() {
  return document.querySelector('.error-message[data-error-for="selected-category"]');
}


/**
 * Displays the error message when no category has been selected.
 * 
 * @param {HTMLElement|null} errorElement - The error element to update.
 */
function showCategoryError(errorElement) {
  if (errorElement) {
    errorElement.textContent = "Please select a category.";
    errorElement.style.display = "block";
    dropdownBtn.classList.add("error");
  } else {
    throw error("Error element not found for selected-category.");
  }
}


/**
 * Hides the category selection error message.
 * 
 * @param {HTMLElement|null} errorElement - The error element to update.
 */
function hideCategoryError(errorElement) {
  if (errorElement) {
    errorElement.style.display = "none";
  }
  dropdownBtn.classList.remove("error");
}


/**
 * Toggles the visibility of the dropdown list and updates the dropdown button icon.
 * When the dropdown is opened, it resets the selected category.
 */
function toggleDropdown(event) {
  event.stopPropagation();
  if (!dropdownContainer.classList.contains("open")) resetDropdown();
  
  const isOpen = toggleDropdownState();
  const iconImg = dropdownBtn.querySelector("img");
  const newSrc = `/assets/imgs/dropdown-${isOpen ? "upwards" : "black"}.png?nocache=${Date.now()}`;
  
  iconImg ? iconImg.src = newSrc : (() => { throw new Error('Icon image element not found'); })();

  if (isOpen) validateSelectedCategory();
    
  setTimeout(checkFormValidity, 1);
  disableCreateButton();
}


/**
 * Handles the selection of a category from the dropdown.
 * Updates the dropdown button text and the selected category value.
 * 
 * @param {HTMLElement} option - The selected option element from the dropdown list.
 */
function selectCategory(option) {
  document.getElementById("selected-category").value = option.getAttribute("data-value");
  updateDropdownHTML(option.textContent);

  document.querySelector(".dropdown-container").classList.remove("open");
  document.getElementById("dropdown-list").style.display = "none";

  validateSelectedCategory();
  checkFormValidity();
}


/**
 * Updates the dropdown button's inner HTML to display the selected category.
 * 
 * @param {string} selectedText - The text of the selected category option.
 */
function updateDropdownHTML(selectedText) {
  dropdownBtn.innerHTML = `
    ${selectedText}
    <span class="icon-container">
      <img src="/assets/imgs/dropdown-black.png" alt="Dropdown Icon" id="dropdown-icon">
    </span>
  `;
}
  

/**
 * Resets the dropdown to its default state, showing the default text and clearing the selected category.
 */
function resetDropdown() {
    dropdownBtn.innerHTML = `
      ${defaultText}
      <span class="icon-container">
        <img src="/assets/imgs/dropdown-upwards.png" alt="Dropdown Icon" id="dropdown-icon">
      </span>
    `;
    selectedCategory.value = "";

    validateSelectedCategory();
}


/**
 * Toggles the dropdown state (open/close).
 * @returns {boolean} - The new state of the dropdown (open or closed).
 */
function toggleDropdownState() {
  const isOpen = dropdownContainer.classList.toggle("open");
  dropdownList.style.display = isOpen ? "block" : "none"
  
  return isOpen;
}



