import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import FormInput from "../FormInput";
import GenericButton from "../GenericButton";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import useForm from "../../utils/hooks/useForm";
import { GameplayContext } from "../../context/GameplayContext";
import GameHeader from "./GameHeader";

function GuessPanel() {
  const classes = useStyles();
  const [guess, setGuess] = useForm({ guess: "" });
  const {
    answer,
    gameState,
    clues,
    sendGuessToBE,
    isGuessPhase,
    showNextRoundScreen,
  } = useContext(GameplayContext);
  const { gameId } = useParams();

  function submitGuess(event) {
    event.preventDefault();
    const answer = guess.guess;
    sendGuessToBE(gameId, answer, clues);
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
        justify="center"
        alignItems="center"
      >
        <Container component="div" maxWidth="xs">
          {!showNextRoundScreen ? (
            <>
              <form className={classes.form} onSubmit={submitGuess} noValidate>
                <FormInput
                  label="guess"
                  error=""
                  handleChange={setGuess}
                  isDisabled={!isGuessPhase}
                />
              </form>
              <div className={classes.submitBtn}>
                {isGuessPhase ? (
                  <GenericButton
                    handleClick={submitGuess}
                    isSubmit
                    isDisabled={!isGuessPhase}
                  >
                    Submit
                  </GenericButton>
                ) : (
                  <Typography
                    className={classes.waiting}
                    variant="h6"
                    component="p"
                  >
                    Waiting for all Clues...
                  </Typography>
                )}
              </div>
            </>
          ) : (
            <Typography
              color="textPrimary"
              variant="h4"
              component="p"
              align="center"
            >
              {answer === gameState.state.word
                ? "You Got It!"
                : `The word was ${gameState.state.word
                    .charAt(0)
                    .toUpperCase()}${gameState.state.word.slice(1)}`}
            </Typography>
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
  gameHeader: {
    height: "10%",
    width: "100%",
    margin: "0 auto",
  },
  grid: {
    height: "90%",
  },
  form: {
    width: "100%",
  },
  submitBtn: {
    width: "max-content",
    margin: "2rem auto 0",
  },
  waiting: {
    color: theme.palette.text.primary,
  },
}));

export default GuessPanel;
