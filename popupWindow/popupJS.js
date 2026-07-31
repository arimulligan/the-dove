// SETTINGS
function loadSettings() {
    const value = document.querySelector("#remIntervalsValue");
    const input = document.querySelector("#remIntervals");
    chrome.storage.sync.get('reminderInterval', (data) => {
        const interval = data.reminderInterval;
        if (interval) {
            const hours = Math.floor(interval / 60);
            const minutes = interval % 60;
            input.value = hours + (minutes / 60);
            value.textContent = hours+ " hour(s), and "+minutes+" mins.";
        } else {
            value.textContent = "0 hour(s), and 1 min.";
        }
    });
    input.addEventListener("input", (event) => {
        const time = getMinutesHours(event);
        value.textContent = time[0]+ " hour(s), and "+time[1]+" mins.";
    });
    input.addEventListener("mouseup", (event) => {
        const reminderInterval = event.target.value; // Convert hours to minutes
        const minutes = parseInt(((reminderInterval - 0.017) / (5.0 - 0.017)) * (300 - 1) + 1);
        chrome.storage.sync.set({ reminderInterval: minutes }, () => {
            alert('I will now fly down and remind you \nthrough quotes, verses, and sassy questions every: \n\n'+ minutes + " minutes.");
        });
    });

    function onOrOffButton(storageVar, elementId) {
        const toggleInteractionElem = document.getElementById(elementId);
        if (toggleInteractionElem.innerHTML == '') {
            chrome.storage.local.get(storageVar, (result) => {
                const settingOnOrOff = result[storageVar] ?? true;
                toggleInteractionElem.innerHTML = settingOnOrOff ? 'Turn Off' : 'Turn On';
            });
        }
        toggleInteractionElem.addEventListener('click', () => {
            chrome.storage.local.get(storageVar, (result) => {
                const settingOnOrOff = result[storageVar] ?? true;
                const newSetting = !settingOnOrOff;
                chrome.storage.local.set({ [storageVar]: !settingOnOrOff }, () => {
                    toggleInteractionElem.innerHTML = newSetting ? 'Turn Off' : 'Turn On';
                });
            });
        });
    }

    onOrOffButton('showDoveIndefinitely', 'onOrOff');

    const showDoveNow = document.getElementById("showDoveNow");
    showDoveNow.addEventListener('click', () => {
        chrome.runtime.sendMessage({ cmd: 'SHOW_DOVE' }, ()=> {
            checkIfBackgroundScriptWorks("Can't show the dove on this page, try another URL.");
        });
    });
}

function getMinutesHours(event) {
    const decimalHours = event.target.value;
    const n = new Date(0,0);
    n.setMinutes(+Math.round(decimalHours * 60));
    const hours = n.getHours();
    const minutes = n.getMinutes();
    return [hours, minutes];
}

function checkIfBackgroundScriptWorks(message) {
    if (chrome.runtime.lastError) {
        // Create a notification to inform the user
        chrome.notifications.create({
            type: 'basic',
            iconUrl: '/icons/doveLogo128.png',
            title: 'Dove Reminder Issue',
            message: message,
            priority: 2
        });
    }
}