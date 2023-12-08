const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose
    .connect(process.env.MOGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.log("Error in connecting Database");
      console.log(err);
    });
};

module.exports = connectDB;
