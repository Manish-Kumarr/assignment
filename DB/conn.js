const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const conn = mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DataBase Connected!');
  })
  .catch((e) => {
    console.log(e.message + 'Connection Failed!');
  });

module.exports = conn;
