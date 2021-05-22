module.exports = function (validator) {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) {
      let errorMessages = error.details.map((x) => x.message);
      return res.status(400).send(errorMessages);
    }
    next();
  };
};
