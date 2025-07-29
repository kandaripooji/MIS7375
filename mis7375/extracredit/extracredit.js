// Constants for patterns, genders, and country/states
const PATTERNS = {
    name: /^[A-Za-z'\-\s]+$/,
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
            submitBtn.style.display = 'flex';
            validateBtn.style.display = 'none';
        } else {
            submitBtn.style.display = 'none';
            validateBtn.style.display = 'flex';
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
    
    // If this is the first name field and validation passes, save user info
    if (inputId === 'firstName' && document.getElementById('rememberMe').checked) {
        saveUserInfo();
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

function onSubmit(token) {
     document.getElementById("demo-form").submit();
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
        
        // Change color based on pain level
        if (parseInt(ratingInput.value) >= 7) {
            ratingValue.style.backgroundColor = '#fee2e2';
            ratingValue.style.color = '#dc2626';
        } else if (parseInt(ratingInput.value) >= 4) {
            ratingValue.style.backgroundColor = '#fef3c7';
            ratingValue.style.color = '#d97706';
        } else {
            ratingValue.style.backgroundColor = '#dcfce7';
            ratingValue.style.color = '#16a34a';
        }
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

// Format date for display
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function reviewForm() {
    const reviewSection = document.getElementById('reviewSection');
    const reviewContent = document.getElementById('reviewContent');

    if (!reviewSection || !reviewContent) {
        alert("Review section not found.");
        return;
    }

    const firstName = document.getElementById('firstName').value.trim();
    const middleInitial = document.getElementById('middleInitial').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const dob = document.getElementById('dob').value.trim();
    const ssn = document.getElementById('ssn').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address1 = document.getElementById('address1').value.trim();
    const address2 = document.getElementById('address2').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zip = document.getElementById('zip').value.trim();
    const country = document.getElementById('country').value.trim();
    const userId = document.getElementById('userId').value.trim();
    const password = document.getElementById('password').value;
    const symptoms = document.getElementById('symptoms').value.trim();
    const painLevel = parseInt(document.getElementById('healthRating').value || 5);

    const vaccinated = document.querySelector('input[name="vaccinated"]:checked');
    const insurance = document.querySelector('input[name="insurance"]:checked');
    const conditions = document.querySelectorAll('input[name="conditions"]:checked');

    let html = "<h4><i class='fas fa-clipboard-check'></i> Review Information</h4>";

    // Name
    html += "<b><i class='fas fa-user'></i> Name (First, MI, Last):</b><br>";
    if (!firstName) {
        html += "<span style='color:red'>ERROR: Missing First Name</span><br>";
    } else {
        html += `${firstName} ${middleInitial} ${lastName}<br>`;
    }
    
    // DOB
    html += "<br><b><i class='fas fa-birthday-cake'></i> Date of Birth:</b><br>";
    html += dob ? `${formatDate(dob)}<br>` : "<span style='color:red'>ERROR: Missing Date of Birth</span><br>";

    // SSN
    html += "<br><b><i class='fas fa-id-card'></i> Social Security Number:</b><br>";
    html += ssn ? `${ssn}<br>` : "<span style='color:red'>ERROR: Missing SSN</span><br>";

    // Gender
    html += "<br><b><i class='fas fa-venus-mars'></i> Gender:</b><br>";
    html += gender ? `${gender}<br>` : "<span style='color:red'>ERROR: Missing Gender</span><br>";

    // Email
    html += "<br><b><i class='fas fa-envelope'></i> Email address:</b><br>";
    html += email ? `${email}<br>` : "<span style='color:red'>ERROR: Missing Email</span><br>";

    // Phone
    html += "<br><b><i class='fas fa-phone'></i> Phone number:</b><br>";
    html += phone ? `${phone}<br>` : "<span style='color:red'>ERROR: Missing Phone Number</span><br>";

    // Address
    html += "<br><b><i class='fas fa-home'></i> Address:</b><br>";
    if (!address1) {
        html += "<span style='color:red'>ERROR: Missing Address</span><br>";
    } else {
        html += `${address1}<br>`;
        if (address2) html += `${address2}<br>`;
        html += `${city}, ${state} ${zip}<br>`;
        html += `${country}<br>`;
    }

    // Conditions
    html += "<br><b><i class='fas fa-heartbeat'></i> Medical Conditions:</b><br>";
    if (conditions.length === 0) {
        html += "<span style='color:red'>ERROR: No conditions selected</span><br>";
    } else {
        conditions.forEach(c => html += `${c.value}<br>`);
    }

    // Vaccinated
    html += "<br><b><i class='fas fa-syringe'></i> Vaccinated:</b><br>";
    if (!vaccinated) {
        html += "<span style='color:red'>ERROR: Vaccination status not selected</span><br>";
    } else {
        html += vaccinated.value === "vaccinated" ? "Yes<br>" : "No<br>";
    }

    // Insurance
    html += "<br><b><i class='fas fa-file-medical'></i> Insurance:</b><br>";
    if (!insurance) {
        html += "<span style='color:red'>ERROR: Insurance status not selected</span><br>";
    } else {
        html += insurance.value === "insured" ? "Yes<br>" : "No<br>";
    }

    // Pain Level
    html += "<br><b><i class='fas fa-thermometer-half'></i> Level of Pain:</b><br>";
    html += `<span style="${painLevel >= 7 ? 'color:#dc2626' : painLevel >= 4 ? 'color:#d97706' : 'color:#16a34a'}">${painLevel}/10 - ${painLevel >= 7 ? "SEVERE" : painLevel >= 4 ? "MODERATE" : "MILD"}</span><br>`;

    // Symptoms (required)
    html += "<br><b><i class='fas fa-notes-medical'></i> Described Symptoms:</b><br>";
    html += symptoms ? `${symptoms}<br>` : "<span style='color:red'>ERROR: Missing Symptoms Description</span><br>";

    // User ID
    html += "<br><b><i class='fas fa-user-shield'></i> User ID:</b><br>";
    html += userId ? `${userId}<br>` : "<span style='color:red'>ERROR: Missing User ID</span><br>";

    // Password
    html += "<br><b><i class='fas fa-lock'></i> Password:</b><br>";
    html += password ? "********<br>" : "<span style='color:red'>ERROR: Missing Password</span><br>";

    // Close button
    html += `<br><button onclick="closeReviewSection()" style="padding: 8px 16px; background-color: #4a7890; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;"><i class="fas fa-times"></i> Close</button>`;

    reviewContent.innerHTML = html;
    reviewSection.style.display = "block";
    reviewSection.scrollIntoView({ behavior: "smooth" });
}

// Close review section
function closeReviewSection() {
    const reviewSection = document.getElementById('reviewSection');
    if (reviewSection) {
        reviewSection.style.display = 'none';
    }
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
        // Success notification with animation
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#dcfce7';
        notification.style.color = '#16a34a';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '10000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '8px';
        notification.innerHTML = '<i class="fas fa-check-circle"></i> All fields are valid! You can now submit the form.';
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
        
        document.getElementById('validateBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'flex';
    } else {
        // Show error count notification
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#fee2e2';
        notification.style.color = '#dc2626';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '10000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '8px';
        notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> There are ${errorCount} errors in the form. Please correct them before submitting.`;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
        
        // Scroll to first error
        const firstErrorId = Object.keys(errors)[0];
        const firstErrorElement = document.getElementById(firstErrorId);
        if (firstErrorElement) {
            const section = firstErrorElement.closest('section');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

// Submit form
function submitForm() {
    if (validateAllFields()) {
        if (document.getElementById('rememberMe').checked) {
            saveUserInfo();
        } else {
            deleteCookie('userFirstName');
        }
        
        // Create success overlay
        const successOverlay = document.createElement('div');
        successOverlay.style.position = 'fixed';
        successOverlay.style.top = '0';
        successOverlay.style.left = '0';
        successOverlay.style.width = '100%';
        successOverlay.style.height = '100%';
        successOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        successOverlay.style.display = 'flex';
        successOverlay.style.alignItems = 'center';
        successOverlay.style.justifyContent = 'center';
        successOverlay.style.zIndex = '10000';
        
        // Success message
        const successMessage = document.createElement('div');
        successMessage.style.backgroundColor = 'white';
        successMessage.style.padding = '2rem';
        successMessage.style.borderRadius = '8px';
        successMessage.style.textAlign = 'center';
        successMessage.style.maxWidth = '500px';
        successMessage.style.width = '90%';
        successMessage.style.animation = 'fadeIn 0.5s ease-out';
        
        successMessage.innerHTML = `
            <div style="font-size: 4rem; color: #16a34a; margin-bottom: 1rem;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: #16a34a; margin-bottom: 1rem;">Registration Successful!</h2>
            <p style="margin-bottom: 1.5rem;">Thank you for registering with Healthcare Medical Center. We will contact you shortly to confirm your appointment.</p>
            <button id="successButton" style="background-color: #16a34a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-weight: bold; cursor: pointer;">Continue</button>
        `;
        
        successOverlay.appendChild(successMessage);
        document.body.appendChild(successOverlay);
        
        // Add event listener to button
        document.getElementById('successButton').addEventListener('click', () => {
            document.body.removeChild(successOverlay);
            window.location.href = 'ThankYou.html';
        });
    } else {
        validateForm(); // This will display the error notification
    }
}

// User Type and Cookie Consent Popups
function initPopupFlow() {
    const userTypePopup = document.getElementById('userTypePopup');
    const cookiePopup = document.getElementById('cookieConsentPopup');

    if (userTypePopup) userTypePopup.style.display = 'flex';

    // New User button
    const newUserBtn = document.getElementById('newUserBtn');
    if (newUserBtn) {
        newUserBtn.addEventListener('click', () => {
            userTypePopup.style.display = 'none';
            cookiePopup.style.display = 'flex';
        });
    }

    // Existing User button
    const existingUserBtn = document.getElementById('existingUserBtn');
    if (existingUserBtn) {
        existingUserBtn.addEventListener('click', () => {
            userTypePopup.style.display = 'none';
            loadUserInfo();
        });
    }

    // Accept Cookies button
    const acceptCookiesBtn = document.getElementById('acceptCookiesBtn');
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            cookiePopup.style.display = 'none';
            document.getElementById('rememberMe').checked = true;
            setCookie('cookieConsent', 'true', 30); // Set cookie consent for 30 days
        });
    }

    // Decline Cookies button
    const declineCookiesBtn = document.getElementById('declineCookiesBtn');
    if (declineCookiesBtn) {
        declineCookiesBtn.addEventListener('click', () => {
            cookiePopup.style.display = 'none';
            document.getElementById('rememberMe').checked = false;
        });
    }

    // Not You checkbox
    const notYouCheckbox = document.getElementById('notYouCheckbox');
    if (notYouCheckbox) {
        notYouCheckbox.addEventListener('change', handleNotYouCheckbox);
    }
}

// Load and Prefill First Name from Cookie
function loadUserInfo() {
    const firstName = getCookie('userFirstName');
    const firstNameInput = document.getElementById('firstName');
    if (firstName && firstNameInput) {
        firstNameInput.value = firstName;
        updateWelcomeMessage(firstName);
        document.getElementById('savedUserName').textContent = firstName;
        document.getElementById('notYouContainer').style.display = 'block';
    } else {
        updateWelcomeMessage('');
        document.getElementById('notYouContainer').style.display = 'none';
    }
}

// Update Welcome Message
function updateWelcomeMessage(name) {
    const welcome = document.getElementById('welcomeMessage');
    if (welcome) {
        welcome.innerHTML = name ? `<i class="fas fa-user-circle"></i> Welcome back, ${name}` : '<i class="fas fa-user-plus"></i> Welcome New User';
    }
}

// Handle "Not You?" Reset
function handleNotYouCheckbox() {
    deleteCookie('userFirstName');
    document.getElementById('patientForm').reset();
    document.getElementById('firstName').value = '';
    updateWelcomeMessage('');
    document.getElementById('notYouContainer').style.display = 'none';
    document.getElementById('notYouCheckbox').checked = false;
}

// Cookie Utility Functions
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
}

// Save First Name to Cookie
function saveUserInfo() {
    const firstName = document.getElementById('firstName').value.trim();
    const rememberMe = document.getElementById('rememberMe');
    if (firstName && rememberMe.checked) {
        setCookie('userFirstName', firstName, 2);
        updateWelcomeMessage(firstName);
    }
}

// Initialize Form
document.addEventListener('DOMContentLoaded', function() {
    // Show user type popup
    initPopupFlow();
    
    // Update current date
    updateCurrentDate();
    
    // Populate gender dropdown
    const genderSelect = document.getElementById('gender');
    if (genderSelect) {
        // Clear existing options
        while (genderSelect.options.length > 1) {
            genderSelect.remove(1);
        }
        
        // Add gender options
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
        // Clear existing options
        while (countrySelect.options.length > 1) {
            countrySelect.remove(1);
        }
        
        // Add country options
        Object.keys(COUNTRY_STATES).forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    }
    
    // Set up health rating display
    updateRatingValue();
    
    // Setup the event listeners
    
    // Form validation events
    document.getElementById('firstName').addEventListener('blur', function() {
        validateName('firstName', 'firstNameError');
    });
    document.getElementById('lastName').addEventListener('blur', function() {
        validateName('lastName', 'lastNameError');
    });
    document.getElementById('middleInitial').addEventListener('blur', function() {
        validateMiddleInitial('middleInitial', 'middleInitialError');
    });
    document.getElementById('dob').addEventListener('change', validateDob);
    document.getElementById('ssn').addEventListener('input', function() {
        formatSSN(this);
    });
    document.getElementById('ssn').addEventListener('blur', validateSSN);
    document.getElementById('gender').addEventListener('change', function() {
        validateDropdown('gender', 'genderError');
    });
    
    // Contact Information
    document.getElementById('address1').addEventListener('blur', function() {
        validateAddress('address1', 'address1Error');
    });
    document.getElementById('address2').addEventListener('blur', function() {
        validateOptionalAddress('address2', 'address2Error');
    });
    document.getElementById('city').addEventListener('blur', validateCity);
    document.getElementById('country').addEventListener('change', function() { 
        updateStates(); 
        validateDropdown('country', 'countryError'); 
    });
    document.getElementById('state').addEventListener('change', function() {
        validateDropdown('state', 'stateError');
    });
    document.getElementById('zip').addEventListener('blur', validateZip);
    document.getElementById('phone').addEventListener('input', function() {
        formatPhoneNumber(this);
    });
    document.getElementById('phone').addEventListener('blur', validatePhone);
    document.getElementById('email').addEventListener('blur', validateEmail);
    
    // Medical conditions
    const conditionsCheckboxes = document.querySelectorAll('input[name="conditions"]');
    conditionsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateConditions);
    });
    
    // Radio buttons
    const vaccinatedRadios = document.querySelectorAll('input[name="vaccinated"]');
    vaccinatedRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            validateRadio('vaccinated', 'vaccinatedError');
        });
    });
    
    const insuranceRadios = document.querySelectorAll('input[name="insurance"]');
    insuranceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            validateRadio('insurance', 'insuranceError');
        });
    });
    
    document.getElementById('symptoms').addEventListener('blur', validateSymptoms);
    
    // Account Information
    document.getElementById('userId').addEventListener('blur', validateUserId);
    document.getElementById('password').addEventListener('input', validatePassword);
    document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);
    
    // Slider for health rating
    const healthRating = document.getElementById('healthRating');
    if (healthRating) {
        healthRating.addEventListener('input', updateRatingValue);
    }
    
    // Remember Me checkbox handler
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox) {
        rememberMeCheckbox.addEventListener('change', function () {
            const firstName = document.getElementById('firstName').value.trim();
            if (this.checked && firstName && PATTERNS.name.test(firstName)) {
                saveUserInfo();
            } else {
                deleteCookie('userFirstName');
            }
        });
    }
    
    // Form buttons
    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', reviewForm);
    }
    
    const validateBtn = document.getElementById('validateBtn');
    if (validateBtn) {
        validateBtn.addEventListener('click', validateForm);
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitForm);
    }
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            document.getElementById('patientForm').reset();
            clearAllErrors();
            
            // If Remember me is unchecked, also clear cookies
            if (!document.getElementById('rememberMe').checked) {
                deleteCookie('userFirstName');
                loadUserInfo();
            }
        });
    }
    
    // Hide submit button initially
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
    
    // Initialize states dropdown based on default country
    updateStates();
});