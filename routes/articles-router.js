const express = require("express");
const articlesRouter = express.Router();
const {
  sendByArticleId,
  patchArticlceById,
  postCommentByArticleId,
  sendCommentsByArticleId,
  sendAllArticles
} = require("../controllers/articles-controllers");

articlesRouter.route("/").get(sendAllArticles);

articlesRouter
  .route("/:article_id")
  .get(sendByArticleId)
  .patch(patchArticlceById);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(sendCommentsByArticleId);

module.exports = articlesRouter;
