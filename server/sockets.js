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

  io.on("connect", (socket) => {
    console.log("connected", socket.id, new Date().toLocaleTimeString());
    socket.on("disconnect", () => {
      console.log("disconnected", socket.id, new Date().toLocaleTimeString());
    });

    //joining the game (room)
    socket.on("BE-user-joined", async ({ gameId, player }) => {
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

    //host starts the game
    socket.on("start-game", (gameId) => {
      const gameState = Match.startGame(gameId);
      socket.broadcast.to(gameId).emit("game-started", gameState);
    });
  });
  console.log("Sockets Initialized");
};

module.exports = sockets;
