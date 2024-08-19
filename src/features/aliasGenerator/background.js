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