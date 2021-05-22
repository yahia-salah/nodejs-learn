const express = require("express");
const { Genre, validate } = require("./../models/genre");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectID");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (genre) {
    res.send(genre);
  } else res.status(404).send("Genre not found!");
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    return res.status(400).send(errorMessages);
  }
  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();
  res.setHeader("Content-Type", "application/json");
  res.send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    return res.status(400).send(errorMessages);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    return res.status(404).send("Genre not found!");
  }

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    return res.status(404).send("Genre not found!");
  }

  res.send(genre);
});

module.exports = router;
