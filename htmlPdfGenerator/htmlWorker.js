import { Worker } from "bullmq";
import { connection, queueName2 } from "../config";

const htmlWorker = new Worker(queueName2, `${__dirname}/htmlPdfGererator.js`, {
  connection,
});

console.info("Worker listening for jobs");

export default htmlWorker;
