import Router from "express";
import customValidation from "../middleware/validation";
import billSchema from "../schema/billSchema";
import config from "../config";
import { Queue } from "bullmq";
import mailWorker from "../sendEmail/mailWorker";
import dbWorker from "./billWorker";
import htmlWorker from "../htmlPdfGenerator/htmlWorker";
const Redis = require("ioredis");
const io = new Redis(); // Connect to 127.0.0.1:6379

require("dotenv").config();

const router = new Router();

const dbQueue = new Queue(config.queueName1, {
  connection: config.connection,
});

const htmlQueue = new Queue(config.queueName2, {
  connection: config.connection,
});

const mailQueue = new Queue(config.queueName3, {
  connection: config.connection,
});

router.post("/", billSchema, customValidation, async (req, res) => {
  let resData = {};
  try {
    dbWorker.on("completed", async (result) => {
      resData = { ...result.returnvalue };
      await htmlQueue.add("someTaskName", result.returnvalue);
      io.publish("my-channel-1", JSON.stringify(result.returnvalue));
    });

    htmlWorker.on("completed", async () => {
      await mailQueue.add("someTaskName");
    });

    mailWorker.on("completed", async (job) => {
      res.send(resData);
    });

    await dbQueue.add("dataBase in quene", req.body);
    res.send("post request is done");
  } catch (er) {
    console.log(er);
  }
});

export default router;
