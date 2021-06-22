const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const validate = require("../middleware/validate");

router.post("/", validate(validateAuth), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send({ token });
});

function validateAuth(body) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(25).required(),
  });
  return schema.validate(body, { abortEarly: false });
}

module.exports = router;
