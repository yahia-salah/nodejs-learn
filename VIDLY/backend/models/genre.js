const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genre, { abortEarly: false, allowUnknown: true });
}

module.exports.Genre = Genre;
module.exports.validator = validateGenre;
module.exports.schema = genreSchema;
