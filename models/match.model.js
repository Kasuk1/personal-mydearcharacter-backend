const { Schema, model } = require('mongoose');
const { CardSchema } = require('./card.model');

const MatchSchema = Schema({
  player1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  player2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  deckPlayer1: [CardSchema],
  deckPlayer2: [CardSchema],
  status: {
    type: String,
    required: true,
    default: 'waiting',
  },
  turns: {
    type: Number,
    required: true,
    default: 1,
  },
  cardsSelected: {
    type: [CardSchema],
  },
  healthPlayer1: {
    type: Number,
  },
  healthPlayer2: {
    type: Number,
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = model('Match', MatchSchema);
