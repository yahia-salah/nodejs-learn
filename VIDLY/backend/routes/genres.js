const express = require("express");
const { Genre, validate } = require("./../models/genre");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid genreId");

  const genre = await Genre.findById(req.params.id);

  if (genre) {
    res.send(genre);
  } else res.status(404).send("Genre not found!");
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    res.status(400).send(errorMessages);
    return;
  }
  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();
  res.setHeader("Content-Type", "application/json");
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid genreId");

  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    res.status(400).send(errorMessages);
    return;
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    res.status(404).send("Genre not found!");
    return;
  }

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid genreId");

  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    res.status(404).send("Genre not found!");
    return;
  }

  res.send(genre);
});

module.exports = router;
