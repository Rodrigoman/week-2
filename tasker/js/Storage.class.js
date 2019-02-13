class Storage {
  constructor() {
    this.db = localStorage;
  }

  /**
   * gets and parse the TaskList from Local Storage
   */
  getParsedTaskList() {
    return JSON.parse(this.db.getItem('TaskList'));
  }

  /**
   * Stringify and save to Local Storage
   * @newTaskList the new array to set
   */
  saveTaskList(newTaskist) {
    this.db.setItem('TaskList', JSON.stringify(newTaskist));
  }
}

export default Storage;
