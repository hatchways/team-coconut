import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  makeStyles,
  Grid,
} from "@material-ui/core";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import FormInput from "../components/FormInput";
import GenericButton from "../components/GenericButton";
import useForm from "../utils/hooks/useForm";
import Notification from "../components/Notification";
import PlayerStatus from "../components/PlayerStatus";
import sockets from "../utils/sockets";

function PreGameLobby({ match }) {
  const queryGameId = match.params.gameId;
  const classes = useStyles();
  const { logoutUser } = useContext(AuthContext);
  const {
    game,
    gameNotification,
    errors,
    sendInvitation,
    joinGame,
    closeGameNotification,
    isCurrentUserHost,
  } = useContext(GameContext);
  const [playerEmail, setPlayerEmail] = useForm({ email: "" });
  const { players } = game;
  const [gameStart, setGameStart] = useState(false);

  useEffect(() => {
    if (!game.gameId) {
      joinGame(queryGameId);
    }
    sockets.on("game-started", () => {
      setGameStart(true);
    });
  }, [joinGame, queryGameId, game]);

  function startGame() {
    setGameStart(true);
    sockets.emit("start-game", queryGameId);
  }

  if (gameStart) {
    return <Redirect to={`/session/${queryGameId}`} />;
  }

  function inviteClick(event) {
    event.preventDefault();
    sendInvitation(playerEmail.email);
  }

  return (
    <Container className={classes.mainContainer} component="main" maxWidth="sm">
      <div className={classes.logoutBtn}>
        <GenericButton className={classes.logoutBtn} handleClick={logoutUser}>
          Logout
        </GenericButton>
      </div>
      <Paper className={classes.paper} elevation={5}>
        <Typography className={classes.heading} variant="h3" component="p">
          Invite Friends
        </Typography>
        <Typography className={classes.subHeading} variant="h6" component="p">
          Game Id: {queryGameId}
        </Typography>
        <form className={classes.form} onSubmit={inviteClick} noValidate>
          <FormInput
            label="email"
            error={errors.inviteError}
            handleChange={setPlayerEmail}
            hasAdornment
            adornmentText="Invite"
            onClick={inviteClick}
          />
        </form>
        {players &&
          players.map((player) => (
            <Container
              key={player.email}
              className={classes.invitedPlayerContainer}
              component="div"
              maxWidth="xs"
            >
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Typography
                  className={classes.playerName}
                  color="textSecondary"
                  variant="h6"
                  component="p"
                >
                  {player.email}
                </Typography>
                <div className={classes.indicator}>
                  <PlayerStatus status={player.status} />
                </div>
              </Grid>
              <hr className={classes.divider} />
            </Container>
          ))}
        <div className={classes.buttonContainer}>
          {isCurrentUserHost() && (
            <GenericButton handleClick={startGame}>Start Game</GenericButton>
          )}
        </div>

        <Notification
          open={gameNotification.open}
          msg={gameNotification.msg}
          handleClose={closeGameNotification}
        />
      </Paper>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  logoutBtn: {
    position: "absolute",
    top: "0",
    right: "0",
    margin: "1.5rem 1.5rem 0 0",
  },
  mainContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    margin: "3rem auto 0",
    textAlign: "center",
  },
  subHeading: {
    margin: "1rem auto 0",
    textAlign: "center",
  },
  form: {
    width: "70%",
  },
  invitedPlayerContainer: {
    marginTop: "2em",
  },
  playerName: {
    marginLeft: "1rem",
  },
  indicator: {
    marginRight: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    // styles for standard <hr />, not using Mui Divider Component
    marginTop: "0.75rem",
    height: "1px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
  },
  buttonContainer: {
    margin: "4em auto 3em",
    width: "max-content",
  },
}));

export default PreGameLobby;
