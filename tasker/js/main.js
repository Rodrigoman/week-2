import UI from './UI.class.js';

class Jarvis {
  constructor(where = 'tbody') {
    this.UI = new UI(where);
  }

  /**
   * renders the UI
   */
  giveMeTheUI(magicWord) {
    if (magicWord === 'please') {
      this.UI.renderTaskTable();
    }
  }
}

const jarvis = new Jarvis('#pokedex tbody');

jarvis.giveMeTheUI('please');
