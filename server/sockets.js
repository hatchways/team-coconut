const MatchManager = require("./engine/MatchManager");
const Player = require("./engine/Player");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const ClientError = require("./common/ClientError");

const sockets = {};
const socketIdEmail = {};

sockets.init = function (server) {
  // Create Match Manager
  const Match = new MatchManager();

  // socket.io setup
  var io = require("socket.io")(server, {
    pingInterval: 5000,
    pingTimeout: 10000,
  });

  /**
   * Socket Authentication
   */
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      const token = cookies["token"];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
          if (error) {
            next(new ClientError("", "Authentication Error", 401));
          }
          socket.decoded = decoded;
          console.log(socket.decoded);
          next();
        });
      } else {
        next(new ClientError("", "Unauthorized", 401));
      }
    } catch (error) {
      socket.emit("auth-error", { errorMsg: error.userMessage });
      socket.disconnect();
    }
  })
    /**
     * Socket Connect
     */
    .on("connect", (socket) => {
      console.log("connected", socket.id, new Date().toLocaleTimeString());
      socket.on("disconnect", () => {
        delete socketIdEmail[socket.id];
        //console.log("disconnected", socket.id, new Date().toLocaleTimeString());
      });

      // --------------------------------------------------------------- //
      // ------------- START: RTC Connection Events -------------------- //
      // --------------------------------------------------------------- //

      socket.on("BE-join-video-call", ({ gameId, userEmail }) => {
        socket.join(gameId);
        socketIdEmail[socket.id] = userEmail;
        io.in(gameId).clients((err, clients) => {
          const players = [];
          clients.forEach((client) => {
            if (client !== socket.id && socketIdEmail[client]) {
              players.push({ socketId: client, email: socketIdEmail[client] });
            }
          });
          socket.emit("FE-players-in-room", players);
        });
      });

      // initiate call with other players in game
      socket.on(
        "BE-send-call",
        ({ callerEmail, playerToCall, caller, callerSignal }) => {
          io.to(playerToCall).emit("FE-receive-call", {
            callerEmail,
            callerSignal,
            caller,
          });
        }
      );

      // accept call and send signal back to caller for them to accept
      socket.on("BE-answer-call", ({ playerEmail, answerSignal, caller }) => {
        io.to(caller).emit("FE-accept-call-back", {
          playerEmail,
          answerSignal,
          playerAnsweringId: socket.id,
        });
      });

      // --------------------------------------------------------------- //
      // ---------------- END: RTC Connection Events ------------------- //
      // --------------------------------------------------------------- //

      // --------------------------------------------------------------- //
      // ---------------- START: Game Logic Events --------------------- //
      // --------------------------------------------------------------- //

      /**
       * Join Room
       */
      socket.on("BE-user-joined", ({ gameId, player }) => {
        const newPlayer = new Player(player.email, player.name);
        if (!Match.checkRoomExist(gameId)) {
          Match.createRoom(gameId);
        }
        // Add New Player in the Match Map
        const gameState = Match.joinRoom(gameId, newPlayer);
        //joining room
        socket.join(gameId);
        //notify all other users in the room
        io.sockets.in(gameId).emit("FE-user-joined", {
          joinedPlayer: player.email,
          gamePlayers: gameState.players,
        });
      });

      /**
       * Start Game
       */
      socket.on("start-game", (gameId) => {
        try {
          const gameState = Match.startGame(gameId);
          // Start Timer
          Match.startTimer(gameId, function () {
            console.log("Time Over!!");
            socket.in(gameId).emit("FE-time-over", { gameId, gameState });
          });
          io.sockets.in(gameId).emit("game-started", gameState);
        } catch (error) {
          console.log(error);
          socket.emit("FE-error-start-game", { msg: error.userMessage });
        }
      });

      /**
       * Send Clues
       */
      socket.on("BE-send-clue", ({ gameId, player, clues }) => {
        console.log(clues);
        try {
          const gameState = Match.trackClues(gameId, player);
          io.sockets.in(gameId).emit("FE-send-clue", { player, gameState });
        } catch (error) {
          console.log(error);
          socket.emit("FE-error-during-game", { msg: error.userMessage });
        }
      });

      /**
       * Send Clues
       */
      socket.on("BE-display-typing-notification", ({ gameId, playerEmail }) => {
        try {
          const gameState = Match.trackTyping(gameId, playerEmail);
          socket.broadcast
            .to(gameId)
            .emit("FE-display-typing-notification", gameState);
        } catch (error) {
          console.log(error);
          socket.emit("FE-error-during-game", { msg: error.userMessage });
        }
      });

      /**
       * End of Round
       */
      socket.on("BE-send-answer", ({ gameId, answer, clues }) => {
        try {
          const gameState = Match.endRound(gameId, answer, clues);
          // End Timer
          Match.endTimer(gameId);
          io.sockets.in(gameId).emit("FE-send-answer", { gameState, gameId });
        } catch (error) {
          console.log(error);
          socket.emit("FE-error-during-game", { msg: error.userMessage });
        }
      });

      /**
       * Move to Next Round
       */
      socket.on("BE-move-round", ({ gameId, playerSocketId }) => {
        try {
          const numberOfPlayers = Match.waitNextRound(gameId, playerSocketId);
          if (numberOfPlayers === 4) {
            const gameState = Match.moveToNextRound(gameId);
            // Start Timer
            Match.startTimer(gameId, function () {
              console.log("Time Over!!");
              socket.in(gameId).emit("FE-time-over", { gameId, gameState });
            });
            io.sockets.in(gameId).emit("FE-move-round", gameState);
          }
        } catch (error) {
          console.log(error);
          socket.emit("FE-error-during-game", { msg: error.userMessage });
        }
      });

      /**
       * Play Again / Non-Host players join new game
       */
      socket.on("BE-join-new-game", ({ gameId, newGameId }) => {
        socket.broadcast.to(gameId).emit("FE-join-new-game", newGameId);
        io.of("/")
          .in(gameId)
          .clients(function (error, clients) {
            if (clients.length > 0) {
              console.log("clients in the room: \n");
              console.log(clients);
              clients.forEach(function (socket_id) {
                io.sockets.sockets[socket_id].leave(gameId);
              });
            }
          });
      });

      /**
       * Player leaves game AFTER the game has ended
       */
      socket.on("BE-leave-game", ({ gameId }) => {
        io.of("/")
          .in(gameId)
          .clients((error, clients) => {
            clients.forEach((socket_id) => {
              if (socket_id === socket.id) {
                io.sockets.sockets[socket_id].leave(gameId);
              }
            });
          });
      });

      /**
       * End game
       */
      socket.on("BE-end-game", (gameId) => {
        try {
          Match.endGame(gameId);
        } catch (error) {
          console.log(error);
          socket.emit("FE-error-during-game", { msg: error.userMessage });
        }
      });
      // --------------------------------------------------------------- //
      // ------------------ END: Game Logic Events --------------------- //
      // --------------------------------------------------------------- //
    });
  console.log("Sockets Initialized");
};

module.exports = sockets;
