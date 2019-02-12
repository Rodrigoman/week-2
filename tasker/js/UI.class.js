import TaskList from './TaskList.class.js';

class UI {
  constructor() {
    this.tasks = new TaskList().taskList;
  }

  /**
   * where you want to render the table
   * @param {*} where a optional selector.
   * By default looks for a rbody to render
   */
  renderTaskTable(where = 'tbody') {
    let template = '';
    this.tasks.forEach((task) => {
      template += `
          <tr id="row${task.id}">
              <td onclick="deleteTask(${task.id})"><i class="nes-icon close is-small"></i> ${task.id}</td>
              <td>${task.name}</td>
              <td>${task.assignee}</td>
              <td>${task.status}</td>
              <td>${moment(task.date).format('Y/M/d h:ss')}</td>
          </tr>`;
    });
    document.querySelector(where).innerHTML = template;
  }
}


export default UI;
