const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN_STRING, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });

    console.info('DB Online!');
  } catch (err) {
    console.error(err);
    throw new Error('Error in database - see the logs');
  }
};

module.exports = { dbConnection };
