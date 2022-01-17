require('dotenv').config();
const express = require('express');
const http = require('http');
const { port, nodeEnv } = require('./config/index');
const { connectToDb } = require('./config/database');

const app = express();
const PORT = port;

connectToDb();

app.use(express.json());

const routes = require('./routes/index');
app.use('/', routes);

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running in ${nodeEnv} mode on port ${PORT}`));
