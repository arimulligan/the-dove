document.addEventListener('DOMContentLoaded', () => {
    const content = {
        goalsTab: `<h2>My Goals</h2>
                <ul id="taskList">
                    <div>
                        <h3 draggable="false" id="h3NotDone">Not Done</h3>
                        <input type="text" id="taskInputNotDone" placeholder="Add a new task..." draggable=false style="display: inline-block;">
                    </div>
                    <div>
                        <h3 draggable="false" id="h3Doing">Doing</h3>
                        <input type="text" id="taskInputDoing" placeholder="Add a current task..." draggable=false style="display: inline-block;">
                    </div>
                    <div>
                        <h3 draggable="false" id="h3Done">Done</h3>
                        <input type="text" id="taskInputDone" placeholder="Add an old task..." draggable=false style="display: inline-block;">
                    </div>
                </ul>
                <h4>Remember: Double click the dove or branch to make them fly away...</h4>`,
        workTab: `<h2>Work</h2>
                <div class="timer-container">
                    <span class="circular-bg">
                        <span class="circular-progress">
                        <button id="startBtn" class="edit-buttons">Start Timer</button>
                            <input id="editTimerRange" type="range" min="0.167" max="6" step="0.167" value="0.833"></input>
                            <p id="showTimeEdits"></p>
                            <h3 class="countdown"></h3>
                        </span>
                    </span>
                </div>
                <h2 style="font-size: 20px;">Distracted on certain sites?</h2>
                <ul id="taskList">
                    <div>
                        <h4 draggable="false" id="blockerHeader">Block the keyword</h4>
                        <input type="text" id="url" placeholder="Enter word here..." draggable=false style="display: inline-block;">
                    </div>
                </ul>`,
        restTab: `<h2>Rest</h2>
                <div class="timer-container">
                    <span class="circular-bg">
                        <span class="circular-progress">
                        <button id="startBtn" class="edit-buttons">Start Timer</button>
                            <input id="editTimerRange" type="range" min="0.167" max="6" step="0.167" value="0.833"></input>
                            <p id="showTimeEdits"></p>
                            <h3 class="countdown"></h3>
                        </span>
                    </span>
                </div>
                <h2 style="font-size: 20px;">Struggling to rest?</h2>
                <ul id="taskList">
                    <div>
                        <h4 draggable="false" id="blockerHeader">Block the keyword</h4>
                        <input type="text" id="url" placeholder="Enter word here..." draggable=false style="display: inline-block;">
                    </div>
                </ul>`,
        settingsTab: `<h2>Settings</h2>
                    <h3 style="font-size:20px; border-bottom:5px solid #0388A6;">Interactive Dove Reminders:</h3>
                    <div class="column-container">
                        <div class="row-container">
                            <h4>Turn on/off reminders indefinitely</h4>
                            <button id="onOrOff" class="edit-buttons"></button>
                        </div>
                        <div class="row-container">
                            <h4>Change the reminder frequency here</h4>
                            <div class="column-container">
                                <input id="remIntervals" type="range" min="0.25" max="23.75" step="0.25" style="width: 90%;" value="1.5"></input>
                                <h4 id="remIntervalsValue"></h4>
                            </div>
                        </div>
                    </div>
                    <h3 style="font-size:20px; border-bottom:5px solid #0388A6;">Strict Mode:</h3>
                    <div class="column-container">
                        <div class="row-container">
                            <h4>Get tempted to unblock sites</h4>
                            <button id="unblockOnOff" class="edit-buttons"></button>
                        </div>
                        <div class="row-container">
                            <h4>Edit the rest and work timers</h4>
                            <button id="editTimersOnOff" class="edit-buttons"></button>
                        </div>
                    </div>
            `
    };

    // <button id="redirectBtn" class="edit-buttons">Redirect websites</button> to go below edittimerBtn (if i have time)
    const loadContent = {
        goalsTab: loadTasks,
        workTab: loadWorkTab,
        restTab: loadRestTab,
        settingsTab: loadSettings
    };

    const wrongContent = {
        workTab: `<div class="bg-container other">
        <h2>Work</h2>
        <h2>You're in rest mode!</h2>
        <button id="endRestEarly" class="edit-buttons" style="transform: translateY(300%);width: 120px;">End rest early</button>
        </div>
        `,
        restTab: `<div class="bg-container other">
        <h2>Rest</h2>
        <h2>You're in work mode!</h2>
        <button id="endWorkEarly" class="edit-buttons"  style="transform: translateY(300%);width: 120px;">End work early</button>
        </div>
        `,
    };

    const loadWrongContent = {
        workTab: loadChangedWorkTab,
        restTab: loadChangedRestTab,
    };

    document.querySelector('.boxes').addEventListener('click', (event) => {
        const button = event.target.closest('.unselected-box');
        if (button) {
            const targetPage = button.getAttribute('data-target');
            if (targetPage === 'workTab' || targetPage === 'restTab') {
                chrome.storage.sync.get('mode', (data) => {
                    const mode = data.mode;
                    if (mode === 'Rest' && targetPage === 'workTab' ||
                        mode === 'Work' && targetPage === 'restTab'
                    ) {
                        changeMainContent(targetPage, wrongContent, loadWrongContent, button);
                    }
                });
            }
            changeMainContent(targetPage, content, loadContent, button);
        }
    });

    document.querySelector('.settings-cog').addEventListener('click', (event) => {
        const targetPage = event.target.getAttribute('data-target');
        changeMainContent(targetPage, content, loadContent, null);
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.mode) {
            if (changes.mode.newValue === 'Rest') {
                const button = document.getElementById('restIcon');
                changeMainContent('restTab', content, loadContent, button);
            }
            else if (changes.mode.newValue === 'Work') {
                const button = document.getElementById('workIcon');
                changeMainContent('workTab', content, loadContent, button);
            }
        }
    });

    // load the default tab on page load
    document.getElementById('content').innerHTML = content['goalsTab'];
    loadTasks();
});

