import Storage from './Storage.class.js';
import Filters from './filters.class.js';

export default class TaskList {
  constructor() {
    this.taskList = Storage.getParsedTaskList();
    this.currentFilters = new Filters();
    this.filteredTaskList = this.taskList;
  }

  /**
   * removes a task from TaskList
   * @param taskId the id to remove
   */
  removeFromTaskList(taskId) {
    this.taskList = this.taskList.filter(task => task.id !== taskId);
    Storage.saveTaskList(this.taskList);
  }

  sortTasktList() {
    const filter = this.currentFilters;
    this.filteredTaskList = this.taskList.filter((task) => {
      if (filter.status !== 'All') {
        return (task.status === filter.status
           && task.name.toLowerCase().includes(filter.search.toLowerCase()));
      }
      return task.name.toLowerCase().includes(filter.search.toLowerCase());
    });
  }

  updateSortStatus(status) {
    this.currentFilters.status = status;
    this.sortTasktList();
  }
}
