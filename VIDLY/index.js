const startupDebuger = require("debug")("app:startup");
const dbDebuger = require("debug")("app:db");
const express = require("express");
const mongoose = require("mongoose");
//const logger = require('./middleware/logger');
//const authenticate = require('./middleware/authenticate');
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const genres = require("./backend/routes/genres");
const customers = require("./backend/routes/customers");
const movies = require("./backend/routes/movies");
const rentals = require("./backend/routes/rentals");
const users = require("./backend/routes/users");
const auth = require("./backend/routes/auth");
const home = require("./backend/routes/home");
const app = express();

// Check if config is defined
if (!config.get("jwtSecret")) {
  // $env:vidly_jwtSecret="jwtSecret123" in PS, set vidly_jwtSecret=jwtSecret123 in CMD
  console.error("FATAL ERROR: jwtSecret is not defined.");
  process.exit(1);
}

// Database code
mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
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
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/", home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
