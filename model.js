const db = require("./db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchReviews = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then(({ rows: review }) => {
            return review[0];
    });
};

exports.updateReview = (newVote)=>{
  return db.query(`"UPDATE restaurants SET area_id = $1 WHERE restaurant_id = $2 RETURNING * ",
  [area_id, id]`).then(({rows:votes}))
}