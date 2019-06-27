const express = require("express");
const topicsRouter = express.Router();
const { sendAllTopics } = require("../controllers/topics-controllers.js");
const { sendMethodNotAllowed } = require("../errors/index");

topicsRouter
  .route("/")
  .get(sendAllTopics)
  .all(sendMethodNotAllowed);

module.exports = topicsRouter;
