class TaskCreator {
  constructor(title, description, extraInfo, id) {
    this.title = title;
    this.description = description;
    this.extraInfo = extraInfo;
    this.id = id;
    this.draggable = true;
  }
}

class Tasks {
  onGoingTasks = [];
  finishedTasks = [];
  id = 0;

  constructor() {}

  newTaskObj(title, description, extraInfo, id, taskEl) {
    const newTask = new TaskCreator(title, description, extraInfo, id);
    this.render('Finish', taskEl, newTask, false);
  }

  newTaskElement(action, element, newTask) {
    if (action === 'Finish') {
      element.querySelector('button:last-of-type').textContent = 'Activate';
      this.render('Activate', element, newTask, true);
    } else {
      element.querySelector('button:last-of-type').textContent = 'Finish';
      this.render('Finish', element, newTask, true);
    }
  }

  createTask(action) {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const extraInfo = document.getElementById('extra-info');
    const taskElement = document.createElement('li');
    this.addTaskEventListener(taskElement, this.id);
    taskElement.setAttribute('draggable', true);
    taskElement.id = this.id;
    taskElement.classList = 'card';
    taskElement.innerHTML = `
    <h2>${title.value}</h2>
    <p>${description.value}</p>
    <button class="alt">More Info</button>
    <button id="delete">Delete</button>
    <button class="hidden">${action}</button>`;
    this.newTaskObj(
      title.value,
      description.value,
      extraInfo.value,
      this.id,
      taskElement
    );
    this.id++;
  }

  /* <-- VERY IMPORTANT --> */
  clearEventListeners(element) {
    const clonedElement = element.cloneNode(true); /// true makes a deep clone
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  addTaskEventListener(element, id) {
    element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'move';
    });
  }

  buttonsListeners(action, taskEl, newTask, exists) {
    const handlers = new TaskHandler();
    handlers.removeBackAndModal();
    const buttons = taskEl.querySelectorAll('button');
    let moreInfoBtn = buttons[0];
    let deleteBtn = buttons[1];
    let actionBtn = buttons[2];
    moreInfoBtn = this.clearEventListeners(moreInfoBtn);
    actionBtn = this.clearEventListeners(actionBtn); //makes a deep clone
    deleteBtn = this.clearEventListeners(deleteBtn);
    actionBtn.addEventListener(
      'click',
      handlers.actionTaskHandler.bind(this, newTask, taskEl, action)
    );
    handlers.clearInputs();
    moreInfoBtn.addEventListener(
      'click',
      handlers.extraInfoHandler.bind(
        handlers,
        newTask,
        this.onGoingTasks,
        this.finishedTasks
      )
    );
      deleteBtn.addEventListener(
        'click',
        handlers.deleteBtnHandler.bind(this, newTask, taskEl, action)
      );
     return taskEl;
  }

  render(action, taskEl, newTask, exists) {
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    taskEl = this.buttonsListeners(action, taskEl, newTask, exists);
    if (action === 'Finish') {
      this.onGoingTasks.push(newTask);
      onGoingTaskList.append(taskEl); //When you append an existing element, it automatically removes it from the previous location
      taskEl.scrollIntoView({ behavior: 'smooth' }); //Can also use top and left as properties inside that object. ex {top: 50, left: 50, behavior: 'smooth'};
    } else {
      this.finishedTasks.push(newTask);
      finishedTaskList.append(taskEl);
      // finishedTaskList.scrollTo(0, 5000);
      taskEl.scrollIntoView({ behavior: 'smooth' }); //smooth transition
    }
  }
}

class TaskHandler extends Tasks {
  id = 0;

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

