import bad_words from '../data/bad_words.json';

class WordsFilter {
    constructor() {
      const badWords_ = bad_words.words;
      this.badWordsArray = badWords_.map((word) => word.toLowerCase());
    }
  
    containsBadWord(text) {
      const regex = new RegExp(`\\b(${this.badWordsArray.join('|')})\\b`, 'gi');
      console.log(this.devolverPalabra(text));
      return regex.test(text);
    }
  
    devolverPalabra(text) {
      const regex = new RegExp(`\\b(${this.badWordsArray.join('|')})\\b`, 'gi');
      const match = regex.exec(text);
      if (match) {
        return match[0];
      } else {
        return "No hay nada";
      }
    }
  }

  export default WordsFilter;