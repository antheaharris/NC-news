const express = require("express");
const usersRouter = express.Router();
const { sendMethodNotAllowed } = require("../errors/index");
const { sendByUsername } = require("../controllers/users-controllers");

usersRouter
  .route("/:username")
  .get(sendByUsername)
  .all(sendMethodNotAllowed);

module.exports = usersRouter;
