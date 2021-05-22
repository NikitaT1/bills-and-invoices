const { body } = require("express-validator");

const customerSchema = [
  body("firstName")
    .isString()
    .isLength({ min: 5 })
    .withMessage("First name must be at least 5 characters long"),
  body("lastName")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Last name must be at least 5 characters long"),
  body("email")
    .isEmail()
    .withMessage("email must contain a valid email address"),
];

module.exports = customerSchema;
