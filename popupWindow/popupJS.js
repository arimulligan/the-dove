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
                <div class="column-container">
                <h3 style="font-size:20px; border:5px solid #04668C; border-radius: 10px; width: 100%;">Pomodoro</h3>
                    <div class="row-container" id="displayCountdown">
                        <div class="column-container">
                            <div class="dove-text" style="align-self: flex-start;">Time Left:</div>
                            <div class="dove-countdown-before" id="countdownBefore">00:00</div>
                            <div class="dove-countdown" id="countdownDuring">00:00</div>
                            <div class="dove-countdown-after" id="countdownAfter">00:00</div>
                            <div></div><div></div>
                        </div>
                        <div class="column-container">
                            <div class="row-container">
                                <div class="dove-text" style="align-self: flex-start;" id="cyclesText">Cycles left:</div>
                                <div id="cyclesDisplay" class="dove-countdown">4</div>
                            </div>
                            <img src="/images/standingDoveWaving.gif" alt="Standing dove waving" width="200" height="133">
                        </div>
                    </div>
                    <div class="column-container" id="optionsCountdown">
                        <div class="row-container">
                            <h4 draggable="false" id="blockerHeader">Cycles: </h4>
                            <input type="number" id="cycles" min="1" value="4" draggable=false style="display: inline-block;">
                        </div>
                        
                        <div class="row-container">
                            <h4 draggable="false" id="blockerHeader">Work Interval (minutes): </h4>
                            <input type="number" id="work" min="1" value="25" draggable=false style="display: inline-block;">
                        </div>

                        <div class="row-container">
                            <h4 draggable="false" id="blockerHeader">Rest Interval (minutes): </h4>
                            <input type="number" id="rest" min="1" value="5" draggable=false style="display: inline-block;">
                        </div>
                        <button id="startBtn" class="edit-buttons">Start Timer</button>
                    </div>
                </div>
                <h3 style="font-size:20px; border:5px solid #04668C; border-radius: 10px;">Website blocker</h3>
                <ul id="taskList">
                    <div style="border: none;">
                        <h4 draggable="false" id="blockerHeader">Block the websites keyword</h4>
                        <input type="text" id="url" placeholder="Enter word here..." draggable=false style="display: inline-block;">
                    </div>
                </ul>`,
        restTab: `<h2>Rest</h2>
        <div class="column-container">
        <h3 style="font-size:20px; border:5px solid #04668C; border-radius: 10px; width: 100%;">Pomodoro</h3>
        <div class="row-container" id="displayCountdown">
            <div class="column-container">
                <div class="dove-text" style="align-self: flex-start;" id="timeLeftText">Time Left:</div>
                <div class="dove-countdown-before" id="countdownBefore">00:00</div>
                <div class="dove-countdown" id="countdownDuring">00:00</div>
                <div class="dove-countdown-after" id="countdownAfter">00:00</div>
                <div></div><div></div>
            </div>
            <div class="column-container">
                <div class="row-container">
                    <div class="dove-text" style="align-self: flex-start;" id="cyclesText">Cycles left:</div>
                    <div id="cyclesDisplay" class="dove-countdown">4</div>
                </div>
                <img src="/images/standingDoveWaving.gif" alt="Standing dove waving" width="200" height="133">
            </div>
        </div>
        </div>
        <h3 style="font-size:20px; border:5px solid #04668C; border-radius: 10px;">Website blocker</h3>
        <ul id="taskList">
            <div style="border: none;">
                <h4 draggable="false" id="blockerHeader">Block the websites keyword</h4>
                <input type="text" id="url" placeholder="Enter word here..." draggable=false style="display: inline-block;">
            </div>
        </ul>`,
        settingsTab: `<h2>Settings</h2>
                    <h3 style="font-size:20px; border:5px solid #04668C; border-radius: 10px;">Interactive Dove Reminders</h3>
                    <div class="column-container">
                        <div class="row-container">
                            <h4>Turn on/off reminders indefinitely</h4>
                            <button id="onOrOff" class="edit-buttons"></button>
                        </div>
                        <div class="row-container">
                            <h4>Change the reminder frequency here</h4>
                            <div class="column-container">
                                <input id="remIntervals" type="range" min="0.017" max="5.0" style="width: 90%;" step="0.017"></input>
                                <h4 id="remIntervalsValue"></h4>
                            </div>
                        </div>
                        <div class="row-container">
                            <h4>Make dove fly down on current page?</h4>
                            <div class="column-container">
                                <button id="showDoveNow" class="edit-buttons">Show dove!</button>
                                <h4 style="font-size:10px;">You need to be on a page with a valid URL (e.g. not a new tab).</h4>
                            </div>
                        </div>
                    </div>
                    <h3 style="font-size:20px; border:5px solid #04668C; border-radius: 10px;">Strict Mode</h3>
                    <div class="column-container">
                        <div class="row-container">
                            <h4>Get tempted to unblock sites</h4>
                            <button id="unblockOnOff" class="edit-buttons"></button>
                        </div>
                        <div class="row-container">
                            <h4>Can end rest/work cycle early</h4>
                            <button id="endCycleOnOff" class="edit-buttons"></button>
                        </div>
                        <div class="row-container">
                            <h4>Can end pomodoro anytime</h4>
                            <button id="endPomodoroOnOff" class="edit-buttons"></button>
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
        <div class="row-container">
            <div class="dove-text" style="border-top-right-radius: 0px; margin-right: 10px;">You're in rest mode!</div>
            <img src="/images/standingBird.png" alt="Standing dove" width="200" height="185">
        </div>
        <button id="endCycletoWork" class="edit-buttons" style="width: 200px;">End rest cycle early</button>
        <button id="endPomodoro" class="edit-buttons"  style="width: 200px;">End pomodoro and work</button>
        </div>
        `,
        restTab: `<div class="bg-container other">
        <h2>Rest</h2>
        <div class="row-container">
            <div class="dove-text" style="border-top-right-radius: 0px; margin-right: 10px;">You're in work mode!</div>
            <img src="/images/standingBird.png" alt="Standing dove" width="200" height="185">
        </div>
        <button id="endCycletoRest" class="edit-buttons"  style="width: 200px;">End work cycle early</button>
        <button id="endPomodoro" class="edit-buttons"  style="width: 200px;">End pomodoro and rest</button>
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
                    } else {
                        changeMainContent(targetPage, content, loadContent, button);
                    }
                });
            } else {
                changeMainContent(targetPage, content, loadContent, button);
            }
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
    taskSpan.contentEditable = true;
    taskSpan.style.cursor = "text";
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
        taskSpan.focus();
        // Add blur event to save when done editing
        taskSpan.addEventListener('blur', () => {
            if (taskSpan.textContent === "") {
                deleteTask(section, taskSpan.id);
            } else {
                task.content = taskSpan.textContent;
                taskList[section] = taskList[section].map(t =>
                    t.id === task.id ? task : t
                );
                saveTasksToStorage(taskList);
            }
        });
        
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
            'NotDone': [{
                id: "task0",
                content: "Your first task! Drag/drop, edit, or delete this."
            }],
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
    const allDraggableElements = [...sortableList.querySelectorAll("ul div")];

    sortableList.addEventListener("dragstart", (e) => {
        allDraggableElements.forEach((el) => el.style.border = '5px solid #04668C');
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.display = "none";
        }, 0);
    });

    sortableList.addEventListener("dragend", (e) => {
        allDraggableElements.forEach((el) => el.style.border = '5px solid #04668C');
        setTimeout(() => {
            e.target.style.display = "";
            draggedItem = null;
            saveTasksOrder();
        }, 0);
    });

    sortableList.addEventListener("dragover", (e) => {
        e.preventDefault();
        allDraggableElements.forEach((el) => el.style.border = '5px solid #04668C');

        let afterElement = getDragAfterElement(sortableList, e.clientY);
        if (afterElement) {
            if (afterElement.tagName === 'LI') {
                let sibling = afterElement.previousElementSibling;
                while (sibling && sibling.tagName !== 'DIV') {
                    sibling = sibling.previousElementSibling;
                }
                afterElement = sibling;
                afterElement.style.border = '5px dashed #04668C';
            }
            afterElement.style.border = '5px dashed #04668C';
            // Insert after the hovered element by using insertBefore and nextSibling
            try {
                sortableList.insertBefore(draggedItem, afterElement.nextSibling);
            } catch (error) {
                // functionality still works, because it throws the error when it's in a temporarily invliad state (when the user is still hovering)
            }
                
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll("li:not(.dragging)"), ...container.querySelectorAll(
            "div:not(.dragging)"
        ),];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height;
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
                listItem.style.paddingTop = '10px';
                listItem.style.paddingBottom = '10px';
            }
        })

        listItem.appendChild(taskSpan);
        taskList.appendChild(listItem);
    }
}

