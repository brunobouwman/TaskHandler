class TaskCreator {
  constructor(title, description, extraInfo, id) {
    this.title = title;
    this.description = description;
    this.extraInfo = extraInfo;
    this.id = id;
  }
}

class Tasks {
  onGoingTasks = [];
  finishedTasks = [];
  id = 0;

  constructor() {}

  newTaskObj(title, description, extraInfo, id, action, taskEl) {
    const newTask = new TaskCreator(title, description, extraInfo, id);
    if (action === 'Finish') {
      this.render(action, taskEl, newTask); //bind this?
    } else {
      this.render(action, taskEl, newTask);
    }
  }

  newTaskElement(action) {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const extraInfo = document.getElementById('extra-info');
    const taskElement = document.createElement('li');
    taskElement.id = this.id;
    taskElement.classList = 'card';
    taskElement.innerHTML = `
    <h2>${title.value}</h2>
    <p>${description.value}</p>
    <button class="alt">More Info</button>
    <button >${action}</button>`;
    this.newTaskObj(
      title.value,
      description.value,
      extraInfo.value,
      this.id,
      action,
      taskElement
    );
  }

  render(action, taskEl, newTask) {
    const handlers = new TaskHandler(); //pass action ?
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    handlers.removeBackAndModal();
    if (action === 'Finish') {
      handlers.onGoingTasks.push(newTask);
      onGoingTaskList.append(taskEl);
      const moreInfoBtn = taskEl.querySelector('button');
      const activateBtn = taskEl.querySelector('button:last-of-type');
      moreInfoBtn.addEventListener(
        'click',
        handlers.extraInfoHandler.bind(handlers, newTask)
      );
      activateBtn.addEventListener(
        'click',
        handlers.activateTaskHandler.bind(handlers, newTask, taskEl)
      );
    } else {
      handlers.finishedTasks.push(newTask);
      finishedTaskList.append(taskEl);
      const moreInfoBtn = taskEl.querySelector('button');
      const finishBtn = taskEl.querySelector('button:last-of-type');
      moreInfoBtn.addEventListener(
        'click',
        handlers.extraInfoHandler.bind(handlers, newTask)
      );
      finishBtn.addEventListener(
        'click',
        handlers.finishTaskHandler.bind(handlers, newTask, taskEl)
      );
    }
    this.id++;
    handlers.clearInputs();
  }
}

class TaskHandler extends Tasks {
  id = 0;
  onGoingTasks = [];
  finishedTasks = [];

  constructor() {
    super();
  }

  removeBackAndModal() {
    const backdrop = document.getElementById('backdrop-id');
    const addModal = document.getElementById('add-task-modal-id');
    const infoModal = document.getElementById('more-info-modal-id');
    this.clearInputs();
    backdrop.classList.remove('visible');
    addModal.classList.remove('visible');
    infoModal.classList.remove('visible');
  }

  showBackdrop() {
    const backdrop = document.getElementById('backdrop-id');
    backdrop.classList.add('visible');
    backdrop.addEventListener('click', this.removeBackAndModal.bind(this));
  }

  showAddModal() {
    const addModal = document.getElementById('add-task-modal-id');
    addModal.classList.add('visible');
    this.showBackdrop();
  }

  clearInputs() {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const extraInfo = document.getElementById('extra-info');
    title.value = '';
    description.value = '';
    extraInfo.value = '';
  }

  addTaskHandler() {
    // $("#title").focus();
    this.showAddModal();
  }

  extraInfoHandler(taskObj) {
    const infoModal = document.getElementById('more-info-modal-id');
    this.showBackdrop();
    infoModal.classList.add('visible');
    if(this.onGoingTasks.includes(taskObj)) {
    for (const task of this.onGoingTasks) {
      if (task.id === taskObj.id) {
        infoModal.innerHTML = `
            <p>${task.extraInfo}</p>`;
        break;
      }
    }
  }else {
    for (const task of this.finishedTasks) {
      if (task.id === taskObj.id) {
        infoModal.innerHTML = `
        <p>${task.extraInfo}</p>`;
    break;
      }
    }
  }
}

  finishTaskHandler(newTask, element) {
    let taskIndex = 0;
    const onGoingTaskSection = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    for (const task of this.onGoingTasks) {
      if (task.id === newTask.id) {
        break;
      } else taskIndex++;
    }
    this.onGoingTasks.splice(taskIndex, 1);
    onGoingTaskSection.children[taskIndex].remove();
    element.innerHTML = `<h2>${newTask.title}</h2>
    <p>${newTask.description}</p>
    <button class="alt">More Info</button>
    <button >Activate</button>
    `;
    finishedTaskList.prepend(element);
    const moreInfoBtn = element.querySelector('button');
    const activateBtn = element.querySelector('button:last-of-type');
    moreInfoBtn.addEventListener(
      'click',
      this.extraInfoHandler.bind(this, element.id)
    );
    activateBtn.addEventListener(
      'click',
      this.activateTaskHandler.bind(this, element)
    );
  }

  activateTaskHandler(element, newTask) {
    const onGoingTaskSection = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    let taskIndex = 0;
    for (const task of this.finishedTasks) {
      //Try dictonaries
      if (task.id === element.id) {
        break;
      } else taskIndex++;
    }
    const task = this.finishedTasks.splice(taskIndex, 1);
    this.onGoingTasks.push(task);
    finishedTaskList.children[taskIndex].remove();
    onGoingTaskSection.append(element);
  }
}

const App = new TaskHandler();
const Task = new Tasks();
const addTaskBtn = document.getElementById('add-task-btn');
addTaskBtn.addEventListener('click', App.addTaskHandler.bind(App));
const addTaskConfirm = document.getElementById('add-task-button-confirm');
addTaskConfirm.addEventListener(
  'click',
  Task.newTaskElement.bind(Task, 'Finish')
);
