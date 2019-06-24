exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handleSqlErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.code === "22P02")
    res.status(400).send({ msg: err.message.split(" - ")[1] });
  else next(err);
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
