import React, { createContext, useState, useEffect } from "react";
import sockets from "../utils/sockets";

const GameplayContext = createContext();

function GameplayContextProvider({ children }) {
  const [gameState, setGameState] = useState();
  const [gameReady, setGameReady] = useState(false);
  const [guesser, setGuesser] = useState();
  const [clues, setClues] = useState([]);

  useEffect(() => {
    sockets.on("game-started", (gameState) => {
      setGameState(gameState);

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

    sockets.on("FE-send-answer", (gameState) => {
      console.log(gameState);
    });

    sockets.on("FE-move-round", (gameState) => {
      console.log(gameState);
    });

    sockets.on("FE-reset-game", (gameState) => {
      console.log(gameState);
    });
  }, []);

  function sendClueToBE(gameId, player) {
    console.log(gameId, player);
    sockets.emit("BE-send-clue", { gameId, player });
  }

  function sendGuessToBE(gameId, answer, clues) {
    console.log(gameId, answer, clues);
    sockets.emit("BE-send-answer", { gameId, answer, clues });
  }

  return (
    <GameplayContext.Provider
      value={{
        gameReady,
        gameState,
        guesser,
        clues,
        sendClueToBE,
        sendGuessToBE,
      }}
    >
      {children}
    </GameplayContext.Provider>
  );
}

export { GameplayContext, GameplayContextProvider };
