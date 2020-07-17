import React from "react";
import { makeStyles } from "@material-ui/core";

function TypingNotification() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.dots}></div>
      <div className={classes.dots}></div>
      <div className={classes.dots}></div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    background: theme.gradient.blue.background,
    height: "25px",
    width: "50px",
    borderRadius: "8px",
  },
  dots: {
    borderRadius: "50%",
    background: theme.palette.text.primary,
    height: "10px",
    width: "10px",
  },
}));

export default TypingNotification;
