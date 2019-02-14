import TaskList from './TaskList.class.js';
import ErrorHandler from './error-handler.class.js';

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
              <td class="replaceable ${task.id} name">${task.name}</td>
              <td class="replaceable ${task.id} assignee">${task.assignee}</td>
              <td class="replaceable ${task.id} status">${task.status}</td>
              <td class="replaceable ${task.id} time">${moment(task.date).format('Y/M/d h:ss')}</td>
          </tr>`;
    });
    document.querySelector(this.where).innerHTML = template;
    this.addDeleteListener();
    this.addEditListener();
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


  addEditListener() {
    document.querySelectorAll(`${this.where} tr`).forEach((row) => {
      row.addEventListener('click', (event) => {
        event.stopPropagation();

        const { cells } = event.path[1];
        this.modifyRow(cells);
      }, { once: true });
    });
  }

  editTask(editedTask) {
    this.tasks.editFromTaskList(editedTask);
    this.renderTaskTable();
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

  markAssError() {
    this.form.name.classList.add('is-error');
    document.querySelector('#secret-message').classList.remove('secret-message');
    document.querySelector('#secret-message').classList.add('error-message');
    this.focusOnName();
  }

  cleanErrors() {
    this.form.name.classList.remove('is-error');
    document.querySelector('#secret-message').classList.remove('error-message');
    document.querySelector('#secret-message').classList.add('secret-message');
  }

  focusOnName() {
    this.form.name.focus();
  }

  createtask() {
    this.cleanErrors();
    const { name, assignee, status } = this.form;
    if (!this.errorHandler.isValid(name.value)) {
      this.markAssError();
      return;
    }
    const formatedStatus = status.checked ? 'Done' : 'Pending';

    this.tasks.createTask(name.value, assignee.value, formatedStatus);
    this.renderTaskTable();
    this.focusOnName();
  }
}


export default UI;
