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
                        <h4 draggable="false" id="blockerHeader">Block the keywords</h4>
                        <input type="text" id="url" placeholder="Enter word here..." draggable=false style="display: inline-block;">
                    </div>
                </ul>
                <button id="save">Save</button>
                <button id="unblock">Unblock</button>`,
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
                <h2 style="font-size: 20px;">Keep working on sites?</h2>
                <ul id="taskList">
                    <div>
                        <h4 draggable="false" id="blockerHeader">Block the keywords</h4>
                        <input type="text" id="url" placeholder="Enter word here..." draggable=false style="display: inline-block;">
                    </div>
                </ul>
                <button id="save">Save</button>
                <button id="unblock">Unblock</button>`,
        settingsTab: `<h2>Settings</h2>
                    <h3 style="font-size:20px; border-bottom:5px solid #0388A6;">Interactive Dove Reminders:</h3>
                    <div class="column-container">
                        <div class="row-container">
                            <h4>Turn on/off reminders indefinitely?</h4>
                            <button id="onOrOff" class="edit-buttons"></button>
                        </div>
                        <div class="row-container">
                            <h4>Change the reminder frequency?</h4>
                            <div class="column-container">
                                <input id="remIntervals" type="range" min="0.25" max="23.75" step="0.25" style="width: 90%;" value="1.5"></input>
                                <h4 id="remIntervalsValue"></h4>
                            </div>
                        </div>
                        <div class="row-container">
                            <h4>Change what dove talks about?</h4>
                            <div class="column-container" id="discussion">
                                <label><input type="checkbox" name="toggle"><span>Bible verses</span></label>
                                <label><input type="checkbox" name="toggle"><span>Cheeky questions</span></label>
                            </div>
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
        workTab: `<h2>You should be in rest mode!!</h2>`,
        restTab: `<h2>You should be in work mode!!</h2>`,
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
            const currentContent = document.getElementsByClassName('selected-box')[0];
            if (currentContent.id === 'workIcon' && changes.mode.newValue === 'Rest') {
                const button = document.getElementById('restIcon');
                changeMainContent('restTab', content, loadContent, button);
            }
            else if (currentContent.id === 'restIcon' && changes.mode.newValue === 'Work') {
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

// Work and Rest Tab functions
function doBlockWebsiteButtons(mode) {
    // loading blocked websites
    chrome.storage.sync.get(["blockedSites"+mode], function (result) {
        const blockedSites = result.blockedSites || [];
        let index = 0;
        blockedSites.forEach((site, i) => {
            addWebsiteToDOM(site, index);
            index = i;
        });

        // adding a new blocked website
        document.getElementById('url').addEventListener('keydown', (event) =>{ 
            if (event.key === 'Enter') {
                const urlInput = document.getElementById('url').value;
                if (urlInput.trim() !== '') {
                    index++;
                    chrome.runtime.sendMessage({ cmd: 'BLOCK_OR_UNBLOCK_URL', 
                        site: urlInput, index: null, mode: mode });
                    addWebsiteToDOM(urlInput, index);
                    urlInput = '';
                }
            }
        });
    });

    function addWebsiteToDOM(site, index) {
        const taskList = document.querySelector('#taskList');
        const listItem = document.createElement('li');
        const taskSpan = document.createElement('span');
        taskSpan.id = index;
        taskSpan.textContent = site;
        taskSpan.addEventListener('dragstart', (e) => {
            e.preventDefault(); // make text not draggable (bug fix)
        });
        
        const removeSite = document.createElement('button');
        removeSite.id = 'deleteButton';
        removeSite.onclick = () => {
            chrome.runtime.sendMessage({ cmd: 'BLOCK_OR_UNBLOCK_URL', 
                site: site, index: index, mode: mode });
            taskList.removeChild(listItem);
        };

        const prettyBulletPoint = document.createElement('div');
        prettyBulletPoint.id = 'bulletPoint';

        listItem.appendChild(prettyBulletPoint);
        listItem.appendChild(taskSpan);
        listItem.appendChild(removeSite);
        taskList.insertBefore(listItem, taskList.nextSibling);
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
    showTimeEdits.textContent = "0 hr(s), and 50 mins.";
    editTimerRange.addEventListener("input", (event) => {
        const time = getMinutesHours(event);
        showTimeEdits.textContent = time[0]+ " hr(s), and "+time[1]+" mins.";
    });
    editTimerRange.addEventListener("mouseup", (event) => {
        const time = getMinutesHours(event);
        totalTime = (time[0] * 60) + time[1]; // Convert hours to seconds
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
    // haven't done yet
}

// REST TAB
function loadRestTab() {
    doCountdownTimer(false);
    doBlockWebsiteButtons("Rest");
}

function loadChangedRestTab() {
    // haven't done yet
}

// SETTINGS
function loadSettings() {
    const toggleInteractionElem = document.getElementById('onOrOff');
    if (toggleInteractionElem.innerHTML == '') {
        chrome.storage.local.get('showDoveIndefinitely', (result) => {
            const showDoveIndefinitely = result.showDoveIndefinitely ?? true;
            toggleInteractionElem.innerHTML = showDoveIndefinitely ? 'Turn Off' : 'Turn On';
        });
    }
    toggleInteractionElem.addEventListener('click', () => {
        chrome.storage.local.get('showDoveIndefinitely', (result) => {
            const showDoveIndefinitely = result.showDoveIndefinitely ?? true;
            toggleInteractionElem.innerHTML = showDoveIndefinitely ? 'Turn Off' : 'Turn On';
            chrome.storage.local.set({ showDoveIndefinitely: !showDoveIndefinitely }, () => {
                chrome.runtime.sendMessage({ cmd: 'RELOAD' });
            });
        });
    });

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

    // TODO: add event listnener for dove talks about (verses / questions) and send info to content script.
}

function getMinutesHours(event) {
    const decimalHours = event.target.value;
    const n = new Date(0,0);
    n.setMinutes(+Math.round(decimalHours * 60)); 
    const hours = n.getHours();
    const minutes = n.getMinutes();
    return [hours, minutes];
}