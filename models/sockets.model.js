const {
  userConnected,
  userDisconnected,
  createGame,
  cancelGame,
  getMatches,
  joinGame,
  playGame,
  cardSelect,
  cardBattle,
  finishGame,
} = require('../controllers/sockets.controller');
const { comprobarJWT } = require('../helpers/jwt');

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    this.io.on('connection', async (socket) => {
      console.info('Client connected to Socket!');

      // Validating token and disconnecting user if not
      const token = socket.handshake.query['x-token'];
      const [valid, uid] = comprobarJWT(token);
      if (!valid) {
        console.log('Socket unidentified');
        return socket.disconnect();
      }
      // Connecting user normally if token is valid
      const user = await userConnected(uid);
      /* console.log(user.nickname + ' has connected'); */

      /* this.io.emit('games-list', await getMatches()); */

      // Listen to create room
      socket.on('create-game', async () => {
        const game = await createGame(user.id);
        socket.join(`${game._id} game`);
        /* console.log(socket.rooms); */
        console.log(user.nickname, ' create a room');
        socket.emit('created-game', game);
        this.io.emit('games-list');
      });

      // Listen to join game(room)
      socket.on('join-game', async (match) => {
        /* console.log(`${user.nickname} has joined ${match._id}`); */
        const game = await joinGame(user.id, match._id);
        socket.join(`${game._id} game`);
        /* console.log(socket.rooms); */
        this.io.in(`${game._id} game`).emit('joined-game', game);
        this.io.emit('games-list');
      });

      // Listen to cancel game or delete room
      socket.on('cancel-game', async (gameId) => {
        /* console.log(gameId, ' game canceled'); */
        const game = await cancelGame(gameId);
        this.io.in(`${game._id} game`).emit('canceled-game');
        this.io.emit('games-list');
      });

      // Listen to play game event
      socket.on('play-game', async (gameId) => {
        /* console.log(gameId, ' game started'); */
        const game = await playGame(gameId);
        this.io.in(`${game._id} game`).emit('started-game', game);
        this.io.emit('games-list');
      });

      // Listen to card-selected
      socket.on('select-card', async (cardSelected, gameId) => {
        /* console.log('Card was selected'); */
        const game = await cardSelect(cardSelected, gameId);
        this.io.in(`${game._id} game`).emit('selected-card', game);
      });

      // Listen to battle-card
      socket.on('battle-card', async (cardsSelected, gameId) => {
        /* console.log('Cards are fighting'); */
        const game = await cardBattle(cardsSelected, gameId);
        this.io.in(`${game._id} game`).emit('selected-card', game);
      });

      // Listen to finish-game
      socket.on('finish-game', async (gameId) => {
        /* console.log('Game finished'); */
        const game = await finishGame(gameId);
        this.io.in(`${game._id} game`).emit('finished-game');
        this.io.emit('games-list', await getMatches());
      });

      // All the events when user disconnect
      socket.on('disconnect', async () => {
        const user = await userDisconnected(uid);
        /* console.log('User disconnected', user.nickname); */
      });
    });
  }
}

module.exports = Sockets;
