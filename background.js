// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        // Check if the base email is set
        chrome.storage.sync.get(['baseEmail'], function(result) {
            if (!result.baseEmail) {
                // If base email is not set, open the options page
                chrome.runtime.openOptionsPage();
            }
        });
    }
});

// Add context menu item to access configuration
chrome.contextMenus.create({
    id: "openConfig",
    title: "Configuration",
    contexts: ["action"]
});

// Listen for context menu clicks
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "openConfig") {
        chrome.runtime.openOptionsPage();
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