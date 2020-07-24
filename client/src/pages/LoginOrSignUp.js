import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Paper, Typography, makeStyles } from "@material-ui/core";
import { AuthContext } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import GenericButton from "../components/GenericButton";
import useForm from "../utils/hooks/useForm";

function LoginOrSignUp({ type }) {
  const classes = useStyles();
  const { errors, registerUser, loginUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useForm({
    name: "",
    email: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (type === "register") {
      const newUserData = {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      };
      registerUser(newUserData);
    } else {
      const loginData = {
        email: credentials.email,
        password: credentials.password,
      };
      loginUser(loginData);
    }
  }

  // Component rendering is as follows:
  // MUI Container (top level container, centers component on screen)
  // MUI Paper component (background for login form)
  // HTML form with MUI typography, inputs, and helperText components
  // MUI Button, then horizontal rule, then a link to the other version of the form

  return (
    <Container className={classes.mainContainer} component="main" maxWidth="sm">
      <Paper className={classes.paper} elevation={5}>
        <Typography className={classes.heading} variant="h3" component="p">
          {type === "register" ? "Register" : "Sign In"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          {type === "register" && (
            <FormInput
              label="name"
              error={errors.name}
              handleChange={setCredentials}
            />
          )}
          <FormInput
            label="email"
            error={errors.email}
            handleChange={setCredentials}
          />
          <FormInput
            label="password"
            error={errors.password}
            handleChange={setCredentials}
          />
          <div className={classes.buttonContainer}>
            <GenericButton handleClick={handleSubmit} isSubmit>
              {type === "register" ? "Sign Up" : "Sign In"}
            </GenericButton>
          </div>
        </form>
        <hr className={classes.divider} />
        <div className={classes.redirect}>
          {type === "register"
            ? "Already have an account? "
            : "Don't have an account? "}
          <Link
            className={classes.link}
            to={type === "register" ? "/login" : "/register"}
          >
            {type === "register" ? "Sign In" : "Sign Up"}
          </Link>
        </div>
      </Paper>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    margin: "3rem auto 0",
    textAlign: "center",
  },
  form: {
    width: "70%",
  },
  buttonContainer: {
    margin: "2em auto",
    width: "max-content",
  },
  divider: {
    // styles for standard <hr />, not using Mui Divider Component
    height: "1px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    border: "none",
  },
  redirect: {
    margin: "2em auto",
    textAlign: "center",
  },
  link: {
    // styles for react-router Link, not using Mui Link Component
    textDecoration: "none",
    color: "#FF701C",
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default LoginOrSignUp;
