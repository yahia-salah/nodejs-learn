const express = require("express");
const { Movie, validator } = require("../models/movie");
const { Genre } = require("../models/genre");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/multer");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectID");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ title: 1 });
  movies.forEach((movie) => {
    if (movie.thumbnail)
      movie.thumbnail = "http://localhost:3000/api/uploads/" + movie.thumbnail;
  });
  res.send(movies);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    if (movie.thumbnail)
      movie.thumbnail = "http://localhost:3000/api/uploads/" + movie.thumbnail;
    res.send(movie);
  } else res.status(404).send("Movie not found!");
});

router.post("/", [auth, validate(validator)], async (req, res) => {
  const genre = await Genre.findById(req.body.genre._id);
  if (!genre) return res.status(400).send("Invalid genre");

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

router.put(
  "/thumbnail-upload/:id",
  [auth, validateObjectId, upload.single("thumbnail")],
  async (req, res) => {
    console.log("movieId", req.params.id);
    console.log("file", req.file);

    let filename = req.file.filename;
    console.log("filename", filename);

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found!");
    }

    await movie.update({ thumbnail: req.file.filename });
    movie.thumbnail = "http://localhost:3000/api/uploads/" + filename;

    res.send(movie);
  }
);

router.put(
  "/:id",
  [auth, validateObjectId, validate(validator)],
  async (req, res) => {
    const genre = await Genre.findById(req.body.genre._id);
    if (!genre) return res.status(400).send("Invalid genre");

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
      return res.status(404).send("Movie not found!");
    }

    if (movie.thumbnail)
      movie.thumbnail = "http://localhost:3000/api/uploads/" + movie.thumbnail;

    res.send(movie);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    return res.status(404).send("Movie not found!");
  }

  res.send(movie);
});

module.exports = router;
