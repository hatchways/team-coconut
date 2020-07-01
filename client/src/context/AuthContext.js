import React, { createContext, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function registerUser(newUserData) {
    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });
      if (!response.ok) {
        const { errors } = await response.json();
        errors.map((error) =>
          setErrors((prev) => ({ ...prev, [error.param]: error.msg }))
        );
        throw new Error(response.status);
      }
      const json = await response.json();
      setUser(json);
      setAuth(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function loginUser(loginData) {
    try {
      const response = await fetch("/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        const { errors } = await response.json();
        errors.map((error) =>
          setErrors((prev) => ({ ...prev, [error.param]: error.msg }))
        );
        throw new Error(response.status);
      }
      const json = await response.json();
      setUser(json);
      setAuth(true);
    } catch (error) {
      return error;
    }
  }

  async function logoutUser() {
    setAuth(false);
    // Implement try catch block to request
    // deletion of cookie
  }

  return (
    <AuthContext.Provider
      value={{ auth, user, errors, registerUser, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
