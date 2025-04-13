/**
 * Initializes the date input field by adding event listeners for the "input" and "change" events.
 * When the input field has a value, the "has-value" class is added; otherwise, it is removed.
 * Logs an error if the input field with the ID 'due-date' is not found.
 */
function dateInput() {
  const dateInputs = document.querySelectorAll("#due-date"); 
  const calendarIcons = document.querySelectorAll("#calendar-icon");
  if (!dateInputs.length || !calendarIcons.length) return;

  dateInputs.forEach((dateInput) => {
      dateInput.addEventListener("input", function () {
          dateInput.classList.toggle("has-value", !!dateInput.value);
      });

      dateInput.addEventListener("change", function () {
          dateInput.classList.toggle("has-value", !!dateInput.value);
      });
  });
}


/**
* Sets up an event listener on the calendar icon to open the Flatpickr date picker when clicked.
* Ensures that Flatpickr is initialized on the date input field before adding the event listener.
*/
function setupCalendarIcon() {
  const dateInput = document.getElementById("due-date");
  const calendarIcon = document.getElementById("calendar-icon");

  if (!dateInput || !calendarIcon) return;

  if (dateInput._flatpickr) {
      calendarIcon.addEventListener("click", function () {
          dateInput._flatpickr.open(); 
      });
  } 
}


/**
* Sets up the date reset functionality by adding an event listener for the 'click' event
* on the date input field. When clicked, the event handler `handleDateReset` is triggered.
*/
function setupDateReset() {
  const dateInput = document.getElementById("due-date");
  if (dateInput) dateInput.addEventListener('click', (event) => handleDateReset(event, dateInput));
}


/**
* Handles the date reset when the date input field's reset icon is clicked.
* If the icon is clicked, the date input field is reset after a short timeout.
* 
* @param {Event} event - The event triggered by clicking the date input.
* @param {HTMLInputElement} input - The date input field that is being reset.
*/
function handleDateReset(event, input) {
  if (iconClicked(event, input)) {
      setTimeout(() => resetDateInput(input), 0);
  }
}


/**
* Determines if the reset icon of the date input field was clicked.
* The reset icon is assumed to be located at the right edge of the input field, within the last 30px.
* 
* @param {Event} event - The click event triggered by the user.
* @param {HTMLInputElement} input - The date input field being checked.
* @returns {boolean} True if the reset icon was clicked, otherwise false.
*/
function iconClicked(event, input) {
  const rect = input.getBoundingClientRect();
  return event.clientX > rect.right - 30;
}
