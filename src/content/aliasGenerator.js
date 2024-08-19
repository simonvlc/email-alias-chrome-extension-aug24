// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateAlias") {
        // If the action is to generate an alias, call the function with the base email
        generateAndInsertAlias(request.baseEmail);
    } else if (request.action === "showError") {
        // If the action is to show an error, call the error modal function
        showErrorModal(request.message);
    }
});

// Function to generate and insert the email alias
function generateAndInsertAlias(baseEmail) {
    // Find the first email input field on the page
    const emailInput = document.querySelector('input[type="email"]');
    
    // If no email input field is found, show an error
    if (!emailInput) {
        showErrorModal("No email input fields found.");
        return;
    }

    // Generate the alias
    const alias = generateAlias(baseEmail);

    // Set the value of the input
    emailInput.value = alias;
    
    // Passes the generated alias to be stored in history
    chrome.runtime.sendMessage({ action: "aliasGenerated", alias: alias });

    // Create and dispatch events to simulate user input
    // We need to do this to trigger the email validation on the page
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    emailInput.dispatchEvent(new Event('blur', { bubbles: true }));

    // Focus on the input field
    emailInput.focus();
}

// Function to generate the email alias
function generateAlias(baseEmail) {
    // Split the base email into username and domain
    const [username, domain] = baseEmail.split('@');
    
    // Get the current website's domain and extract the top-level domain
    const currentDomain = extractTopLevelDomain(window.location.hostname);
    
    // Get the current date and time
    const now = new Date();
    
    // Format the date as MMDDYY
    const date = now.toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: '2-digit'}).replace(/\//g, '');
    
    // Format the time as HHMM in 24-hour format
    const time = now.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}).replace(':', '');
    
    // Construct and return the alias
    return `${username}+${currentDomain}.${date}.${time}@${domain}`;
}

// Function to extract the top-level domain from a hostname
function extractTopLevelDomain(hostname) {
    // Split the hostname into parts
    const parts = hostname.split('.');
    
    // If there are two or fewer parts, return the whole hostname
    if (parts.length <= 2) {
        return hostname;
    }
    
    // Otherwise, return the last two parts (e.g., 'example.com')
    return parts.slice(-2).join('.');
}

// Function to show an error modal
function showErrorModal(message) {
    // Create a modal element
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #fefefe;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        border-radius: 5px;
        text-align: center;
    `;

    // Add the error message
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    modalContent.appendChild(errorMessage);

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
        padding: 10px 20px;
        margin-top: 15px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    `;
    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };
    modalContent.appendChild(closeButton);

    // Add the modal content to the modal
    modal.appendChild(modalContent);

    // Add the modal to the page
    document.body.appendChild(modal);

    // Close the modal when clicking outside of it
    modal.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    };
}
