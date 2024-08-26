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
                <script src="goalsTab.js"></script>`,
        workTab: `<h2>Productivity</h2>
                <h3>URL Blocker Options</h3>
                <label for="url">Enter URL to Block:</label>
                <input type="text" id="url" placeholder="https://www.example.com">
                <button id="save">Save</button>
                <button id="unblock">Unblock</button>`,
        restTab: `<h2>Resting...</h2>`,
        settingsTab: `<div style="width: 450px; order:2">
                <h2 class="text-center">Turn off flying dove?</h2>
                <button id="onOrOff">On/Off</button>
            </div>`
    };
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
        if (data.blockedUrl) {
            document.getElementById('url').value = data.blockedUrl;
        }
    });
});

// REST TAB
function loadRestTab() {
    // haven't done yet
}

// SETTINGS
function loadSettings() {
    document.getElementById('onOrOff').addEventListener('click', () => {
        chrome.storage.local.get(['showDove'], (result) => {
            const showDove = result.showDove ?? false; // Default to true if undefined
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
}

function reloadPage() {
    location.reload();
}