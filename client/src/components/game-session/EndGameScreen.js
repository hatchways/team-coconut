import React, { useContext } from "react";
import { makeStyles, Container, Paper, Typography } from "@material-ui/core";
import { GameplayContext } from "../../context/GameplayContext";
import { GameContext } from "../../context/GameContext";
import GenericButton from "../GenericButton";
import { Redirect, useParams } from "react-router-dom";

function EndGameScreen() {
  const classes = useStyles();
  const {
    gameState,
    saveGameToDB,
    endGame,
    leaveGame,
    createNewGame,
    redirect,
    redirectPath,
  } = useContext(GameplayContext);
  const {
    state: { players },
  } = gameState;
  const { isCurrentUserHost, errors, createGame } = useContext(GameContext);
  const { gameId } = useParams();

  function leaveCurrentGame() {
    // save game state to DB only if host
    if (isCurrentUserHost()) {
      const gameData = {
        gameId: gameId,
        players: players,
      };
      saveGameToDB(gameData);
      endGame(gameId);
    }
    leaveGame(gameId);
  }

  async function playAgain() {
    // save game state to DB
    const gameData = {
      gameId: gameId,
      players: players,
    };
    saveGameToDB(gameData);
    endGame(gameId);
    // create new game
    const newGameId = await createGame();
    createNewGame(gameId, newGameId);
  }

  if (!errors.joinError && redirect && redirectPath) {
    return <Redirect to={redirectPath} />;
  }

  return (
    <div className={classes.overlay}>
      <Container className={classes.endGameContainer} component="div">
        <Paper className={classes.endGamePaper} elevation={12}>
          <div className={classes.gameOverText}>
            <strong className={classes.strongText}>Game </strong> Over
          </div>
          <Container component="div">
            {players.map((player, index) => (
              <div key={player.id}>
                <Container className={classes.scoreSection} component="section">
                  <Typography
                    className={classes.scoreText}
                    variant="h4"
                    component="p"
                  >
                    <strong className={classes.strongText}>
                      # {index + 1}{" "}
                    </strong>{" "}
                    {player.name}
                  </Typography>
                  <Typography
                    className={classes.strongText}
                    variant="h4"
                    component="p"
                  >
                    {player.point} pts
                  </Typography>
                </Container>
                <hr className={classes.divider} />
              </div>
            ))}
          </Container>
          <Container className={classes.endGameBtns} component="div">
            {isCurrentUserHost() && (
              <GenericButton handleClick={playAgain}>Play Again</GenericButton>
            )}
            <GenericButton handleClick={leaveCurrentGame}>Leave</GenericButton>
          </Container>
        </Paper>
      </Container>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  overlay: {
    background: "rgba(0,0,0,0.5)",
    position: "absolute",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
  },
  gameOverText: {
    margin: "0 auto 2rem",
    width: "max-content",
    fontSize: theme.gameOverText.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  strongText: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold,
  },
  endGameContainer: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreSection: {
    display: "flex",
    padding: "0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: {
    fontWeight: theme.typography.fontWeightBold,
  },
  divider: {
    // styles for standard <hr />, not using Mui Divider Component
    margin: "0.75rem 0 2rem",
    height: "1px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
  },
  endGamePaper: {
    width: "50%",
    padding: "2.5rem 1.5rem 3rem",
    border: "solid white 2px",
  },
  endGameBtns: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "3rem",
  },
}));

export default EndGameScreen;
