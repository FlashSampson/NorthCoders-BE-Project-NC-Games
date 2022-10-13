exports.checkIfCategoryExists = (category) => {
    console.log('in the error handler')
  return db
    .query("SELECT * FROM reviews WHERE category = $1"[category])
    .then(({ category }) => {
        console.log('promise returned err handler')
      if (category.length === 0) {
        return Promise.reject({ status: 400, msg: "no matching results" });
      }
      return category;
    });
};
