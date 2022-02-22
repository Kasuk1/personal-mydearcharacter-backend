const { request, response } = require('express');

const Match = require('../models/match.model');

// Get matches
const getMatches = async (req = request, res = response) => {
  try {
    const matches = await Match.find(
      { status: { $ne: 'cancelled' } },
      {
        deckPlayer1: 0,
        deckPlayer2: 0,
        __v: 0,
      }
    ).sort({
      status: -1,
    });

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

module.exports = { getMatches };
