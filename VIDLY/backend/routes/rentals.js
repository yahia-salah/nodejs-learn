const express = require("express");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find()
    .populate("movie customer")
    .sort({ dateOut: -1 });
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid rentalId");

  const rental = await Rental.findById(req.params.id);

  if (rental) {
    res.send(rental.populate("movie customer"));
  } else res.status(404).send("Rental not found!");
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    res.status(400).send(errorMessages);
    return;
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customerId");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movieId");

  if (movie.numberInStock == 0)
    return res.status(400).send("This movie is out of stock");

  const rental = new Rental({
    movie: movie._id,
    customer: customer._id,
    rentalFee: customer.isGold ? 5 : 10,
  });
  // rental = await rental.save();
  // movie.numberInStock -= 1;
  // await movie.save();
  // Transaction of the above 3 lines using Fawn package
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.setHeader("Content-Type", "application/json");
    res.send(rental.populate("movie customer"));
  } catch (err) {
    res.status(500).send("Something went wrong in  database!");
  }
});

module.exports = router;
