chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("blockedUrl", function(data) {
        const blockedUrl = data.blockedUrl || "";
        if (blockedUrl) {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [1],
                addRules: [{
                id: 1,
                priority: 1,
                action: { type: "block" },
                condition: { urlFilter: blockedUrl, resourceTypes: ["main_frame"] }
                }]
            });
        }
    });

    chrome.storage.onChanged.addListener(function(changes, area) {
        if (area === "sync") {
            if (changes.blockedUrl?.newValue) {
                const newUrl = changes.blockedUrl.newValue;
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [1],
                    addRules: [{
                        id: 1,
                        priority: 1,
                        action: { type: "block" },
                        condition: { urlFilter: newUrl, resourceTypes: ["main_frame"] }
                    }]
                });
            } else if (changes.blockedUrl?.oldValue && !changes.blockedUrl.newValue) {
                chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [1]
                });
            }
        }
    });
});

// for relaoding current tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'reload') {
        reloadPage();
        sendResponse({ success: true });
        // Indicate that the response will be sent asynchronously
        return true;
    }
});

function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
            console.error('Error querying tabs:', chrome.runtime.lastError);
            return;
        }
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: reloadTab
            });
        }
    });

    function reloadTab() {
        location.reload();
    }
}
