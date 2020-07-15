const MatchManager = require("./engine/MatchManager");
const Player = require("./engine/Player");

const sockets = {};

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
      // Start Game
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
     * End of Round
     */
    socket.on("BE-send-answer", ({ gameId, answer, clues }) => {
      const gameState = Match.endRound(gameId, answer, clues);

      console.log("End Round : ", gameState.state.players);

      io.sockets.in(gameId).emit("FE-send-answer", { gameId, gameState });
    });

    /**
     * Open Next Round Screen Overlay
     */
    socket.on("BE-show-next-round-screen", (gameId) => {
      io.sockets.in(gameId).emit("FE-show-next-round-screen");
    });

    /**
     * Move to Next Round
     */
    socket.on("BE-move-round", (gameId) => {
      const gameState = Match.moveToNextRound(gameId);

      io.sockets.in(gameId).emit("FE-move-round", gameState);
    });

    /**
     * Restart Game
     */
    socket.on("BE-reset-game", (gameId) => {
      const gameState = Match.startGame(gameId);

      io.sockets.in(gameId).emit("game-started", gameState);
    });
  });
  console.log("Sockets Initialized");
};

module.exports = sockets;
