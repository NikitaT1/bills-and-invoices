const Router = require("express");
const router = new Router();
const customerRouter = require("./customerRouter");
const billRouter = require("./billRouter");

router.use("/customer", customerRouter);
router.use("/bills", billRouter);

module.exports = router;
