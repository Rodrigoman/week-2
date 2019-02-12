class Storage {
  static getParsedTaskList() {
    return JSON.parse(localStorage.getItem('TaskList'));
  }
}

export default Storage;
