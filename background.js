// for URL blocking
function updateBlockedSites() {
    chrome.storage.sync.get(['mode', 'blockedSitesRest', 'blockedSitesWork'], function (result) {
        let blockedSites = [];

        // Select the appropriate blocked sites list based on the mode
        if (result.mode === 'Rest') {
            blockedSites = result.blockedSitesRest || [];
        } else if (result.mode === 'Work') {
            blockedSites = result.blockedSitesWork || [];
        }

        // Get the existing dynamic rules and clear them
        chrome.declarativeNetRequest.getDynamicRules(function (existingRules) {
            const oldRuleIds = existingRules.map(rule => rule.id);

            // Create new rules for the currently blocked sites
            const newRules = blockedSites.map((site, index) => ({
                id: index + 1,
                priority: 1,
                action: { type: 'block' },
                condition: { urlFilter: `*${site}*`, resourceTypes: ["main_frame"] }
            }));

            // Remove old rules and add new rules based on the current mode
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: oldRuleIds,
                addRules: newRules
            });
        });
    });
}

function blockCurrentURL(mode) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const url = tabs[0].url;
        if (url) {
            const blockedWebsites = "blockedSites" + mode;
            chrome.storage.sync.get([blockedWebsites], function (result) {
                let blockedSites = result[blockedWebsites] || [];
                // Add the site if it's not already in the list
                if (!blockedSites.includes(url)) {
                    blockedSites.push(url);
                    chrome.storage.sync.set({ [blockedWebsites]: blockedSites });
                }
            });
        }
    });
}

function closeCurrentTab(milliseconds) {
    setTimeout(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.remove(tabs[0].id);
        });  
    }, milliseconds);
}

// listens and executes all action messages
let countdownInterval;
let totalTime;
let timeLeft;
let counterToMinute = 0;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIMER') {
        totalTime = request.totalTime;
        timeLeft = totalTime;
        startCountdown();
    } else if (request.cmd === 'GET_TIME') {
        sendResponse({ timeLeft: timeLeft, totalTime: totalTime });
    } else if (request.cmd === 'STOP_TIMER') {
        stopCountdown();
    } else if (request.cmd === 'RELOAD') {
        reloadPage();
    } else if (request.cmd === 'BLOCK_CURRENT_URL') {
        blockCurrentURL(request.mode);
    } else if (request.cmd === 'CLOSE_TAB') {
        closeCurrentTab(request.milliseconds);
    }
    return true;
});

function startCountdown() {
    stopCountdown();
    countdownInterval = setInterval(() => {
        if (timeLeft > 0) {
            counterToMinute++;
            if (counterToMinute == 60) {
                timeLeft--;
                counterToMinute = 0;
            }
            chrome.runtime.sendMessage({ cmd: 'UPDATE_TIME', timeLeft: timeLeft, seconds: counterToMinute });
        } else {
            stopCountdown();
            counterToMinute = 0;
            chrome.storage.sync.get('mode', (data) => {
                const mode = data.mode;
                chrome.storage.sync.set({ mode: mode === 'Work' ? 'Rest' : 'Work' });
            });
        }
    }, 1000); // 1000 == 1 secs, 60000 == 1 minute
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        timeLeft = null;
        totalTime = null;
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
                    const message = `Cannot inject script into this restricted page.`;
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/doveLogo128.png',
                        title: 'Dove Reminder Issue',
                        message: message,
                        priority: 2
                    });
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
                matches: ['<all_urls>',"*://*/*"]
            }
        ]);
    }

    // Inject content script into the specified tab
    await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content-script.js']
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

    let executionCount = 0;
    const runReminderLogic = async (count) => {
        chrome.storage.local.get(['showDoveIndefinitely'], async (result) => {
            const showDoveIndefinitely = result.showDoveIndefinitely ?? true;
            if (showDoveIndefinitely) {
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    const activeTab = tabs[0];
                    try {
                        if (tabs.length > 0) {
                            const activeTabId = activeTab.id;
                            await registerContentScript(activeTabId); // Ensure content script is injected
                            const seconds = (interval * count) / 100;
                            // TODO: immplement the seconds functionality into content script
                            const result = await chrome.tabs.sendMessage(activeTabId, { action: 'doveReminding', seconds: seconds });
                            if (result !== 'received and done'){
                                console.error("hang on a minute!", result)
                            }
                        }
                    } catch (error) {
                        // Create a notification to inform the user
                        const message = `Cannot inject script into restricted page: ${activeTab.url}`;
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'icons/doveLogo128.png',
                            title: 'Dove Reminder Issue',
                            message: message,
                            priority: 2
                        });
                        return;
                    }
                });
            }
        });
    };
    runReminderLogic(executionCount);
    reminderTimer = setInterval(() => {
        executionCount++;
        runReminderLogic(executionCount);
    }, interval);
}

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get('reminderInterval', (data) => {
        const interval = data.reminderInterval || 5400000; // Default to 1.5 hours
        setReminder(interval);
    });
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.reminderInterval) {
        setReminder(changes.reminderInterval.newValue);
    }
    // for URL blocking
    if (changes.blockedSitesRest || changes.blockedSitesWork || changes.mode) {
        updateBlockedSites();
    }
});

chrome.windows.onCreated.addListener(async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length > 0) {
            const activeTabId = tabs[0].id;
            await registerContentScript(activeTabId); // Ensure content script is injected
        }
    });
});
