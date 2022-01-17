const development = require('./development.env');
const production = require('./production.env');

const nodEnv = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

module.exports = { development, production, nodEnv, port };