function doCountdownTimer(isWork) {
    const countdownBefore = document.getElementById('countdownBefore');
    const countdownDuring = document.getElementById('countdownDuring');
    const countdownAfter = document.getElementById('countdownAfter');
    const cyclesDisplay = document.getElementById('cyclesDisplay');
    const cyclesText = document.getElementById('cyclesText');
    const timeLeftText = document.getElementById('timeLeftText');
    const displayCountdown = document.getElementById('displayCountdown');
    let optionsCountdown;
    
    chrome.storage.sync.get('timer', (data) => { 
        const isTimerOn = data.timer;
        if (isWork) {
            optionsCountdown = document.getElementById('optionsCountdown');
            
            if (!isTimerOn) {
                displayCountdown.style.display = "none";
                optionsCountdown.style.display = "flex";
            } else {
                displayCountdown.style.display = "flex";
                optionsCountdown.style.display = "none";
            }
            document.getElementById('startBtn').addEventListener('click', () => {
                const cycles = document.getElementById('cycles').value;
                const workDuration = document.getElementById('work').value;
                const restDuration = document.getElementById('rest').value;
                chrome.runtime.sendMessage({
                  cmd: "START_TIMER",
                  cycles: parseInt(cycles),
                  workDuration: parseInt(workDuration),
                  restDuration: parseInt(restDuration)
                }, (response) => {
                    chrome.storage.sync.set({ mode: 'Work' }, () => {
                        const message = `${response.status} You will be working for
                        ${workDuration} minutes, and will be blocked out of all specified URLs.`
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: '/icons/doveLogo128.png',
                            title: 'Dove Reminder - Work',
                            message: message,
                            priority: 2
                        });
                    });
                });
            });
        } else {
            if (!isTimerOn) {
                cyclesText.innerHTML = "Go into the work tab to start a pomodoro session...";
                cyclesDisplay.style.display = "none";
                countdownAfter.style.display = "none";
                countdownBefore.style.display = "none";
                countdownDuring.style.display = "none";
                timeLeftText.style.display = "none";
    
                const smallBranchURL = chrome.runtime.getURL('/images/smallBranch.png');
                const smlBranchImg = document.createElement('img');
                smlBranchImg.src = smallBranchURL;
                smlBranchImg.id = "smallBranchURL";
                smlBranchImg.style.transform = "rotate(90deg)";
                smlBranchImg.style.left = "7%";
                smlBranchImg.style.position = "relative";
                smlBranchImg.style.width = "55vw";
                displayCountdown.style.justifyContent = "end";
                displayCountdown.insertBefore(smlBranchImg, displayCountdown.firstChild);
            }
        }
    });

    // Listen for updates from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "updateTimerState") {
            const remainingTime = request.remainingTime;

            countdownBefore.textContent = formatTime(remainingTime -1);
            countdownDuring.textContent = formatTime(remainingTime);
            countdownAfter.textContent = formatTime(remainingTime +1);

            cyclesDisplay.textContent = `${request.totalCycles - request.currentCycle}`;
            displayCountdown.style.display = "flex";
            if (isWork) {
                optionsCountdown.style.display = "none";
            } else {
                countdownAfter.style.display = "block";
                countdownBefore.style.display = "block";
                countdownDuring.style.display = "block";
                timeLeftText.style.display = "block";
                const smlBranchImg = document.getElementById('smallBranchURL');
                if (smlBranchImg) smlBranchImg.remove();
                displayCountdown.style.justifyContent = "space-between";
            }
        }
    });
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

