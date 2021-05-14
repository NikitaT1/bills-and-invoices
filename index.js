const express = require("express");
require("dotenv").config();
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const router = require("./routers/router");

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

start();
