import React, { useContext } from "react";
import FormInput from "../FormInput";
import useForm from "../../utils/hooks/useForm";
import { Container, Grid, Typography, makeStyles } from "@material-ui/core";
import GenericButton from "../GenericButton";
import { GameplayContext } from "../../context/GameplayContext";
import { useParams } from "react-router-dom";

function CluePanel() {
  const classes = useStyles();
  const [clue, setClue] = useForm({ clue: "" });
  const {
    gameState,
    sendClueToBE,
    submitDisable,
    disableSubmitInputs,
    displayTypingNotification,
    showNextRoundScreen,
  } = useContext(GameplayContext);
  const { word: wordToGuess } = gameState;
  const { gameId } = useParams();
  const { email } = JSON.parse(localStorage.getItem("user"));

  function submitClue(event) {
    event.preventDefault();
    disableSubmitInputs(true);
    const player = {
      msg: clue.clue,
      id: email,
    };
    sendClueToBE(gameId, player, gameState);
  }

  function handleOnKeyUp(event) {
    event.preventDefault();
    displayTypingNotification(gameId, email);
  }

  return (
    <Container className={classes.sectionContainer} component="section">
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
            {showNextRoundScreen ? "Picking Word..." : "The Secret Word"}
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
          {!showNextRoundScreen && (
            <>
              <form className={classes.form} onSubmit={submitClue} noValidate>
                <FormInput
                  label="clue"
                  error=""
                  handleChange={setClue}
                  isDisabled={submitDisable}
                  handleOnKeyUp={handleOnKeyUp}
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
          )}
        </Container>
      </Grid>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    backgroundColor: theme.palette.background.paper,
    height: "100vh",
    minWidth: "450px",
  },
  grid: {
    height: "100vh",
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
