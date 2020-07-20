import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import FormInput from "../FormInput";
import GenericButton from "../GenericButton";
import { Container, Grid, makeStyles } from "@material-ui/core";
import useForm from "../../utils/hooks/useForm";
import { GameplayContext } from "../../context/GameplayContext";

function GuessPanel() {
  const classes = useStyles();
  const [guess, setGuess] = useForm({ guess: "" });
  const { clues, sendGuessToBE, isGuessPhase } = useContext(GameplayContext);
  const { gameId } = useParams();

  function submitGuess(event) {
    event.preventDefault();
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
            <GenericButton
              handleClick={submitGuess}
              isSubmit
              isDisabled={!isGuessPhase}
            >
              Submit
            </GenericButton>
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
}));

export default GuessPanel;
