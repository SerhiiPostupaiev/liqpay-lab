const mongoose = require('mongoose');
const db = require('./dbConfig.json');

const connectDB = async () => {
  try {
    await mongoose.connect(db.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
