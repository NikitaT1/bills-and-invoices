import { Worker } from "bullmq";
import { connection, queueName3 } from "../config";

const mailWorker = new Worker(queueName3, `${__dirname}/sendEmail.js`, {
  connection,
});

console.info("Worker listening for jobs");

export default mailWorker;
