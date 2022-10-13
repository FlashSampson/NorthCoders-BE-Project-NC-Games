const {
  fetchCategories,
  fetchReviews,
  fetchUsers,
  updateReview,
} = require("./model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviews(review_id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const review_id = req.params.review_id;
  const { inc_votes } = req.body;
  updateReview(review_id, inc_votes)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
