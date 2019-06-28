const {
  selectByArticleId,
  updateArticleById,
  postComment,
  selectAllCommentsByArticleId,
  selectAllArticles,
  checkExists
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

  updateArticleById(article_id, inc_votes)
    .then(([article]) => {
      const articleExists = article_id
        ? checkExists(article_id, "articles", "article_id")
        : null;
      return Promise.all([articleExists, article]);
    })
    .then(([articleExists, article]) => {
      if (articleExists === false)
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
  selectAllCommentsByArticleId(article_id, req.query)
    .then(comments => {
      if (!comments.length)
        return Promise.reject({
          status: 404,
          msg: "article does not exist"
        });
      else res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

exports.sendAllArticles = (req, res, next) => {
  const { author, topic } = req.query;
  selectAllArticles(req.query)
    .then(articles => {
      checkAuthorExists = author
        ? checkExists(author, "users", "username")
        : null;

      checkTopicExists = topic ? checkExists(topic, "topics", "slug") : null;

      return Promise.all([checkAuthorExists, checkTopicExists, articles]);
    })
    .then(([authorExists, topicExists, articles]) => {
      if (authorExists === false || topicExists === false)
        return Promise.reject({
          status: 404,
          msg: "resource not found"
        });
      else res.status(200).send({ articles });
    })
    .catch(err => next(err));
};
