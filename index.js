import express from "express";
require("dotenv").config();
const sequelize = require("./db");
const models = require("./models/models");
import cors from "cors";
const router = require("./routers/router");
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

// export const connection = new IORedis({
//   port: 6379,
//   host: "127.0.0.1",
//   password: "nikitat1",
// });

//export const myQueue = new Queue("myqueue", { connection });
// export const myWorker = new Worker("myworker", async (job) => {}, {
//   connection,
// });

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  } catch (e) {
    console.log(e);
  }
};

start();
