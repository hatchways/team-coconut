const wordArray = require("./Words");

class Game {
  GUESS_POINT = 200;
  CLUE_POINT = 100;
  GAME_TIME = 30500;

  constructor() {
    this.word = "";
    this.round = 0;
    this.wordArray = [];
    this.players = [];
    this.waitingPlayers = [];
    this.maxRound = 0;
    this.timer;
  }

  /**
   * Init & Restart Game
   */
  initGame() {
    this.initGuesser();
    this.initClues();
    this.initTypingStatus();
    this.round = 0;
    this.maxRound = this.players.length * 2;
    this.wordArray = this.initWords();
    this.word = this.wordArray[0];
  }

  /**
   * Get Words Array for game
   */
  initWords() {
    return this.shuffle(wordArray).slice(0, this.maxRound);
  }

  /**
   * Initializae player isGuesser property
   */
  initGuesser() {
    this.players.map((player) => {
      player.isGuesser = false;
    });

    this.players[0].isGuesser = true;
  }

  /**
   * Initialize player clue property
   */
  initClues() {
    this.players.map((player) => {
      player.clue = "";
    });
  }

  /**
   * Initialize player clue property
   */
  initTypingStatus() {
    this.players.map((player) => {
      player.isTyping = false;
    });
  }

  /**
   * Check Guesser's Answer
   * @param {string} answer
   */
  checkAnswer(answer) {
    return this.word.toLowerCase() === answer.toLowerCase();
  }

  /**
   * Go to Next Round
   */
  nextRound() {
    this.round = this.round + 1;
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
    const numberOfPlayers = this.players.length;

    this.players[(nextRound - 1) % numberOfPlayers].isGuesser = false;
    this.players[nextRound % numberOfPlayers].isGuesser = true;
  }

  /**
   * Give points
   * @param {array} clues
   */
  givePoints(clues) {
    const uniqueClueGivers = this.getPlayerUniqueClues(clues);

    this.players.map((player) => {
      if (player.isGuesser) {
        // Guesser gets 200 points
        player.addPoint(this.GUESS_POINT);
      }

      if (uniqueClueGivers.includes(player.id)) {
        // Clue Givers get 100 points
        player.addPoint(this.CLUE_POINT);
      }
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
   * Check Last Round
   */
  checkLastRound() {
    return this.round + 1 === this.maxRound;
  }

  /**
   * Join New Player
   * @param {object} joinPlayer
   */
  addPlayer(joinPlayer) {
    const find = this.players.find((player) => player.id === joinPlayer.id);

    if (!find) this.players.push(joinPlayer);
  }

  /**
   * Leave Player
   * @param {object} outPlayer
   */
  leavePlayer(outPlayer) {
    this.players = this.players.filter((player) => player.id !== outPlayer.id);
  }

  /**
   * Get Number of Players
   */
  getNumberOfPlayers() {
    return this.players.length;
  }

  /**
   * Shuffle Array
   * @param {array} array
   */
  shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  /**
   * Get player giving unique clue
   * @param {array} array
   */
  getPlayerUniqueClues(array) {
    const uniqueClues = array
      .map((clue) => clue["msg"])
      .filter((msg, index, a) => {
        if (msg !== "") {
          return a.indexOf(msg) === a.lastIndexOf(msg);
        }
      });

    return array
      .filter((clue) => uniqueClues.includes(clue.msg))
      .map((c) => c.id);
  }

  /**
   * Start Timer
   * @param {function} callback
   */
  startTimer(callback) {
    this.timer = setTimeout(callback, this.GAME_TIME);
  }

  /**
   * Stop Timer
   */
  endTimer() {
    clearTimeout(this.timer);
  }

  /**
   * Add Wating Player for Next Round
   * @param {object} player
   */
  addWatingPlayer(player) {
    this.waitingPlayers.push(player);
    return this.waitingPlayers.length;
  }

  /**
   * Reset Wating list
   */
  resetWaitingPlayers() {
    this.waitingPlayers = [];
  }

  /**
   * Track Submitted Clue
   * * @param {object} player
   */
  trackPlayerClue(player) {
    this.players.forEach((p) => {
      if (p.id === player.id) {
        p.clue = player.msg;
      }
    });
  }

  /**
   * Track Typing Status For Each Player
   * * @param {string} playerId
   */
  trackTypingStatus(playerId) {
    this.players.forEach((p) => {
      if (p.id === playerId) {
        p.isTyping = true;
      }
    });
  }
}

module.exports = Game;
