import React, { useContext } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import { theme } from "./themes/theme";
import { AuthContext } from "./context/AuthContext";

import LoginOrSignUp from "./pages/LoginOrSignUp";
import CreateOrJoinGame from "./pages/CreateOrJoinGame";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PreGameLobby from "./pages/PreGameLobby";

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/register">
            {auth ? (
              <Redirect to="/create-game" />
            ) : (
              <LoginOrSignUp type="register" />
            )}
          </Route>
          <Route path="/login">
            {auth ? <Redirect to="/create-game" /> : <LoginOrSignUp />}
          </Route>

          <ProtectedRoute
            exact
            path="/create-game"
            component={CreateOrJoinGame}
            auth={auth}
          />
          <ProtectedRoute
            exact
            path="/lobby"
            component={PreGameLobby}
            auth={auth}
          />

          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
