const Game = require('./Game');
const Player = require('./Player');
const ClientError = require('../common/ClientError');

class MatchManager {
  constructor() {
    this.matchManager = new Map();
  }

  createRoom(roomName) {
    this.matchManager.set(roomName, new Game());
  }

  joinRoom(roomName, player) {
    if (this.matchManager.has(roomName)) {
      let game = this.matchManager.get(roomName);
      const newPlayer = new Player(player.id, player.name);

      game.addPlayer(newPlayer);

      return game.getState();
    } else {
      throw new ClientError('', 'Room Not Found', 404);
    }
  }

  startGame(roomName) {
    if (this.matchManager.has(roomName)) {
      let game = this.matchManager.get(roomName);
      const numberOfPlayers = game.getNumberOfPlayers();

      if (numberOfPlayers === 4) {
        game.initGame();
      }

      return game.getState();
    } else {
      throw new ClientError('', 'Room Not Found', 404);
    }
  }

  endRound(roomName, answer, clues) {
    if (this.matchManager.has(roomName)) {
      let game = this.matchManager.get(roomName);
      const correct = game.checkAnswer(answer);

      if (correct) {
        game.givePoints(clues);
      }

      return {
        isCorrect: correct,
        state: game.getState()
      };
    } else {
      throw new ClientError('', 'Room Not Found', 404);
    }
  }

  moveToNextRound(roomName) {
    if (this.matchManager.has(roomName)) {
      let game = this.matchManager.get(roomName);

      game.nextRound();

      return game.getState();
    } else {
      throw new ClientError('', 'Room Not Found', 404);
    }
  }

  leavePlayer(player) {
    if (this.matchManager.has(roomName)) {
      let game = this.matchManager.get(roomName);

      game.leavePlayer(player);

      return game.getState();
    } else {
      throw new ClientError('', 'Room Not Found', 404);
    }
  }

  endGame() {
    if (this.matchManager.has(roomName)) {
      this.matchManager.delete(roomName);
      
    } else {
      throw new ClientError('', 'Room Not Found', 404);
    }
  }

  checkRoomExist(roomName) {
    return this.matchManager.has(roomName);
  }
}

module.exports = MatchManager;
