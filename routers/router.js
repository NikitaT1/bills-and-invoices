import Router from "express";
import customerRouter from "./customerRouter";
import billRouter from "./billRouter";
const Redis = require("ioredis");
const io = new Redis(); // Connect to 127.0.0.1:6379

const router = new Router();

router.use("/customer", customerRouter);
router.use("/bills", billRouter);

module.exports = router;
