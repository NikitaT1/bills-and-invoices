import express from "express";
require("dotenv").config();
const sequelize = require("./db");
import cors from "cors";
const router = require("./routers/router");
const logger = require("./logger/logger");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const PORT = process.env.PORT || 3000;

const app = express();
//app.use(logger);
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// io.subscribe("my-channel-1", "my-channel-2", (err, count) => {
//   if (err) {
//     // Just like other commands, subscribe() can fail for some reasons,
//     // ex network issues.
//     console.error("Failed to subscribe: %s", err.message);
//   } else {
//     // `count` represents the number of channels this client are currently subscribed to.
//     console.log(
//       `Subscribed successfully! This client is currently subscribed to ${count} channels.`
//     );
//   }
// });

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
