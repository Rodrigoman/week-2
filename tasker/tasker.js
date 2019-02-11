/* eslint-disable no-unused-vars */
localStorage.setItem('filters', JSON.stringify({
  status: 'All',
  sort: 'asc',
  search: '',
}));

function setLocalStorageTaskList(taskList) {
  localStorage.setItem('TaskList', JSON.stringify(taskList));
}

function createDummy() {
  const dummy = [{
    id: '0',
    name: ' you don\'t have any task',
    assignee: '--',
    status: '--',
    date: '<button type="button" onclick="focusOnName()" class="nes-btn is-primary">Create one</button>',
  }];
  localStorage.setItem('dummy', JSON.stringify(dummy));
}

function isThereAnyTask(taskList = 'TaskList') {
  createDummy();
  if (localStorage.getItem(taskList) == null || localStorage.getItem(taskList) === undefined
    || localStorage.getItem(taskList) === []) {
    return false;
  }
  return true;
}
function getTaskList(getFrom) {
  return JSON.parse(localStorage.getItem(getFrom));
}

function renderTaskTable(fromSearch = false, filteredTaskList = []) {
  const getFrom = isThereAnyTask() ? 'TaskList' : 'dummy';
  let template = '';
  const taskList = fromSearch === false ? getTaskList(getFrom) : filteredTaskList;

  taskList.forEach((task) => {
    template += `
        <tr id="row${task.id}">
            <td onclick="deleteTask(${task.id})"><i class="nes-icon close is-small"></i> ${task.id}</td>
            <td>${task.name}</td>
            <td>${task.assignee}</td>
            <td>${task.status}</td>
            <td>${isThereAnyTask() ? `${moment(task.date).format('Y/M/d') }(${moment(task.date).fromNow()})` : task.date}</td>
        </tr>`;
  });
  document.querySelector('#pokedex tbody').innerHTML = template;
}
function focusOnName() {
  document.querySelector('#name').value = '';
  document.querySelector('#name').focus();
}
function markAssError() {
  document.querySelector('#name').classList.add('is-error');
  document.querySelector('#secret-message').classList.remove('secret-message');
  document.querySelector('#secret-message').classList.add('error-message');
  focusOnName();
}
function cleanErrors() {
  document.querySelector('#name').classList.remove('is-error');
  document.querySelector('#secret-message').classList.remove('error-message');
  document.querySelector('#secret-message').classList.add('secret-message');
}
function createtask() {
  cleanErrors();
  const name = document.querySelector('#name').value;
  const assignee = document.querySelector('#assignee').value;
  const status = document.querySelector('input[name="status"]').checked === true ? 'Done' : 'Pending';
  const date = new Date();
  const taskList = isThereAnyTask() ? JSON.parse(localStorage.getItem('TaskList')) : [];
  const id = isThereAnyTask() ? taskList[taskList.length - 1].id + 1 : 1;

  if (name === '' || name.length > 100) {
    markAssError();
    return;
  }

  const newtask = {
    id, name, assignee, status, date,
  };
  taskList.push(newtask);

  setLocalStorageTaskList(taskList);
  focusOnName();
  document.querySelector('input[name="statusFilter"]').checked = true;
  document.querySelector('input[name="dateOrder"]').checked = true;
  renderTaskTable();
}
function deleteTask(taskId) {
  if (taskId !== 0) {
    const taskList = JSON.parse(localStorage.getItem('TaskList'));
    const newList = [];
    taskList.forEach((task) => {
      if (task.id !== taskId) {
        newList.push(task);
      }
    });
    if (newList.length === 0) {
      localStorage.removeItem('TaskList');
      renderTaskTable();
      return;
    }
    setLocalStorageTaskList(newList);
    document.querySelector(`#row${taskId}`).remove();
  }
}

function applyFilters() {
  let taskList = getTaskList('TaskList');
  const filters = JSON.parse(localStorage.getItem('filters'));

  if (filters.status == 'All' && filters.search === '') {
    taskList = filters.sort === 'desc' ? taskList.reverse() : taskList;
    renderTaskTable(true, taskList);
    return;
  }
  let filteredTaskList = taskList.filter((task) => {
    if (filters.status !== 'All') {
      return (task.status === filters.status && task.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    return task.name.toLowerCase().includes(filters.search.toLowerCase());
  });
  filteredTaskList = filters.sort === 'desc' ? filteredTaskList.reverse() : filteredTaskList;
  renderTaskTable(true, filteredTaskList);
}

function setFilters(wichFilter, value) {
  const currentFilters = JSON.parse(localStorage.getItem('filters'));
  currentFilters[wichFilter] = value;
  localStorage.setItem('filters', JSON.stringify(currentFilters));
}

document.querySelector('#search').addEventListener('keyup', (e) => {
  setFilters('search', document.querySelector('#search').value);
  applyFilters();
});

const statusRadios = document.querySelectorAll('input[name="statusFilter"]');
statusRadios.forEach((radio) => {
  radio.addEventListener('click', (e) => {
    setFilters('status', radio.value);
    applyFilters();
  });
});

const dateRadios = document.querySelectorAll('input[name="dateOrder"]');
dateRadios.forEach((radio) => {
  radio.addEventListener('click', (e) => {
    setFilters('sort', radio.value);
    applyFilters();
  });
});

document.querySelector('#name').addEventListener('keyup', () => {
  cleanErrors();
});

renderTaskTable();
