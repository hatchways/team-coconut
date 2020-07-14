const Game = require("./models/Game");

const sockets = {};

sockets.init = function (server) {
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
    socket.on("BE-user-joined", async ({ gameId, userEmail }) => {
      //joining room
      socket.join(gameId);
      //notify all other users in the room
      socket.broadcast.to(gameId).emit("FE-user-joined", userEmail);
    });

    //host starts the game
    socket.on("start-game", (gameId) => {
      socket.broadcast.to(gameId).emit("game-started");
    });
  });
  console.log("Sockets Initialized");
};

module.exports = sockets;
