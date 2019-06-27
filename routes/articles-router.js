const express = require("express");
const articlesRouter = express.Router();
const { sendMethodNotAllowed } = require("../errors/index");
const {
  sendByArticleId,
  patchArticlceById,
  postCommentByArticleId,
  sendCommentsByArticleId,
  sendAllArticles
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/")
  .get(sendAllArticles)
  .all(sendMethodNotAllowed);

articlesRouter
  .route("/:article_id")
  .get(sendByArticleId)
  .patch(patchArticlceById)
  .all(sendMethodNotAllowed);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(sendCommentsByArticleId)
  .all(sendMethodNotAllowed);

module.exports = articlesRouter;
