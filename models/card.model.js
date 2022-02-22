const { Schema } = require('mongoose');

const CardSchema = new Schema({
  anime: {
    type: String,
    required: true,
    default: 'Pokémon',
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: null,
  },
  level: {
    type: Number,
    required: true,
    default: 1,
  },
  power: {
    type: Number,
    required: true,
    default: 300,
  },
  health: {
    type: Number,
    required: true,
    default: 500,
  },
});

module.exports = { CardSchema };
