const apiRouter = require("express").Router();
const topicsRouter = require("../routes/topics-router");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
