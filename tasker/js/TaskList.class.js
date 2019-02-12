import Storage from './Storage.class.js';

export default class TaskList {
  constructor() {
    this.taskList = Storage.getParsedTaskList();
  }
}
