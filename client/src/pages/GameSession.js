import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import PlayerPanel from "../components/game-session/PlayerPanel";
import CluePanel from "../components/game-session/CluePanel";
import GuessPanel from "../components/game-session/GuessPanel";
import { GameplayContext } from "../context/GameplayContext";
import NextRoundScreen from "../components/game-session/NextRoundScreen";
import EndGameScreen from "../components/game-session/EndGameScreen";
import GameHeader from "../components/game-session/GameHeader";

function GameSession() {
  const {
    gameReady,
    gameState,
    isGuesser,
    showNextRoundScreen,
    showEndGameScreen,
  } = useContext(GameplayContext);

  return (
    <>
      <main>
        <GameHeader />
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          {gameReady && (
            <Grid item>
              {isGuesser ? (
                <GuessPanel />
              ) : (
                <CluePanel wordToGuess={gameState.word} />
              )}
            </Grid>
          )}
          {gameReady && (
            <Grid item lg>
              <PlayerPanel />
            </Grid>
          )}
        </Grid>
      </main>
      {showNextRoundScreen && <NextRoundScreen />}
      {showEndGameScreen && <EndGameScreen />}
    </>
  );
}

export default GameSession;
