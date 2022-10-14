const db = require("./db/connection");

exports.checkIfCategoryExists = (category) => {
  return db
    .query("SELECT * FROM reviews WHERE category = $1", [category])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "no matching results" });
      }
      return category;
    });
};
