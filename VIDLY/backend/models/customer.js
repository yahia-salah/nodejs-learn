const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlenght: 5,
      maxlength: 255,
    },
    isGold: {
      type: Boolean,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlenght: 9,
      maxlength: 9,
    },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(9).max(9).required(),
  });
  return schema.validate(customer, { abortEarly: false });
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
