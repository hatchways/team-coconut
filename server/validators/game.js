const { body, param } = require("express-validator");
const { validate } = require("./validate");

module.exports.gameInvitation = [
    param('gameId', 'Invalid game id').notEmpty(),//TODO mongo id
    body('email', 'Invalid email').isEmail(),
    validate
]