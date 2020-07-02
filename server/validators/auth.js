const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const { validate } = require("./validate");
const User = require("../models/User");

module.exports.signup = [
  body("name", "Name is required").notEmpty(),
  body("email", "Invalid email")
    .isEmail()
    .bail() //stop validating if email is invalid
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }
      return true;
    }),
  body("password", "Password min length is 6").isLength({ min: 6 }),
  validate,
];

module.exports.signin = [
  body("email", "Invalid email format")
    .isEmail()
    .bail() //stop validating if email is invalid
    .custom(async (email, { req }) => {
      const { password } = req.body;
      if (!password) {
        throw new Error("Password is required");
      }
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        throw new Error("Invalid email or password");
      }
      return true;
    }),

  validate,
];
