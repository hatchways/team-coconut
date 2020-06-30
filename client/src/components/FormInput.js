import React from "react";
import {
  Typography,
  makeStyles,
  FormControl,
  OutlinedInput,
  FormHelperText,
} from "@material-ui/core";

function FormInput({ label, error, handleChange }) {
  const classes = useStyles();
  return (
    <FormControl fullWidth required>
      <Typography className={classes.inputLabel} align="left">
        {label}
      </Typography>
      <div className={classes.inputContainer}>
        <OutlinedInput
          classes={{ input: classes.inputText }}
          id={label}
          type={label}
          onChange={handleChange}
          fullWidth
        />
      </div>
      {error && (
        <FormHelperText className={classes.helperText}>{error}</FormHelperText>
      )}
    </FormControl>
  );
}

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    marginTop: "2em",
    marginBottom: "0.5em",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "5px",
  },
  inputText: {
    color: "#000000",
  },
  helperText: {
    fontSize: "0.825rem",
    fontWeight: "bold",
  },
}));

export default FormInput;