function changeMainContent(targetPage, content, loadContent, button) {
    document.getElementById('content').innerHTML = content[targetPage];
    loadContent[targetPage]();
    document.querySelectorAll('.boxes button').forEach(btn => {
        btn.classList.remove('selected-box');
        btn.classList.add('unselected-box');
    });
    if (button) {
        // Add selected-box class to the clicked button
        button.classList.remove('unselected-box');
        button.classList.add('selected-box');
    }
}

// GOALS TAB
function loadTasks() {
    document.getElementById('taskInputNotDone').addEventListener('keydown', (event) =>{ if (event.key === 'Enter') {addTask('NotDone');}});
    document.getElementById('taskInputDoing').addEventListener('keydown', (event) =>{ if (event.key === 'Enter') {addTask('Doing');}});
    document.getElementById('taskInputDone').addEventListener('keydown', (event) =>{ if (event.key === 'Enter') {addTask('Done');}});

    const tasks = getTasksFromStorage();
    Object.keys(tasks).forEach(section => {
        tasks[section].forEach(task => {
            addTaskToDOM(section, task);
        });
    });
    makeTaskDraggable(document.querySelector('#taskList'));
}

function addTask(section) {
    const taskInput = document.getElementById(`taskInput${section}`);
    const taskList = getTasksFromStorage();

    if (!taskList[section]) {
        taskList[section] = [];
    }

    if (taskInput.value.trim() !== '') {
        const task = {
            id: `task${taskList[section].length}`,
            content: taskInput.value
        };

        taskList[section].push(task);
        saveTasksToStorage(taskList);

        addTaskToDOM(section, task);
        taskInput.value = '';
    }
}

