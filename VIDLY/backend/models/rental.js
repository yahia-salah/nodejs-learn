const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
    // The other properties are going to be set by the server based on some business logic!!!
    // dateOut, dateReturned, rentalFee
  });
  return schema.validate(rental, { abortEarly: false });
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
