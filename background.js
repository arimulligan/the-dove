// for URL blocking
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

// for the dove reminder intervals
let reminderTimer;

function setReminder(interval) {
    if (reminderTimer) {
        clearInterval(reminderTimer);
    }

    setInterval(() => {
        chrome.storage.local.get(['showDoveIndefinitely'], (result) => {
            const showDoveIndefinitely = result.showDoveIndefinitely ?? true;
            if (showDoveIndefinitely) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'doveReminding' }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error('Error sending message:', chrome.runtime.lastError);
                            }
                        });
                    }
                });
            }
        });
    }, 15000); // TODO: once finished debugging change 15000 to interval
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('reminderInterval', (data) => {
        const interval = data.reminderInterval || 5400000; // Default to 1.5 hours
        setReminder(interval);
    });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.reminderInterval) {
        setReminder(changes.reminderInterval.newValue);
    }
});
