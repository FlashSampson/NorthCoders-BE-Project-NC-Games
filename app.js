const express = require("express");
const app = express();
const {
  getCategories,
  getReviewsByID,
  getUsers,
  patchReview,
  getReviews,
  getComments,
} = require("./controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewsByID);

app.get(`/api/reviews`, getReviews);

app.get("/api/users", getUsers);

app.get("/api/reviews/:review_id/comments", getComments);

app.patch("/api/reviews/:review_id", patchReview);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "route not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid input" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "no input detected" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Oops server broke :(" });
});

module.exports = app;
