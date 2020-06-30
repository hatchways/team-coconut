import React, { createContext, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(false);

  async function registerUser(newUserData) {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });
      if (!response.ok) throw new Error(response.status);
      const json = await response.json();
      setAuth(true);
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  }

  async function loginUser(loginData) {
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) throw new Error(response.status);
      const json = await response.json();
      console.log(json);
      setAuth(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function logoutUser() {
    try {
      setAuth(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ auth, registerUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
