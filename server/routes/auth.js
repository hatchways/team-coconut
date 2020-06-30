const express = require("express");
const router = express.Router();

const AuthService = require("../services/auth");
const authService = new AuthService();

// @route POST auth/signup
// @desc User registration
// @param name
// @param email
// @param password

router.post("/signup", function (req, res, next) {
  try {
    const { newUser, token, cookieConfig } = authService.signUpUser(req.body);
    return res.status(201).json(newUser).cookie("token", token, cookieConfig);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
