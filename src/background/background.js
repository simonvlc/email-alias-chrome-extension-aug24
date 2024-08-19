import './configuration.js';

// Create a context menu item to view the alias history
chrome.contextMenus.create({
    id: "viewHistory",
    title: "View Alias History",
    contexts: ["action"]  // This makes it appear when right-clicking the extension icon
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "viewHistory") {
        // Open the history page in a new tab when "View Alias History" is clicked
        chrome.tabs.create({ url: chrome.runtime.getURL("src/history/history.html") });
    }
});

// Function to store a new alias in the history
function storeAlias(alias) {
    chrome.storage.sync.get(['aliasHistory'], function(result) {

        // Check that we can access the alias history
        if (chrome.runtime.lastError) {
            console.error('Error retrieving alias history:', chrome.runtime.lastError);
            return;
        }

        // Get the current history or initialize an empty array if it doesn't exist
        let history = result.aliasHistory || [];
        
        // Add the new alias to the beginning of the array
        history.unshift({ alias: alias, date: new Date().toISOString() });
        
        // Keep only the latest 1000 aliases
        history = history.slice(0, 1000);
        
        // Save the updated history back to storage
        chrome.storage.sync.set({ aliasHistory: history });

        // 
        chrome.storage.sync.set({ aliasHistory: history }, function() {
            if (chrome.runtime.lastError) {
                console.error('Error saving alias history:', chrome.runtime.lastError);
            }
        });
    });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "aliasGenerated") {
        // When a new alias is generated, store it in the history
        storeAlias(request.alias);
    }
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get(['baseEmail'], function(result) {
        if (!result.baseEmail) {
            // Base email not set, show error
            chrome.tabs.sendMessage(tab.id, {action: "showError", message: "Base email is not set."});
        } else {
            // Generate and insert alias
            chrome.tabs.sendMessage(tab.id, {action: "generateAlias", baseEmail: result.baseEmail});
        }
    });
});