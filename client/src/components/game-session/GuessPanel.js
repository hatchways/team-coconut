import React from "react";
import FormInput from "../FormInput";
import GenericButton from "../GenericButton";
import { Container, Grid, makeStyles } from "@material-ui/core";
import useForm from "../../utils/hooks/useForm";

function GuessPanel() {
  const classes = useStyles();
  const [guess, setGuess] = useForm({ guess: "" });
  console.log(guess);

  function submitGuess(event) {
    event.preventDefault();
    console.log(`submitted ${guess.guess}`);
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
            <FormInput label="guess" error="" handleChange={setGuess} />
          </form>
          <div className={classes.submitBtn}>
            <GenericButton handleClick={submitGuess} isSubmit>
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
