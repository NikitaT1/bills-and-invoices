import bodyparser from "body-parser";
import { check, validationResult } from "express-validator";

function customValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export default customValidation;
