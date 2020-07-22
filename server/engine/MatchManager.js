const Game = require('./Game');
const Player = require('./Player');
const ClientError = require('../common/ClientError');

class MatchManager {
  constructor() {
    this.matchManager = new Map();
  }

  /**
   * Create New Room
   * @param {string} gameId
   */
  createRoom(gameId) {
    this.matchManager.set(gameId, new Game());
  }

  /**
   * Join Room
   * @param {string} gameId
   * @param {object} player
   */
  joinRoom(gameId, player) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);
    const newPlayer = new Player(player.id, player.name);

    game.addPlayer(newPlayer);

    return game.getState();
  }

  /**
   * Start Game
   * @param {string} gameId
   */
  startGame(gameId) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);
    const numberOfPlayers = game.getNumberOfPlayers();

    if (numberOfPlayers === 4) {
      game.initGame();
    } else {
      throw new ClientError('', 'Only 4 players can play a game!', 500);
    }

    return game.getState();
  }

  /**
   * End Round
   * @param {string} gameId
   * @param {string} answer
   * @param {array} clues
   */
  endRound(gameId, answer, clues) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);
    const correct = game.checkAnswer(answer);

    if (correct) {
      game.givePoints(clues);
    }

    return {
      isCorrect: correct,
      state: game.getState(),
    };
  }

  /**
   * Move To Next Round
   * @param {string} gameId
   */
  moveToNextRound(gameId) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    game.resetWaitingPlayers();
    game.nextRound();

    return game.getState();
  }

  /**
   * Player leaves game
   * @param {string} gameId
   * @param {object} player
   */
  leavePlayer(gameId, player) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    game.leavePlayer(player);

    return game.getState();
  }

  /**
   * End Game
   */
  endGame(gameId) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    this.matchManager.delete(gameId);
  }

  /**
   * Check Room is Exist in a Match Map
   * @param {string} gameId
   */
  checkRoomExist(gameId) {
    return this.matchManager.has(gameId);
  }

  /**
   * Start Game Timer
   * @param {string} gameId
   * @param {function} callback
   */
  startTimer(gameId, callback) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    game.startTimer(callback);
  }

  /**
   * End Game Timer
   * @param {string} gameId
   */
  endTimer(gameId) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    game.endTimer();
  }

  /**
   * Add Wating Players For Next Round
   * @param {string} gameId
   * @param {object} player
   * @return {number} Number of Wating Players
   */
  waitNextRound(gameId, player) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    return game.addWatingPlayer(player);
  }

  /**
   * Collect submitted clues
   * @param {string} gameId
   * @param {string} clue
   */
  collectClues(gameId, clue) {
    if (!this.checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    game.addClue(clue);

    return game.getState();
  }
}

module.exports = MatchManager;
