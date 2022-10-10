const express = require("express");
const app = express();
const { getCategories } = require("./controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Oops server broke :(" });
  });

module.exports = app;
