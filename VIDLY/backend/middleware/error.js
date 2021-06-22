const logger = require("./../log/logger");

module.exports = function (err, req, res, next) {
  // Logging logic here
  // error
  // warn
  // info
  // verbose
  // debug
  // silly
  try {
    logger.error(err.message, err);
  } catch (loggerError) {
    res.status(500).send("Internal Server Error: " + loggerError);
  }

  res.status(500).send("Internal Server Error: " + err);
};
