import React, { useContext } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import { AuthContext } from "../context/AuthContext";
import GenericButton from "../components/GenericButton";

function CreateOrJoinGame() {
  const classes = useStyles();
  const { logoutUser } = useContext(AuthContext);

  function createGame() {
    console.log("new");
  }

  function joinGame() {
    console.log("join");
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
          <Grid item>
            <GenericButton handleClick={createGame}>New Game</GenericButton>
          </Grid>
          <Grid item>
            <GenericButton handleClick={joinGame}>Join Game</GenericButton>
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
}));

export default CreateOrJoinGame;
