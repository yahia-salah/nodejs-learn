const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mimeTypes = require("mime-types");
const path = require("path");
const fs = require("fs");

router.get("/:fileName", (req, res) => {
  let fileName = req.params.fileName;
  let filePath = path.join(process.cwd(), "backend", "uploads", fileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log("Error reading file", err);
      return res.status(404).send("File not found");
    }
    console.log("Returning file: " + filePath);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Type", mimeTypes.lookup(fileName));
    res.send(data);
  });
});

module.exports = router;
