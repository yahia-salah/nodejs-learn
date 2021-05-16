const logger = require("./../log/logger");

module.exports = function (req, res, next) {
  logger.info(req.originalUrl);
  next();
};
