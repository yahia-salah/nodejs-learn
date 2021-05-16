const config = require("config");
const logger = require("./../log/logger");

module.exports = function () {
  // Check if config is defined
  if (!config.get("jwtSecret")) {
    // $env:vidly_jwtSecret="jwtSecret123" in PS, set vidly_jwtSecret=jwtSecret123 in CMD
    throw new Error("FATAL ERROR: jwtSecret is not defined.");
  }
};
