class Storage {
  constructor(from) {
    this.db = localStorage;
    this.from = from;
    this.dummy = [{
      id: 1,
      name: 'this is a demo task go ahead',
      assignee: 'and create a new one',
      status: 'Done',
      date: new Date('1999/9/9'),
    }];
  }

  /**
   * gets and parse the TaskList from Local Storage
   */
  getParsedTaskList() {
    const result = JSON.parse(this.db.getItem(this.from));

    if (result === null || result.length === 0) {
      return this.dummy;
    }
    return result;
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
