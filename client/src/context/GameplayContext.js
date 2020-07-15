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
      // currently there is an issue that occurs as follows:
      // playerOne submits a clue => clues = [playerOneClue]
      // playerTwo submits a clue => clues = [playerOneClue, playerTwoClue, playerTwoClue]
      // playerThree submits a clue => clues = [playerOneClue, playerTwoClue, playerTwoClue, playerThreeClue, playerThreeClue, playerThreeClue]
      // maybe using a Set is an easy solution?
      // but finding a way to prevent re-renders is probably the best solution
      setClues((prevClues) => [...prevClues, player.msg]);
      console.log(clues);
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
  }, [clues]);

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
