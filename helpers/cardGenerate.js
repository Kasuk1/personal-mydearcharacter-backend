const fetch = require('cross-fetch');

const POKEAPIURI = 'https://pokeapi.co/api/v2';

const generate10RandomCards = async () => {
  return Promise.all(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(async (num) => {
      return await generateRandomCard();
    })
  );
};

const generateRandomCard = async () => {
  const randomNumber = Math.floor(Math.random() * 850 + 1);
  const randomLevel = Math.floor(Math.random() * 30 + 1);
  const response = await fetch(`${POKEAPIURI}/pokemon/${randomNumber}`);
  const json = await response.json();
  const { name, sprites } = json;
  return {
    name,
    image: sprites.other['official-artwork'].front_default,
    level: randomLevel,
    power: randomLevel * 300,
    health: randomLevel * 500,
  };
};

module.exports = { generateRandomCard, generate10RandomCards };
