const express = require("express");
const commentsRouter = express.Router();
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comments-controllers");
const { sendMethodNotAllowed } = require("../errors/index");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(sendMethodNotAllowed);

module.exports = commentsRouter;
