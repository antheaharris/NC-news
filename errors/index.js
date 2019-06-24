exports.handleCustomErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
};
