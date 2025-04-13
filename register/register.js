const dbUrl =
  "https://join-ma-default-rtdb.europe-west1.firebasedatabase.app";

/**
 * Adds a new user to the database and creates associated contact
 * @async
 * @throws {Error} When database operations fail
 */
async function addUser() {
  if (!(await validateForm())) return;

  const { email, password, name, phone } = getUserInput();
  const userData = prepareUserData(name, email, password);
  const firebaseKey = formatFirebaseKey(email);

  try {
    await saveUser(firebaseKey, userData);
    const contactId = await saveContact(name, email, phone, userData.bgcolor);
    await updateContact(contactId, name, email, phone, userData.bgcolor);
    finalizeSignup();
  } catch (error) {
    console.error("Fehler:", error);
    handleValidationResult("Registration failed. Please try again.");
  }
}

/**
 * Extracts user input values from form fields
 * @returns {Object} User input values
 */
function getUserInput() {
  return {
    email: document.getElementById("idEmail").value.trim().toLowerCase(),
    password: document.getElementById("idPassword").value,
    name: document.getElementById("idName").value.trim(),
    phone: document.getElementById("idPhone")?.value.trim() || "",
  };
}

/**
 * Creates user data object with random background color
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Prepared user data
 */
function prepareUserData(name, email, password) {
  return { name, email, password, bgcolor: getRandomColor() };
}

/**
 * Formats email for Firebase key
 * @param {string} email - User email
 * @returns {string} Formatted Firebase key
 */
function formatFirebaseKey(email) {
  return email.replace(/\./g, "_").replace(/@/g, "-");
}

/**
 * Saves user data to Firebase
 * @param {string} firebaseKey - Formatted Firebase key
 * @param {Object} userData - User data to save
 */
async function saveUser(firebaseKey, userData) {
  await fetch(`${dbUrl}/users/${firebaseKey}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
}

/**
 * Saves new contact to Firebase
 * @param {string} name - Contact name
 * @param {string} email - Contact email
 * @param {string} phone - Contact phone
 * @param {string} bgcolor - Background color
 * @returns {Promise<string>} Contact ID
 */
async function saveContact(name, email, phone, bgcolor) {
  const response = await fetch(`${dbUrl}/contacts.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      tel: phone,
      bgcolor,
      initials: getInitials(name),
    }),
  });
  const responseData = await response.json();
  return responseData.name;
}

/**
 * Updates existing contact in Firebase
 * @param {string} contactId - Contact ID to update
 * @param {string} name - Contact name
 * @param {string} email - Contact email
 * @param {string} phone - Contact phone
 * @param {string} bgcolor - Background color
 */
