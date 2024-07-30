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
      this.loadFromLocalStorage();
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
  
    getCompletedPercentage() {
      const totalTasks = this.tasks.length;
      const completedTasks = this.tasks.filter(task => task.completed).length;
      return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    }
  
    saveToLocalStorage() {
      localStorage.setItem(this.name, JSON.stringify(this.tasks));
    }
  
    loadFromLocalStorage() {
      const savedTasks = JSON.parse(localStorage.getItem(this.name));
      if (savedTasks) {
        this.tasks = savedTasks.map(task => Object.assign(new Task(), task));
      }
    }
  }
  
  class ToDoApp {
    constructor() {
      this.lists = [];
      this.loadFromLocalStorage();
      this.render();
    }
  
    addList(listName) {
      const newList = new List(listName);
      this.lists.push(newList);
      this.saveToLocalStorage();
      this.render();
    }
  
    saveToLocalStorage() {
      localStorage.setItem('toDoLists', JSON.stringify(this.lists.map(list => list.name)));
    }
  
    loadFromLocalStorage() {
      const savedLists = JSON.parse(localStorage.getItem('toDoLists'));
      if (savedLists) {
        this.lists = savedLists.map(listName => new List(listName));
      }
    }
  
    render() {
      const container = document.getElementById('lists-container');
      container.innerHTML = '';
      this.lists.forEach((list, listIndex) => {
        const listElement = document.createElement('div');
        listElement.className = 'list';
  
        const listNameElement = document.createElement('div');
        listNameElement.className = 'list-name';
        listNameElement.textContent = list.name;
  
        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.placeholder = 'New Task';
  
        const addTaskButton = document.createElement('button');
        addTaskButton.textContent = 'Add Task';
        addTaskButton.addEventListener('click', () => {
          if (taskInput.value) {
            list.addTask(taskInput.value);
            this.render();
          }
        });
  
        const tasksContainer = document.createElement('div');
        list.tasks.forEach((task, taskIndex) => {
          const taskElement = document.createElement('div');
          taskElement.className = 'task';
  
          const taskNameElement = document.createElement('span');
          taskNameElement.textContent = task.name;
          if (task.completed) {
            taskNameElement.classList.add('completed');
          }
  
          const taskButtons = document.createElement('div');
          taskButtons.className = 'task-buttons';
  
          const toggleButton = document.createElement('button');
          toggleButton.className = 'toggle';
          toggleButton.textContent = task.completed ? 'Undo' : 'Complete';
          toggleButton.addEventListener('click', () => {
            list.toggleTaskCompletion(taskIndex);
            this.render();
          });
  
          const removeButton = document.createElement('button');
          removeButton.className = 'remove';
          removeButton.textContent = 'Remove';
          removeButton.addEventListener('click', () => {
            list.removeTask(taskIndex);
            this.render();
          });
  
          taskButtons.appendChild(toggleButton);
          taskButtons.appendChild(removeButton);
          taskElement.appendChild(taskNameElement);
          taskElement.appendChild(taskButtons);
          tasksContainer.appendChild(taskElement);
        });
  
        const completedPercentageElement = document.createElement('div');
        completedPercentageElement.className = 'completed-percentage';
        completedPercentageElement.textContent = `Completed: ${list.getCompletedPercentage()}%`;
  
        listElement.appendChild(listNameElement);
        listElement.appendChild(taskInput);
        listElement.appendChild(addTaskButton);
        listElement.appendChild(tasksContainer);
        listElement.appendChild(completedPercentageElement);
        container.appendChild(listElement);
      });
    }
  }
  
  const app = new ToDoApp();
  
  document.getElementById('new-list-button').addEventListener('click', () => {
    const listName = document.getElementById('list-name').value;
    if (listName) {
      app.addList(listName);
    }
  });
  