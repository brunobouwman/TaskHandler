class TaskHandler {
  onGoingTasks = [];
  finishedTasks = [];
  newMovie = {};
  id = 0;

  removeBackAndModal() {
    const backdrop = document.getElementById('backdrop-id');
    const addModal = document.getElementById('add-task-modal-id');
    const infoModal = document.getElementById('more-info-modal-id');
    backdrop.classList.remove('visible');
    addModal.classList.remove('visible');
    infoModal.classList.remove('visible');
  }

  showBackdrop() {
    const backdrop = document.getElementById('backdrop-id');
    backdrop.classList.add('visible');
    backdrop.addEventListener('click', this.removeBackAndModal);
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
    this.showAddModal();
    //   const addTaskConfirm = document.getElementById('add-task-button-confirm');
    //   console.log(addTaskConfirm);
    //   addTaskConfirm.addEventListener('click', this.taskRender.bind(this));
  }

  taskRender() {
    this.removeBackAndModal();
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
    taskElement.innerHTML = `
        <h2>${newMovie.title}</h2>
        <p>${newMovie.description}</p>
        <button class="alt">More Info</button>
        <button >Finish</button>`;
    const moreInfoBtn = taskElement.querySelector('button');
    const finishBtn = taskElement.querySelector('button:last-of-type');
    moreInfoBtn.addEventListener(
      'click',
      this.extraInfoHandler.bind(this, taskElement.id)
    );
    finishBtn.addEventListener(
      'click',
      this.finishTask.bind(this, newMovie, taskElement.id, taskElement)
    );
    this.onGoingTasks.push(newMovie);
    onGoingTaskSection.prepend(taskElement);
    this.id++;
    this.clearInputs();
  }

  extraInfoHandler(id) {
    const infoModal = document.getElementById('more-info-modal-id');
    this.showBackdrop();
    infoModal.classList.add('visible');
    for (const tasks of this.onGoingTasks) {
      if (tasks.id === id) {
        infoModal.innerHTML = `
            <p>${tasks.extraInfo}</p>`;
      }
    }
  }

  finishTask(newMovie, id, element) {
    const onGoingTaskSection = document.querySelector('ul');
    const finishedTaskList = document.getElementById('finished-list');
    this.onGoingTasks.splice(newMovie.id, 1);
    this.finishedTasks.push(newMovie);
    onGoingTaskSection.children[id].remove();
    element.innerHTML = `<h2>${newMovie.title}</h2>
    <p>${newMovie.description}</p>
    <button class="alt">More Info</button>
    <button >Activate</button>
    `;
    finishedTaskList.prepend(element);
    const moreInfoBtn = element.querySelector('button');
    const ActivateBtn = element.querySelector('button:last-of-type');
    moreInfoBtn.addEventListener(
      'click',
      this.extraInfoHandler.bind(this, element.id)
    );
  }
}

const App = new TaskHandler();
const addTaskBtn = document.getElementById('add-task-btn');
const addTaskConfirm = document.getElementById('add-task-button-confirm');
addTaskConfirm.addEventListener('click', App.taskRender.bind(App));
console.log(addTaskBtn);
addTaskBtn.addEventListener('click', App.addTaskHandler.bind(App));
