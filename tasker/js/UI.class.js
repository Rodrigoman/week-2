import TaskList from './TaskList.class.js';

class UI {
  constructor() {
    this.tasks = new TaskList().taskList;
  }
}


export default UI;
