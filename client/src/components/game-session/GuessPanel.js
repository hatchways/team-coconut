import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import FormInput from "../FormInput";
import GenericButton from "../GenericButton";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import useForm from "../../utils/hooks/useForm";
import { GameplayContext } from "../../context/GameplayContext";
import submitAudio from "../../game-audio/submit_answer.wav";
import { Howl } from "howler";

function GuessPanel() {
  const classes = useStyles();
  const [guess, setGuess] = useForm({ guess: "" });
  const { clues, sendGuessToBE, isGuessPhase } = useContext(GameplayContext);
  const { gameId } = useParams();

  function playSound(src) {
    const sound = new Howl({
      src,
      volume: 0.5,
    });
    sound.play();
  }

  function submitGuess(event) {
    event.preventDefault();
    playSound(submitAudio);
    const answer = guess.guess;
    sendGuessToBE(gameId, answer, clues);
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
