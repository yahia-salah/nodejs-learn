const Joi = require("joi");
const mongoose = require("mongoose");
const PasswordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlenght: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlenght: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlenght: 8,
    maxlength: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    _.pick(this, ["_id", "isAdmin"]),
    config.get("jwtSecret")
  );
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: new PasswordComplexity({
      min: 8,
      max: 25,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }).required(),
  });
  return schema.validate(user, { abortEarly: false });
}

module.exports.User = User;
module.exports.validate = validateUser;
