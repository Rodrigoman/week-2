import TaskList from './TaskList.class.js';

class UI {
  /**
   * @param {*} where  a optional selector
   * where you want to render the table.
   * By default looks for a rbody to render
   */
  constructor(where = 'tbody') {
    this.where = where;
    this.tasks = new TaskList();
    this.radios = document.querySelectorAll('input[name="statusFilter"]');
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

  addListenerToRadios() {
    this.radios.forEach((radio) => {
      radio.addEventListener('click', (event) => {
        event.stopPropagation();
        this.updateSortStatus(radio.value);
      });
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

  deleteTask(taskId) {
    this.tasks.removeFromTaskList(taskId);
    this.renderTaskTable();
  }
}


export default UI;
