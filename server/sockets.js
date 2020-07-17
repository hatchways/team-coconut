const Game = require("./models/Game");
const { use } = require("chai");

const sockets = {};

const socketIdEmail = {};

sockets.init = function (server) {
  // socket.io setup
  var io = require("socket.io")(server, {
    pingInterval: 5000,
    pingTimeout: 10000,
  });

  io.on("connect", (socket) => {
    //console.log("connected", socket.id, new Date().toLocaleTimeString());
    socket.on("disconnect", () => {
      delete socketIdEmail[socket.id]
      //console.log("disconnected", socket.id, new Date().toLocaleTimeString());
    });

    //joining the game (room)
    socket.on("BE-user-joined", async ({ gameId, userEmail }) => {
      //joining room
      socket.join(gameId);
      //notify all other users in the room
      socket.broadcast.to(gameId).emit("FE-user-joined", userEmail);
    });

    socket.on("BE-join-video-call", ({ gameId, userEmail }) => {
      socket.join(gameId);
      socketIdEmail[socket.id] = userEmail;
      io.in(gameId).clients((err, clients) => {
        const players = [];
        clients.forEach(client => {
          if (client !== socket.id && socketIdEmail[client]) {
            players.push({socketId: client, email: socketIdEmail[client]});
          }
        });
        socket.emit("FE-players-in-room", players)
      });
    });

    // send all player socket ids (except current user) to front end somehow
    //socket.emit("get-player-socket-ids");

    // initiate call with other players in game
    socket.on("BE-send-call", ({ callerEmail, playerToCall, caller, callerSignal }) => {
      io.to(playerToCall).emit("FE-receive-call", { callerEmail, callerSignal, caller });
    });

    // accept call and send signal back to caller for them to accept
    socket.on("BE-answer-call", ({ playerEmail, answerSignal, caller }) => {
      io.to(caller).emit("FE-accept-call-back", {
        playerEmail,
        answerSignal,
        playerAnsweringId: socket.id,
      });
    });

    //host starts the game
    socket.on("start-game", (gameId) => {
      socket.broadcast.to(gameId).emit("game-started");
    });
  });
  console.log("Sockets Initialized");
};

module.exports = sockets;
