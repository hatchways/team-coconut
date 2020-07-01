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
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    marginTop: "2em",
    marginBottom: "0.5em",
    fontWeight: "bold",
    letterSpacing: theme.spacing(0.5),
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.overrides.MuiOutlinedInput.notchedOutline.borderRadius,
  },
  inputText: {
    color: "#000000",
  },
}));

export default FormInput;
