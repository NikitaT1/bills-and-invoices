import Router from "express";
import { Customer } from "../models/models";
import customValidation from "../middleware/validation";
import customerSchema from "../schema/customerSchema";

const router = new Router();

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

export default router;
