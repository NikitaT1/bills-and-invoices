const { Worker } = require("bullmq");
const { connection, concurrency, limiter, queueName1 } = require("../config");

const worker = new Worker(queueName1, `${__dirname}/billBll.js`, {
  connection,
  concurrency,
  limiter,
});

console.info("Worker listening for jobs" + queueName1);

module.exports = worker;
