const {
  selectByArticleId,
  updateArticleById,
  postComment,
  selectAllCommentsByArticleId
} = require("../models/articles-models");

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

exports.patchArticlceById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes)
    res.status(400).send({ msg: "no inc_vote key on request body" });
  //feel like this isn't where to do this? or not the best way to?
  else {
    updateArticleById(article_id, inc_votes)
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
  }
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const author = username;
  delete username;
  const newComment = { author, body };
  postComment(article_id, newComment)
    .then(comment => {
      if (!comment.article_id)
        return Promise.reject({
          status: 404,
          msg: "article does not exist"
        });
      else res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectAllCommentsByArticleId(article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => console.log(err));
};
