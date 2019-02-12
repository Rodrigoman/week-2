class Storage {
  /**
   * gets and parse the TaskList from Local Storage
   */
  static getParsedTaskList() {
    return JSON.parse(localStorage.getItem('TaskList'));
  }

  /**
   * Stringify and save to Local Storage
   * @newTaskList the new array to set
   */
  static saveTaskList(newTaskist) {
    localStorage.setItem('TaskList', JSON.stringify(newTaskist));
  }
}

export default Storage;
