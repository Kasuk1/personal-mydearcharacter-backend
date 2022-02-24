const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');

const Sockets = require('./sockets.model');

const { dbConnection } = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Connect to DB
    dbConnection();

    // Http Server
    this.server = http.createServer(this.app);

    // Socket initialization and configuration
    this.io = socketio(this.server, {
      cors: {
        origin: '*',
      },
    });
  }

  middlewares() {
    // Deploy public directory
    this.app.use(express.static(path.resolve(__dirname, '../public')));

    // CORS
    this.app.use(cors());

    // Body parser
    this.app.use(express.json());

    // API endpoints
    this.app.use('/api/users', require('../routes/user.routes'));
    this.app.use('/api/matches', require('../routes/match.routes'));
  }

  // This configuration can be here or just as class' property
  // it depends what you need
  configureSockets() {
    new Sockets(this.io);
  }

  // This method will execute all the defined in the class
  execute() {
    // Initializing Middlewares
    this.middlewares();

    // Initializing sockets
    this.configureSockets();

    // Initializing Server
    this.server.listen(this.port, () => {
      console.info('Server running on port: ', this.port);
    });
  }
}

module.exports = Server;
