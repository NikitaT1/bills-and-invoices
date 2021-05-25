import { Worker } from "bullmq";
import { connection, concurrency, limiter, queueName1 } from "../config";

const worker = new Worker(queueName1, `${__dirname}/billBll.js`, {
  connection,
  concurrency,
  limiter,
});

console.info("Worker listening for jobs" + queueName1);

export default worker;
