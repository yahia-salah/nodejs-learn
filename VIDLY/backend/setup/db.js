const mongoose = require("mongoose");
const logger = require("./../log/logger");
const config = require("config");

// Database code
module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => logger.info(`Connected to ${db}...`));
};
