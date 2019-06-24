const express = require("express");
const topicsRouter = express.Router();
const { sendAllTopics } = require("../controllers/topics-controllers.js");

topicsRouter.route("/").get(sendAllTopics);

module.exports = topicsRouter;
