const {
  fetchCategories,
  fetchReviewsByID,
  fetchReviews,
  fetchUsers,
  updateReview,
  insertComment,
  fetchComments
} = require("./model");

const { checkIfCategoryExists } = require("./utils");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsByID(review_id)
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

exports.getReviews = (req, res, next) => {
  const { category: filter, sortBy: sortQuery} = req.query;
 
  if (filter) {
    checkIfCategoryExists(filter).catch((err) => {
      next(err);
    });
  } 

  fetchReviews(filter, sortQuery)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;

  insertComment(req.body, review_id)
    .then((data) => {
      const comment = data[0].body
      res.status(201).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
