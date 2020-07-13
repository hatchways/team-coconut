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

    // send all player socket ids (except current user) to front end somehow
    socket.emit("get-player-socket-ids");

    // initiate call with other players in game
    socket.on("starting-call", ({ playerToCall, caller, callerSignal }) => {
      console.log(`${caller} is calling ${playerToCall}`);
      io.to(playerToCall).emit("receiving-call", { callerSignal, caller });
    });

    // accept call and send signal back to caller for them to accept
    socket.on("answering-call", ({ answerSignal, caller }) => {
      io.to(caller).emit("accept-call-back", {
        answerSignal,
        playerAnsweringId: socket.id,
      });
    });
  });
  console.log("Sockets Initialized");
};

module.exports = sockets;
