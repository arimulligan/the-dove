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

// listens and executes all action messages
let countdownInterval;
let totalTime;
let timeLeft;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIMER') { // OR Editing the timer
        totalTime = request.totalTime;
        timeLeft = totalTime;
        startCountdown();
    } else if (request.cmd === 'STOP_TIMER') {
        stopCountdown();
    } else if (request.cmd === 'GET_TIME') {
        sendResponse({ timeLeft: timeLeft, totalTime: totalTime });
    } else if (request.cmd === 'RELOAD') {
        reloadPage();
    }
});

function startCountdown() {
    stopCountdown();
    countdownInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME', timeLeft: timeLeft });
        } else {
            stopCountdown();
            chrome.runtime.sendMessage({ cmd: 'TIMER_FINISHED' });
        }
    }, 1000); // TODO: 1000==secs, change to minutes
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: reloadTab
            }, ()=> {
                let error = chrome.runtime.lastError;
                if (error && error.message &&
                    !error.message.startsWith("Cannot access contents of url \"chrome") &&
                    !error.message.startsWith("Cannot access a chrome:// URL")
                ) {
                    console.log(error.message);
                }
            });
        }
    });

    function reloadTab() {
        location.reload();
    }
}

// for the dove reminder intervals
const DYNAMIC_SCRIPT_ID = 'show-dove-reminders';
let reminderTimer;

async function registerContentScript(tabId) {
    // Check if the content script is already registered
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    const isRegistered = scripts.some((s) => s.id === DYNAMIC_SCRIPT_ID);
    
    if (!isRegistered) {
        await chrome.scripting.registerContentScripts([
            {
                id: DYNAMIC_SCRIPT_ID,
                js: ['content-script.js'],
                matches: ['<all_urls>',"*://*/*"],
                runAt: 'document_end',
                allFrames: true
            }
        ]);
    }

    // Inject content script into the specified tab
    await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content-script.js']
    }, () => {
        let error = chrome.runtime.lastError;
        if (error && error.message &&
            !error.message.startsWith("Cannot access contents of url \"chrome") &&
            !error.message.startsWith("Cannot access a chrome:// URL")
        ) {
            console.log(error.message);
        }
    });
}
const debug = true; // make dove turn up faster.
function setReminder(interval) {
    if (debug) {
        interval = 10000; // 10 seconds
    }
    if (reminderTimer) {
        clearInterval(reminderTimer);
    }

    reminderTimer = setInterval(async () => {
        chrome.storage.local.get(['showDoveIndefinitely'], async (result) => {
            const showDoveIndefinitely = result.showDoveIndefinitely ?? true;
            if (showDoveIndefinitely) {
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    try {
                        if (tabs.length > 0) {
                            const activeTabId = tabs[0].id;
                            await registerContentScript(activeTabId); // Ensure content script is injected
    
                            chrome.tabs.sendMessage(activeTabId, { action: 'doveReminding' }, (response) => {
                                if (chrome.runtime.lastError) {
                                    // TODO: Change these to notifications, so the user DOES see the dove in a diff way.
                                    console.error('Probably a chrome URL I cannot interfere with...', chrome.runtime.lastError);
                                }
                            });
                        }
                    } catch (error) {
                        // TODO: Change these to notifications, so the user DOES see the dove in a diff way.
                        console.error('Probably a chrome URL I cannot interfere with...', error);
                    }
                });
            }
        });
    }, interval);
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('reminderInterval', (data) => {
        const interval = data.reminderInterval || 5400000; // Default to 1.5 hours
        setReminder(interval);
    });
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.reminderInterval) {
        setReminder(changes.reminderInterval.newValue);
    }
});

chrome.tabs.onActivated.addListener(async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length > 0) {
            const activeTabId = tabs[0].id;
            await registerContentScript(activeTabId); // Ensure content script is injected
        }
    });
});
