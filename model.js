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

exports.fetchUsers = () => {
    return db
      .query(`SELECT * FROM users;`)
      .then(({ rows: users }) => {
              return users;
      });
  };
