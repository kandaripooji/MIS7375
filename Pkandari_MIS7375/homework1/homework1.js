/* Place your JavaScript in this file */

/*
Program name: homework1.js
Author: Poojitha Kandari
Date created: February 5th, 2025
Date last edited: February 17th, 2025
Version: 5.0
Description: JavaScript functionality for the patient registration form
*/

// Form validation patterns
const PATTERNS = {
    phone: /^\d{3}-\d{3}-\d{4}$/,
    ssn: /^\d{3}-\d{2}-\d{4}$/,
    zip: /^\d{5}(-\d{4})?$/
};

// Utility functions
const formatPhoneNumber = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length >= 6) {
        return `${value.slice(0,3)}-${value.slice(3,6)}-${value.slice(6,10)}`;
    } else if (value.length >= 3) {
        return `${value.slice(0,3)}-${value.slice(3)}`;
    }
    return value;
};

const updateCurrentDate = () => {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = currentDate;
};

const GENDERS = ["Male", "Female", "Other"];
const COUNTRY_STATES = {
    "United States": [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
        "New Hampshire", "New Jersey", "New Mexico", "New York", 
        "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
        "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
        "West Virginia", "Wisconsin", "Wyoming"
    ],
    "Canada": [
        "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
        "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", 
        "Quebec", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"
    ],
    "India": [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ],
    "United Kingdom": [
        "England", "Scotland", "Wales", "Northern Ireland"
    ],
    "Australia": [
        "New South Wales", "Victoria", "Queensland", "Western Australia", 
        "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
    ]
};

const COUNTRIES = Object.keys(COUNTRY_STATES);

const populateDropdown = (dropdownId, items) => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Select ${dropdownId.charAt(0).toUpperCase() + dropdownId.slice(1)}</option>`;

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
};

const updateStates = () => {
    const countrySelect = document.getElementById("country");
    const stateSelect = document.getElementById("state");

    if (!countrySelect || !stateSelect) return;

    const selectedCountry = countrySelect.value;
    const states = COUNTRY_STATES[selectedCountry] || [];

    populateDropdown("state", states);
};

// Form validation functions
const validateField = (value, pattern, errorMessage) => {
    if (!pattern.test(value)) {
        throw new Error(errorMessage);
    }
};

const validateForm = (formData) => {
    // Password match validation
    if (formData.get('password') !== formData.get('confirmPassword')) {
        throw new Error('Passwords do not match!');
    }

    // Phone number validation
    validateField(
        formData.get('phone'),
        PATTERNS.phone,
        'Please enter a valid phone number in the format: 123-456-7890'
    );

    // SSN validation
    validateField(
        formData.get('ssn'),
        PATTERNS.ssn,
        'Please enter a valid SSN in the format: XXX-XX-XXXX'
    );

    // ZIP code validation
    validateField(
        formData.get('zip'),
        PATTERNS.zip,
        'Please enter a valid ZIP code in the format: 12345 or 12345-6789'
    );
};

// Event handlers

const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        validateForm(formData);
        
        // Store form data in localStorage (optional)
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        localStorage.setItem('patientFormData', JSON.stringify(formDataObj));
        
        // Redirect to Thank You page
        window.location.href = 'ThankYou.html';
    } catch (error) {
        alert(error.message);
    }
};

// Initialize form
const initializeForm = () => {
    // Update current date
    updateCurrentDate();
    
    // Populate dropdowns
    populateDropdown("gender", GENDERS);
    populateDropdown("country", COUNTRIES);
    
    // Set up health rating display
    const healthRating = document.getElementById('healthRating');
    if (healthRating) {
        const ratingValue = document.getElementById('ratingValue');
        if (ratingValue) {
            ratingValue.textContent = healthRating.value;
        }
        
        healthRating.addEventListener('input', (event) => {
            const value = event.target.value;
            document.getElementById('ratingValue').textContent = value;
        });
    }
    
    // Set up phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (event) => {
            event.target.value = formatPhoneNumber(event.target.value);
        });
    }

    // Set up country-state relationship
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        countrySelect.addEventListener('change', updateStates);
    }

    // Set up form submission
    const form = document.getElementById('patientForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeForm);