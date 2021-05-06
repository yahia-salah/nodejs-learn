const mongoose = require("mongoose");
const Joi = require("joi");

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlenght: 5,
      maxlength: 50,
    },
  })
);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genre, { abortEarly: false });
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