function addTaskToDOM(section, task) {
    const taskList = document.querySelector(`#taskList #h3${section}`).parentNode;
    const listItem = document.createElement('li');
    listItem.draggable = true;

    const taskSpan = document.createElement('span');
    taskSpan.id = task.id;
    taskSpan.textContent = task.content;
    taskSpan.addEventListener('dragstart', (e) => {
        e.preventDefault(); // make text not draggable (bug fix)
    });
    taskSpan.addEventListener('click', () => editTask(section, taskSpan));
    
    const deleteButton = document.createElement('button');
    deleteButton.id = 'deleteButton';
    deleteButton.onclick = () => {
        deleteTask(section, task.id);
        taskList.parentNode.removeChild(listItem);
    };

    const prettyBulletPoint = document.createElement('div');
    prettyBulletPoint.id = 'bulletPoint';

    listItem.appendChild(prettyBulletPoint);
    listItem.appendChild(taskSpan);
    listItem.appendChild(deleteButton);
    taskList.parentNode.insertBefore(listItem, taskList.nextSibling);
}

function editTask(section, taskSpan) {
    const taskList = getTasksFromStorage();
    const task = taskList[section].find(t => t.id === taskSpan.id);
    if (task !== undefined){
        if (!taskSpan.isContentEditable) {
            taskSpan.contentEditable = true;
            taskSpan.focus();
        } else {
            task.content = taskSpan.textContent;
            saveTasksToStorage(taskList);
        }
    }
}

function deleteTask(section, taskId) {
    const taskList = getTasksFromStorage();
    taskList[section] = taskList[section].filter(task => task.id !== taskId);
    saveTasksToStorage(taskList);
}

function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    if (!tasks || tasks === 'undefined') {
        return {
            'NotDone': [],
            'Doing': [],
            'Done': []
        };
    }
    return JSON.parse(tasks);
}

function saveTasksToStorage(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

/**
 * Inspiration from geeksforgeeks.org
 * @param {*} sortableList list to have draggable items
 * @param {*} draggedItem item dragging
 */
function makeTaskDraggable(sortableList) {
    let draggedItem = null;

    sortableList.addEventListener("dragstart", (e) => {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.display = "none";
        }, 0);
    });

    sortableList.addEventListener("dragend", (e) => {
        setTimeout(() => {
            e.target.style.display = "";
            draggedItem = null;
            saveTasksOrder();
        }, 0);
    });

    sortableList.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(sortableList, e.clientY);
        if (afterElement == null) {
            sortableList.appendChild(draggedItem);
        } else {
            sortableList.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll("li:not(.dragging)"), ...container.querySelectorAll(
            "div:not(.dragging)"
        ),];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveTasksOrder() {
        const sections = ['NotDone', 'Doing', 'Done'];
        const taskList = {};
        sections.forEach(section => {
            taskList[section] = [];
            const sectionElement = document.querySelector(`h3#h3${section}`).parentNode;
            item = sectionElement.nextElementSibling;
            while (item && item.tagName == 'LI') {
                const id = item.querySelector('span').id;
                const content = item.querySelector('span').textContent;
                taskList[section].push({ id, content });
                item = item.nextElementSibling;
            }
            // Reverse the array to maintain the original order
            taskList[section] = taskList[section].reverse();
        });
        saveTasksToStorage(taskList);
    }
}

