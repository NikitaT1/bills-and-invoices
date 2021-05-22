const { body } = require("express-validator");

const billSchema = [
  body("recipientEmail")
    .isEmail()
    .withMessage("email must contain a valid email address"),
  body("customerEmail")
    .isEmail()
    .withMessage("email must contain a valid email address"),
  body("recipientsCompany")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Recipients Company must be at least 3 characters long"),
  body("works")
    .isArray()
    .withMessage("Works must contay performed work and it's price"),
];

module.exports = billSchema;
