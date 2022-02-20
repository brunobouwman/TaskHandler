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
      this.render(action, false, taskEl, newTask);
    } else {
      this.render(action, false, taskEl, newTask);
    }
  }

  newTaskElement(action, alreadyExists, element, newTask) {
    console.log(action, alreadyExists);
    if (alreadyExists) {
      element.querySelector('button:last-of-type').textContent = action;
      this.render(action, alreadyExists, element, newTask);
    }else {
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
  }

  render(action, alreadyExists, taskEl, newTask) {
    const handlers = new TaskHandler();
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    handlers.removeBackAndModal();
    if (!alreadyExists) {
      this.onGoingTasks.push(newTask);
      onGoingTaskList.append(taskEl);
        const moreInfoBtn = taskEl.querySelector('button');
        const actionBtn = taskEl.querySelector('button:last-of-type');
        moreInfoBtn.addEventListener(
          'click',
          handlers.extraInfoHandler.bind(handlers, newTask, this.onGoingTasks)
        );
        actionBtn.addEventListener(
          'click',
          handlers.actionTaskHandler.bind(
            handlers,
            newTask,
            taskEl,
            action,
            this.onGoingTasks
          )
        );
      } else if (alreadyExists && action === 'Activate') {
        this.onGoingTasks.push(newTask);
        onGoingTaskList.append(taskEl);
        const moreInfoBtn = taskEl.querySelector('button');
        const actionBtn = taskEl.querySelector('button:last-of-type');
        moreInfoBtn.removeEventListener('click', handlers.extraInfoHandler);
        actionBtn.removeEventListener('click', handlers.actionTaskHandler);
        moreInfoBtn.addEventListener(
          'click',
          handlers.extraInfoHandler.bind(handlers, newTask, this.finishedTasks)
        );
        actionBtn.addEventListener(
          'click',
          handlers.actionTaskHandler.bind(
            handlers,
            newTask,
            taskEl,
            action,
            this.finishedTasks
          )
        );
      } else if (alreadyExists && action === 'Finish') {
      this.finishedTasks.push(newTask);
      finishedTaskList.append(taskEl);
      const moreInfoBtn = taskEl.querySelector('button');
        const actionBtn = taskEl.querySelector('button:last-of-type');
        moreInfoBtn.removeEventListener('click', handlers.extraInfoHandler);
        actionBtn.removeEventListener('click', handlers.actionTaskHandler);
        moreInfoBtn.addEventListener(
          'click',
          handlers.extraInfoHandler.bind(handlers, newTask, this.onGoingTasks)
        );
        actionBtn.addEventListener(
          'click',
          handlers.actionTaskHandler.bind(
            handlers,
            newTask,
            taskEl,
            action,
            this.onGoingTasks
          )
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

  extraInfoHandler(taskObj, taskArray) {
    const infoModal = document.getElementById('more-info-modal-id');
    this.showBackdrop();
    infoModal.classList.add('visible');
    if (taskArray.includes(taskObj)) {
      for (const task of taskArray) {
        if (task.id === taskObj.id) {
          infoModal.innerHTML = `
            <p>${task.extraInfo}</p>`;
          break;
        }
      }
    } else {
      for (const task of taskArray) {
        if (task.id === taskObj.id) {
          infoModal.innerHTML = `
        <p>${task.extraInfo}</p>`;
          break;
        }
      }
    }
  }

  actionTaskHandler(newTask, element, action, taskArray) {
    console.log(action);
    let taskIndex = 0;
    const onGoingTaskList = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    for (const task of taskArray) {
      if (task.id === newTask.id) {
        break;
      } else taskIndex++;
    }
    if (action === 'Finish') {
      if(onGoingTaskList.children.length !== 0){
        onGoingTaskList.children[taskIndex].remove();
        taskArray.splice(taskIndex, 1);
      }
        this.newTaskElement('Activate', true, element, newTask);
    } else {
      if(finishedTaskList.children.length !== 0) {
      finishedTaskList.children[taskIndex].remove();
      taskArray.splice(taskIndex, 1);
      }
      this.newTaskElement('Finish', true, element, newTask);
    }

    // const moreInfoBtn = element.querySelector('button');
    // const activateBtn = element.querySelector('button:last-of-type');
    // moreInfoBtn.addEventListener(
    //   'click',
    //   this.extraInfoHandler.bind(this, element.id)
    // );
    // activateBtn.addEventListener(
    //   'click',
    //   this.actionTaskHandler.bind(this, element)
    // );
  }

  //   activateTaskHandler(element, newTask) {
  //     const onGoingTaskList = document.querySelector('ul');
  //     const finishedTaskList = document.getElementById('finished-list');
  //     let taskIndex = 0;
  //     for (const task of this.finishedTasks) {
  //       //Try dictonaries
  //       if (task.id === element.id) {
  //         break;
  //       } else taskIndex++;
  //     }
  //     const task = this.finishedTasks.splice(taskIndex, 1);
  //     this.onGoingTasks.push(task);
  //     finishedTaskList.children[taskIndex].remove();
  //     onGoingTaskSection.append(element);
  //   }
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
