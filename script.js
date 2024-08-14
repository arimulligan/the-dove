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

function reloadPage() {
    location.reload();
}

document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('addTaskButton').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const tasks = getTasksFromStorage();

    if (taskInput.value.trim() !== '') {
        const task = {
            id: `task${tasks.length}`,
            content: taskInput.value
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
    const taskSpan = document.createElement('span');
    taskSpan.setAttribute('id', task.id);
    taskSpan.textContent = task.content;
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

function deleteTask(taskId) {
    const tasks = getTasksFromStorage().filter(task => task.id !== taskId);
    saveTasksToStorage(tasks);
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(addTaskToDOM);
}

