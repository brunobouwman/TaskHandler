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
    this.render('Finish', taskEl, newTask);
  }

  newTaskElement(action, element, newTask) {
    if (action === 'Finish') {
      element.querySelector('button:last-of-type').textContent = 'Activate';
      this.render('Activate', element, newTask);
    } else {
      element.querySelector('button:last-of-type').textContent = 'Finish';
      this.render('Finish', element, newTask);
    }
  }

  createTask(action) {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const extraInfo = document.getElementById('extra-info');
    const taskElement = document.createElement('li');
    this.addTaskEventListener(taskElement, this.id);
    taskElement.id = this.id;
    taskElement.setAttribute('draggable', true);
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
      taskElement
    );
    this.id++;
  }

  /* <-- VERY IMPORTANT --> */
  clearEventListeners(element) {
    const clonedElement = element.cloneNode(true); //Makes a deep clone
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  addTaskEventListener(element, id) {
    element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'move';
    });
  }

  render(action, taskEl, newTask) {
    const handlers = new TaskHandler();
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    handlers.removeBackAndModal();
    const moreInfoBtn = taskEl.querySelector('button');
    let actionBtn = taskEl.querySelector('button:last-of-type');
    actionBtn = this.clearEventListeners(actionBtn, true); //makes a deep clone
    // actionBtn = this.clearEventListeners(actionBtn);
    if (action === 'Finish') {
      this.onGoingTasks.push(newTask);
      onGoingTaskList.append(taskEl); //When you append an existing element, it automatically removes it from the previous location
      taskEl.scrollIntoView({ behavior: 'smooth' }); //Can also use top and left as properties inside that object. ex {top: 50, left: 50, behavior: 'smooth'};
      moreInfoBtn.addEventListener(
        'click',
        handlers.extraInfoHandler.bind(this, newTask)
      );
      actionBtn.addEventListener(
        'click',
        handlers.actionTaskHandler.bind(this, newTask, taskEl, action)
      );
    } else {
      this.finishedTasks.push(newTask);
      finishedTaskList.append(taskEl);
      // finishedTaskList.scrollTo(0, 5000);
      taskEl.scrollIntoView({ behavior: 'smooth' }); //smooth transition
      moreInfoBtn.addEventListener(
        'click',
        handlers.extraInfoHandler.bind(this, newTask)
      );
      actionBtn.addEventListener(
        'click',
        handlers.actionTaskHandler.bind(this, newTask, taskEl, action)
      );
    }
    handlers.clearInputs();
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

  extraInfoHandler(taskObj) {
    const infoModal = document.getElementById('more-info-modal-id');
    this.showBackdrop();
    infoModal.classList.add('visible');
    if (this.onGoingTasks.includes(taskObj)) {
      for (const task of this.onGoingTasks) {
        if (task.id === taskObj.id) {
          infoModal.innerHTML = `
            <p>${task.extraInfo}</p>`;
        }
      }
    } else {
      for (const task of this.finishedTasks) {
        if (task.id === taskObj.id) {
          infoModal.innerHTML = `
        <p>${task.extraInfo}</p>`;
        }
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
  if (Task.onGoingTasks.find((p) => p.id === projId)) {
    return;
  }else 
  document.getElementById(projId).querySelector('button:last-of-type').click();
  activeList.parentElement.classList.remove('droppable');
  event.preventDefault();
});

finishedList.addEventListener('drop', (event) => {
  const projId = event.dataTransfer.getData('text/plain');
  if (Task.finishedTasks.find((p) => p.id === projId)) {
    return;
  } else
  document.getElementById(projId).querySelector('button:last-of-type').click();
  finishedList.parentElement.classList.remove('droppable');
  event.preventDefault();
});
