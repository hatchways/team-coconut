const { model } = require("../models/User");

module.exports = function (err, req, res, next) {
  if (err.httpStatus) {
    //client errors
    console.log(`\nmsg:${err.message}\nuserId:${req.userId}`);
    return res.status(err.httpStatus).json({ errors: [{ msg: err.userMessage }] });
  }

  console.error(`${err.message}\n${err.stack}`);
  res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
};
