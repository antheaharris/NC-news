const express = require("express");
const articlesRouter = express.Router();
const {
  sendByArticleId,
  patchArticlceById,
  postCommentByArticleId
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(sendByArticleId)
  .patch(patchArticlceById);

articlesRouter.route("/:article_id/comments").post(postCommentByArticleId);

module.exports = articlesRouter;
