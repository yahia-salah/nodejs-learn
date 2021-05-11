const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ title: 1 });
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid movieId");

  const movie = await Movie.findById(req.params.id);

  if (movie) {
    res.send(movie);
  } else res.status(404).send("Movie not found!");
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    res.status(400).send(errorMessages);
    return;
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genreId");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.setHeader("Content-Type", "application/json");
  res.send(movie);
});

router.put("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid movieId");

  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    res.status(400).send(errorMessages);
    return;
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genreId");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie) {
    res.status(404).send("Movie not found!");
    return;
  }

  res.send(movie);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid movieId");

  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    res.status(404).send("Movie not found!");
    return;
  }

  res.send(movie);
});

module.exports = router;
