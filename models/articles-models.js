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

exports.selectAllCommentsByArticleId = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return connection("comments")
    .select("comments.*")
    .where({ "comments.article_id": article_id })
    .join("articles", "comments.article_id", "=", "articles.article_id")
    .orderBy(sort_by, order)
    .then(comments => comments);
};

exports.selectAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(queryBuilder => {
      if (author) {
        queryBuilder.where("articles.author", author);
      }
      if (topic) {
        queryBuilder.where("articles.topic", topic);
      }
    })
    .then(articles => articles);
};
