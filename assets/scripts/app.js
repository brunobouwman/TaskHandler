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

  newTaskObj(title, description, extraInfo, id, taskEl) {
    const newTask = new TaskCreator(title, description, extraInfo, id);
    this.render('Finish', taskEl, newTask);
  }

  newTaskElement(action, alreadyExists, element, newTask) {
    if (action === 'Finish' && alreadyExists) {
      element.querySelector('button:last-of-type').textContent = 'Activate';
      this.render('Activate', element, newTask);
    } else if (action === 'Activate' && alreadyExists) {
      element.querySelector('button:last-of-type').textContent = 'Finish';
      this.render('Finish', element, newTask);
    } else if (!alreadyExists) {
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
        taskElement
      );
    }
  }

  clearEventListeners(element) {
    const clonedElement = element.cloneNode(true); //Makes a deep clone
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  render(action, taskEl, newTask) {
    const handlers = new TaskHandler();
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    handlers.removeBackAndModal();
    const moreInfoBtn = taskEl.querySelector('button');
    let actionBtn = taskEl.querySelector('button:last-of-type');
    actionBtn = this.clearEventListeners(actionBtn);
    if (action === 'Finish') {
      console.log('onGoingBeforeArray->', this.onGoingTasks);
      this.onGoingTasks.push(newTask);
      console.log('onGoingAfterArray->', this.onGoingTasks);
      console.log('onGoingBeforeEl->', onGoingTaskList);
      onGoingTaskList.append(taskEl);
      console.log('onGoingAfterEl->', onGoingTaskList);
      moreInfoBtn.addEventListener(
        'click',
        handlers.extraInfoHandler.bind(handlers, newTask, this.onGoingTasks, this.finishedTasks)
      );
      actionBtn.addEventListener(
        'click',
        handlers.actionTaskHandler.bind(handlers, newTask, taskEl, action, this.onGoingTasks, this.finishedTasks)
      );
    } else {
      console.log('FinishBeforeArray->', this.finishedTasks);
      this.finishedTasks.push(newTask);
      console.log('FinishAfterArray->', this.finishedTasks);
      console.log('FinishBeforeEl->', finishedTaskList);
      finishedTaskList.append(taskEl);
      console.log('FinishAfterEl->', finishedTaskList);
      moreInfoBtn.addEventListener(
        'click',
        handlers.extraInfoHandler.bind(handlers, newTask, this.onGoingTasks, this.finishedTasks)
      );
      actionBtn.addEventListener(
        'click',
        handlers.actionTaskHandler.bind(handlers, newTask, taskEl, action, this.onGoingTasks, this.finishedTasks)
      );
    }
    this.id++;
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

  extraInfoHandler(taskObj, onGoingTasks, finishedTasks) {
    const infoModal = document.getElementById('more-info-modal-id');
    this.showBackdrop();
    infoModal.classList.add('visible');
    if (onGoingTasks.includes(taskObj)) {
      for (const task of onGoingTasks) {
        if (task.id === taskObj.id) {
          infoModal.innerHTML = `
            <p>${task.extraInfo}</p>`;
          break;
        }
      }
    } else {
      for (const task of finishedTasks) {
        if (task.id === taskObj.id) {
          infoModal.innerHTML = `
        <p>${task.extraInfo}</p>`;
          break;
        }
      }
    }
  }

  actionTaskHandler(newTask, element, action, onGoingTasks, finishedTasks) {
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    if (action === 'Finish') {
      if (onGoingTaskList.children.length !== 0) {
        const objIndex = onGoingTasks.findIndex(p => p.id === newTask.id);
        console.log(objIndex);
        console.log('ongoingBeforeEl->', onGoingTaskList.children.length);
        onGoingTaskList.children[objIndex].remove();
        console.log('ongoingAftEl->', onGoingTaskList.children.length);
        console.log('onGoingBeforeArray->', onGoingTasks);
        onGoingTasks = onGoingTasks.filter(
          (p) => p.id !== newTask.id
        ); // filters every element but the one we want to remove
        // this.onGoingTasks.splice(objIndex, 1);
        console.log('onGoingAfterArray->', onGoingTasks);
      }
      this.newTaskElement(action, true, element, newTask);
    } else {
      if (finishedTaskList.children.length !== 0) {
        const objIndex = finishedTasks.findIndex(p => p.id === newTask.id);
        console.log('finishedBeforeEl->', finishedTaskList.children.length);
        finishedTaskList.children[objIndex].remove();
        console.log('finishedAfterEl->', finishedTaskList.children.length);
        console.log('finishedBeforeArray->', finishedTasks);
        finishedTasks = finishedTasks.filter(p => p.id !== newTask.id);
        // finishedTasks.splice(objIndex, 1);
        console.log('finishedAfterArray->', finishedTasks);
      }
      this.newTaskElement(action, true, element, newTask);
    }
  }
}

const App = new TaskHandler();
const Task = new Tasks();
const addTaskBtn = document.getElementById('add-task-btn');
addTaskBtn.addEventListener('click', App.addTaskHandler.bind(App));
const addTaskConfirm = document.getElementById('add-task-button-confirm');
addTaskConfirm.addEventListener(
  'click',
  Task.newTaskElement.bind(Task, 'Finish', false)
);
