const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { sendInvitation } = require("../services/game");
const { gameInvitation } = require("../validators/game");

// @route POST game/:gameId/invite
// @desc Invitation to the game via email
// @param gameId
// @body email

router.post("/:gameId/invite", [auth, gameInvitation], async function (
  req,
  res
) {
  const { gameId } = req.params;
  const { email } = req.body;
  await sendInvitation(req.userId, gameId, email);
  return res.send();
});

module.exports = router;
