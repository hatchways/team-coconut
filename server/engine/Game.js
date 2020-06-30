const wordArray = require('./Words');

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

class Game {
  ADD_POINT = 100;

  constructor(id, players) {
    this.roomName = id;
    this.guesser = '';
    this.word = '';
    this.point = 0;
    this.round = 0;
    this.wordArray = [];
    this.players = players;
    this.totalRound = players.length * 2;

    this.initGame();
  }

  /**
   * Init & Restart Game
   */
  initGame() {
    // Get Array Data
    this.wordArray = this.initWords(this.players);
    this.guesser = this.players[0];
    this.word = this.wordArray[0];
    this.point = 0;
    this.round = 0;
  }

  /**
   * Get Words Array for game
   * @param {array} players 
   */
  initWords(players) {
    // Determine Word Array length by players.length
    let shuffledWords = shuffle(wordArray);

    return shuffledWords.slice(0, this.totalRound);
  }

  /**
   * Check Guesser's Answer
   * @param {string} answer 
   */
  checkAnswer(answer) {
    const word = this.word;
    let correct = false;

    if (word === answer) {
      this.point += this.ADD_POINT;
      correct = true;
    }

    return correct;
  }

  /**
   * Go to Next Round
   */
  nextRound() {
    this.round = this.round + 1;
    this.guesser = this.getNextGuesser(this.round);
    this.word = this.getNextWord(this.round);

    return this.getState();
  }

  /**
   * Get State
   */
  getState() {
    return {
      roomName: this.roomName,
      guesser: this.guesser,
      word: this.word,
      point: this.point,
      round: this.round,
    };
  }

  /**
   * Get Next Guesser
   * @param {number} round 
   */
  getNextGuesser(round) {
    const players = this.players;
    let nextGuesser;

    if (round >= players.length) {
      nextGuesser = players[round - players.length];
    } else {
      nextGuesser = players[round];
    }

    return nextGuesser;
  }

  /**
   * Get Next Word
   * @param {number} round 
   */
  getNextWord(round) {
    return this.wordArray[round];
  }

  /**
   * Check Last Round
   */
  checkLastRound() {
    return this.round + 1 === this.totalRound ? true : false;
  }
}

module.exports = Game;
