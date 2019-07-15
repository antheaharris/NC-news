const apiData = require("../endpoints.json");

exports.sendApiData = (req, res, next) => {
  res.status(200).send(apiData);
};
