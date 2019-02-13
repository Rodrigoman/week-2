import TaskList from './TaskList.class.js';

class UI {
  /**
   * @param {*} where  a optional selector
   * where you want to render the table.
   * By default looks for a rbody to render
   */
  constructor(where = 'tbody', rules, form) {
    this.where = where;
    this.tasks = new TaskList();
    this.statusRadios = document.querySelectorAll('input[name="statusFilter"]');
    this.sortRadios = document.querySelectorAll('input[name="dateOrder"]');
    this.search = document.querySelector('#search');
    this.addTask = document.querySelector('#submit');
    this.errorHandler = new ErrorHandler(rules);
    this.abstracForm = form;
  }

  /**
   * Create each row for the table then adds a lister for each item
   */
  renderTaskTable() {
    let template = '';
    this.tasks.filteredTaskList.forEach((task) => {
      template += `
          <tr id="row${task.id}" class="editable">
              <td><i class="nes-icon close is-small delete" id="${task.id}" ></i> ${task.id}</td>
              <td>${task.name}</td>
              <td>${task.assignee}</td>
              <td>${task.status}</td>
              <td>${moment(task.date).format('Y/M/d h:ss')}</td>
          </tr>`;
    });
    document.querySelector(this.where).innerHTML = template;
    this.addDeleteListener();
  }

  addListenerToStatusRadios() {
    this.statusRadios.forEach((radio) => {
      radio.addEventListener('click', (event) => {
        event.stopPropagation();
        this.updateStatusStatus(radio.value);
      });
    });
  }

  addListenerToSortRadios() {
    this.sortRadios.forEach((radio) => {
      radio.addEventListener('click', (event) => {
        event.stopPropagation();
        this.updateSortStatus(radio.value);
      });
    });
  }

  addListenerToSearchForm() {
    this.search.addEventListener('keyup', (event) => {
      this.updateSearchQuery(event.target.value);
    });
  }

  addTaskListener() {
    this.addTask.addEventListener('click', (event) => {
      event.stopPropagation();
      this.createFormObject(document.querySelector(this.abstracForm));
      this.createtask();
    });
  }

  /**
   * Create A listener for each item with the given class
   * then calls deleteTask when when the item is clicked
   */
  addDeleteListener() {
    const Tasksids = document.querySelectorAll('.delete');
    Tasksids.forEach((id) => {
      id.addEventListener('click', (event) => {
        event.stopPropagation();
        this.deleteTask(Number(event.target.id));
      });
    });
  }

  createFormObject(form) {
    const formObj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const field of form) {
      if (field.name) {
        formObj[field.name] = field;
      }
    }
    this.form = formObj;
  }

  deleteTask(taskId) {
    this.tasks.removeFromTaskList(taskId);
    this.renderTaskTable();
  }

  updateSortStatus(status) {
    this.tasks.updateSortsStatus(status);
    this.renderTaskTable();
  }

  updateStatusStatus(status) {
    this.tasks.updateStatusStatus(status);
    this.renderTaskTable();
  }

  updateSearchQuery(term) {
    this.tasks.searchInTaskList(term);
    this.renderTaskTable();
  }
}


export default UI;