  dragTaskHandler(list) {
    list.addEventListener('dragenter', (event) => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
        list.parentElement.classList.add('droppable');
      }
    });
    list.addEventListener('dragover', (event) => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault();
      }
    });

    list.addEventListener('dragleave', (event) => {
      if (event.relatedTarget.closest('ul') != list) {
        list.parentElement.classList.remove('droppable');
      }
    });
  }

  extraInfoHandler(taskObj, activeArray, finishedArray) {
    const combinedArray = activeArray.concat(finishedArray);
    const infoModal = document.getElementById('more-info-modal-id');
    this.showBackdrop();
    infoModal.classList.add('visible');
    for (const task of combinedArray) {
      if (task.id === taskObj.id) {
        infoModal.innerHTML = `
          <p>${task.extraInfo}</p>`;
      }
    }
  }

  actionTaskHandler(newTask, element, action) {
    if (action === 'Finish') {
      this.onGoingTasks = this.onGoingTasks.filter((p) => p.id !== newTask.id); // filters every element but the one we want to remove
      this.newTaskElement(action, element, newTask);
      // const objIndex = taskArray.findIndex((p) => p.id === newTask.id);
    } else {
      this.finishedTasks = this.finishedTasks.filter(
        (p) => p.id !== newTask.id
      );
      // finishedTasks.splice(objIndex, 1);
      this.newTaskElement(action, element, newTask);
    }
  }

  deleteBtnHandler(task, element) {
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    if (this.onGoingTasks.includes(task)) {
      this.onGoingTasks = this.onGoingTasks.filter((p) => p.id !== task.id);
      for (let i = 0; i < onGoingTaskList.children.length; i++) {
        if (onGoingTaskList.children[i].textContent === element.textContent) {
          onGoingTaskList.children[i].remove();
        }
      }
    } else {
      this.finishedTasks = this.finishedTasks.filter((p) => p.id !== task.id);
      for (let i = 0; i < finishedTaskList.children.length; i++) {
        if (finishedTaskList.children[i].textContent === element.textContent) {
          finishedTaskList.children[i].remove();
        }
      }
    }
  }
}

// class App {
//   static init() {
//     const Handlers = new TaskHandler();
//     const Tasks = new Tasks();
//     const addTaskBtn = document.getElementById('add-task-btn');
//     addTaskBtn.addEventListener('click', Handlers.addTaskHandler.bind(Handlers));
//     const addTaskConfirm = document.getElementById('add-task-button-confirm');
//     addTaskConfirm.addEventListener(
//       'click',
//       Tasks.createTask.bind(Tasks, 'Finish')
//     );
//   }
// }
// App.init();

const Handlers = new TaskHandler();
const Task = new Tasks();
const addTaskBtn = document.getElementById('add-task-btn');
addTaskBtn.addEventListener('click', Handlers.addTaskHandler.bind(Handlers));
const addTaskConfirm = document.getElementById('add-task-button-confirm');
addTaskConfirm.addEventListener('click', Task.createTask.bind(Task, 'Finish'));
const activeList = document.querySelector('ul');
const finishedList = document.getElementById('finished-list');
Handlers.dragTaskHandler(activeList);
Handlers.dragTaskHandler(finishedList);

activeList.addEventListener('drop', (event) => {
  const projId = event.dataTransfer.getData('text/plain');
  const task = document.getElementById(projId);
  let check = false;
  for (let i = 0; i < activeList.children.length; i++) {
    if (activeList.children[i].textContent === task.textContent) {
      check = true;
    }
  }
  if (check) {
    return;
  } else {
    document
      .getElementById(projId)
      .querySelector('button:last-of-type')
      .click();
    activeList.parentElement.classList.remove('droppable');
    event.preventDefault();
  }
});

finishedList.addEventListener('drop', (event) => {
  const projId = event.dataTransfer.getData('text/plain');
  const task = document.getElementById(projId);
  let check = false;
  for (let i = 0; i < finishedList.children.length; i++) {
    if (finishedList.children[i].textContent === task.textContent) {
      check = true;
    }
  }
  if (check) {
    return;
  } else {
    document
      .getElementById(projId)
      .querySelector('button:last-of-type')
      .click();
    finishedList.parentElement.classList.remove('droppable');
    event.preventDefault();
  }
});
