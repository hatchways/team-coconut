const { body, param } = require("express-validator");
const { validate } = require("./validate");
const Game = require("../models/Game");

const gameIdValidator = param("gameId", "Invalid game id")
  .isMongoId()
  .bail()
  .custom(async (gameId) => {
    const game = await Game.findById(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    return true;
  });

module.exports.gameInvitation = [
  body("email", "Invalid email").isEmail(),
  gameIdValidator,
  validate,
];

module.exports.gameJoin = [gameIdValidator, validate];
