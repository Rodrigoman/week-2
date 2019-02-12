class Storage {
  /**
   * gets and parse the TaskList from Local Storage
   */
  static getParsedTaskList() {
    return JSON.parse(localStorage.getItem('TaskList'));
  }

  /**
   * Stringify and save to Local Storage
   */
  static setStringifyTaskList() {
    JSON.stringify(localStorage.getItem('TaskList'));
  }
}

export default Storage;
