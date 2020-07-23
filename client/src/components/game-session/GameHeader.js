import React, { useContext, useEffect } from "react";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { makeStyles, Typography, Paper } from "@material-ui/core";
import { GameplayContext } from "../../context/GameplayContext";
import { useParams } from "react-router-dom";

function GameHeader() {
  const classes = useStyles();
  const {
    gameTimer,
    decrementTimer,
    isGuessPhase,
    showEndGameScreen,
    showNextRoundScreen,
    clues,
    sendGuessToBE,
    changeGamePhase,
    isGuesser,
  } = useContext(GameplayContext);
  const { gameId } = useParams();

  useEffect(() => {
    let timerToClose;
    if (gameTimer > 0 && !showNextRoundScreen && !showEndGameScreen) {
      timerToClose = setTimeout(() => {
        decrementTimer();
      }, 1000);
    }

    if (gameTimer === 0) {
      if (!isGuessPhase) {
        changeGamePhase(true);
      } else if (isGuessPhase && isGuesser) {
        const answer = ""; // if the timer ends and the guesser doesn't submit
        sendGuessToBE(gameId, answer, clues);
      }
    }

    return () => {
      clearTimeout(timerToClose);
    };
  }, [
    gameTimer,
    decrementTimer,
    showNextRoundScreen,
    showEndGameScreen,
    isGuessPhase,
    sendGuessToBE,
    clues,
    gameId,
    changeGamePhase,
    isGuesser,
  ]);

  return (
    <header className={classes.header}>
      <span className={classes.logo}>
        <strong className={classes.logoStrong}>Just</strong>One
      </span>
      <Paper className={classes.timer}>
        <AccessTimeIcon className={classes.timerIcon} />
        <Typography
          style={{ marginRight: "0.5rem" }}
          className={classes.timerText}
        >
          {isGuessPhase ? "Guess!" : "Give Clues!"}
        </Typography>
        <Typography className={classes.timerText}>{gameTimer}</Typography>
      </Paper>
    </header>
  );
}

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1em",
    width: "100%",
  },
  logo: {
    fontSize: theme.logo.fontSize,
    fontWeight: theme.logo.fontWeight,
    color: theme.logo.color,
  },
  timer: {
    color: theme.palette.text.primary,
    background: theme.modal.background,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    padding: "0.5em",
  },
  timerText: {
    fontSize: "1.5rem",
    fontWeight: theme.typography.fontWeightMedium,
  },
  timerIcon: {
    fontSize: "2.5rem",
    marginRight: "0.5rem",
  },
  settings: {},
  logoStrong: {
    color: theme.palette.text.secondary,
    fontWeight: theme.logo.fontWeight,
  },
}));

export default GameHeader;
