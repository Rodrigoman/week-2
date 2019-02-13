import Storage from './Storage.class.js';
import Filters from './filters.class.js';
import Task from './task.class.js';

export default class TaskList {
  constructor() {
    this.connection = new Storage();
    this.taskList = this.connection.getParsedTaskList();
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

  createTask(name, assignee, status) {
    const id = this.taskList ? this.taskList[this.taskList.length - 1].id + 1 : 1;
    const newTask = new Task(id, name, assignee, status);
    this.taskList.push(newTask);
    this.connection.saveTaskList(this.taskList);
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
