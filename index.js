const express = require("express");
require("dotenv").config();
const sequelize = require("./db");
const models = require("./models/models");

const PORT = process.env.PORT || 3000;

const app = express();

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
