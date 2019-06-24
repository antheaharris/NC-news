const express = require("express");
const articlesRouter = express.Router();
const { sendByArticleId } = require("../controllers/articles-controllers");

articlesRouter.route("/:article_id").get(sendByArticleId);

module.exports = articlesRouter;
