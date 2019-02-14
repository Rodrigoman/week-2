class Task {
  constructor(id, name, assignee, status) {
    this.id = id;
    this.name = name;
    this.assignee = assignee;
    this.status = status;
    this.date = new Date();
  }
}

export default Task;
