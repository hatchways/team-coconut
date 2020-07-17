import React, { useContext } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import PlayerPanel from "../components/game-session/PlayerPanel";
import CluePanel from "../components/game-session/CluePanel";
import GuessPanel from "../components/game-session/GuessPanel";
import Settings from "../components/Settings";
import { GameplayContext } from "../context/GameplayContext";
import NextRoundScreen from "../components/game-session/NextRoundScreen";
import EndGameScreen from "../components/game-session/EndGameScreen";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

function GameSession() {
  const classes = useStyles();
  const {
    gameReady,
    gameState,
    isGuesser,
    showNextRoundScreen,
    showEndGameScreen,
  } = useContext(GameplayContext);

  return (
    <>
      <main className={classes.mainContainer}>
        <span className={classes.logo}>
          <strong className={classes.logoStrong}>Just</strong>One
        </span>
        <nav className={classes.settings}>
          <Settings />
        </nav>
        <span className={classes.timer}>
          <Typography className={classes.timerText}>30</Typography>
          <AccessTimeIcon className={classes.timerIcon} />
        </span>
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

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: "0",
    left: "0",
    margin: "1.5rem 0 0 3rem",
    fontSize: theme.logo.fontSize,
    fontWeight: theme.logo.fontWeight,
    color: theme.logo.color,
  },
  // this in particular definitely needs to change in terms of responsiveness
  // however, these values should be where it is ideally placed
  timer: {
    position: "absolute",
    top: "0",
    left: "0",
    margin: "1.5rem 0 0 20rem",
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: "2rem",
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: "0.5rem",
  },
  timerIcon: {
    fontSize: "2.5rem",
  },
  settings: {
    position: "absolute",
    top: "0",
    right: "0",
    margin: "1.5rem 3rem 0 0",
  },
  logoStrong: {
    color: theme.palette.text.secondary,
    fontWeight: theme.logo.fontWeight,
  },
}));

export default GameSession;
