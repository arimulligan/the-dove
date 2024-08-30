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
                </ul>`,
        workTab: `<h2>Work</h2>
                <button id="editTimersBtn" class="edit-buttons">Edit Timers</button>
                <div class="timer-container">
                    <span class="circular-bg">
                        <span class="circular-progress">
                            <button id="startBtn">Start working</button>
                            <h3 class="countdown"></h3>
                        </span>
                    </span>
                </div>
                <h2 style="font-size: 20px; right: 15%; top: -11%;">Distracted on certain sites?</h2>
                <ul id="taskList">
                    <div>
                        <h4 draggable="false" id="blockerHeader">Block the keywords</h4>
                        <input type="text" id="taskInputBlockerHeader" placeholder="Enter word here..." draggable=false style="display: inline-block;">
                    </div>
                </ul>
                <label for="url">Enter URL to Block:</label>
                <input type="text" id="url" placeholder="https://www.example.com">
                <button id="save">Save</button>
                <button id="unblock">Unblock</button>`,
        restTab: `<h2>Resting...</h2>`,
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
                                <input id="remIntervals" type="range" min="0" max="23.75" step="0.25" style="width: 90%;" value="1.5"></input>
                                <h4 id="remIntervalsValue"></h4>
                            </div>
                        </div>
                    </div>
            `
    };

    // <button id="redirectBtn" class="edit-buttons">Redirect websites</button> to go below edittimersBtn (if i have time)
    const loadContent = {
        goalsTab: loadTasks,
        workTab: loadWorkTab,
        restTab: loadRestTab,
        settingsTab: loadSettings
    };

document.querySelector('.boxes').addEventListener('click', (event) => {
        const button = event.target.closest('.unselected-box');
        if (button) {
            const targetPage = button.getAttribute('data-target');
            document.getElementById('content').innerHTML = content[targetPage];
            loadContent[targetPage]();

            // Remove selected-box class from all buttons
            document.querySelectorAll('.boxes button').forEach(btn => {
                btn.classList.remove('selected-box');
                btn.classList.add('unselected-box');
            });

            // Add selected-box class to the clicked button
            button.classList.remove('unselected-box');
            button.classList.add('selected-box');
        }
    });

    document.querySelector('.settings-cog').addEventListener('click', (event) => {
        const targetPage = event.target.getAttribute('data-target');
        document.getElementById('content').innerHTML = content[targetPage];
        loadContent.settingsTab();

        document.querySelectorAll('.boxes button').forEach(btn => {
            btn.classList.remove('selected-box');
            btn.classList.add('unselected-box');
        });
    });

    // load the default tab on page load
    document.getElementById('content').innerHTML = content['goalsTab'];
    loadTasks();
});

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

// WORK TAB
function loadWorkTab() {
    doCountdownTimer();

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
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get('blockedUrl', function(data) {
        if (data.blockedUrl && document.getElementById('url')) {
            document.getElementById('url').value = data.blockedUrl;
        }
    });
});

function doCountdownTimer() {
    const startBtn = document.getElementById('startBtn');
    const editTimersBtn = document.getElementById('editTimersBtn');
    const countdownView = document.getElementsByClassName('countdown')[0];
    const circularProgressEl = document.getElementsByClassName("circular-progress")[0];
    let circularProgress;
    let circularProgressIntervalID;
    let totalTime = 10;
    let timeLeft;
    let countDownIntervalID;
    let isPaused = false;
    let running = false;

    startBtn.addEventListener('click', startTimer);
    editTimersBtn.addEventListener('click', editTimers);

    function startTimer() {
        if (countDownIntervalID === undefined && !isPaused && !running) {
            timeLeft = totalTime;
            startBtn.style.display = "none";
        }
        
        countDownIntervalID = setInterval(() => {
            countdownView.innerHTML = timeLeft + " minutes left";
            if (timeLeft === 0) {
                stopTimer();
                countdownView.innerHTML = 'Finished';
                return;
            } else {
                timeLeft = timeLeft - 1;
            }
        }, 1000); // TODO: change to minutes
        
        running = true;
        startCircularProgressAnimation();
    }

    function stopTimer() {
        if (countDownIntervalID !== undefined) {
            clearInterval(countDownIntervalID);
            countDownIntervalID = undefined;
            stopCircularProgressAnimation();
        }
    }

    function editTimers() {
        if (!running){

        } else {
            isPaused = !isPaused;
            editTimersBtn.innerHTML = isPaused ? 'Resume' : 'Pause';
            if (countDownIntervalID !== undefined) {
                stopTimer();
            } else {
                startTimer();
            }
        }
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
    
    function stopCircularProgressAnimation() {
        clearInterval(circularProgressIntervalID);
        if (!isPaused) {
            circularProgressEl.style.background = `conic-gradient(#0388A6 0deg, #04668C 0deg)`;
        }
    }
}

// REST TAB
function loadRestTab() {
    // haven't done yet
}

// SETTINGS
function loadSettings() {
    const toggleInteractionElem = document.getElementById('onOrOff');
    if (toggleInteractionElem.innerHTML == '') {
        chrome.storage.local.get('showDove', (result) => {
            const showDove = result.showDove ?? true;
            toggleInteractionElem.innerHTML = showDove ? 'Turn Off' : 'Turn On';
        });
    }
    toggleInteractionElem.addEventListener('click', () => {
        chrome.storage.local.get('showDove', (result) => {
            const showDove = result.showDove ?? true;
            toggleInteractionElem.innerHTML = showDove ? 'Turn Off' : 'Turn On';
            chrome.storage.local.set({ showDove: !showDove }, () => {
                reloadPage();
            });
        });
    });

    const value = document.querySelector("#remIntervalsValue");
    const input = document.querySelector("#remIntervals");
    value.textContent = "1 hour(s), and 30 minutes.";
    input.addEventListener("input", (event) => {
        const decimalHours = event.target.value;
        const n = new Date(0,0);
        n.setMinutes(+Math.round(decimalHours * 60)); 
        const hours = n.getHours()
        const minutes = n.getMinutes()

        value.textContent = hours+ " hour(s), and "+minutes+" minutes.";
    });
    input.addEventListener("mouseup", (event) => {
        chrome.storage.sync.set({ reminderInterval: event.target.value }, () => {
            alert('I will now fly down and remind you \nthrough quotes, verses, and sassy questions every: \n\n'+ value.textContent);
        });
    });
}

function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
            console.error('Error querying tabs:', chrome.runtime.lastError);
            return;
        }
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: reloadTab
            });
        }
    });

    function reloadTab() {
        location.reload();
    }
}
