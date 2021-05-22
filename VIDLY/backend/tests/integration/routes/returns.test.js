const request = require("supertest");
const { Customer } = require("../../../models/customer");
const { Movie } = require("../../../models/movie");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");
const _ = require("lodash");
const mongoose = require("mongoose");
const moment = require("moment");
let server;

// POST /api/returns {customerId,movieId}
//
// Return 401 if user is not logged in
// Return 400 if customerId is invalid
// Return 400 if movieId is invalid
// Return 404 if not rental for this customerId and movieId
// Return 400 if rental is already processed
// Return 200 if valid request
// Set the return date
// Calculate the retnal fee
// Increase the stock
// Return the rental in response

describe("/api/returns", () => {
  let token;
  let customerId;
  let movieId;
  let rental;
  beforeEach(async () => {
    server = require("../../../../index");
    token = new User().generateAuthToken();

    const customer = await Customer.create({
      name: "12345",
      isGold: false,
      phone: "123456789",
    });
    const movie = await Movie.create({
      title: "12345",
      genre: { name: "12345" },
      numberInStock: 1,
      dailyRentalRate: 1,
    });
    customerId = customer._id;
    movieId = movie._id;
    rental = await Rental.create({
      customer,
      movie,
      rentalFee: 0,
    });
  });

  afterEach(async () => {
    if (server) await server.close();
    await Rental.deleteMany({});
    await Customer.deleteMany({});
    await Movie.deleteMany({});
  });

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  it("should return 401 if user is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.statusCode).toBe(401);
  });

  it("should return 400 if customer doesn't exist", async () => {
    customerId = mongoose.Types.ObjectId().toHexString();
    const res = await exec();
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if customerId is invalid", async () => {
    customerId = "123";
    const res = await exec();
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if movie doesn't exist", async () => {
    movieId = mongoose.Types.ObjectId().toHexString();
    const res = await exec();
    expect(res.statusCode).toBe(400);
  });

  it("should return 400 if movieId is invalid", async () => {
    movieId = "123";
    const res = await exec();
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if not rental for this customerId and movieId", async () => {
    await Rental.findByIdAndDelete(rental._id);
    const res = await exec();
    expect(res.statusCode).toBe(404);
  });

  it("should return 400 if rental is already processed", async () => {
    rental.dateReturned = Date.now();
    await rental.save();
    const res = await exec();
    expect(res.statusCode).toBe(400);
  });

  it("should return 200 if valid request", async () => {
    const res = await exec();
    expect(res.statusCode).toBe(200);
  });

  it("should set the return date", async () => {
    const res = await exec();
    const result = await Rental.findById(rental._id);
    expect(result.dateReturned).not.toBeNull();

    const diff = Date.now() - result.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should calculate the renal fee", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(1 * 7);
  });

  it("should increase the stock", async () => {
    const res = await exec();
    const movie = await Movie.findById(movieId);
    expect(movie.numberInStock).toBe(2);
  });

  it("should return the rental in response", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "movie",
        "customer",
      ])
    );
  });
});
