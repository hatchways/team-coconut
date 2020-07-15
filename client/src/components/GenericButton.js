import React from "react";
import { Button, makeStyles } from "@material-ui/core";

function GenericButton({
  children,
  handleClick,
  isSubmit,
  isDisabled,
  isAdornment,
}) {
  const classes = useStyles();
  return (
    <Button
      style={{
        padding: isAdornment ? "0.5em 1em" : "1em 3em",
        letterSpacing: isAdornment ? "1px" : "2.5px",
        borderRadius: isAdornment ? "2px" : "8px",
      }}
      className={classes.button}
      variant="contained"
      onClick={handleClick}
      type={isSubmit ? "submit" : "button"}
      disabled={isDisabled}
    >
      {children}
    </Button>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.text.primary,
    // orange linear gradient for all buttons
    background: theme.gradient.orange.background,
  },
}));

export default GenericButton;
