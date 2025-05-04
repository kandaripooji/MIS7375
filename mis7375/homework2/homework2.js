// Constants
// Regular expression patterns for form validation
const PATTERNS = {
    name: /^[A-Za-z\'\-]+$/,
    middleInitial: /^[A-Za-z]$/,
    phone: /^\d{3}-\d{3}-\d{4}$/,
    ssn: /^\d{3}-\d{2}-\d{4}$/,
    zip: /^\d{5}(-\d{4})?$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    userId: /^[A-Za-z][A-Za-z0-9_\-]{4,19}$/,
    password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\\/<>,.`~])[A-Za-z\d!@#$%^&*()_+\-=\\/<>,.`~]{8,30}$/
};

const GENDERS = ["Male", "Female", "Other", "Prefer Not to Say"];
const COUNTRY_STATES = {
    "United States": [
        "AL", "AK", "AZ", "AR", "CA", "CO", 
        "CT", "DE", "FL", "GA", "HI", "ID", 
        "IL", "IN", "IA", "KS", "KY", "LA", 
        "ME", "MD", "MA", "MI", "MN", 
        "MS", "MO", "MT", "NE", "NV", 
        "NH", "NJ", "NM", "NY", 
        "NC", "ND", "OH", "OK", "OR", 
        "PA", "RI", "SC", "SD", 
        "TN", "TX", "UT", "VT", "VA", "WA", 
        "WV", "WI", "WY", "DC", "PR"
    ],
    "Canada": [
        "AB", "BC", "MB", "NB", 
        "NL", "NS", "ON", "PE", 
        "QC", "SK", "NT", "NU", "YT"
    ],
    "United Kingdom": [
        "ENG", "SCO", "WAL", "NIR"
    ],
    "Australia": [
        "NSW", "VIC", "QLD", "WA", 
        "SA", "TAS", "ACT", "NT"
    ]
};

// Error messages tracker
let errorCount = 0;
const errors = {};

// DOM utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
    
    // Update error tracking
    if (message) {
        errors[elementId] = message;
    } else {
        delete errors[elementId];
    }
    
    // Update error count
    errorCount = Object.keys(errors).length;
    
    // Update submit button visibility
    updateSubmitButton();
}

function clearError(elementId) {
    showError(elementId, '');
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    // Reset error tracking
    for (const key in errors) {
        delete errors[key];
    }
    errorCount = 0;
    
    // Hide submit button
    updateSubmitButton();
}

function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    const validateBtn = document.getElementById('validateBtn');
    
    if (submitBtn && validateBtn) {
        if (errorCount === 0) {
            submitBtn.style.display = 'inline-block';
            validateBtn.style.display = 'none';
        } else {
            submitBtn.style.display = 'none';
            validateBtn.style.display = 'inline-block';
        }
    }
}

// Formatting Functions
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    if (value.length >= 6) {
        input.value = `${value.slice(0,3)}-${value.slice(3,6)}-${value.slice(6,10)}`;
    } else if (value.length >= 3) {
        input.value = `${value.slice(0,3)}-${value.slice(3)}`;
    } else {
        input.value = value;
    }
}

function formatSSN(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 9) {
        value = value.slice(0, 9);
    }
    
    if (value.length >= 5) {
        input.value = `${value.slice(0,3)}-${value.slice(3,5)}-${value.slice(5,9)}`;
    } else if (value.length >= 3) {
        input.value = `${value.slice(0,3)}-${value.slice(3)}`;
    } else {
        input.value = value;
    }
}

