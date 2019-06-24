const express = require("express");
const usersRouter = express.Router();
const { sendByUsername } = require("../controllers/users-controllers");

usersRouter.route("/:username").get(sendByUsername);

module.exports = usersRouter;
