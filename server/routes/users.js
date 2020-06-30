const express = require("express");
const router = express.Router();

router.post("/signup", function (req, res, next) {
  console.log(req.body);
  res.send({ message: "Successful sign up request" });
});

router.post("/signin", function (req, res, next) {
  console.log(req.body);
  res.send({ message: "Successful login request" });
});

module.exports = router;
