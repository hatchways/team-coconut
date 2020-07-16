import React, { createContext, useState, useEffect, useCallback } from "react";
import sockets from "../utils/sockets";

const GameplayContext = createContext();

function GameplayContextProvider({ children }) {
  const [gameState, setGameState] = useState();
  const [gameReady, setGameReady] = useState(false);
  const [guesser, setGuesser] = useState();
  const [clues, setClues] = useState([]);
  const [showNextRoundScreen, setShowNextRoundScreen] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);

  useEffect(() => {
    /**
     * Start Game
     */
    sockets.on("game-started", (gameState) => {
      setGameState(gameState);
      console.log("First Round : ", gameState);

      const currentGuesser = gameState.players.filter(
        (player) => player.isGuesser === true
      );
      setGuesser(currentGuesser);

      // this is effectively a isLoading state variable
      setGameReady(true);
    });

    /**
     * Send Clues
     */
    sockets.on("FE-send-clue", (player) => {
      setClues((prevClues) => [...prevClues, player]);
    });

    /**
     * End of Round
     */
    sockets.on("FE-send-answer", ({ gameState }) => {
      setGameState(gameState);
      setShowNextRoundScreen(true);
    });

    /**
     * Move to Next Round
     */
    sockets.on("FE-move-round", (gameState) => {
      setGameState(gameState);
      const currentGuesser = gameState.players.filter(
        (player) => player.isGuesser === true
      );
      setGuesser(currentGuesser);
      console.log(gameState);
    });

    /**
     * Restart Game
     */
    sockets.on("FE-reset-game", (gameState) => {
      console.log(gameState);
    });
  }, []);

  function sendClueToBE(gameId, player) {
    sockets.emit("BE-send-clue", { gameId, player });
  }

  function sendGuessToBE(gameId, answer, clues) {
    sockets.emit("BE-send-answer", { gameId, answer, clues });
  }

  const closeNextRoundScreen = useCallback((gameId) => {
    setShowNextRoundScreen(false);
    sockets.emit("BE-move-round", gameId);
    console.log("closed next round screen");
  }, []);

  const disableSubmitInputs = useCallback((bool) => {
    setSubmitDisable(bool);
  }, []);

  return (
    <GameplayContext.Provider
      value={{
        gameReady,
        gameState,
        guesser,
        clues,
        showNextRoundScreen,
        submitDisable,
        closeNextRoundScreen,
        disableSubmitInputs,
        sendClueToBE,
        sendGuessToBE,
      }}
    >
      {children}
    </GameplayContext.Provider>
  );
}

export { GameplayContext, GameplayContextProvider };
