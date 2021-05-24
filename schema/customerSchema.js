import { body } from "express-validator";

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

export default customerSchema;
