/* eslint-disable no-param-reassign */
import Storage from './Storage.class.js';
import Filters from './filters.class.js';
import Task from './task.class.js';

export default class TaskList {
  constructor() {
    this.connection = new Storage('TaskList');
    this.currentFilters = new Filters();
    this._taskList = null;
    this.taskList = this.connection.getParsedTaskList();
  }

  /**
   * removes a task from TaskList
   * @param taskId the id to remove
   */
  removeFromTaskList(taskId) {
    this.taskList = this.taskList.filter(task => task.id !== taskId);
    this.connection.saveTaskList(this.taskList);
  }

  editFromTaskList(editedTask) {
    const {
      id, name, assignee, status,
    } = editedTask;

    this.taskList = this.taskList.map((task) => {
      if (Number(id) === task.id) {
        task.name = name;
        task.assignee = assignee;
        task.status = status;
      }
      return task;
    });
    this.connection.saveTaskList(this.taskList);
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

  set taskList(taskList) {
    this._taskList = taskList;
    this.sortTasktList();
  }

  get taskList() {
    return this._taskList;
  }

  createTask(name, assignee, status) {
    const id = this.taskList.length !== 0 ? this.taskList[this.taskList.length - 1].id + 1 : 1;
    const newTask = new Task(id, name, assignee, status);
    this.taskList.push(newTask);
    this.connection.saveTaskList(this.taskList);
    this.sortTasktList();
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
