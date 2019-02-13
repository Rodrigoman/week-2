import UI from './UI.class.js';

class Jarvis {
  constructor(where = 'tbody') {
    this.UI = new UI(where);
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

  TheSortFilter() {
    this.UI.addListenerToSortRadios();
    return this;
  }

  andTheSearch() {
    this.UI.addListenerToSearchForm();
  }
}

const jarvis = new Jarvis('#pokedex tbody');

jarvis.giveMeTheUI('please')
  .makeTheStatusFilterWork()
  .TheSortFilter()
  .andTheSearch();
