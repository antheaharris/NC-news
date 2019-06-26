exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handleSqlErrors = (err, req, res, next) => {
  // console.log(err);
  const PSQLerrorCodes = ["22P02", "42703", "23502"];
  if (PSQLerrorCodes.includes(err.code))
    res.status(400).send({ msg: err.message.split(" - ")[1] });
  else if (err.code === "23503")
    res.status(404).send({ msg: "article does not exist" });
  else next(err);
};

exports.routeNotFound = (err, req, res, next) => {
  res.status(404).send({ msg: "Route Not Found" });
};

exports.handleServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
