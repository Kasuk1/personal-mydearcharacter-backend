const mongoose = require('mongoose');
const { nodEnv, production, development } = require('./index');

const MONGO_URI = nodEnv == 'development' ? development.database.mongoUri : production.database.mongoUri;

const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

exports.connectToDb = () => {
    mongoose.connect(MONGO_URI, options);
    const { connection } = mongoose;
    connection.once('open', () => console.log('Connection to the Database has been stablished'));
    connection.on('error', (err) => console.log('Something went wrong'));
    return connection;
};
