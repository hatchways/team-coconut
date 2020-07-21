import React, { useContext, useEffect } from "react";
import { Grid } from "@material-ui/core";
import PlayerPanel from "../components/game-session/PlayerPanel";
import CluePanel from "../components/game-session/CluePanel";
import GuessPanel from "../components/game-session/GuessPanel";
import { GameplayContext } from "../context/GameplayContext";
import { GameContext } from "../context/GameContext";
import NextRoundScreen from "../components/game-session/NextRoundScreen";
import EndGameScreen from "../components/game-session/EndGameScreen";
import GameHeader from "../components/game-session/GameHeader";

function GameSession({ match }) {
  const {
    gameReady,
    isGuesser,
    showNextRoundScreen,
    showEndGameScreen,
  } = useContext(GameplayContext);

  const { game: { players }, getGame } = useContext(GameContext);

  const gameId = match.params.gameId;
  useEffect(() => {
    getGame(gameId);
  }, [gameId, getGame]);

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
            <Grid item>{isGuesser ? <GuessPanel /> : <CluePanel />}</Grid>
          )}
          {gameReady && (
            <Grid item lg>
              <PlayerPanel players={players} gameId={gameId} />
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
