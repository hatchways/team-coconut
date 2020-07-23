const { sendEmail } = require('../utils/emailSender');
const User = require('../models/User');
const Game = require('../models/Game');

const sendInvitation = async (userId, gameId, email) => {
  const userInviter = await User.findById(userId);
  const game = await Game.findById(gameId);

  const emailTemplateId = process.env.EMAIL_TEMPLATE_ID;
  const emailTemplateData = {
    link: `${process.env.APP_URL}/lobby/${gameId}`,
    inviter: userInviter.name,
  };
  await sendEmail(email, emailTemplateId, emailTemplateData);

  game.players.push({ email: email, status: 'Invited' });
  await game.save();
  return game;
};

const createGame = async (userId) => {
  const user = await User.findById(userId);
  const newGame = new Game({
    players: [{ email: user.email, status: 'Joined' }],
  });
  await newGame.save();

  return newGame;
};

const getGame = async (gameId) => {
  const game = await Game.findById(gameId);
  return game;
};

const joinGame = async (gameId, userId) => {
  const user = await User.findById(userId);
  const game = await Game.findByIdAndUpdate(
    gameId,
    {
      $addToSet: { players: { email: user.email, status: 'Joined' } },
    },
    { new: true, upsert: true }
  );

  return game;
};

const saveGame = async (gameId, players) => {
  const game = await Game.findById(gameId);

  players.map((player) => {
    let playerIndex = game.players.findIndex((p, index) => {
      return p.email === player.id;
    });

    if (playerIndex > -1) {
      game.players[playerIndex].score = player.point;
    }
  });

  game.status = 'finished';

  await game.save();
  return game;
};

const leaveGame = async (gameId, userId) => {
  const user = await User.findById(userId);
  const game = await Game.findById(gameId);

  const idx = game.players.findIndex((p) => p.email === user.email);

  if(idx > -1) {
    game.players.splice(idx, 1);
  }

  await game.save();
  return game;
}

module.exports = { sendInvitation, createGame, getGame, joinGame, saveGame, leaveGame };
