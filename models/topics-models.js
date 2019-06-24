const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection("topics").select("description", "slug");
};
