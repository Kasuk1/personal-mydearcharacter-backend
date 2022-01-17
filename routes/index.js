const express = require('express');
const app = express();

const usersRoutes = require('./user.routes');
const charactersRoutes = require('./character.routes');

app.use('/users', usersRoutes);
app.use('/characters', charactersRoutes);

module.exports = app;
