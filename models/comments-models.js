const connection = require("../db/connection");

exports.updateCommentById = (comment_id, inc_votes) => {
  return connection("comments")
    .where({ "comments.comment_id": comment_id })
    .increment("votes", inc_votes)
    .returning("*");
};
