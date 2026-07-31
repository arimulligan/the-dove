// shows the dove on the current tab
chrome.runtime.onMessage.addListener((request) => {
    if (request.cmd === 'SHOW_DOVE') {
        runReminderLogic();
    }
});

// for the dove reminder intervals
const DYNAMIC_SCRIPT_ID = 'show-dove-reminders';
const ALARM_NAME = 'dove-reminder';
const debug = false;

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
    const existingAlarm = await chrome.alarms.get(ALARM_NAME);
    if (existingAlarm && existingAlarm.periodInMinutes === interval) {
        return; // Don't recreate the alarm if it's already set with the correct interval
    }

    if (debug) {
        interval = 0.5; // 30 seconds for testing
    }

    chrome.alarms.clear(
        ALARM_NAME,
        async () => {
            chrome.alarms.create(ALARM_NAME, {
                periodInMinutes: interval
            });
        }
    );
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
                            title: 'Dove Reminder Error',
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

// LISTENERS
chrome.storage.onChanged.addListener(async (changes) => {
    if (changes.reminderInterval) {
        await createReminder(changes.reminderInterval.newValue);
    }
});

chrome.alarms.onAlarm.addListener(runReminderLogic);

// reset timer stuff if new session is created.
chrome.runtime.onStartup.addListener(()=> {
    chrome.storage.sync.get('reminderInterval', async (data) => {
        const interval = data.reminderInterval || 90; // default to 1 hour and a half
        chrome.storage.sync.set({ reminderInterval: interval });
        await createReminder(interval);
    });
});
chrome.runtime.onInstalled.addListener(()=> {
    chrome.storage.sync.get('reminderInterval', async (data) => {
        const interval = data.reminderInterval || 90; // default to 1 hour and a half
        chrome.storage.sync.set({ reminderInterval: interval });
        await createReminder(interval);
    });
});
