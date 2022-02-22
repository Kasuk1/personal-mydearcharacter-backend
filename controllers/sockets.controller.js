const User = require('../models/user.model');
const Match = require('../models/match.model');
const { generate10RandomCards } = require('../helpers/cardGenerate');

const userConnected = async (uid) => {
  const user = await User.findById(uid);
  user.online = true;
  await user.save();
  return user;
};

const userDisconnected = async (uid) => {
  const user = await User.findById(uid);
  user.online = false;
  await user.save();
  return user;
};

const getMatches = async () => {
  const matches = await Match.find().sort({ status: -1 });
  return matches;
};

const createGame = async (player1) => {
  try {
    const deckPlayer1 = await generate10RandomCards();
    const deckPlayer2 = await generate10RandomCards();
    const match = new Match({
      player1,
      deckPlayer1,
      deckPlayer2,
    });
    await match.save();

    return match;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const cancelGame = async (gameId) => {
  try {
    const match = await Match.findById(gameId);
    match.status = 'cancelled';
    await match.save();
    return match;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const joinGame = async (player2, gameId) => {
  try {
    const match = await Match.findById(gameId);
    match.player2 = player2;
    match.status = 'full';
    await match.save();
    return match;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  userConnected,
  userDisconnected,
  getMatches,
  createGame,
  cancelGame,
  joinGame,
};
