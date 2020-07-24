import React, { useContext, useState, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import { theme } from "./themes/theme";
import { AuthContext } from "./context/AuthContext";
import { GameplayContextProvider } from "./context/GameplayContext";
import { RTCContextProvider } from "./context/RTCContext";
import { GameContextProvider } from "./context/GameContext";

import LoginOrSignUp from "./pages/LoginOrSignUp";
import CreateOrJoinGame from "./pages/CreateOrJoinGame";
import PageNotFound from "./pages/PageNotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PreGameLobby from "./pages/PreGameLobby";
import GameSession from "./pages/GameSession";
import fetchIntercept from 'fetch-intercept';

function App() {
  const { auth, setAuthAndRemoveUser } = useContext(AuthContext);
  const [redirectPath, setRedirectPath] = useState("/create-game");

  const path = window.location.pathname;

  //saving initial path to state. Then use it after user is logged in.
  useEffect(() => {
    if (!["/login", "/register"].includes(path)) {
      setRedirectPath(path);
    }

    //401 interceptor
    const unregister = fetchIntercept.register({
      response: function (response) {
        if (response.status === 401) {
          console.log("response intercept 401")
          setAuthAndRemoveUser();
        }
        return response;
      },
    });

    return () => {
      //unregister the interceptor
      unregister()
    }

  }, [path, setAuthAndRemoveUser]);

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/create-game" />
          </Route>
          <Route path="/register">
            {auth ? (
              <Redirect to="/create-game" />
            ) : (
                <LoginOrSignUp type="register" />
              )}
          </Route>
          <Route path="/login">
            {auth ? <Redirect to={redirectPath} /> : <LoginOrSignUp />}
          </Route>

          <GameContextProvider>
            <ProtectedRoute
              exact
              path="/create-game"
              component={CreateOrJoinGame}
              auth={auth}
            />
            <GameplayContextProvider>
              <ProtectedRoute
                exact
                path="/lobby/:gameId"
                component={PreGameLobby}
                auth={auth}
              />
              <RTCContextProvider>
                <ProtectedRoute
                  exact
                  path="/session/:gameId"
                  component={GameSession}
                  auth={auth}
                />
              </RTCContextProvider>
            </GameplayContextProvider>
          </GameContextProvider>

          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
