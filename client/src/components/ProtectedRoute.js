import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ auth, component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
}

export default ProtectedRoute;
