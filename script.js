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
makeTaskDraggable(document.getElementById('taskList'), null);

function addTask(section) {
    const taskInput = document.getElementById(`taskInput${section}`);
    const tasks = getTasksFromStorage();

    if (taskInput.value.trim() !== '') {
        const task = {
            id: `task${tasks.length}`,
            content: taskInput.value,
            section: section
        };

        tasks.push(task);
        saveTasksToStorage(tasks);

        addTaskToDOM(task);
        taskInput.value = '';
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');

    const listItem = document.createElement('li');
    listItem.draggable = true;
    const taskSpan = document.createElement('span');
    taskSpan.setAttribute('id', task.id);
    taskSpan.textContent = task.content;
    taskSpan.addEventListener('dragstart', (e) => {
        e.preventDefault(); // make text not draggable (bug fix)
    });
    listItem.appendChild(taskSpan);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        deleteTask(task.id);
        taskList.removeChild(listItem);
    };
    listItem.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(taskSpan, editButton));
    listItem.appendChild(editButton);

    taskList.appendChild(listItem);
}

function editTask(taskSpan, editButton) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(t => t.id === taskSpan.id);
    if (task !== undefined){
        if (!taskSpan.isContentEditable) {
            taskSpan.contentEditable = true;
            taskSpan.focus();
            editButton.textContent = 'Done';
        } else {
            taskSpan.contentEditable = false;
            task.content = taskSpan.textContent;
            saveTasksToStorage(tasks);
            editButton.textContent = 'Edit';
        }
    }
}

function deleteTask(taskId) {
    const tasks = getTasksFromStorage().filter(task => task.id !== taskId);
    saveTasksToStorage(tasks);
}

function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    // TODO: the tasks.JSON is making this all faulty, need to fix... don't know how to!
    /**
     * My solution in such cases is to parse the complex object into a simple
     * one containing only the properties you need in the formatting of your
     *  choosing.
     * https://stackoverflow.com/questions/73455972/undefined-is-not-valid-json
     */
    if (tasks === null || tasks === undefined || tasks === '' || tasks.JSON == undefined) {
        console.error(tasks);
        return [];
    }
    return JSON.parse(tasks);
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(addTaskToDOM);
}

/**
 * Inspiration from geeksforgeeks.org
 * @param {*} sortableList list to have draggable items
 * @param {*} draggedItem item dragging
 */
function makeTaskDraggable(sortableList, draggedItem) {
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
            saveTasksToStorage();
        }, 0);
    });
    
    sortableList.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(sortableList, e.clientY);
        const currentElement = document.querySelector(".dragging");
        if (afterElement == null) {
            sortableList.appendChild(draggedItem);
        }
        else {
            sortableList.insertBefore(draggedItem, afterElement);
        }
    });
        
    const getDragAfterElement = (container, y) => {
        const draggableElements = [
            ...container.querySelectorAll(
                "li:not(.dragging)"
            ),
            ...container.querySelectorAll(
                "div:not(.dragging)"
            ),];
            
        return draggableElements.reduce(
            (closest, child) => {
                const box =
                    child.getBoundingClientRect();
                const offset =
                    y - box.top - box.height / 2;
                if (
                    offset < 0 &&
                    offset > closest.offset) {
                    return {
                        offset: offset,
                        element: child,
                    };}
                else {
                    return closest;
                }},
            {
                offset: Number.NEGATIVE_INFINITY,
            }
        ).element;
    };
}