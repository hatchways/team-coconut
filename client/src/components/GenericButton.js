import React from "react";
import { Button, makeStyles } from "@material-ui/core";

function GenericButton({ children, handleClick }) {
  const classes = useStyles();
  return (
    <Button
      className={classes.button}
      variant="contained"
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    padding: "1em 3em",
    color: theme.palette.text.primary,
    // orange linear gradient for all buttons
    background:
      "linear-gradient(90deg, rgba(255,108,32,1) 0%, rgba(255,143,2,1) 100%)",
    borderRadius: "8px",
  },
}));

export default GenericButton;
