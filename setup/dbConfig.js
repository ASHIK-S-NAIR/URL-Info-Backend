const mongoose = require("mongoose");

//DB connection
const dbConfig = () => {
  mongoose.connect(process.env.DATABASE, {}).then(() => {
    console.log("DB connected");
  });
};

module.exports = dbConfig;
