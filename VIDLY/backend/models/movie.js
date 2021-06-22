const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const genreSchema = require("./genre").schema;

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlenght: 5,
      maxlength: 255,
    },
    genre: genreSchema,
    numberInStock: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
      max: 255,
    },
    thumbnail: {
      type: String,
    },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genre: {
      _id: Joi.objectId().required(),
      name: Joi.string().required(),
    },
    numberInStock: Joi.number().required().min(0).max(255),
    dailyRentalRate: Joi.number().required().min(0).max(255),
    thumbnail: Joi.string().optional(),
  });
  return schema.validate(movie, { abortEarly: false, allowUnknown: true });
}

module.exports.Movie = Movie;
module.exports.validator = validateMovie;
