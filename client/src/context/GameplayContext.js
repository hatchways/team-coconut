import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { GameContext } from "./GameContext";
import { AuthContext } from "./AuthContext";
import sockets from "../utils/sockets";

const TIME = 15;
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
  const [gameTimer, setGameTimer] = useState(TIME);
  const [isGuessPhase, setIsGuessPhase] = useState(false);
  const { joinGame } = useContext(GameContext);
  const { auth } = useContext(AuthContext);
  let currentUser;
  if (auth) {
    const { email } = JSON.parse(localStorage.getItem("user"));
    currentUser = email;
  }

  useEffect(() => {
    /**
     * Start Game
     */
    sockets.on("game-started", (gameState) => {
      setGameState(gameState);
      setIsGuessPhase(false);
      setRedirect(false);
      setRedirectPath("");
      setIsGuesser(false);
      setSubmitDisable(false);
      setShowEndGameScreen(false);
      setClues([]);
      setGameTimer(TIME);
      console.log("First Round: ", gameState);
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
    sockets.on("FE-send-clue", ({ player, cluesSubmitted, gameState }) => {
      setGameState(gameState);
      setClues((prevClues) => [...prevClues, player]);
      setShowTypingNotification(false);
      if (cluesSubmitted.length === 3) {
        setIsGuessPhase(true);
        setGameTimer(TIME);
        setSubmitDisable(true);
      }
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
      setGameTimer(TIME);
      setShowTypingNotification(false); // if the clue giver was still typing at the end of the first phase
      // if (gameState.state.round === gameState.state.players.length - 1) {
      if (gameState.state.round === 2) {
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
      setClues([]);
      setIsGuessPhase(false);
      setIsGuesser(false); // reset guesser
      // determine guesser on subsequent rounds
      const currentGuesser = gameState.players.filter(
        (player) => player.isGuesser === true
      );
      if (currentGuesser[0].id === currentUser) {
        setIsGuesser(true);
      }
      console.log(`Round ${gameState.round}: `, gameState);
    });

    /**
     * Send Blank Answer If Time Runs Out
     */
    sockets.on("FE-time-over", ({ gameId, cluesSubmitted }) => {
      const answer = ""; // time ran out and the guesser did not submit anything
      sockets.emit("BE-send-answer", { gameId, answer, cluesSubmitted });
    });

    /**
     * Join New Game Host Creates
     */
    sockets.on("FE-join-new-game", async (newGameId) => {
      await joinGame(newGameId);
      redirectToNewGame(newGameId);
    });
  }, [joinGame, currentUser]);

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
    setGameTimer(TIME);
    setSubmitDisable(true);
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

  function leaveGame(gameId) {
    setRedirect(true);
    setRedirectPath("/create-game");
    sockets.emit("BE-leave-game", { gameId });
  }

  function createNewGame(gameId, newGameId) {
    sockets.emit("BE-join-new-game", { gameId, newGameId });
    setRedirect(true);
    setRedirectPath(`/lobby/${newGameId}`);
    setShowEndGameScreen(false);
  }

  function redirectToNewGame(newGameId) {
    setRedirect(true);
    setRedirectPath(`/lobby/${newGameId}`);
    setShowEndGameScreen(false);
  }

  /**
   * @param {object} gameData = {gameId, players}
   */
  async function saveGameToDB(gameData) {
    try {
      await fetch(`/game/${gameData.gameId}/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });
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
      }}
    >
      {children}
    </GameplayContext.Provider>
  );
}

export { GameplayContext, GameplayContextProvider };
