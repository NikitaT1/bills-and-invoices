const Router = require("express");
const router = new Router();
const { Customer } = require("../models/models");
const customValidation = require("../middleware/validation");
const customerSchema = require("../schema/customerSchema");

router.post("/", customerSchema, customValidation, async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const type = await Customer.create({ firstName, lastName, email });
    res.json(type);
  } catch (er) {
    console.log(er);
  }
});

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.findAndCountAll({});
    res.json(customers);
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
