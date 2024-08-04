document.getElementById('save').addEventListener('click', function() {
    const url = document.getElementById('url').value;
        if (url) {
        chrome.storage.sync.set({ blockedUrl: url }, function() {
            chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1],
            addRules: [{
                id: 1,
                priority: 1,
                action: { type: "block" },
                condition: { urlFilter: url, resourceTypes: ["main_frame"] }
            }]
            }, function() {
            alert('URL saved and will be blocked.');
            });
        });
    }
});

document.getElementById('unblock').addEventListener('click', function() {
    chrome.storage.sync.remove('blockedUrl', function() {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1]
        }, function() {
            alert('URL unblocked.');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get('blockedUrl', function(data) {
        if (data.blockedUrl) {
            document.getElementById('url').value = data.blockedUrl;
        }
    });
});
