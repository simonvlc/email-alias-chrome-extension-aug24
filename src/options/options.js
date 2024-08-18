// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to important DOM elements
    const form = document.getElementById('configForm');
    const baseEmailInput = document.getElementById('baseEmail');
    const errorMessage = document.getElementById('errorMessage');

    // Load the saved email address when the page loads
    chrome.storage.sync.get(['baseEmail'], function(result) {
        if (result.baseEmail) {
            baseEmailInput.value = result.baseEmail;
        }
    });

    // Add submit event listener to the form
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting normally
        const email = baseEmailInput.value.trim();

        if (validateEmail(email)) {
            saveEmail(email);
        } else {
            showError('Please enter a valid email address.');
        }
    });

    // Clear error message when user starts typing
    baseEmailInput.addEventListener('input', function() {
        errorMessage.textContent = '';
    });

    // Function to validate email (must be a Gmail address)
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return re.test(email);
    }

    // Function to save the email address using Chrome's storage API
    function saveEmail(email) {
        chrome.storage.sync.set({baseEmail: email}, function() {
            showSuccess('Email saved successfully!');
        });
    }

    // Function to display error messages
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.color = 'red';
    }

    // Function to display success messages
    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.color = 'green';
    }

    // Add warning when user tries to leave page without setting an email
    window.addEventListener('beforeunload', function (e) {
        if (baseEmailInput.value.trim() === '') {
            e.preventDefault(); // Cancel the event
            // This message might not be displayed in modern browsers, but the dialog will still appear
            e.returnValue = 'Are you sure? The extension won\'t work if you don\'t set a base email address.';
        }
    });
});