const connection = require("../db/connection");

exports.selectByArticleId = article_id => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id });
};

exports.updateArticleById = (article_id, inc_votes) => {
  //   const { inc_votes } = request_body;
  return connection("articles")
    .where({ "articles.article_id": article_id })
    .increment("votes", inc_votes)
    .returning("*");
};

exports.postComment = (article_id, newComment) => {
  return connection("comments")
    .insert({ ...newComment, article_id })
    .returning("*")
    .then(([comment]) => comment);
};

exports.selectAllCommentsByArticleId = article_id => {
  return connection("comments")
    .select("comments.*")
    .where({ "comments.article_id": article_id })
    .join("articles", "comments.article_id", "=", "articles.article_id")
    .orderBy("created_at")
    .then(comments => comments);
};
