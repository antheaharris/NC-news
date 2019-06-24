const express = require("express");
const apiRouter = require("./routes/api");
const app = express();
const {
  routeNotFound,
  handle500,
  handleCustomErrors,
  handleSqlErrors
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFound);

app.use(handleCustomErrors);

module.exports = app;
