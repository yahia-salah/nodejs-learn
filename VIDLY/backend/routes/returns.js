const express = require("express");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const Joi = require("joi");
const { Rental } = require("../models/rental");
Joi.objectId = require("joi-objectid")(Joi);
const Fawn = require("fawn");
const moment = require("moment");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customerId");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movieId");

  let rental = await Rental.findOne({ customer, movie });
  if (!rental)
    return res.status(404).send("No rental found for this customer and movie");

  if (rental.dateReturned)
    return res.status(400).send("Rental already processed");

  try {
    await new Fawn.Task()
      .update(
        "rentals",
        { _id: rental._id },
        {
          dateReturned: Date.now(),
          rentalFee:
            movie.dailyRentalRate * moment().diff(rental.dateOut, "days"),
        }
      )
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: 1 } })
      .run();

    rental = await Rental.findById(rental._id);
    res.send(rental);
  } catch (err) {
    res.status(500).send("Something went wrong in  database!");
  }
});

function validateReturn(returnObj) {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  });
  return schema.validate(returnObj, { abortEarly: false });
}

module.exports = router;
