import React, { useContext } from "react";
import { makeStyles, Container, Typography, Paper } from "@material-ui/core";
import { GameplayContext } from "../../context/GameplayContext";

function NextRoundScreen() {
  const classes = useStyles();
  const { gameState } = useContext(GameplayContext);
  const { players } = gameState;
  console.log(players);
  return (
    <div className={classes.overlay}>
      <Container className={classes.nextRoundContainer} component="div">
        <Paper className={classes.timerPaper} elevation={5}>
          <Typography className={classes.text} variant="h4" component="p">
            Next Round In:
          </Typography>
        </Paper>
        <Paper className={classes.scoresPaper} elevation={5}>
          {testPlayers.map((player) => (
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

const testPlayers = [
  { id: "1", name: "Darren", point: "100" },
  { id: "2", name: "Aecio", point: "500" },
  { id: "3", name: "Hyunse", point: "300" },
  { id: "4", name: "Insaf", point: "500" },
];

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
