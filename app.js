const express = require("express");
const app = express();
const { getCategories } = require("./controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.all("/*", (req, res)=>{
    res.status(404).send({ msg: "route not found" });
})

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({msg: err.msg});
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Oops server broke :(" });
});

module.exports = app;
