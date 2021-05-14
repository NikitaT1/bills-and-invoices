const Router = require("express");
const router = new Router();
const { Bill } = require("../models/models");

router.post("/", async (req, res) => {
  const { workPerformed, price } = req.body;
  try {
    const type = await Bill.create({ workPerformed, price });
    return res.json(type);
  } catch (er) {
    console.log(er);
  }
});

module.exports = router;
