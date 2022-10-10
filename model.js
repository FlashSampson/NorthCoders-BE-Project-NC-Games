const db = require("./db/index.js");

exports.fetchCategories = () => {
  
  return db.query(`SELECT * FROM  `).then(({ rows: categories }) => {
    return categories;
  });
};
