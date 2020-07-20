import React, { createContext, useState, useEffect, useCallback } from "react";
import sockets from "../utils/sockets";

const GameplayContext = createContext();

function GameplayContextProvider({ children }) {
  const [gameState, setGameState] = useState(null);
  const [gameReady, setGameReady] = useState(false);
  const [clues, setClues] = useState([]);
  const [showNextRoundScreen, setShowNextRoundScreen] = useState(false);
  const [showEndGameScreen, setShowEndGameScreen] = useState(false);
  const [showTypingNotification, setShowTypingNotification] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);
  const [isGuesser, setIsGuesser] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [gameTimer, setGameTimer] = useState(5);
  const [isGuessPhase, setIsGuessPhase] = useState(false);

  useEffect(() => {
    const { email: currentUser } = JSON.parse(localStorage.getItem("user"));
    /**
     * Start Game
     */
    sockets.on("game-started", (gameState) => {
      setGameState(gameState);
      setRedirect(false);
      setRedirectPath("");
      setIsGuesser(false);
      console.log("First Round : ", gameState);
      // determine guesser on first round
      const currentGuesser = gameState.players.filter(
        (player) => player.isGuesser === true
      );
      if (currentGuesser[0].id === currentUser) {
        setIsGuesser(true);
      }
      // this is effectively a isLoading state variable
      setGameReady(true);
    });

    /**
     * Send Clues
     */
    sockets.on("FE-send-clue", (player) => {
      setClues((prevClues) => [...prevClues, player]);
      setShowTypingNotification(false);
    });

    /**
     * Display Typing Notification
     */
    sockets.on("FE-display-typing-notification", (playerEmail) => {
      setShowTypingNotification(true);
      // use playerEmail to which player panel to display the notification?
    });

    /**
     * End of Round
     */
    sockets.on("FE-send-answer", ({ gameState }) => {
      setGameState(gameState);
      setGameTimer(5);
      setShowTypingNotification(false); // if the clue giver was still typing at the end of the first phase
      if (gameState.state.round === gameState.state.players.length - 1) {
        setShowEndGameScreen(true);
      } else {
        setShowNextRoundScreen(true);
      }
    });

    /**
     * Move to Next Round
     */
    sockets.on("FE-move-round", (gameState) => {
      setGameState(gameState);
      setIsGuessPhase(false);
      setIsGuesser(false); // reset guesser
      // determine guesser on subsequent rounds
      const currentGuesser = gameState.players.filter(
        (player) => player.isGuesser === true
      );
      if (currentGuesser[0].id === currentUser) {
        setIsGuesser(true);
      }
    });

    /**
     * Restart Game
     */
    sockets.on("FE-reset-game", (gameState) => {
      console.log(gameState);
    });
  }, []);

  // ---------- ALL FUNCTION DECLARATIONS ---------- //

  function sendClueToBE(gameId, player) {
    sockets.emit("BE-send-clue", { gameId, player });
  }

  const sendGuessToBE = useCallback((gameId, answer, clues) => {
    sockets.emit("BE-send-answer", { gameId, answer, clues });
  }, []);

  const closeNextRoundScreen = useCallback((gameId) => {
    sockets.emit("BE-move-round", {
      gameId,
      playerSocketId: sockets.id,
    });
    setShowNextRoundScreen(false);
  }, []);

  const decrementTimer = useCallback(() => {
    setGameTimer((time) => time - 1);
  }, []);

  const changeGamePhase = useCallback((bool) => {
    setIsGuessPhase(bool);
    setGameTimer(5);
  }, []);

  const disableSubmitInputs = useCallback((bool) => {
    setSubmitDisable(bool);
  }, []);

  function displayTypingNotification(gameId, email) {
    sockets.emit("BE-display-typing-notification", {
      gameId,
      playerEmail: email,
    });
  }

  function endGame(gameId) {
    sockets.emit("BE-end-game", gameId);
  }

  function leaveGame() {
    setRedirect(true);
    setRedirectPath("/create-game");
  }

  function createNewGame(gameId, newGameId) {
    sockets.emit("BE-join-new-game", { gameId, newGameId });
    setRedirect(true);
    setRedirectPath(`/lobby/${newGameId}`);
    setShowEndGameScreen(false);
  }

  const joinNewGame = useCallback((newGameId) => {
    setRedirect(true);
    setRedirectPath(`/lobby/${newGameId}`);
    setShowEndGameScreen(false);
  }, []);

  /**
   * @param {object} gameData = {gameId, players}
   */
  async function saveGameToDB(gameData) {
    try {
      const response = await fetch(`/game/${gameData.gameId}/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });
      const json = await response.json();
      console.log("Saved Game : ", json); // do something with json object later?
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <GameplayContext.Provider
      value={{
        gameReady,
        gameState,
        isGuesser,
        clues,
        showNextRoundScreen,
        showEndGameScreen,
        showTypingNotification,
        submitDisable,
        redirect,
        redirectPath,
        isGuessPhase,
        gameTimer,
        closeNextRoundScreen,
        disableSubmitInputs,
        sendClueToBE,
        sendGuessToBE,
        displayTypingNotification,
        saveGameToDB,
        decrementTimer,
        changeGamePhase,
        endGame,
        leaveGame,
        createNewGame,
        joinNewGame,
      }}
    >
      {children}
    </GameplayContext.Provider>
  );
}

export { GameplayContext, GameplayContextProvider };
