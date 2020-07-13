import React, { createContext, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState(localStorage.getItem("user") ? true : false);
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
        // clear errors first before setting up new error messages
        setErrors({
          name: "",
          email: "",
          password: "",
        });
        errors.forEach((error) => {
          setErrors((prev) => ({ ...prev, [error.param]: error.msg }));
        });
        throw new Error(response.status);
      }
      const json = await response.json();
      localStorage.setItem("user", JSON.stringify(json));
      setAuth(true);
      // clear errors after successful signup
      setErrors({
        name: "",
        email: "",
        password: "",
      });
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
        // clear errors first before setting up new error messages
        setErrors({
          name: "",
          email: "",
          password: "",
        });
        errors.forEach((error) => {
          setErrors((prev) => ({ ...prev, [error.param]: error.msg }));
        });
        throw new Error(response.status);
      }
      const json = await response.json();
      localStorage.setItem("user", JSON.stringify(json));
      setAuth(true);
      // clear errors after successful login
      setErrors({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function logoutUser() {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(response.status);
      setAuth(false);
      localStorage.removeItem("user");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider
      value={{ auth, errors, registerUser, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
