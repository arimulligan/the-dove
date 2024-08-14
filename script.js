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

document.getElementById('addTaskButton').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskNum = document.querySelectorAll('li').length;

    if (taskInput.value.trim() !== '') {
        const listItem = document.createElement('li');

        const taskSpan = document.createElement('span');
        taskSpan.setAttribute('id', "newTask" + taskNum);
        taskSpan.textContent = taskInput.value;
        listItem.appendChild(taskSpan);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => taskList.removeChild(listItem);
        listItem.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(taskSpan, editButton));
        listItem.appendChild(editButton);

        taskList.appendChild(listItem);

        taskInput.value = '';
    }
}

function editTask(taskSpan, editButton) {
    if (!taskSpan.isContentEditable) {
        taskSpan.contentEditable = true;
        taskSpan.focus();
        editButton.textContent = 'Done';
    } else {
        taskSpan.contentEditable = false;
        editButton.textContent = 'Edit';
    }
}
