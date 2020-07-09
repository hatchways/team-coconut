import React, { useContext, useState } from "react";
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import SportsEsportsOutlinedIcon from "@material-ui/icons/SportsEsportsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/GameContext";
import { Redirect } from "react-router-dom";
import GenericButton from "../components/GenericButton";
import FormInput from "../components/FormInput";

function CreateOrJoinGame() {
  const classes = useStyles();
  const { logoutUser } = useContext(AuthContext);
  const [gameId, setGameId] = useState("");
  const { errors, createGame, joinGame } = useContext(GameContext)
  const [redirect, setRedirect] = useState(false);

  async function joinGameSubmit(event) {
    event.preventDefault();
    await joinGame(gameId);
    setRedirect(true);
  }

  async function newGameClick(event) {
    event.preventDefault();
    const id = await createGame();
    setGameId(id);
    setRedirect(true);
  }

  //redirect user to lobby if game is created
  if (!errors.joinError && redirect && gameId) {
    return <Redirect to={`/lobby/${gameId}`} />
  }

  return (
    <div>
      <Container className={classes.mainContainer} component="main">
        <div className={classes.logoutBtn}>
          <GenericButton className={classes.logoutBtn} handleClick={logoutUser}>
            Logout
          </GenericButton>
        </div>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper} elevation={5}>
              <Typography
                className={classes.heading}
                variant="h3"
                component="h3"
                align="center"
              >
                Create Game
              </Typography>
              <SportsEsportsOutlinedIcon className={classes.createIcon} />
              <GenericButton className={classes.createBtn} handleClick={newGameClick}>
                New Game
              </GenericButton>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper} elevation={5}>
              <Typography
                className={classes.heading}
                variant="h3"
                component="h3"
                align="center"
              >
                Join
              </Typography>
              <PeopleAltOutlinedIcon className={classes.joinIcon} />
              <form className={classes.form} onSubmit={joinGameSubmit} noValidate>
                <FormInput
                  label="game"
                  error={errors.joinError}
                  handleChange={(e) => setGameId(e.target.value)}
                  hasAdornment
                  adornmentText="Join"
                  onClick={joinGameSubmit}
                />
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    position: "absolute",
    top: "0",
    right: "0",
    margin: "1.5rem 1.5rem 0 0",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "400px",
  },
  heading: {
    margin: "3rem 0 2rem",
  },
  createIcon: {
    marginBottom: "3.5rem",
    fontSize: theme.icon.large.fontSize,
  },
  joinIcon: {
    margin: "0",
    fontSize: theme.icon.large.fontSize,
  },
  createBtn: {
    marginBottom: "3rem",
    padding: "1em 3em",
    borderRadius: "2px",
    color: theme.palette.text.primary,
    letterSpacing: theme.spacing(0.15),
    textDecoration: "none",
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold,
    background: theme.gradient.orange.background,
  },
  form: {
    marginBottom: "3rem",
    width: "80%",
  },
}));

export default CreateOrJoinGame;
