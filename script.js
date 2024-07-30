class Task {
    constructor(name) {
        this.name = name;
        this.completed = false;
    }
}

class List {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    addTask(taskName) {
        const task = new Task(taskName);
        this.tasks.push(task);
        this.saveToLocalStorage();
    }

    removeTask(taskIndex) {
        this.tasks.splice(taskIndex, 1);
        this.saveToLocalStorage();
    }

    toggleTaskCompletion(taskIndex) {
        this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem(this.name, JSON.stringify(this.tasks));
    }

    loadFromLocalStorage() {
        const savedTasks = JSON.parse(localStorage.getItem(this.name));
        if (savedTasks) {
            this.tasks = savedTasks.map(taskData => {
                const task = new Task(taskData.name);
                task.completed = taskData.completed;
                return task;
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const listsContainer = document.getElementById('lists');
    const newListNameInput = document.getElementById('new-list-name');
    const newListButton = document.getElementById('new-list-button');

    newListButton.addEventListener('click', () => {
        const listName = newListNameInput.value.trim();
        if (listName) {
            const list = new List(listName);
            list.loadFromLocalStorage();
            addListToDOM(list);
            newListNameInput.value = '';
        }
    });

    function addListToDOM(list) {
        const listElement = document.createElement('div');
        listElement.className = 'list';
        listElement.innerHTML = `
            <h2 class="list-title">${list.name}</h2>
            <input type="text" class="task-input" placeholder="New Task">
            <button class="add-task-button">Add Task</button>
            <ul class="tasks-list"></ul>
        `;
        listsContainer.appendChild(listElement);

        const taskInput = listElement.querySelector('.task-input');
        const addTaskButton = listElement.querySelector('.add-task-button');
        const tasksUl = listElement.querySelector('.tasks-list');

        addTaskButton.addEventListener('click', () => {
            const taskName = taskInput.value.trim();
            if (taskName) {
                list.addTask(taskName);
                addTaskToDOM(taskName, tasksUl, list.tasks.length - 1, list);
                taskInput.value = '';
            }
        });

        list.tasks.forEach((task, index) => {
            addTaskToDOM(task.name, tasksUl, index, list, task.completed);
        });
    }

    function addTaskToDOM(taskName, ulElement, taskIndex, list, completed = false) {
        const taskLi = document.createElement('li');
        taskLi.className = completed ? 'completed' : '';
        taskLi.innerHTML = `
            <span class="task-name">${taskName}</span>
            <button class="complete-task-button">Complete</button>
            <button class="delete-task-button">Delete</button>
        `;
        ulElement.appendChild(taskLi);

        const completeButton = taskLi.querySelector('.complete-task-button');
        const deleteButton = taskLi.querySelector('.delete-task-button');

        completeButton.addEventListener('click', () => {
            list.toggleTaskCompletion(taskIndex);
            taskLi.classList.toggle('completed');
        });

        deleteButton.addEventListener('click', () => {
            list.removeTask(taskIndex);
            ulElement.removeChild(taskLi);
        });
    }
});
