const { request, response } = require('express');

const Match = require('../models/match.model');

// Get matches
const getMatches = async (req = request, res = response) => {
  try {
    const matches = await Match.find(
      { status: { $nin: ['cancelled', 'finished'] } },
      {
        deckPlayer1: 0,
        deckPlayer2: 0,
        __v: 0,
      }
    )
      .sort({ date: -1 })
      .populate('player1')
      .populate('player2');

    res.json({
      ok: true,
      matches,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: 'Report to the admin',
    });
  }
};

// Get matches by user id
const getMatchesByUserId = async (req = request, res = response) => {
  const { userId } = req.params;

  try {
    const matches = await Match.find({
      $or: [{ player1: userId }, { player2: userId }],
      status: { $ne: 'cancelled' },
    })
      .sort({ date: -1 })
      .populate('player1')
      .populate('player2');

    res.json({
      ok: true,
      matches,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: 'Report to the admin',
    });
  }
};

module.exports = { getMatches, getMatchesByUserId };
