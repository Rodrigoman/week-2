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

  modifyRow(cells) {
    if (typeof cells === 'object') {
      for (const cell of cells) {
        const { classList } = cell;
        if (classList.contains('replaceable')) {
          cell.innerHTML = `<input type="text" id="edit-${classList.item(1)}-${classList.item(2)}" 
          autocomplete="off" value="${cell.innerHTML}" class="nes-input">`;
        }
        if (classList.contains('assignee')) {
          cell.innerHTML = `
          <select id="edit-${classList.item(1)}-assignee" class="nes-input">
            <option value="Frank">Frank</option>
            <option value="John">John</option>
            <option value="Alice">Alice</option>
            <option value="Mary">Mary</option>
          </select>`;
        }
        if (classList.contains('status')) {
          const firstStatus = cell.innerHTML === 'Done' ? 'Done' : 'Pending';
          const secondStatus = firstStatus === 'Done' ? 'Pending' : 'Done';

          cell.innerHTML = ` <select id="edit-${classList.item(1)}-status" class="nes-input">
            <option value="${firstStatus}">${firstStatus}</option>
            <option value="${secondStatus}">${secondStatus}</option>
        </select>`;
        }
        if (classList.contains('time')) {
          cell.innerHTML = `<button type="button" name="submit" id="edit-${classList.item(1)}"
            class="nes-btn is-success editItem">save</button>`;
        }
      }
      document.querySelector('.editItem').addEventListener('click', (e) => {
        e.stopPropagation();
        const idToEdit = e.target.attributes.id.value;
        const id = idToEdit.slice(5, idToEdit.length);
        const name = document.querySelector(`#edit-${id}-name`).value;
        const assignee = document.querySelector(`#edit-${id}-assignee`).value;
        const status = document.querySelector(`#edit-${id}-status`).value;
        this.editTask({
          id, name, assignee, status,
        });
      });
    } // end if is iterable
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
