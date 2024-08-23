// document.getElementById('onOrOff').addEventListener('click', () => {
//     chrome.storage.local.get(['showDove'], (result) => {
//         const showDove = result.showDove ?? false; // Default to true if undefined
//         // setting showDove to local storage 
//         chrome.storage.local.set({ showDove: !showDove }, () => {
//             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                 if (tabs.length > 0) {
//                     chrome.scripting.executeScript({
//                         target: { tabId: tabs[0].id },
//                         function: reloadPage
//                     });
//                 }
//             });
//         });
//     });
// });

// function reloadPage() {
//     location.reload();
// }
document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('taskInputNotDone').addEventListener('keydown', (event) =>{ if (event.key === 'Enter') {addTask('NotDone');}});
document.getElementById('taskInputDoing').addEventListener('keydown', (event) =>{ if (event.key === 'Enter') {addTask('Doing');}});
document.getElementById('taskInputDone').addEventListener('keydown', (event) =>{ if (event.key === 'Enter') {addTask('Done');}});

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

function loadTasks() {
    const tasks = getTasksFromStorage();
    Object.keys(tasks).forEach(section => {
        tasks[section].forEach(task => {
            addTaskToDOM(section, task);
        });
    });
    makeTaskDraggable(document.querySelector('#taskList'));
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
