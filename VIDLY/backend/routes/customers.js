const express = require("express");
const { Customer, validator } = require("./../models/customer");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectID");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    res.send(customer);
  } else res.status(404).send("Customer not found!");
});

router.post("/", [auth, validate(validator)], async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();
  res.setHeader("Content-Type", "application/json");
  res.send(customer);
});

router.put(
  "/:id",
  [auth, validateObjectId, validate(validator)],
  async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
      { new: true }
    );

    if (!customer) {
      return res.status(404).send("Customer not found!");
    }

    res.send(customer);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return res.status(404).send("Customer not found!");
  }

  res.send(customer);
});

module.exports = router;
