const MatchManager = require("./engine/MatchManager");
const Player = require("./engine/Player");

const sockets = {};
let playersCurrentlyReady = [];

sockets.init = function (server) {
  // Create Match Manager
  const Match = new MatchManager();
  // socket.io setup
  var io = require("socket.io")(server, {
    pingInterval: 5000,
    pingTimeout: 10000,
  });

  /**
   * Socket Connect
   */
  io.on("connect", (socket) => {
    console.log("connected", socket.id, new Date().toLocaleTimeString());
    socket.on("disconnect", () => {
      console.log("disconnected", socket.id, new Date().toLocaleTimeString());
    });

    /**
     * Join Room
     */
    socket.on("BE-user-joined", ({ gameId, player }) => {
      const newPlayer = new Player(player.email, player.name);

      if (!Match.checkRoomExist(gameId)) {
        Match.createRoom(gameId);
      }

      // Add New Player in the Match Map
      Match.joinRoom(gameId, newPlayer);

      //joining room
      socket.join(gameId);
      //notify all other users in the room
      socket.broadcast.to(gameId).emit("FE-user-joined", player.email);
    });

    /**
     * Start Game
     */
    socket.on("start-game", (gameId) => {
      const gameState = Match.startGame(gameId);

      io.sockets.in(gameId).emit("game-started", gameState);
    });

    /**
     * Send Clues
     */
    socket.on("BE-send-clue", ({ gameId, player }) => {
      console.log(`Clue is ${player.msg} from ${player.name}`);

      io.sockets.in(gameId).emit("FE-send-clue", player);
    });

    /**
     * Send Clues
     */
    socket.on("BE-display-typing-notification", ({ gameId, playerEmail }) => {
      socket.broadcast
        .to(gameId)
        .emit("FE-display-typing-notification", playerEmail);
    });

    /**
     * End of Round
     */
    socket.on("BE-send-answer", ({ gameId, answer, clues }) => {
      const gameState = Match.endRound(gameId, answer, clues);

      console.log("End Round : ", gameState.state.players);

      io.sockets.in(gameId).emit("FE-send-answer", { gameState });
    });

    /**
     * Move to Next Round
     */
    socket.on("BE-move-round", ({ gameId, playerSocketId }) => {
      playersCurrentlyReady.push(playerSocketId);
      if (playersCurrentlyReady.length === 4) {
        playersCurrentlyReady = []; // reset player ready list for the next round
        const gameState = Match.moveToNextRound(gameId);
        io.sockets.in(gameId).emit("FE-move-round", gameState);
        console.log("Next Round : ", gameState);
      }
    });

    /**
     * Restart Game
     */
    socket.on("BE-reset-game", (gameId) => {
      const gameState = Match.startGame(gameId);

      io.sockets.in(gameId).emit("game-started", gameState);
    });

    /**
     * Player leavs game
     */
    socket.on("BE-leave-game", ({ gameId, player }) => {
      const gameState = Match.leavePlayer(gameId, player);

      io.sockets.in(gameId).emit("FE-leave-game", gameState);
    });

    /**
     * End game
     */
    socket.on("BE-end-game", (gameId) => {
      Match.endGame(gameId);

      io.sockets.in(gameId).emit("FE-end-game");
    });
  });
  console.log("Sockets Initialized");
};

module.exports = sockets;
