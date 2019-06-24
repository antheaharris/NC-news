const { selectByArticleId } = require("../models/articles-models");

exports.sendByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectByArticleId(article_id)
    .then(([article]) => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: "article does not exist"
        });
      else res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};
