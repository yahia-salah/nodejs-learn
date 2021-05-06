const startupDebuger = require("debug")("app:startup");
const dbDebuger = require("debug")("app:db");
const express = require("express");
const mongoose = require("mongoose");
//const logger = require('./middleware/logger');
//const authenticate = require('./middleware/authenticate');
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const home = require("./routes/home");
const app = express();

// Database code
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Can't connect to MongoDB", err.message));

app.set("view engine", "pug");
app.set("views", "./views");

// Middleware Fucntions //
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebuger("Morgan is enabled..."); // $env:DEBUG="app:startup" in PS, set DEBUG=app:startup in CMD
}
app.use(helmet());
app.use(express.json());
//app.use(logger);
//app.use(authenticate);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/", home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
