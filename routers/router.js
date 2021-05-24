import Router from "express";
import customerRouter from "./customerRouter";
import billRouter from "./billRouter";

const router = new Router();

router.use("/customer", customerRouter);
router.use("/bills", billRouter);

module.exports = router;
