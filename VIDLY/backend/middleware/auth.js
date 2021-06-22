const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  let token = req.header("Authorization");
  token = token ? token.replace("Bearer ", "") : null;
  if (!token)
    return res.status(401).send("Access denied. No auth token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send("Invalid token");
  }
}

module.exports = auth;
