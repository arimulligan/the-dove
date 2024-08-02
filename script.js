document.getElementById('onOrOff').addEventListener('click', () => {
    chrome.storage.local.get(['showDove'], (result) => {
        const showDove = result.showDove ?? true; // Default to true if undefined
        // setting showDove to local storage 
        chrome.storage.local.set({ showDove: !showDove }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        function: reloadPage
                    });
                }
            });
        });
    });
});

function reloadPage() {
    location.reload();
}
