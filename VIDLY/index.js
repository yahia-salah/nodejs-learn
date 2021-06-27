const logger = require("./backend/log/logger");
const startupDebuger = require("debug")("app:startup");
const dbDebuger = require("debug")("app:db");
const express = require("express");
const fs = require("fs");
const app = express();

// folders setup
if (!fs.existsSync("./backend/uploads"))
  fs.mkdir("./backend/uploads", () => {
    logger.info("Created uploads directory!");
  });

// modules setup
require("./backend/setup/db")();
require("./backend/setup/config")();
require("./backend/setup/routes")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
