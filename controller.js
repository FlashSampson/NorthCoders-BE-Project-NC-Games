const { fetchCategories, fetchReviews, updateReview } = require("./model");

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

exports.patchReview = (req, res, next) =>{
  const {newVote} = req.params
  console.log(newVote)
  updateReview(newVote)
}