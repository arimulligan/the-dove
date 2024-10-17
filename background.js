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
let currentCycle = 0;
let totalCycles = 0;
let workDuration = 0; // mins
let restDuration = 0; // mins
let remainingTime = 0; // in seconds
let isWorking = true;
let sendTimerSecs;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'START_TIMER') {
        totalCycles = request.cycles;
        workDuration = request.workDuration;
        restDuration = request.restDuration;
        currentCycle = 0;
        remainingTime = workDuration * 60; // Start with work time
        updateIcon("work");
            
        // Create alarms for the first work session and update icon every minute
        chrome.alarms.create("work", { delayInMinutes: workDuration });
        chrome.alarms.create("updateIcon", { delayInMinutes: 1, periodInMinutes: 1 }); // Update icon every minute

        isWorking = true;
        const mode = isWorking ? 'Work' : 'Rest';
        chrome.storage.sync.set({ mode: mode });
        sendResponse({ status: isWorking ? "Started work mode!" : "Started rest mode!"});
    } else if (request.cmd === 'GET_TIME') {
        sendResponse({ remainingTime: remainingTime, currentCycle: currentCycle });
    } else if (request.cmd === 'STOP_TIMER') {
        resetTimer();
        sendResponse({ status: 'success' });
    } else if (request.cmd === 'RELOAD') {
        reloadPage();
    } else if (request.cmd === 'BLOCK_CURRENT_URL') {
        blockCurrentURL(request.mode);
    } else if (request.cmd === 'CLOSE_TAB') {
        closeCurrentTab(request.milliseconds);
    } else if (request.cmd === 'SHOW_DOVE') {
        runReminderLogic();
    }
    return true;
});

// Helper function to send the current timer state to the popup
function sendTimerState() {
    chrome.runtime.sendMessage({
      action: "updateTimerState",
      remainingTime,
      totalCycles,
      currentCycle,
      isWorking
    });
}

function updateModeSendNotif(isPomodoro) {
    const mode = isWorking ? 'Work' : 'Rest';
    chrome.storage.sync.set({ mode: mode });
    const message = isPomodoro ? `Time is up... get ready to ${mode.toLowerCase()}!` 
    : "You've finished your current pomodoro! Rest mode will be on until your next work session.";
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/doveLogo48.png',
        title: `Switched to ${mode} interval.`,
        message: message,
        priority: 2
    });
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "work") {
        currentCycle++;
        remainingTime = restDuration * 60; // set remaining time for rest
        updateIcon("rest");
        chrome.alarms.create("rest", { delayInMinutes: restDuration });
        isWorking = false;
        sendTimerState();
        updateModeSendNotif(true);
    } else if (alarm.name === "rest") {
        if (currentCycle < totalCycles) {
          remainingTime = workDuration * 60; // set remaining time for work
          updateIcon("work");
          chrome.alarms.create("work", { delayInMinutes: workDuration });
          isWorking = true;
          updateModeSendNotif(true);
        } else {
          resetTimer();
          updateModeSendNotif(false);
        }
        sendTimerState();
    } else if (alarm.name === "updateIcon") {
        updateIcon(isWorking ? "work" : "rest");
    }
});

function updateIcon(type) {
    const minutesLeft = Math.ceil(remainingTime / 60); // Get the remaining time in minutes
    chrome.action.setBadgeText({ text: String(minutesLeft)+"m" });
    chrome.action.setBadgeBackgroundColor({ color: type === "work" ? "#F2A007" : "#0388A6" });

    if (remainingTime > 0) {
        if (sendTimerSecs) clearInterval(sendTimerSecs);
        sendTimerSecs = setInterval(() => {
            remainingTime--; // Decrement the remaining time every second
            sendTimerState();
        }, 1000);
    }
}

function resetTimer() {
  currentCycle = 0;
  remainingTime = 0;
  chrome.action.setBadgeText({ text: "" });
  chrome.alarms.clearAll();
  if (sendTimerSecs) clearInterval(sendTimerSecs);
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
                    const message = 'Cannot inject script into this page, sorry.';
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
const ALARM_NAME = 'dove-reminder';
const debug = true;

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

async function createReminder(interval) {
    if (debug) {
        interval = 0.5; // 30 seconds for testing
    }

    const alarm = await chrome.alarms.get(ALARM_NAME);
    if (typeof alarm === 'undefined') {
        chrome.alarms.create(ALARM_NAME, {
            periodInMinutes: interval
        });
    }
}

async function runReminderLogic() {
    chrome.storage.local.get(['showDoveIndefinitely'], async (result) => {
        const showDoveIndefinitely = result.showDoveIndefinitely ?? true;
        if (showDoveIndefinitely) {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs.length === 0) return; // No active tabs
                const activeTab = tabs[0];
                try {
                    if (tabs.length > 0) {
                        const activeTabId = activeTab.id;
                        await registerContentScript(activeTabId); // Ensure content script is injected
                        await chrome.tabs.sendMessage(activeTabId, { action: 'doveReminding' });
                    }
                } catch (error) {
                    // Create a notification to inform the user
                    if (error.message && error.message.startsWith("Cannot access a chrome:// URL")) {
                        const message = "The Dove can't fly down right now, please make sure you have a valid URL,"
                        + " or click the extension again for a refresh.";
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'icons/doveLogo128.png',
                            title: 'Dove Reminder',
                            message: message,
                            priority: 2
                        });
                    }
                    return;
                }
            });
        }
    });
};

chrome.storage.onChanged.addListener(async (changes) => {
    if (changes.reminderInterval) {
        chrome.alarms.clear(
            ALARM_NAME,
            async () => {
                await createReminder(changes.reminderInterval.newValue);
            });
    }
    // for URL blocking
    if (changes.blockedSitesRest || changes.blockedSitesWork || changes.mode) {
        updateBlockedSites();
    }
});

// Every time the user enters their URL, the dove shows up.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        chrome.storage.sync.get('reminderInterval', async (data) => {
            const interval = data.reminderInterval || 90; // 1 hour and a half
            await createReminder(interval);
        });
    }
});

chrome.alarms.onAlarm.addListener(runReminderLogic);
