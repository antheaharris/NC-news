const apiRouter = require("express").Router();
const topicsRouter = require("../routes/topics-router");
const usersRouter = require("../routes/users-router");

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
