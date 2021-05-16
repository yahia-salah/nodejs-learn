const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const genres = require("./../routes/genres");
const customers = require("./../routes/customers");
const movies = require("./../routes/movies");
const rentals = require("./../routes/rentals");
const users = require("./../routes/users");
const auth = require("./../routes/auth");
const home = require("./../routes/home");
const error = require("./../middleware/error");
const logger = require("./../middleware/logger");

module.exports = function (app) {
  app.set("view engine", "pug");
  app.set("views", "./views");

  // Middleware Fucntions //
  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    //startupDebuger("Morgan is enabled..."); // $env:DEBUG="app:startup" in PS, set DEBUG=app:startup in CMD
  }
  app.use(logger);
  app.use(helmet());
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error);
};
