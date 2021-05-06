const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "VIDLY APP", message: "Welcome to VIDLY APP" });
});

module.exports = router;