// Validation Functions
function validateName(inputId, errorId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    
    if (!value) {
        showError(errorId, `ERROR: ${inputId === 'firstName' ? 'First' : 'Last'} name is required`);
        return false;
    }
    
    if (value.length < 1 || value.length > 30) {
        showError(errorId, `ERROR: ${inputId === 'firstName' ? 'First' : 'Last'} name must be 1-30 characters`);
        return false;
    }
    
    if (!PATTERNS.name.test(value)) {
        showError(errorId, `ERROR: ${inputId === 'firstName' ? 'First' : 'Last'} name can only contain letters, apostrophes, and hyphens`);
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateMiddleInitial(inputId, errorId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    
    if (value && !PATTERNS.middleInitial.test(value)) {
        showError(errorId, "ERROR: Middle initial must be a single letter");
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateDob() {
    const dobInput = document.getElementById('dob');
    const dobValue = dobInput.value;
    
    if (!dobValue) {
        showError('dobError', "ERROR: Date of birth is required");
        return false;
    }
    
    const dob = new Date(dobValue);
    const now = new Date();
    const minDate = new Date();
    minDate.setFullYear(now.getFullYear() - 120); // 120 years ago
    
    if (dob > now) {
        showError('dobError', "ERROR: Date of birth cannot be in the future");
        return false;
    }
    
    if (dob < minDate) {
        showError('dobError', "ERROR: Date of birth cannot be more than 120 years ago");
        return false;
    }
    
    clearError('dobError');
    return true;
}

function validateSSN() {
    const ssnInput = document.getElementById('ssn');
    const value = ssnInput.value.trim();
    
    if (!value) {
        showError('ssnError', "ERROR: SSN is required");
        return false;
    }
    
    if (!PATTERNS.ssn.test(value)) {
        showError('ssnError', "ERROR: SSN must be in format XXX-XX-XXXX");
        return false;
    }
    
    clearError('ssnError');
    return true;
}

function validateDropdown(selectId, errorId) {
    const select = document.getElementById(selectId);
    const value = select.value;
    
    if (!value) {
        const fieldName = selectId.charAt(0).toUpperCase() + selectId.slice(1);
        showError(errorId, `ERROR: ${fieldName} is required`);
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateAddress(inputId, errorId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    
    if (!value) {
        showError(errorId, "ERROR: Address is required");
        return false;
    }
    
    if (value.length < 2 || value.length > 30) {
        showError(errorId, "ERROR: Address must be 2-30 characters");
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateOptionalAddress(inputId, errorId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    
    if (value && (value.length < 2 || value.length > 30)) {
        showError(errorId, "ERROR: Address line must be 2-30 characters if provided");
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateCity() {
    const cityInput = document.getElementById('city');
    const value = cityInput.value.trim();
    
    if (!value) {
        showError('cityError', "ERROR: City is required");
        return false;
    }
    
    if (value.length < 2 || value.length > 30) {
        showError('cityError', "ERROR: City must be 2-30 characters");
        return false;
    }
    
    clearError('cityError');
    return true;
}

function validateZip() {
    const zipInput = document.getElementById('zip');
    const value = zipInput.value.trim();
    
    if (!value) {
        showError('zipError', "ERROR: ZIP code is required");
        return false;
    }
    
    if (!PATTERNS.zip.test(value)) {
        showError('zipError', "ERROR: ZIP code must be 5 digits or 5+4 format (e.g., 12345 or 12345-6789)");
        return false;
    }
    
    clearError('zipError');
    return true;
}

function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const value = phoneInput.value.trim();
    
    if (!value) {
        showError('phoneError', "ERROR: Phone number is required");
        return false;
    }
    
    if (!PATTERNS.phone.test(value)) {
        showError('phoneError', "ERROR: Phone number must be in format 123-456-7890");
        return false;
    }
    
    clearError('phoneError');
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    let value = emailInput.value.trim();
    
    // Force lowercase
    value = value.toLowerCase();
    emailInput.value = value;
    
    if (!value) {
        showError('emailError', "ERROR: Email is required");
        return false;
    }
    
    if (!PATTERNS.email.test(value)) {
        showError('emailError', "ERROR: Email must be in format name@domain.tld");
        return false;
    }
    
    clearError('emailError');
    return true;
}

function validateConditions() {
    const checkboxes = document.querySelectorAll('input[name="conditions"]:checked');
    
    if (checkboxes.length === 0) {
        showError('conditionsError', "ERROR: Please select at least one medical condition");
        return false;
    }
    
    clearError('conditionsError');
    return true;
}

function validateRadio(name, errorId) {
    const radios = document.querySelectorAll(`input[name="${name}"]:checked`);
    
    if (radios.length === 0) {
        const fieldName = name.charAt(0).toUpperCase() + name.slice(1);
        showError(errorId, `ERROR: ${fieldName} selection is required`);
        return false;
    }
    
    clearError(errorId);
    return true;
}

function validateSymptoms() {
    const symptoms = document.getElementById('symptoms');
    const value = symptoms.value.trim();
    
    if (!value) {
        showError('symptomsError', "ERROR: Symptoms description is required");
        return false;
    }
    
    clearError('symptomsError');
    return true;
}

function validateUserId() {
    const userIdInput = document.getElementById('userId');
    const value = userIdInput.value.trim();
    
    if (!value) {
        showError('userIdError', "ERROR: Username is required");
        return false;
    }
    
    if (value.length < 5 || value.length > 20) {
        showError('userIdError', "ERROR: Username must be 5-20 characters");
        return false;
    }
    
    if (!/^[A-Za-z]/.test(value)) {
        showError('userIdError', "ERROR: Username must start with a letter");
        return false;
    }
    
    if (!/^[A-Za-z0-9_\-]+$/.test(value)) {
        showError('userIdError', "ERROR: Username can only contain letters, numbers, underscores, and dashes");
        return false;
    }
    
    clearError('userIdError');
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const userIdInput = document.getElementById('userId');
    const value = passwordInput.value;
    const userId = userIdInput.value;
    
    if (!value) {
        showError('passwordError', "ERROR: Password is required");
        return false;
    }
    
    if (value.length < 8) {
        showError('passwordError', "ERROR: Password must be at least 8 characters");
        return false;
    }
    
    if (!/[A-Z]/.test(value)) {
        showError('passwordError', "ERROR: Password must contain at least one uppercase letter");
        return false;
    }
    
    if (!/[a-z]/.test(value)) {
        showError('passwordError', "ERROR: Password must contain at least one lowercase letter");
        return false;
    }
    
    if (!/\d/.test(value)) {
        showError('passwordError', "ERROR: Password must contain at least one number");
        return false;
    }
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
        showError('passwordError', "ERROR: Password must contain at least one special character");
        return false;
    }
    
    if (value === userId) {
        showError('passwordError', "ERROR: Password cannot be the same as your username");
        return false;
    }
    
    clearError('passwordError');
    return true;
}

function validatePasswordMatch() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!confirmPassword) {
        showError('confirmPasswordError', "ERROR: Please confirm your password");
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', "ERROR: Passwords do not match");
        return false;
    }
    
    clearError('confirmPasswordError');
    return true;
}

function updateRatingValue() {
    const ratingInput = document.getElementById('healthRating');
    const ratingValue = document.getElementById('ratingValue');
    
    if (ratingInput && ratingValue) {
        ratingValue.textContent = ratingInput.value;
    }
}

// Form functions
function updateStates() {
    const countrySelect = document.getElementById("country");
    const stateSelect = document.getElementById("state");
    
    if (!countrySelect || !stateSelect) return;
    
    const selectedCountry = countrySelect.value;
    const states = COUNTRY_STATES[selectedCountry] || [];
    
    // Clear current options
    stateSelect.innerHTML = '<option value="">Select State</option>';
    
    // Add new options
    states.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
    
    // Validate after updating
    validateDropdown('state', 'stateError');
}

function updateCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        currentDateElement.textContent = currentDate;
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Review Form
function reviewForm() {
    // Validate all fields first
    validateAllFields();
    
    const reviewSection = document.getElementById('reviewSection');
    const reviewContent = document.getElementById('reviewContent');
    
    if (!reviewSection || !reviewContent) return;
    
    // Show the review section
    reviewSection.style.display = 'block';
    
    // Get form data
    const form = document.getElementById('patientForm');
    const formData = new FormData(form);
    
    // Helper function to check if a field is provided
    const isFieldProvided = (value) => value && value.trim() !== '';
    
    // Get selected conditions
    const selectedConditions = [];
    document.querySelectorAll('input[name="conditions"]:checked').forEach(checkbox => {
        selectedConditions.push(checkbox.value.charAt(0).toUpperCase() + checkbox.value.slice(1));
    });
    
    // Create review content
    const html = `
        <div class="review-section">
            <div class="review-row">
                <div>
                    <strong>Name (First, MI, Last):</strong>
                    <div>${formData.get('firstName') || ''} ${formData.get('middleInitial') || ''} ${formData.get('lastName') || ''}</div>
                    <div class="status-message">${!isFieldProvided(formData.get('firstName')) 
                        ? '<div class="error-message">ERROR: Missing First Name</div>'
                        : !isFieldProvided(formData.get('lastName'))
                            ? '<div class="error-message">ERROR: Missing Last Name</div>'
                            : '<div class="status-message">Provided</div>'}</div>
                </div>
                
                <div>
                    <strong>Date of Birth:</strong>
                    <div>${formatDate(formData.get('dob'))}</div>
                    <div class="status-message">${!isFieldProvided(formData.get('dob'))
                        ? '<div class="error-message">ERROR: Missing Date of Birth</div>'
                        : new Date(formData.get('dob')) > new Date()
                            ? '<div class="error-message">ERROR: Date of Birth cannot be in the future</div>'
                            : '<div class="status-message">Provided</div>'}</div>
                </div>
            </div>

            <div class="review-row">
                <div>
                    <strong>SSN:</strong>
                    <div>${formData.get('ssn') || ''}</div>
                    <div class="status-message">${!isFieldProvided(formData.get('ssn'))
                        ? '<div class="error-message">ERROR: Missing SSN</div>'
                        : !PATTERNS.ssn.test(formData.get('ssn'))
                            ? '<div class="error-message">ERROR: SSN must be in format XXX-XX-XXXX</div>'
                            : '<div class="status-message">Provided</div>'}</div>
                </div>
                
                <div>
                    <strong>Gender:</strong>
                    <div>${formData.get('gender') || ''}</div>
                    <div class="status-message">${!isFieldProvided(formData.get('gender'))
                        ? '<div class="error-message">ERROR: Missing Gender</div>'
                        : '<div class="status-message">Provided</div>'}</div>
                </div>
            </div>

            <div class="review-row">
                <div>
                    <strong>Email address:</strong>
                    <div>${formData.get('email') || ''}</div>
                    <div class="status-message">${!isFieldProvided(formData.get('email'))
                        ? '<div class="error-message">ERROR: Missing Email</div>'
                        : '<div class="status-message">Provided</div>'}</div>
                </div>
                
                <div>
                    <strong>Phone number:</strong>
                    <div>${formData.get('phone') || ''}</div>
                    <div class="status-message">${!isFieldProvided(formData.get('phone'))
                        ? '<div class="error-message">ERROR: Missing Phone Number</div>'
                        : !PATTERNS.phone.test(formData.get('phone'))
                            ? '<div class="error-message">ERROR: Phone must be in format 123-456-7890</div>'
                            : '<div class="status-message">Provided</div>'}</div>
                </div>
            </div>

            <div>
                <strong>Address:</strong>
                <div>${formData.get('address1') || ''}</div>
                ${formData.get('address2') ? `<div>${formData.get('address2')}</div>` : ''}
                <div>${formData.get('city') || ''} ${formData.get('state') || ''} ${formData.get('zip') || ''}</div>
                <div class="status-message">${!isFieldProvided(formData.get('address1'))
                    ? '<div class="error-message">ERROR: Missing Address</div>'
                    : !isFieldProvided(formData.get('city'))
                        ? '<div class="error-message">ERROR: Missing City</div>'
                        : !isFieldProvided(formData.get('state'))
                            ? '<div class="error-message">ERROR: Missing State</div>'
                            : !isFieldProvided(formData.get('zip'))
                                ? '<div class="error-message">ERROR: Missing ZIP Code</div>'
                                : !PATTERNS.zip.test(formData.get('zip'))
                                    ? '<div class="error-message">ERROR: ZIP code must be 5 digits or 5+4 format</div>'
                                    : '<div class="status-message">Provided</div>'}</div>
            </div>

            <div class="requested-info">
                <h3>MEDICAL CONDITIONS</h3>
                <div class="review-column">
                    ${selectedConditions.length > 0 
                        ? `<div>${selectedConditions.join('<br>')}</div>`
                        : '<div class="error-message">ERROR: No conditions selected</div>'}
                    <div>
                        ${formData.get('vaccinated') === 'vaccinated' ? '<div>Vaccinated: Yes</div>' : formData.get('vaccinated') === 'unvaccinated' ? '<div>Vaccinated: No</div>' : '<div class="error-message">ERROR: Vaccination status not selected</div>'}
                        ${formData.get('insurance') === 'insured' ? '<div>Insurance: Yes</div>' : formData.get('insurance') === 'uninsured' ? '<div>Insurance: No</div>' : '<div class="error-message">ERROR: Insurance status not selected</div>'}
                        ${parseInt(formData.get('healthRating')) >= 7 
                            ? '<div>Pain Level indicated: HIGH (' + formData.get('healthRating') + ')</div>' 
                            : '<div>Pain Level indicated: MODERATE (' + formData.get('healthRating') + ')</div>'}
                    </div>
                </div>
            </div>

            <div>
                <strong>Described Symptoms:</strong>
                <div class="symptoms-box">${formData.get('symptoms') || ''}</div>
                <div class="status-message">${!isFieldProvided(formData.get('symptoms'))
                    ? '<div class="error-message">ERROR: Missing Symptoms Description</div>'
                    : '<div class="status-message">Provided</div>'}</div>
            </div>

            <div class="review-row">
                <div>
                    <strong>User ID:</strong>
                    <div>${formData.get('userId') || ''}</div>
                    <div class="status-message">${!isFieldProvided(formData.get('userId'))
                        ? '<div class="error-message">ERROR: Missing User ID</div>'
                        : !PATTERNS.userId.test(formData.get('userId'))
                            ? '<div class="error-message">ERROR: User ID must start with a letter and be 5-20 characters with only letters, numbers, underscores, and dashes</div>'
                            : '<div class="status-message">Provided</div>'}</div>
                </div>
                <div>
                    <strong>Password:</strong>
                    <div>********</div>
                    <div class="status-message">${!isFieldProvided(formData.get('password'))
                        ? '<div class="error-message">ERROR: Missing Password</div>'
                        : formData.get('password').length < 8
                            ? '<div class="error-message">ERROR: Password must be at least 8 characters</div>'
                            : formData.get('password') !== formData.get('confirmPassword')
                                ? '<div class="error-message">ERROR: Passwords do not match</div>'
                                : '<div class="status-message">Provided</div>'}</div>
                </div>
            </div>
        </div>
    `;
    
    reviewContent.innerHTML = html;
    
    // Scroll to the review section
    reviewSection.scrollIntoView({ behavior: 'smooth' });
}

// Validate all fields
function validateAllFields() {
    // Personal Information
    validateName('firstName', 'firstNameError');
    validateMiddleInitial('middleInitial', 'middleInitialError');
    validateName('lastName', 'lastNameError');
    validateDob();
    validateSSN();
    validateDropdown('gender', 'genderError');
    
    // Contact Information
    validateAddress('address1', 'address1Error');
    validateOptionalAddress('address2', 'address2Error');
    validateCity();
    validateDropdown('country', 'countryError');
    validateDropdown('state', 'stateError');
    validateZip();
    validatePhone();
    validateEmail();
    
    // Medical History
    validateConditions();
    validateRadio('vaccinated', 'vaccinatedError');
    validateRadio('insurance', 'insuranceError');
    validateSymptoms();
    
    // Account Information
    validateUserId();
    validatePassword();
    validatePasswordMatch();
    
    return errorCount === 0;
}

// Validate form
function validateForm() {
    if (validateAllFields()) {
        alert('All fields are valid! You can now submit the form.');
        document.getElementById('validateBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'inline-block';
    } else {
        alert(`There are ${errorCount} errors in the form. Please correct them before submitting.`);
    }
}

// Submit form
function submitForm() {
    if (validateAllFields()) {
        window.location.href = 'thankyou.html';
    } else {
        alert(`There are ${errorCount} errors in the form. Please correct them before submitting.`);
    }
}

// Initialize Form
document.addEventListener('DOMContentLoaded', function() {
    // Update current date
    updateCurrentDate();
    
    // Populate gender dropdown
    const genderSelect = document.getElementById('gender');
    if (genderSelect) {
        GENDERS.forEach(gender => {
            const option = document.createElement('option');
            option.value = gender;
            option.textContent = gender;
            genderSelect.appendChild(option);
        });
    }
    
    // Populate country dropdown
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        Object.keys(COUNTRY_STATES).forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    }
    
    // Set up health rating display
    updateRatingValue();
    
    // Hide submit button initially
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
});