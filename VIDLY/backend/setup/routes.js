const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");
// const multer = require("multer");
// const upload = multer();
const genres = require("./../routes/genres");
const customers = require("./../routes/customers");
const movies = require("./../routes/movies");
const rentals = require("./../routes/rentals");
const returns = require("./../routes/returns");
const users = require("./../routes/users");
const auth = require("./../routes/auth");
const home = require("./../routes/home");
const uploads = require("./../routes/uploads");
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
  app.use(cors());
  app.use(logger);
  app.use(express.json());
  //app.use(express.urlencoded({ extended: true }));
  // for parsing multipart/form-data
  //app.use(upload.array());
  //app.use(express.static("public"));
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/uploads", uploads);
  app.use("/", home);
  app.use(helmet());
  app.use(compression());
  app.use(error);
};
