import React, { useContext, useState } from "react";
import FormInput from "../FormInput";
import { Container, Grid, Typography, makeStyles } from "@material-ui/core";
import GenericButton from "../GenericButton";
import { GameplayContext } from "../../context/GameplayContext";
import { useParams } from "react-router-dom";
import GameHeader from "./GameHeader";
import Notification from "../Notification";

function CluePanel() {
  const classes = useStyles();
  const [clue, setClue] = useState("");
  const {
    gameState,
    sendClueToBE,
    submitDisable,
    disableSubmitInputs,
    displayTypingNotification,
    showNextRoundScreen,
    displayClueError,
    toggleClueError,
    hint,
    closeHint,
    answer,
  } = useContext(GameplayContext);
  const { word: wordToGuess } = gameState;
  const { gameId } = useParams();
  const { email } = JSON.parse(localStorage.getItem("user"));

  function submitClue(event) {
    event.preventDefault();
    if (clue !== "") {
      toggleClueError(false);
      disableSubmitInputs(true);
      const player = {
        msg: clue,
        id: email,
      };
      sendClueToBE(gameId, player);
      setClue("");
    } else toggleClueError(true);
  }

  function handleOnKeyUp(event) {
    event.preventDefault();
    displayTypingNotification(gameId, email);
  }

  return (
    <Container className={classes.sectionContainer} component="section">
      <div className={classes.gameHeader}>
        <GameHeader />
      </div>
      <Grid
        className={classes.grid}
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
      >
        <Container component="div" maxWidth="xs">
          <Typography
            className={classes.heading}
            color="textPrimary"
            variant="h6"
            component="p"
            align="center"
          >
            {showNextRoundScreen ? "Picking New Word..." : "The Secret Word"}
          </Typography>
          {wordToGuess && (
            <Typography
              className={classes.wordToGuess}
              color="textPrimary"
              variant="h4"
              component="p"
            >
              {wordToGuess.charAt(0).toUpperCase() + wordToGuess.slice(1)}
            </Typography>
          )}
        </Container>
        <Container component="div" maxWidth="xs">
          {!showNextRoundScreen ? (
            <>
              <form className={classes.form} onSubmit={submitClue} noValidate>
                <FormInput
                  label="clue"
                  error={displayClueError && "Please Enter a Clue"}
                  handleChange={(e) => setClue(e.target.value)}
                  isDisabled={submitDisable}
                  handleOnKeyUp={handleOnKeyUp}
                  maxLength={18}
                />
              </form>
              <div className={classes.submitBtn}>
                <GenericButton
                  handleClick={submitClue}
                  isSubmit
                  isDisabled={submitDisable}
                >
                  Submit
                </GenericButton>
              </div>
            </>
          ) : (
            <Typography
              className={classes.heading}
              color="textPrimary"
              variant="h6"
              component="p"
              align="center"
            >
              The Guesser tried: {answer}
            </Typography>
          )}
        </Container>
      </Grid>
      <Notification
        open={hint.open}
        msg={hint.msg}
        handleClose={closeHint}
        severity={hint.severity}
      />
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    backgroundColor: theme.palette.background.paper,
    height: "100vh",
    minWidth: "450px",
  },
  gameHeader: {
    width: "100%",
    margin: "0 auto",
  },
  grid: {
    height: "90%",
  },
  heading: {
    textTransform: "uppercase",
  },
  wordToGuess: {
    margin: "0.75rem auto 0 auto",
    padding: "0.75rem 1.75rem",
    width: "max-content",
    borderRadius: "30px",
    background: theme.gradient.blue.background,
    fontWeight: theme.typography.fontWeightBold,
  },
  form: {
    width: "100%",
  },
  submitBtn: {
    width: "max-content",
    margin: "2rem auto 0",
  },
}));

export default CluePanel;
