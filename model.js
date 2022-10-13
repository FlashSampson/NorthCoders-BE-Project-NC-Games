const { rows } = require("pg/lib/defaults");
const db = require("./db/connection");
const {checkIfCategoryExists} = require('./utils')

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchReviewsByID = (review_id) => {
  return (
    db
      .query(
        `SELECT reviews.* , COUNT(comments.review_id) ::INT AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id, comments.review_id;`,
        [review_id]
      )

      // .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
      .then(({ rows: review }) => {
        return review[0];
      })
  );
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.updateReview = (review_id, inc_votes) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*`,
      [inc_votes, review_id]
    )
    .then(({ rows: updatedReview }) => {
      if (updatedReview.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return updatedReview;
    });
};

exports.fetchReviews = (filter) => {
  
  let queryString = `SELECT users.username AS owner, reviews.* , COUNT(comments.review_id) comment_count
FROM reviews
LEFT JOIN comments ON reviews.review_id = comments.review_id
LEFT JOIN users ON reviews.owner = users.username`

  if (filter) {
      checkIfCategoryExists(filter).then((filter)=>{
        console.log(queryString, 'model')
        return queryString += ` WHERE category = '${filter}'`;
      })
    
    // const acceptableValues = [" social deduction", "dexterity", "euro game"];

    // if (!acceptableValues.includes(filter)) {
    //   return Promise.reject({ status: 400, msg: "Invalid input recieved" });
    // }

    // queryString += ` WHERE category = '${filter}'`;
  }
  queryString += ` GROUP BY reviews.review_id, comments.review_id, users.username
  ORDER BY created_at DESC;`;

  return db.query(queryString).then(({ rows: reviews }) => {
    
    return reviews;
  });
};
