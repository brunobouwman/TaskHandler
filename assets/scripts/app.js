class TaskHandler {
  onGoingTasks = [];
  finishedTasks = [];
  newMovie = {};
  id = 0;

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

  taskRender() {
    const onGoingTaskSection = document.querySelector('ul');
    const taskElement = document.createElement('li');
    taskElement.id = this.id;
    taskElement.classList = 'card';
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const extraInfo = document.getElementById('extra-info');
    const newMovie = {
      title: title.value,
      description: description.value,
      extraInfo: extraInfo.value,
      id: taskElement.id,
    };
    this.removeBackAndModal();
    taskElement.innerHTML = `
        <h2>${newMovie.title}</h2>
        <p>${newMovie.description}</p>
        <button class="alt">More Info</button>
        <button >Finish</button>`;
    const moreInfoBtn = taskElement.querySelector('button');
    const finishBtn = taskElement.querySelector('button:last-of-type');
    moreInfoBtn.addEventListener(
      'click',
      this.extraInfoHandler.bind(this, newMovie.id)
    );
    finishBtn.addEventListener(
      'click',
      this.finishTask.bind(this, newMovie, taskElement)
    );
    this.onGoingTasks.push(newMovie);
    onGoingTaskSection.append(taskElement);
    this.id++;
    this.clearInputs();
    console.log(this.onGoingTasks);
  }

  extraInfoHandler(id) {
    const infoModal = document.getElementById('more-info-modal-id');
    this.showBackdrop();
    infoModal.classList.add('visible');
    for (const tasks of this.onGoingTasks) {
      if (tasks.id === id) {
        infoModal.innerHTML = `
            <p>${tasks.extraInfo}</p>`;
            break;
      }
    }
  }

  finishTask(newMovie, element) {
    let taskIndex = 0;
    const onGoingTaskSection = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    for (const task of this.onGoingTasks) {
      if(task.id === newMovie.id) {
        break;
      }
      else taskIndex++;
    }
    this.onGoingTasks.splice(taskIndex, 1);
    onGoingTaskSection.children[taskIndex].remove();
    element.innerHTML = `<h2>${newMovie.title}</h2>
    <p>${newMovie.description}</p>
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
    activateBtn.addEventListener('click', this.activateTask.bind(this, element));
  }

  activateTask(element) {
    const onGoingTaskSection = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    let taskIndex = 0;
    for (const task of this.finishedTasks) { //Try dictonaries
      if (task.id === element.id) {
        break;
      }
      else taskIndex++;
    };
    const task = this.finishedTasks.splice(taskIndex ,1);
    this.onGoingTasks.push(task);
    finishedTaskList.children[taskIndex].remove();
    onGoingTaskSection.append(element);

  }
}

const App = new TaskHandler();
const addTaskBtn = document.getElementById('add-task-btn');
const addTaskConfirm = document.getElementById('add-task-button-confirm');
addTaskBtn.addEventListener('click', App.addTaskHandler.bind(App));
addTaskConfirm.addEventListener('click', App.taskRender.bind(App));
