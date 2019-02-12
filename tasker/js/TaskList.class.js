import Storage from './Storage.class.js';

export default class TaskList {
  constructor() {
    this.taskList = Storage.getParsedTaskList();
  }

  /**
   * removes a task from TaskList
   * @param taskId the id to remove
   */
  removeFromTaskList(taskId) {
    this.taskList = this.taskList.filter(task => task.id !== taskId);
    Storage.saveTaskList(this.taskList);
  }
}
