import express from "express";
require("dotenv").config();
const sequelize = require("./db");
import cors from "cors";
const router = require("./routers/router");
const logger = require("./logger/logger");

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

logger.info("text info");
logger.warn("text warn");
logger.error("text error");

start();
