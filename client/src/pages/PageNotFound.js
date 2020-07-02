import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

function PageNotFound() {
  const classes = useStyles();
  return (
    <>
      <Typography
        style={{
          margin: "2rem",
          color: "#FFFFFF",
        }}
        variant="h3"
        component="p"
      >
        404 Page not Found
      </Typography>
      <Link className={classes.redirect} to="/login">
        Back to Homepage
      </Link>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  redirect: {
    margin: "0 0 0 2rem",
    padding: "1em 3em",
    borderRadius: "2px",
    color: theme.palette.text.primary,
    letterSpacing: theme.spacing(0.15),
    textDecoration: "none",
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold,
    background:
      "linear-gradient(90deg, rgba(255,108,32,1) 0%, rgba(255,143,2,1) 100%)",
  },
}));

export default PageNotFound;
