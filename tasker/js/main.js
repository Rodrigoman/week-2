import UI from './UI.class.js';

class Jarvis {
  constructor(where = 'tbody', rules, form) {
    this.UI = new UI(where, rules, form);
  }

  /**
   * renders the UI if you ask nicely
   */
  giveMeTheUI(magicWord) {
    if (magicWord === 'please') {
      this.UI.renderTaskTable();
      return this;
    }
    return this;
  }

  makeTheStatusFilterWork() {
    this.UI.addListenerToStatusRadios();
    return this;
  }

  theSortFilter() {
    this.UI.addListenerToSortRadios();
    return this;
  }

  theSearch() {
    this.UI.addListenerToSearchForm();
    return this;
  }

  andTheFormToo() {
    this.UI.addTaskListener();
  }
}
const rules = {
  required: true,
  maxCharacters: 100,
};
const form = '#newTaskForm';

const jarvis = new Jarvis('#pokedex tbody', rules, form);

jarvis.giveMeTheUI('please')
  .makeTheStatusFilterWork()
  .theSortFilter()
  .theSearch()
  .andTheFormToo();
