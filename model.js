const db = require("./db/data/");

exports.fetchCategories = () => {
  
  return db.query(`SELECT * FROM  `).then(({ rows: categories }) => {
    return categories;
  });
};
