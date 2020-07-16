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

    sockets.on("FE-send-clue", (player) => {
      setClues((prevClues) => [...prevClues, player]);
    });

    // get answer and game state, signal to show score screen
    sockets.on("FE-send-answer", ({ gameState }) => {
      setGameState(gameState);
      setShowNextRoundScreen(true);
    });

    // close next round screen
    sockets.on("FE-close-next-round-screen", (gameId) => {
      setShowNextRoundScreen(false);
      sockets.emit("BE-move-round", gameId);
    });

    sockets.on("FE-move-round", (gameState) => {
      setGameState(gameState);
      const currentGuesser = gameState.players.filter(
        (player) => player.isGuesser === true
      );
      setGuesser(currentGuesser);
      console.log(gameState);
    });

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

  function closeNextRoundScreen() {}

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