function doChangedTab(isWork){
    const modeString = isWork ? "Work" : "Rest";
    const endPomodoroButton = document.getElementById('endPomodoro');
    const endCycle = document.getElementById(`endCycleto${modeString}`);
    chrome.storage.local.get(['showEndPomodoro', 'showEndCycle'], (result) => {
        const showEndCycle = result['showEndCycle'] ?? true; // default to true
        const showEndPomodoro = result['showEndPomodoro'] ?? true;

        if (showEndCycle || showEndPomodoro) {
            chrome.storage.sync.get('timer', (data) => { 
                const isTimerOn = data.timer;
                if (!isTimerOn) {
                    endCycle.style.display = "none";
                    if (showEndPomodoro) {
                        endPomodoroButton.style.display = "block";
                        endPomodoroButton.innerHTML = `Switch to ${modeString.toLowerCase()} mode`;
                        endPomodoroButton.addEventListener('click', ()=> {
                            chrome.storage.sync.set({ mode: modeString });
                        });
                    } else {
                        endPomodoroButton.style.display = "none";
                    }
                } else {
                    if (showEndCycle) {
                        endCycle.style.display = "block";
                        endCycle.addEventListener('click', ()=> {
                            chrome.runtime.sendMessage({ cmd: 'SKIP_CYCLE' });
                        });
                    } else {
                        endCycle.style.display = "none";
                    }
                    if (showEndPomodoro) {
                        endPomodoroButton.style.display = "block";
                        endPomodoroButton.addEventListener('click', ()=> {
                            chrome.runtime.sendMessage({ cmd: 'STOP_TIMER' }, (response)=> {
                                if (chrome.runtime.lastError) {
                                    console.error('Error in Dove extension:', chrome.runtime.lastError);
                                } else if (response && response.status === 'success') {
                                    chrome.storage.sync.set({ mode: modeString });
                                }
                            });
                        });
                    } else {
                        endPomodoroButton.style.display = "none";
                    }
                }
            });
        } else {
            endPomodoroButton.style.display = "none";
            endCycle.style.display = "none";
        }
    });
}

// WORK TAB
function loadWorkTab() {
    doCountdownTimer(true);
    doBlockWebsiteButtons("Work");
}

function loadChangedWorkTab() {
    doChangedTab(true);
}

// REST TAB
function loadRestTab() {
    doCountdownTimer(false);
    doBlockWebsiteButtons("Rest");
}

function loadChangedRestTab() {
    doChangedTab(false);
}

// SETTINGS
function loadSettings() {
    const value = document.querySelector("#remIntervalsValue");
    const input = document.querySelector("#remIntervals");
    chrome.storage.sync.get('reminderInterval', (data) => {
        const interval = data.reminderInterval;
        console.error(interval)
        if (interval) {
            const hours = Math.floor(interval / 60);
            const minutes = interval % 60;
            input.value = hours + (minutes / 60);
            console.error(hours, minutes)
            if (hours == 0 || minutes == 0) {
                value.textContent = "0 hour(s), and 1 min.";
            } else {
                value.textContent = hours+ " hour(s), and "+minutes+" mins.";
            }
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
    onOrOffButton('showEndPomodoro', 'endPomodoroOnOff');
    onOrOffButton('showEndCycle', 'endCycleOnOff');
    onOrOffButton('showDeleteBin', 'unblockOnOff');

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