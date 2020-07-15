import React, { useContext, useEffect, useState } from "react";
import { makeStyles, Container, Typography, Paper } from "@material-ui/core";
import { GameplayContext } from "../../context/GameplayContext";
import sockets from "../../utils/sockets";
import { useParams } from "react-router-dom";

function NextRoundScreen() {
  const classes = useStyles();
  const { gameState } = useContext(GameplayContext);
  const {
    state: { players },
  } = gameState;
  const { gameId } = useParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timerToClose;
    if (countdown > 0) {
      timerToClose = setTimeout(() => {
        setCountdown((time) => time - 1);
      }, 1000);
    }
    if (countdown === 0) {
      sockets.emit("BE-close-next-round-screen", gameId);
    }

    return () => {
      clearTimeout(timerToClose);
    };
  }, [countdown, gameId]);

  return (
    <div className={classes.overlay}>
      <Container className={classes.nextRoundContainer} component="div">
        <Paper className={classes.timerPaper} elevation={5}>
          <Typography className={classes.text} variant="h4" component="p">
            Next Round In: {countdown}
          </Typography>
        </Paper>
        <Paper className={classes.scoresPaper} elevation={5}>
          {players.map((player) => (
            <Container
              key={player.id}
              className={classes.scoreSection}
              component="section"
            >
              <Typography className={classes.text} variant="h4" component="p">
                {player.name}
              </Typography>
              <Typography className={classes.text} variant="h4" component="p">
                + {player.point}
              </Typography>
            </Container>
          ))}
        </Paper>
      </Container>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  overlay: {
    background: "rgba(0,0,0,0.2)",
    position: "absolute",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
  },
  nextRoundContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  timerPaper: {
    height: "100px",
    width: "50%",
    margin: "0 auto 3em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.modal.background,
  },
  scoresPaper: {
    padding: "3rem 1.5rem 1.5rem",
    width: "50%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: theme.modal.background,
  },
  scoreSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  text: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default NextRoundScreen;
