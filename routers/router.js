const Router = require("express");
const router = new Router();
const customerRouter = require("./customerRouter");
const billRouter = require("./billRouter");
const recipientRouter = require("./recipientRouter");

router.use("/customer", customerRouter);
router.use("/bills", billRouter);
router.use("/recipientRouter", recipientRouter);

module.exports = router;
