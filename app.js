// Server Model: It has all the express server + socket.io configured
const Server = require('./models/server.model');

// Package to read and stablish environment variables
require('dotenv').config();

// Initialize server instance
const server = new Server();

// Execute server
server.execute();
