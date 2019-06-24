const connection = require("../db/connection.js");

exports.selectByUsername = username => {
  return connection("users")
    .select("users.*")
    .where({ username });
};
