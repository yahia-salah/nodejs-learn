const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf(
          (msg) => `${msg.timestamp} - ${msg.level}: ${msg.message}`
        ),
        winston.format.colorize({ all: true })
      ),
    }),
    new winston.transports.File({
      filename: "logfile.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost/vidly",
    //   level: "error",
    //   options: {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   },
    // }),
  ],
});

logger.exceptions.handle(
  new winston.transports.File({
    filename: "exceptions.log",
  }),
  new winston.transports.Console()
);

process.on("unhandledRejection", function (err) {
  throw err;
});

module.exports = logger;
