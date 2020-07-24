import React, { useState } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import GenericButton from "../components/GenericButton";

function PageNotFound() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  function returnToLogin() {
    setRedirect(true);
    setRedirectPath("/");
  }

  if (redirect && redirectPath) {
    window.location.href = redirectPath;
  }

  return (
    <div className={classes.redirect}>
      <Typography
        style={{
          color: "#FFFFFF",
          marginBottom: "1rem",
        }}
        variant="h3"
        component="p"
      >
        Oops! 404 Page not Found
      </Typography>
      <GenericButton handleClick={returnToLogin}>Go Back</GenericButton>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  redirect: {
    margin: "0 0 0 2rem",
    padding: "1em 3em",
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default PageNotFound;