async function updateContact(contactId, name, email, phone, bgcolor) {
  await fetch(`${dbUrl}/contacts/${contactId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: contactId,
      name,
      email,
      tel: phone,
      bgcolor,
      initials: getInitials(name),
    }),
  });
}

/**
 * Finalizes signup process with animation and redirect
 */
function finalizeSignup() {
  document.getElementById("sign-up-alert").classList.add("anim-sign-up");
  resetForm();
  setTimeout(() => (window.location.href = "../index.html"), 1500);
}

/**
 * Validates form inputs and shows error messages
 * @returns {boolean} True if form is valid
 */
async function validateForm() {
  const formData = getFormInputValues();
  const error = validateFormInputs(formData);
  if (error) {
    handleValidationResult(error);
    return false;
  }

  // Check if email already exists
  const emailExists = await checkEmailExists(formData.email);
  if (emailExists) {
    handleValidationResult("Email already exists");
    return false;
  }

  return true;
}

/**
 * Extracts form input values
 * @returns {Object} Form input values
 */
function getFormInputValues() {
  return {
    name: document.getElementById("idName").value.trim().toLowerCase(),
    email: document.getElementById("idEmail").value.trim().toLowerCase(),
    password: document.getElementById("idPassword").value,
    confirmPassword: document.getElementById("idPasswordCon").value,
    checkPolicy: document.getElementById("idPolicy").checked,
  };
}

/**
 * Validates form inputs and returns error message
 * @param {Object} formData - Form input values
 * @returns {string} Error message or empty string
 */
function validateFormInputs({
  name,
  email,
  password,
  confirmPassword,
  checkPolicy,
}) {
  if (!name) return "Please enter your name";
  if (!email) return "Please enter your email address";
  if (!validateEmail(email)) return "Please enter a valid email address";
  if (!password) return "Please enter a password";
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "The passwords do not match.";
  if (!checkPolicy) return "Please accept the Privacy policy";
  return "";
}

/**
 * Handles validation result by showing errors
 * @param {string} error - Error message
 * @returns {boolean} True if validation passed
 */
function handleValidationResult(error) {
  if (error) {
    document.getElementById("render-alert").innerHTML = error;
    return false;
  }
  return true;
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

async function checkEmailExists(email) {
  const firebaseKey = formatFirebaseKey(email);
  try {
    const response = await fetch(`${dbUrl}/users/${firebaseKey}.json`);
    const data = await response.json();
    return data !== null;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return true; // Im Fehlerfall lieber Registrierung verhindern
  }
}

/**
 * Generates a random hex color
 * @returns {string} Random hex color code
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Creates initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (2 characters)
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "??";
  const nameParts = name.trim().split(/\s+/);
  return nameParts.length > 1
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : nameParts[0][0].toUpperCase();
}

/**
 * Resets form fields to initial state
 */
function resetForm() {
  const fields = [
    "idName",
    "idEmail",
    "idPassword",
    "idPasswordCon",
    "idPhone",
  ];
  fields.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.value = "";
  });
  document.getElementById("idPolicy").checked = false;
}

/**
 * Sets up password visibility toggle
 * @param {string} inputId - ID of password input field
 */
function setupPasswordToggle(inputId) {
  const elements = getPasswordToggleElements(inputId);
  initializePasswordInput(elements);
  setupToggleListeners(elements);
}

/**
 * Gets all password toggle elements
 * @param {string} inputId - Password input ID
 * @returns {Object} Password toggle elements
 */
function getPasswordToggleElements(inputId) {
  const passwordInput = document.getElementById(inputId);
  const container = passwordInput.parentElement;
  return {
    input: passwordInput,
    lock: container.querySelector(".lock-icon"),
    eyeSlash: container.querySelector(".eye-icon"),
    eye: container.querySelector(".eye-slash-icon"),
  };
}

/**
 * Initializes password input behavior
 * @param {Object} elements - Password toggle elements
 */
function initializePasswordInput({ input, lock, eyeSlash }) {
  input.addEventListener("input", () => {
    const hasValue = !!input.value;
    lock.classList.toggle("d_none", hasValue);
    eyeSlash.classList.toggle("d_none", !hasValue);
    if (!hasValue) input.type = "password";
  });
}

/**
 * Sets up toggle listeners for password visibility
 * @param {Object} elements - Password toggle elements
 */
function setupToggleListeners({ input, eyeSlash, eye }) {
  eyeSlash.addEventListener("click", () =>
    togglePasswordVisibility(input, eyeSlash, eye, true)
  );
  eye.addEventListener("click", () =>
    togglePasswordVisibility(input, eyeSlash, eye, false)
  );
}

/**
 * Toggles password visibility
 * @param {HTMLElement} input - Password input field
 * @param {HTMLElement} eyeSlash - Eye slash icon
 * @param {HTMLElement} eye - Eye icon
 * @param {boolean} show - Whether to show password
 */
function togglePasswordVisibility(input, eyeSlash, eye, show) {
  input.type = show ? "text" : "password";
  eyeSlash.classList.toggle("d_none", show);
  eye.classList.toggle("d_none", !show);
}

// Initialisierung
setupPasswordToggle("idPassword");
setupPasswordToggle("idPasswordCon");

function checkForm() {
  let email = document.getElementById("idEmail").value.trim();
  let password = document.getElementById("idPassword").value.trim();
  let name = document.getElementById("idName").value.trim();
  let passwordcon = document.getElementById("idPasswordCon").value.trim();
  let policyCheckbox = document.getElementById("idPolicy");

  let loginButton = document.getElementById("button-signup");

  const isFormValid =
    email !== "" &&
    password !== "" &&
    name !== "" &&
    policyCheckbox.checked &&
    passwordcon !== "";

  loginButton.disabled = !isFormValid;
}

document.getElementById("idEmail").addEventListener("input", checkForm);
document.getElementById("idPassword").addEventListener("input", checkForm);
document.getElementById("idPasswordCon").addEventListener("input", checkForm);
document.getElementById("idName").addEventListener("input", checkForm);
document.getElementById("idPolicy").addEventListener("change", checkForm);


/* Email input validation */

const emailInput = document.getElementById('idEmail');

const isValidEmail = (email) => {
  // einfache Regex für grundlegende Validierung
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

emailInput.addEventListener('input', () => {
  const value = emailInput.value;

  if (value === "") {
    emailInput.classList.remove('valid', 'invalid');
  } else if (isValidEmail(value)) {
    emailInput.classList.add('valid');
    emailInput.classList.remove('invalid');
  } else {
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
  }
});