import React, { useState, useContext } from "react";
import {
  Container,
  Paper,
  Typography,
  makeStyles,
  Grid,
} from "@material-ui/core";
import { AuthContext } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import GenericButton from "../components/GenericButton";
import useForm from "../utils/hooks/useForm";

function PreGameLobby() {
  const classes = useStyles();
  const { logoutUser } = useContext(AuthContext);

  const [playerEmail, setPlayerEmail] = useForm({ email: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [players, setPlayers] = useState([]);
  // Using set to display email addresses
  // In case the same user is invited many times
  const invitedPlayers = [...new Set(players)];

  function startGame() {
    console.log("start");
  }

  // Invite new players to lobby -- up to 4 players can join
  function handleSubmit(event) {
    event.preventDefault();
    const regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setErrorMsg(""); // clear previous errors first
    if (!regex.test(playerEmail.email)) {
      setErrorMsg("Invalid email");
    } else {
      setPlayers((prev) => [...prev, playerEmail.email]);
    }
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
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <FormInput
            label="email"
            error={errorMsg}
            handleChange={setPlayerEmail}
            hasAdornment
            adornmentText="Invite"
            onClick={handleSubmit}
          />
        </form>
        {invitedPlayers &&
          invitedPlayers.map((player, index) => (
            <Container
              key={index}
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
                  {player}
                </Typography>
                <div className={classes.indicator}>
                  <Typography variant="h6" component="p">
                    Sent
                  </Typography>
                </div>
              </Grid>
              <hr className={classes.divider} />
            </Container>
          ))}
        <div className={classes.buttonContainer}>
          <GenericButton handleClick={startGame}>Start Game</GenericButton>
        </div>
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
