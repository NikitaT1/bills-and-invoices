import { Worker } from "bullmq";
import { connection, concurrency } from "../config";

const worker = new Worker("pdfGenerator", `${__dirname}/htmlPdfGererator.js`, {
  connection,
  concurrency,
});

console.info("Worker listening for jobs");

module.exports = {
  worker,
};
