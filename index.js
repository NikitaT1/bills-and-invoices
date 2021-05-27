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
app.use((req, res, done) => {
  logger.info(req.originalUrl);
  done();
});
app.use(cors());
app.use(express.json());
app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