// FUNCTIONS FOR WORK AND REST TABS
function doBlockWebsiteButtons(mode) {
    const setBlockedWebsites = "blockedSites" + mode;
    chrome.storage.sync.get([setBlockedWebsites], function (result) {
        let blockedSites = result[setBlockedWebsites] || [];
        blockedSites.forEach((site, i) => {
            addWebsiteToDOM(site, i, setBlockedWebsites);
        });

        // adding a new blocked website
        const urlInput = document.getElementById('url');
        if (urlInput) {
            urlInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    let urlInputValue = urlInput.value.trim();
                    if (urlInputValue !== '') {
                        if (urlInputValue.includes(" ")) {
                            urlInput.placeholder = 'Only one word...'
                        } else if (blockedSites.includes(urlInputValue)) {
                            urlInput.placeholder = 'A unique word...'
                        } else {
                            // Add the site if it's not already in the list
                            blockedSites.push(urlInputValue);
                            chrome.storage.sync.set({ [setBlockedWebsites]: blockedSites }, () => {
                                addWebsiteToDOM(urlInputValue, blockedSites.length, setBlockedWebsites);
                            });
                        }
                    }
                    urlInput.value = ''; // Clear the input field after adding
                }
            });
        }
    });

    function addWebsiteToDOM(site, index, setBlockedWebsites) {
        const taskList = document.querySelector('#taskList');
        if (!taskList) return;
        const listItem = document.createElement('li');
        listItem.classList = 'notDrag';
        const taskSpan = document.createElement('span');
        taskSpan.textContent = site;
        
        const showDeleteBin = 'showDeleteBin';
        chrome.storage.local.get({ showDeleteBin }, (result) => {
            const showDeleteBins = result[showDeleteBin];
            if (showDeleteBins) {
                const removeSite = document.createElement('button');
                removeSite.id = 'deleteButton';
                removeSite.onclick = () => {
                    chrome.storage.sync.get([setBlockedWebsites], function (result) {
                        let blockedSites = result[setBlockedWebsites];
                        if (!blockedSites) return;
                        if (blockedSites.length === 1) index = 0;
                        blockedSites.splice(index, 1); // removing site from list
                        chrome.storage.sync.set({ [setBlockedWebsites]: blockedSites }, () => {
                            taskList.removeChild(listItem);
                        });
                    })
                };
                listItem.appendChild(removeSite);
            } else {
                listItem.style.paddingTop = '20px';
            }
        })

        listItem.appendChild(taskSpan);
        taskList.appendChild(listItem);
    }
}

function doCountdownTimer(isWork) {
    const startBtn = document.getElementById('startBtn');
    const countdownView = document.getElementsByClassName('countdown')[0];
    const circularProgressEl = document.getElementsByClassName("circular-progress")[0];
    const editTimerRange = document.getElementById('editTimerRange');
    const showTimeEdits = document.getElementById('showTimeEdits');
    let circularProgress;
    let circularProgressIntervalID;
    let totalTime = 10; // debug: need to change to default 50.
    let timeLeft;

    // starting the timer / continuing the timer
    chrome.runtime.sendMessage({ cmd: 'GET_TIME' }, response => {
        if (response.timeLeft && response.totalTime) {
            timeLeft = response.timeLeft;
            totalTime = response.totalTime;
            continueTimer();
        }
    });
    startBtn.addEventListener('click', () => {
        const mode = isWork ? 'Work' : 'Rest';
        timeLeft = totalTime;
        startTimer();
        chrome.storage.sync.set({ mode: mode }, () => {
            alert(`Started ${mode} mode! You will be ${mode}ing for `+
                totalTime + ' minutes, and will be blocked out of all specified URLs.');
        });
    });

    // editing the timer
    const showEditTimers = 'showEditTimers';
    chrome.storage.local.get({ showEditTimers }, (result) => {
        const showEditTimer = result[showEditTimers];
        if (showEditTimer) {
            console.error(showEditTimer)
            showTimeEdits.textContent = "0 hr(s), and 50 mins.";
            editTimerRange.addEventListener("input", (event) => {
                const time = getMinutesHours(event);
                showTimeEdits.textContent = time[0]+ " hr(s), and "+time[1]+" mins.";
            });
            editTimerRange.addEventListener("mouseup", (event) => {
                const time = getMinutesHours(event);
                totalTime = (time[0] * 60) + time[1]; // Convert hours to seconds
            });
        } else {
            showTimeEdits.style.display = 'none';
            editTimerRange.style.display = 'none';
            console.error(showEditTimer, 'changing display')
        }
    });

    function startTimer() {
        chrome.runtime.sendMessage({ cmd: 'START_TIMER', totalTime: totalTime });
        continueTimer();
    }

    function continueTimer() {
        startBtn.style.display = "none";
        showTimeEdits.style.display = 'none';
        editTimerRange.style.display = 'none';
        // Update the countdown display by requesting time left
        chrome.runtime.onMessage.addListener((message) => {
            if (message.cmd === 'UPDATE_TIME') {
                timeLeft = message.timeLeft;
                countdownView.innerHTML = timeLeft + " minutes left";
            }
        });
        startCircularProgressAnimation();
    }

    function startCircularProgressAnimation() {
        let start = totalTime - timeLeft;
        let degreesPerSecond = 360 / totalTime;
        let degreesPerInterval = degreesPerSecond / 20;
        circularProgress = degreesPerSecond * start;
        circularProgressIntervalID = setInterval(() => {
        if (Math.round(circularProgress) === 360) {
            clearInterval(circularProgressIntervalID);
        } else {
            circularProgress = circularProgress + degreesPerInterval;
            circularProgressEl.style.background = `conic-gradient(#0388A6 ${circularProgress}deg, #04668C 0deg)`;
        }
        }, 50);
    }
}

