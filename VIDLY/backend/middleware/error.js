const logger = require("./../log/logger");

module.exports = function (err, req, res, next) {
  // Logging logic here
  // error
  // warn
  // info
  // verbose
  // debug
  // silly
  logger.error(err.message, err);

  res.status(500).send("Something went wrong");
};
