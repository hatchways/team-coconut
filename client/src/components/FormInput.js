import React from "react";
import {
  Typography,
  makeStyles,
  FormControl,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
} from "@material-ui/core";
import GenericButton from "./GenericButton";

function FormInput({
  label,
  error,
  handleChange,
  hasAdornment,
  adornmentText,
  onClick,
  isDisabled,
  maxLength,
  handleOnKeyUp,
  ...props
}) {
  const classes = useStyles();
  return (
    <FormControl fullWidth required>
      <Typography className={classes.inputLabel} align="left">
        {label}
      </Typography>
      <div className={classes.inputContainer}>
        <OutlinedInput
          {...props}
          classes={{ input: classes.inputText }}
          id={label}
          type={label}
          onChange={handleChange}
          fullWidth
          disabled={isDisabled}
          onKeyUp={handleOnKeyUp}
          inputProps={{ maxLength: maxLength }}
          endAdornment={
            hasAdornment && (
              <InputAdornment position="end">
                <GenericButton handleClick={onClick} isSubmit isAdornment>
                  {adornmentText}
                </GenericButton>
              </InputAdornment>
            )
          }
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
