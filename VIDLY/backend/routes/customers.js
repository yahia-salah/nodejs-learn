const express = require("express");
const { Customer, validate } = require("./../models/customer");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid customerId");

  const customer = await Customer.findById(req.params.id);

  if (customer) {
    res.send(customer);
  } else res.status(404).send("Customer not found!");
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    res.status(400).send(errorMessages);
    return;
  }
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();
  res.setHeader("Content-Type", "application/json");
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid customerId");

  const { error } = validate(req.body);
  if (error) {
    let errorMessages = error.details.map((x) => x.message);
    res.status(400).send(errorMessages);
    return;
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );

  if (!customer) {
    res.status(404).send("Customer not found!");
    return;
  }

  res.send(customer);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid customerId");

  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    res.status(404).send("Customer not found!");
    return;
  }

  res.send(customer);
});

module.exports = router;
