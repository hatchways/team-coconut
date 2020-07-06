const wordArray = require('./Words');

class Game {
  GUESS_POINT = 200;
  CLUE_POINT = 100;

  /**
   * @param {array} players : game players array
   */
  constructor(players) {
    this.word = '';
    this.round = 0;
    this.wordArray = [];
    this.players = players;
    this.maxRound = this.players.length * 2;

    this.initGame();
  }

  /**
   * Init & Restart Game
   */
  initGame() {
    console.log(this.players)
    // Get Array Data
    this.wordArray = this.initWords();
    this.players[0].isGuesser = true;
    this.word = this.wordArray[0];
    this.round = 0;
  }

  /**
   * Get Words Array for game
   */
  initWords() {
    return this.shuffle(wordArray).slice(0, this.maxRound);
  }
  
  /**
   * init Players Roles
   */
  initPlayerRoles() {
    this.players.map((player) => {
       player.isGuesser = false;
       player.isGiver = false;
    });
  }

  /**
   * Check Guesser's Answer
   * @param {string} answer
   */
  checkAnswer(answer) {
    return this.word === answer ? true : false;
  }

  /**
   * Go to Next Round
   */
  nextRound() {
    this.round = this.round + 1;
    this.initPlayerRoles();
    this.setNextGuesser(this.round);
    this.setNextWord(this.round);

    return this.getState();
  }

  /**
   * Get State
   */
  getState() {
    return {
      word: this.word,
      round: this.round,
      players: this.players,
    };
  }

  /**
   * Get Next Guesser
   * @param {number} nextRound
   */
  setNextGuesser(nextRound) {
    if (nextRound >= this.players.length) {
      this.players[nextRound - this.players.length].isGuesser = true;
    } else {
      this.players[nextRound].isGuesser = true;
    }
  }

  /**
   * Give Point when answer is correct
   */
  givePoints() {
    this.players.map((player) => {
      // Guesser gets 200 points
      if (player.isGuesser === true) player.addPoint(this.GUESS_POINT);

      // Givers who gives not duplicated words get 100 points
      if (player.isGiver === true) player.addPoint(this.CLUE_POINT);
    });
  }

  /**
   * Set Next Word
   * @param {number} round
   */
  setNextWord(round) {
    this.word = this.wordArray[round];
  }

  /**
   * Set clue giver
   * @param {string} id
   */
  setGiver(id) {
    this.players.map((player) => {
      if (player.id === id) player.isGiver = true;
    });
  }

  /**
   * Check Last Round
   */
  checkLastRound() {
    return this.round + 1 === this.maxRound ? true : false;
  }

  /**
   * Shuffle Array
   * @param {array} array
   */
  shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
}

module.exports = Game;
