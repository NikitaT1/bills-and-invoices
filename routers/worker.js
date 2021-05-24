const { Worker } = require("bullmq");
const { connection, concurrency, limiter, queueName } = require("../config");

const worker = new Worker(queueName, `${__dirname}/process.js`, {
  connection,
  concurrency,
  limiter,
});

console.info("Worker listening for jobs");

module.exports = worker;
