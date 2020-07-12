const Game = require('./Game');
const Player = require('./Player');
const ClientError = require('../common/ClientError');

class MatchManager {
  constructor() {
    this.matchManager = new Map();
  }

  createRoom(gameId) {
    this.matchManager.set(gameId, new Game());
  }

  joinRoom(gameId, player) {
    if (!checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);
    const newPlayer = new Player(player.id, player.name);

    game.addPlayer(newPlayer);

    return game.getState();
  }

  startGame(gameId) {
    if (!checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);
    const numberOfPlayers = game.getNumberOfPlayers();

    console.log(numberOfPlayers);

    if (numberOfPlayers === 4) {
      game.initGame();
    }

    return game.getState();
  }

  endRound(gameId, answer, clues) {
    if (!checkRoomExist(gameId))
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

  moveToNextRound(gameId) {
    if (!checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    game.nextRound();

    return game.getState();
  }

  leavePlayer(player) {
    if (!checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    const game = this.matchManager.get(gameId);

    game.leavePlayer(player);

    return game.getState();
  }

  endGame() {
    if (!checkRoomExist(gameId))
      throw new ClientError('', 'Room Not Found', 404);

    this.matchManager.delete(gameId);
  }

  checkRoomExist(gameId) {
    return this.matchManager.has(gameId);
  }
}

module.exports = MatchManager;
