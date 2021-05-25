module.exports = {
  queueName1: process.env.QUEUE_NAME || "queue1",
  queueName2: process.env.QUEUE_NAME || "queue2",
  queueName3: process.env.QUEUE_NAME || "queue3",
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY, 10) || 1,
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || "6379",
    password: "nikitat1",
  },
};
