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
    const filters = this.currentFilters;

    this.filteredTaskList = this.taskList.filter((task) => {
      if (filters.status !== 'All') {
        return (task.status === filters.status
          && task.name.toLowerCase().includes(filters.search.toLowerCase()));
      }
      return task.name.toLowerCase().includes(filters.search.toLowerCase());
    });

    this.filteredTaskList = filters.sort === 'desc' ? this.filteredTaskList.reverse() : this.filteredTaskList;
  }

  updateStatusStatus(status) {
    this.currentFilters.status = status;
    this.sortTasktList();
  }

  updateSortsStatus(status) {
    this.currentFilters.sort = status;
    this.sortTasktList();
  }

  searchInTaskList(term) {
    this.currentFilters.search = term;
    this.sortTasktList();
  }
}