// WORK TAB
function loadWorkTab() {
    doCountdownTimer(true);
    doBlockWebsiteButtons("Work");
}

function loadChangedWorkTab() {
    const endModeButton = document.getElementById('endRestEarly');
    endModeButton.addEventListener('click', ()=> {
        chrome.storage.sync.set({ mode: 'Work' }, ()=> {
            document.getElementById('workIcon').click();
        });
    })
}

// REST TAB
function loadRestTab() {
    doCountdownTimer(false);
    doBlockWebsiteButtons("Rest");
}

function loadChangedRestTab() {
    const endModeButton = document.getElementById('endWorkEarly');
    endModeButton.addEventListener('click', ()=> {
        chrome.storage.sync.set({ mode: 'Rest' }, ()=> {
            document.getElementById('restIcon').click();
        });
    })
}

// SETTINGS
function loadSettings() {
    const value = document.querySelector("#remIntervalsValue");
    const input = document.querySelector("#remIntervals");
    value.textContent = "1 hour(s), and 30 mins.";
    input.addEventListener("input", (event) => {
        const time = getMinutesHours(event);
        value.textContent = time[0]+ " hour(s), and "+time[1]+" mins.";
    });
    input.addEventListener("mouseup", (event) => {
        const reminderInterval = event.target.value * 3600000; // Convert hours to milliseconds
        chrome.storage.sync.set({ reminderInterval: reminderInterval }, () => {
            alert('I will now fly down and remind you \nthrough quotes, verses, and sassy questions every: \n\n'+ value.textContent);
        });
    });

    function onOrOffButton(storageVar, elementId) {
        const toggleInteractionElem = document.getElementById(elementId);
        if (toggleInteractionElem.innerHTML == '') {
            chrome.storage.local.get(storageVar, (result) => {
                const settingOnOrOff = result[storageVar] ?? true;
                console.error(settingOnOrOff, 'getting setting', storageVar)
                toggleInteractionElem.innerHTML = settingOnOrOff ? 'Turn Off' : 'Turn On';
            });
        }
        toggleInteractionElem.addEventListener('click', () => {
            chrome.storage.local.get(storageVar, (result) => {
                const settingOnOrOff = result[storageVar] ?? true;
                console.error(settingOnOrOff, 'getting setting when clicked', storageVar)
                const newSetting = !settingOnOrOff;
                chrome.storage.local.set({ [storageVar]: !settingOnOrOff }, () => {
                    console.error(
                        'set the var: ', newSetting
                    )
                    toggleInteractionElem.innerHTML = newSetting ? 'Turn Off' : 'Turn On';
                    chrome.runtime.sendMessage({ cmd: 'RELOAD' });
                });
            });
        });
    }

    onOrOffButton('showDoveIndefinitely', 'onOrOff');
    onOrOffButton('showEditTimers', 'editTimersOnOff');
    onOrOffButton('showDeleteBin', 'unblockOnOff');
}

function getMinutesHours(event) {
    const decimalHours = event.target.value;
    const n = new Date(0,0);
    n.setMinutes(+Math.round(decimalHours * 60)); 
    const hours = n.getHours();
    const minutes = n.getMinutes();
    return [hours, minutes];
}