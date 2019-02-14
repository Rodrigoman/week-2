class Storage {
  constructor(from) {
    this.db = localStorage;
    this.from = from;
  }

  /**
   * gets and parse the TaskList from Local Storage
   */
  getParsedTaskList() {
    return JSON.parse(this.db.getItem(this.from));
  }

  /**
   * Stringify and save to Local Storage
   * @newTaskList the new array to set
   */
  saveTaskList(newTaskist) {
    this.db.setItem(this.from, JSON.stringify(newTaskist));
  }
}

export default Storage;
