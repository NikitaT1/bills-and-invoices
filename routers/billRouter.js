import Router from "express";
import customValidation from "../middleware/validation";
import billSchema from "../schema/billSchema";
import config from "../config";
import { Queue } from "bullmq";
import dbWorker from "./billWorker";
const Redis = require("ioredis");
const io = new Redis(); // Connect to 127.0.0.1:6379

require("dotenv").config();

const router = new Router();

const dbQueue = new Queue(config.queueName1, {
  connection: config.connection,
});

router.post("/", billSchema, customValidation, async (req, res) => {
  let resData = {};
  try {
    dbWorker.on("completed", async (result) => {
      resData = { ...result.returnvalue };
      io.publish("createAndSendInvoice", JSON.stringify(result.returnvalue));
    });

    await dbQueue.add("dataBase in quene", req.body);
    res.send("post request is done");
  } catch (er) {
    console.log(er);
  }
});

export default router;
