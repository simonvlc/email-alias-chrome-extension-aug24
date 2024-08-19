// Listen for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        // Check if the base email is set when the extension is first installed
        chrome.storage.sync.get(['baseEmail'], function(result) {
            if (!result.baseEmail) {
                // If base email is not set, open the options page
                chrome.runtime.openOptionsPage();
            }
        });
    }
});

// Create a context menu item to open the options page
chrome.contextMenus.create({
    id: "openConfig",
    title: "Configuration",
    contexts: ["action"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    // Check if the context menu item was clicked
    if (info.menuItemId === "openConfig") {
        // Open the options page
        chrome.runtime.openOptionsPage();
    }
});
