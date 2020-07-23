const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { sendInvitation, createGame, getGame, joinGame, saveGame, leaveGame } = require("../services/game");
const { gameInvitation, gameJoin } = require("../validators/game");

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
  const result = await sendInvitation(req.userId, gameId, email);
  return res.json(result);
});

router.post("/create",
  auth,
  async function (req, res) {
    const result = await createGame(req.userId);
    return res.json(result);
  });

router.get("/:gameId",
  auth,
  async function (req, res) {
    const result = await getGame(req.params.gameId);
    return res.json(result);
  });

router.post("/:gameId/join",
  [auth, gameJoin],
  async function (req, res) {
    const result = await joinGame(req.params.gameId, req.userId);
    return res.json(result);
  });

  router.post("/:gameId/end",
  [gameJoin],
  async function (req, res) {
    const {players} = req.body;
    const result = await saveGame(req.params.gameId, players);
    return res.json(result);
  });

  router.post("/:gameId/leave",
  [auth, gameJoin],
  async function (req, res) {
    const result = await leaveGame(req.params.gameId, req.userId);
    return res.json(result);
  });
  
module.exports = router;