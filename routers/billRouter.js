import Router from "express";
import customValidation from "../middleware/validation";
import billSchema from "../schema/billSchema";
import config from "../config";
import { Queue } from "bullmq";
import mailWorker from "../sendEmail/mailWorker";
import dbWorker from "./billWorker";
import htmlWorker from "../htmlPdfGenerator/htmlWorker";

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
  console.log("=====>");
  let resData = {};
  try {
    dbWorker.on("completed", async (result) => {
      console.log("dbWorker ====> completed", result.returnvalue);
      resData = { ...result.returnvalue };
      await htmlQueue.add("someTaskName", result.returnvalue);
    });

    htmlWorker.on("completed", async () => {
      console.log("htmlWorker ============> completed");
      console.info(`Completed htmlWorker`);
      await mailQueue.add("someTaskName");
    });

    mailWorker.on("completed", async (job) => {
      console.info(`Completed mailWorker`, job.name);
      res.send(resData);
    });

    dbWorker.on(
      "failed",
      (job, err) => console.info(`Failed dbWorker`, job.data, err) //make error handler and add to on => failed
    );
    htmlWorker.on("failed", (job, err) =>
      console.info(`Failed htmlWorker`, job.data, err)
    );
    mailWorker.on("failed", (job, err) =>
      console.info(`Failed mailWorker`, job.data, err)
    );

    await dbQueue.add("someTaskName", req.body);
    res.send("post request is done");
  } catch (er) {
    console.log(er);
  }
});

export default router;
