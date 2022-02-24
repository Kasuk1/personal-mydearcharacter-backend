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
  const matches = await Match.find(
    { status: { $ne: 'cancelled' } },
    {
      deckPlayer1: 0,
      deckPlayer2: 0,
      __v: 0,
    }
  )
    .sort({
      status: -1,
    })
    .populate('player1')
    .populate('player2');
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

    const matchPopulated = await Match.findById(match.id).populate('player1');
    matchPopulated.healthPlayer1 = matchPopulated.player1.level * 3000;
    await matchPopulated.save();
    return matchPopulated;
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

    const matchPopulated1 = await match.populate('player1');
    const matchPopulated2 = await matchPopulated1.populate('player2');
    matchPopulated2.healthPlayer2 = matchPopulated2.player2.level * 3000;
    await matchPopulated2.save();

    return matchPopulated2;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const playGame = async (gameId) => {
  try {
    const match = await Match.findById(gameId)
      .populate('player1')
      .populate('player2');
    match.status = 'playing';
    await match.save();

    return match;
  } catch (error) {
    console.log(err);
    return false;
  }
};

const cardSelect = async (cardSelected, gameId) => {
  try {
    const match = await Match.findById(gameId)
      .populate('player1')
      .populate('player2');

    if (match.cardsSelected.length === 0) {
      match.cardsSelected.push(cardSelected);
      match.turns = match.turns + 1;
    } else if (match.cardsSelected.length === 1) {
      match.cardsSelected.push(cardSelected);
      match.turns = match.turns + 1;
    }

    await match.save();
    return match;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const cardBattle = async (cardsSelected, gameId) => {
  try {
    const [card1, card2] = cardsSelected;

    if (card1.power > card2.power) {
      const match = await Match.findByIdAndUpdate(gameId, {
        $pull: { deckPlayer2: { _id: card2._id } },
      });
      match.healthPlayer2 = match.healthPlayer2 - 500;
      await match.save();
    } else if (card1.power < card2.power) {
      const match = await Match.findByIdAndUpdate(gameId, {
        $pull: { deckPlayer1: { _id: card1._id } },
      });
      match.healthPlayer1 = match.healthPlayer1 - 500;
      await match.save();
    } else {
      await Match.findByIdAndUpdate(gameId, {
        $pull: { deckPlayer1: { _id: card1._id } },
      });
      await Match.findByIdAndUpdate(gameId, {
        $pull: { deckPlayer2: { _id: card2._id } },
      });
    }

    const matchFinal = await Match.findById(gameId)
      .populate('player1')
      .populate('player2');
    matchFinal.cardsSelected = [];
    await matchFinal.save();

    return matchFinal;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const finishGame = async (gameId) => {
  try {
    const match = await Match.findById(gameId);

    if (match.healthPlayer1 <= 0) {
      match.winner = match.player2;
    } else if (match.healthPlayer2 <= 0) {
      match.winner = match.player1;
    }

    match.status = 'finished';

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
  playGame,
  cardSelect,
  cardBattle,
  finishGame,
};
